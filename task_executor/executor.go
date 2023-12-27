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
	t.tasks[id] = &taskHandle{task: task}
	t.tasks[id].ref.Add(1)
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

// will launch cleaner goroutine to remove tasks after timeout
func (meca *MecaExecutor) Start() {
	if !meca.started {
		stopChn := make(chan struct{})
		cleanerStoppedChn := make(chan struct{})
		meca.rm.Start()
		go meca.cleaner(stopChn, cleanerStoppedChn)
		meca.stopChn = stopChn
		meca.cleanerStoppedChn = cleanerStoppedChn
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
			return nil, errors.New("no GPU available")
		}
	}

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
	imageUpdate := false
	if found, err := meca.repo.Exists(taskCfg.ImageId, ""); err != nil && err != errUnFoundImageVersion {
		return nil, err
	} else if !found {
		if err := meca.repo.Fetch(taskCfg.ImageId, "", ""); err != nil {
			return nil, err
		}
		imageUpdate = true
	}

	// if an image update is performed, launch a new task and schedule an cleanup of the last task
	// here the id is the uid for an image.
	// TODO: when id is not uid for an image (using image tag), we should construct uid for task id here, and release the old task handle under the old uid

	// get the taskid as key for tracker.
	taskId := GetTaskId(taskCfg)

	if imageUpdate {
		task, err := meca.fac.Build(taskId, taskCfg)
		if err != nil {
			return nil, err
		}
		meca.tracker.add(taskId, task)
	}

	log.Printf("image ready")
	// get the task handle
	var h *taskHandle
	for {
		if h = meca.tracker.get(taskId); h != nil {
			break
		}
		log.Printf("adding task")
		task, err := meca.fac.Build(taskId, taskCfg)
		if err != nil {
			return nil, err
		}
		meca.tracker.add(taskId, task)
		log.Printf("task handle added")
	}
	log.Printf("task handle ready")
	defer h.release()

	var err error
	// initialize the task once
	if !h.initialized.Load() {
		h.initMu.Lock()
		if !h.initialized.Load() {
			// reserve the resources
			if err := meca.rm.Reserve(float64(taskCfg.Rsrc.CPU), int(taskCfg.Rsrc.MEM)); err != nil {
				h.initMu.Unlock()
				return nil, err
			}
			// retry in port allocation
			port := port_alloc()
			retryCount := 0
			for {
				if err = h.task.Init(ctx, "", port); err == nil {
					// register release callback when the task init successfully
					releaseCpu := float64(taskCfg.Rsrc.CPU)
					releaseMem := int(taskCfg.Rsrc.MEM)
					h.releaseCb = func() error {
						return meca.rm.Release(releaseCpu, releaseMem)
					}
					h.initialized.Store(true)
					break
				} else if retryCount > 10 {
					// init failed, release resources
					meca.rm.Release(float64(taskCfg.Rsrc.CPU), int(taskCfg.Rsrc.MEM))
					break
				}
				retryCount++
				port = port_alloc()
			}
		}
		h.initMu.Unlock()
	}
	if err != nil {
		return nil, err
	}
	log.Printf("task with config %v added: %v ", taskCfg, h.task)
	return h.task.Execute(ctx, input)
}
