package executor

import (
	"context"
	"errors"
	"fmt"
	"log"
	"math/rand"
	"sync"
	"sync/atomic"
	"time"
)

const (
	mecaPortRangeStart = 23500
	mecaPortRangelen   = 1000
)

var (
	errInvalidMecaExecutor    = errors.New("meca executor in invalid state")
	errMecaExecutorNotStarted = errors.New("meca executor not started")
	errMecaExecutorRunning    = errors.New("meca executor is running")
)

func port_alloc() int {
	return rand.Intn(mecaPortRangelen) + mecaPortRangeStart
}

type taskHandle struct {
	task        Task
	lastUsed    atomic.Uint64
	ref         atomic.Uint64
	initialized atomic.Bool
	initMu      sync.Mutex
	releaseCb   func() error
}

func (h *taskHandle) updateLastUsed() {
	for {
		now := uint64(time.Now().UnixMicro())
		last := h.lastUsed.Load()
		if uint64(now) < last || h.lastUsed.CompareAndSwap(last, now) {
			break
		}
	}
}

func (h *taskHandle) release() {
	for {
		old := h.ref.Load()
		target := old - 1
		log.Printf("released: %s %d->%d", h.task.GetId(), old, target)
		if h.ref.CompareAndSwap(old, target) {
			if target == 0 {
				// cleanup the task
				err := h.task.CleanUp()
				if err != nil {
					log.Println(err)
				}
				if h.releaseCb != nil {
					// a handle not initialized will not have a release callback.
					h.releaseCb()
				}
			}
			break
		}
	}
}

type taskTracker struct {
	tasks map[string]*taskHandle
	mu    sync.RWMutex
}

func newTaskTracker() *taskTracker {
	return &taskTracker{tasks: make(map[string]*taskHandle)}
}

func (t *taskTracker) add(id string, task Task) {
	t.mu.Lock()
	if _, ok := t.tasks[id]; !ok {
		t.tasks[id] = &taskHandle{task: task}
		t.tasks[id].ref.Add(1)
	}
	t.tasks[id].updateLastUsed()
	t.mu.Unlock()
}

// return the task if there is one and increment its last used time
// return nil, if there is none
func (t *taskTracker) get(id string) *taskHandle {
	t.mu.RLock()
	defer t.mu.RUnlock()

	ret, ok := t.tasks[id]
	if !ok {
		return nil
	}
	ret.ref.Add(1)
	ret.updateLastUsed()
	return ret
}

func (t *taskTracker) remove(id string) {
	h, ok := t.tasks[id]
	if !ok {
		return
	}
	h.release()
	delete(t.tasks, id)
}

func (t *taskTracker) dropCache() {
	t.mu.Lock()
	for id, h := range t.tasks {
		h.release()
		delete(t.tasks, id)
	}
	t.mu.Unlock()
}

// timeout in minutes
func (t *taskTracker) clean(timeout int) {
	t.mu.RLock()
	for id, h := range t.tasks {
		if uint64(time.Now().UnixMicro())-h.lastUsed.Load() > uint64(timeout)*60*1000000 {
			// upgrade lock to clean
			t.mu.RUnlock()
			t.mu.Lock()
			if uint64(time.Now().UnixMicro())-h.lastUsed.Load() > uint64(timeout)*60*1000000 {
				t.remove(id)
				log.Printf("removed %s from task list", h.task.GetId())
			}
			t.mu.Unlock()
			t.mu.RLock()
		}
	}
	time.Sleep(time.Second) // perfrom cleaning once per second to have low cpu load.
	t.mu.RUnlock()
}

type MecaRequestHandle struct {
	ctx      context.Context
	complete chan struct{}
	err      error
	output   []byte

	taskCfg TaskConfig
	input   []byte
}

func NewMecaRequestHandle(ctx context.Context, taskCfg TaskConfig, input []byte) *MecaRequestHandle {
	return &MecaRequestHandle{complete: make(chan struct{}, 1), ctx: ctx, taskCfg: taskCfg, input: input}
}

