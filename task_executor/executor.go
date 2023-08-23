package executor

import (
	"context"
	"errors"
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
	timeout           int
	tracker           *taskTracker
	rm                ResourceManager
	repo              TaskRepo
	fac               TaskFactory
	started           bool
	stopped           atomic.Bool
	stopChn           chan<- struct{}
	cleanerStoppedChn <-chan struct{}
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
			return
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
		if meca.stopped.CompareAndSwap(false, true) {
			meca.stopChn <- struct{}{}
			meca.rm.Stop()
			<-meca.cleanerStoppedChn
		}
	}
}

func (meca *MecaExecutor) Execute(ctx context.Context, imageId string, rsrc ResourceLimit, input []byte) ([]byte, error) {
	if meca == nil {
		return nil, errInvalidMecaExecutor
	}
	// if the service has been stopped or not started we reject all request.
	if !meca.started || meca.stopped.Load() {
		return nil, errMecaExecutorNotStarted
	}

	// validate and tidy the resource limit
	if rsrc.isEmpty() {
		rsrc = getDefaultResourceLimit()
	}

	// ensure the task uses correct version of image
	// TODO (expose more control for version later)
	imageUpdate := false
	if found, err := meca.repo.Exists(imageId, ""); err != nil && err != errUnFoundImageVersion {
		return nil, err
	} else if !found {
		if err := meca.repo.Fetch(imageId, "", ""); err != nil {
			return nil, err
		}
		imageUpdate = true
	}

	// if an image update is performed, launch a new task and schedule an cleanup of the last task
	// here the id is the uid for an image.
	// TODO: when id is not uid for an image (using image tag), we should construct uid for task id here, and release the old task handle under the old uid

	// get the taskid as key for tracker.
	taskId := GetTaskId(imageId, rsrc)

	if imageUpdate {
		task, err := meca.fac.Build(imageId, rsrc)
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
		task, err := meca.fac.Build(imageId, rsrc)
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
			if err := meca.rm.Reserve(float64(rsrc.CPU), int(rsrc.MEM)); err != nil {
				h.initMu.Unlock()
				return nil, err
			}
			// retry in port allocation
			port := port_alloc()
			retryCount := 0
			for {
				if err = h.task.Init(ctx, "", port); err == nil {
					// register release callback when the task init successfully
					releaseCpu := float64(rsrc.CPU)
					releaseMem := int(rsrc.MEM)
					h.releaseCb = func() error {
						return meca.rm.Release(releaseCpu, releaseMem)
					}
					h.initialized.Store(true)
					break
				} else if retryCount > 10 {
					// init failed, release resources
					meca.rm.Release(float64(rsrc.CPU), int(rsrc.MEM))
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
	log.Printf("task %v (CPU: %d core, MEM %dMB) added: %v ", imageId, rsrc.CPU, rsrc.MEM, h.task)
	return h.task.Execute(ctx, input)
}