func (h *MecaRequestHandle) Done() {
	h.complete <- struct{}{}
}

func (h *MecaRequestHandle) Wait() {
	select {
	case <-h.complete:
		log.Printf("request handle wait completed")
	case <-h.ctx.Done():
		log.Printf("request handle wait canceled")
	}
}

type MecaExecutor struct {
	timeout  int
	tracker  *taskTracker
	rm       ResourceManager
	repo     TaskRepo
	fac      TaskFactory
	runtimes map[string]string // map the meca runtime tag to the corresponding runtime name specified by host

	started           bool
	stopped           atomic.Bool
	stopChn           chan<- struct{}
	cleanerStoppedChn <-chan struct{}
	pauseMu           sync.RWMutex

	reqQueue             chan *MecaRequestHandle
	reqStopChn           chan<- struct{} // stop the request manager
	reqManagerStoppedChn <-chan struct{} // wait for the request manager to stop
}

func NewMecaExecutorFromConfig(cfg MecaExecutorConfig) *MecaExecutor {
	switch cfg.Type {
	case "docker":
		return newDockerMecaExecutor(cfg)
	default:
		return nil
	}
}

func (meca *MecaExecutor) cleaner(stopChn <-chan struct{}, cleanerStoppedChn chan<- struct{}) {
	for {
		select {
		case <-stopChn:
			// clean the tasks
			time.Sleep(time.Second) // let the other goroutine that might have started execution on adding task handle to finish
			meca.tracker.mu.Lock()
			// release every task
			for id, h := range meca.tracker.tasks {
				meca.tracker.remove(id)
				log.Printf("removed %s from task list", h.task.GetId())
			}
			meca.tracker.mu.Unlock()
			cleanerStoppedChn <- struct{}{}
		default:
			time.Sleep(time.Millisecond)
			meca.tracker.clean(meca.timeout)
		}
	}
}

func (meca *MecaExecutor) handleOneRequest(req *MecaRequestHandle) {

	// get the taskid as key for tracker.
	taskId := GetTaskId(req.taskCfg)

	log.Printf("image ready")
	// get the task handle
	var h *taskHandle
	for {
		if h = meca.tracker.get(taskId); h != nil {
			break
		}
		log.Printf("adding task")
		task, err := meca.fac.Build(taskId, req.taskCfg)
		if err != nil {
			req.err = err
			req.Done()
			return
		}
		meca.tracker.add(taskId, task)
		log.Printf("task handle added")
	}
	log.Printf("task handle ready")

	retryDueToResourceShortage := 0
	for {
		time.Sleep(time.Millisecond * time.Duration(retryDueToResourceShortage))
		var err error
		// initialize the task once
		if !h.initialized.Load() {
			h.initMu.Lock()
			if !h.initialized.Load() {
				// reserve the resources
				// reserve the gpu
				var gpus []int
				if req.taskCfg.Rsrc.UseGPU {
					// set to 10 percent utilization for filtering out GPUs in use.
					if gpus, err = meca.rm.ReserveGPU(int(req.taskCfg.Rsrc.GPUCount), 10); err != nil {
						h.initMu.Unlock()
						if err != errMECANotEnoughResource {
							req.err = err
							req.Done()
							h.release()
							return
						}
						// experience resource shortage disable tracker facilitated task caching
						meca.tracker.dropCache()
						retryDueToResourceShortage++
						continue
					}
				}

				// reserve the cpu and memory
				if err := meca.rm.Reserve(float64(req.taskCfg.Rsrc.CPU), int(req.taskCfg.Rsrc.MEM)); err != nil {
					if req.taskCfg.Rsrc.UseGPU {
						meca.rm.ReleaseGPU(gpus)
					}
					h.initMu.Unlock()
					if err != errMECANotEnoughResource {
						req.err = err
						req.Done()
						h.release()
						return
					}
					meca.tracker.dropCache()
					retryDueToResourceShortage++
					continue
				}
				// retry in port allocation
				port := port_alloc()
				retryCount := 0
				for {
					if err = h.task.Init(req.ctx, "", port, gpus); err == nil {
						// register release callback when the task init successfully
						releaseCpu := float64(req.taskCfg.Rsrc.CPU)
						releaseMem := int(req.taskCfg.Rsrc.MEM)
						h.releaseCb = func() error {
							meca.rm.ReleaseGPU(gpus)
							return meca.rm.Release(releaseCpu, releaseMem)
						}
						h.initialized.Store(true)
						break
					} else if retryCount > 10 {
						// init failed, release resources
						meca.rm.ReleaseGPU(gpus)
						meca.rm.Release(float64(req.taskCfg.Rsrc.CPU), int(req.taskCfg.Rsrc.MEM))
						break
					}
					retryCount++
					port = port_alloc()
				}
			}
			h.initMu.Unlock()
		}
		if err != nil {
			req.err = err
			req.Done()
			h.release()
			return
		}
		log.Printf("task with config %v added: %v ", req.taskCfg, h.task)
		go func() {
			defer req.Done()
			req.output, req.err = h.task.Execute(req.ctx, req.input)
			h.release()
		}()
		return
	}
}

func (meca *MecaExecutor) consumeRequests(reqQueue <-chan *MecaRequestHandle, reqStopChn <-chan struct{}, reqManagerStoppedChn chan<- struct{}) {
	scheduledToStop := 0 // because schedule to stop is deferred until all requests are handled, so we use this variable to track the number of caller waiting for it to return stopped signal on reqManagerStoppedChn.
	for {
		select {
		case req := <-reqQueue:
			meca.handleOneRequest(req)
		case <-reqStopChn:
			scheduledToStop++
		default:
			if scheduledToStop > 0 {
				reqManagerStoppedChn <- struct{}{}
				scheduledToStop--
			}
			time.Sleep(time.Millisecond)
		}
	}
}

// will launch cleaner goroutine to remove tasks after timeout
func (meca *MecaExecutor) Start() {
	if !meca.started {
		stopChn := make(chan struct{})
		cleanerStoppedChn := make(chan struct{})
		reqStopChn := make(chan struct{})
		reqManagerStoppedChn := make(chan struct{})
		reqQueue := make(chan *MecaRequestHandle, 100)
		meca.rm.Start()
		go meca.cleaner(stopChn, cleanerStoppedChn)
		go meca.consumeRequests(reqQueue, reqStopChn, reqManagerStoppedChn)
		meca.stopChn = stopChn
		meca.cleanerStoppedChn = cleanerStoppedChn
		meca.reqQueue = reqQueue
		meca.reqStopChn = reqStopChn
		meca.reqManagerStoppedChn = reqManagerStoppedChn
		meca.started = true
	}
}

func (meca *MecaExecutor) Stop() {
	if meca.started {
		meca.pauseMu.Lock()
		if meca.stopped.CompareAndSwap(false, true) {
			meca.stopChn <- struct{}{}
			meca.rm.Stop()
			<-meca.cleanerStoppedChn
			meca.reqStopChn <- struct{}{}
			<-meca.reqManagerStoppedChn
		}
		meca.pauseMu.Unlock()
	}
}

func (meca *MecaExecutor) Pause() {
	if meca.started {
		if meca.stopped.Load() {
			return
		}
		meca.pauseMu.Lock()
		if meca.stopped.CompareAndSwap(false, true) {
			// avoid concurrent pause and unpause
			meca.stopChn <- struct{}{}
			<-meca.cleanerStoppedChn
			meca.reqStopChn <- struct{}{}
			<-meca.reqManagerStoppedChn
		}
		meca.pauseMu.Unlock()
	}
}

func (meca *MecaExecutor) UnPause() {
	if meca.started {
		if !meca.stopped.Load() {
			return
		}
		meca.pauseMu.Lock()
		// to ensure no concurrent cleaning when the stopped switched off
		meca.stopped.Store(false)
		meca.pauseMu.Unlock()
	}
}

func (meca *MecaExecutor) UpdateConfig(cfg MecaExecutorConfigReq) (string, error) {
	if !meca.started {
		return "", errMecaExecutorNotStarted
	}
	if !meca.stopped.Load() {
		return "", errMecaExecutorRunning
	}
	meca.pauseMu.Lock()
	defer meca.pauseMu.Unlock()
	if !meca.stopped.Load() {
		return "", errMecaExecutorRunning
	}

	// the executor is paused
	if meca.timeout >= 1 {
		meca.timeout = cfg.Timeout
	}
	msg := meca.rm.UpdateConfig(cfg.Cpu, cfg.Mem)
	if len(cfg.MicroVMRuntime) > 0 {
		meca.runtimes[TaskTypeMicroVM] = cfg.MicroVMRuntime
	}
	return fmt.Sprintf("meca executor config update: %v; microVM runtime: %v", msg, cfg.MicroVMRuntime), nil
}

func (meca *MecaExecutor) Stats() ResourceStats {
	if !meca.started {
		return ResourceStats{}
	}
	meca.pauseMu.RLock()
	defer meca.pauseMu.RUnlock()
	if meca.stopped.Load() {
		return ResourceStats{}
	}
	return meca.rm.Stats()
}

func (meca *MecaExecutor) Execute(ctx context.Context, taskCfg TaskConfig, input []byte) ([]byte, error) {
	if meca == nil {
		return nil, errInvalidMecaExecutor
	}
	// if the service has been stopped or not started we reject all request.
	if !meca.started {
		return nil, errMecaExecutorNotStarted
	}

	meca.pauseMu.RLock()
	defer meca.pauseMu.RUnlock()
	if meca.stopped.Load() {
		return nil, errMecaExecutorNotStarted
	}

	// validate and tidy the resource limit
	if taskCfg.Rsrc.isEmpty() {
		taskCfg.Rsrc = getDefaultResourceLimit()
	}

	// validate the gpu setting
	if taskCfg.Rsrc.UseGPU {
		gpuCount := meca.rm.GetGPUCount()
		if gpuCount == 0 || gpuCount < int(taskCfg.Rsrc.GPUCount) {
			return nil, errors.New("not enough GPU available")
		}
	}
	// validate cpu and mem setting
	if taskCfg.Rsrc.CPU <= 0 || taskCfg.Rsrc.MEM <= 0 {
		return nil, errors.New("invalid resource limit")
	} else {
		maxCpu, maxMem := meca.rm.GetMaxCPUAndMem()
		if float64(taskCfg.Rsrc.CPU) > maxCpu || uint64(taskCfg.Rsrc.MEM) > maxMem {
			return nil, errors.New("resource limit exceeds the maximum")
		}
	}

	// after validation it is assumed that the task will eventually be processed when all other tasks are finished.

	// translate the runtime type
	if len(taskCfg.Runtime) > 0 {
		if rt, ok := meca.runtimes[taskCfg.Runtime]; !ok {
			log.Printf("unknown runtime %s, using docker default", taskCfg.Runtime)
		} else {
			log.Printf("using runtime %s -> %s", taskCfg.Runtime, rt)
			taskCfg.Runtime = rt
		}
	}

	// ensure the task uses correct version of image
	// TODO (expose more control for version later)
	if found, err := meca.repo.Exists(taskCfg.ImageId, ""); err != nil && err != errUnFoundImageVersion {
		return nil, err
	} else if !found {
		if err := meca.repo.Fetch(taskCfg.ImageId, "", ""); err != nil {
			return nil, err
		}
	}

	// if an image update is performed, the image id shall be different. It is a uid. launch a new task and an cleanup of the last task will be eventually scheduled.
	req := NewMecaRequestHandle(ctx, taskCfg, input)
	meca.reqQueue <- req
	req.Wait()
	log.Printf("request handle completed: %v, err: %v", req.output, req.err)
	return req.output, req.err
}
