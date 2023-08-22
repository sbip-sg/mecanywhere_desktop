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
	errInvalidMecaExecutor = errors.New("meca executor in invalid state")
)

func port_alloc() int {
	return rand.Intn(mecaPortRangelen) + mecaPortRangeStart
}

type taskHandle struct {
	task           Task
	lastUsed       atomic.Uint64
	ref            atomic.Uint64
	initializeOnce sync.Once
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
	timeout int
	tracker *taskTracker
	repo    TaskRepo
	fac     TaskFactory
}

func NewMecaExecutorFromConfig(cfg MecaExecutorConfig) *MecaExecutor {
	switch cfg.Type {
	case "docker":
		return newDockerMecaExecutor(cfg.Timeout)
	default:
		return nil
	}
}

func (meca *MecaExecutor) cleaner() {
	for {
		time.Sleep(time.Millisecond)
		meca.tracker.clean(meca.timeout)
	}
}

// will launch cleaner goroutine to remove tasks after timeout
func (meca *MecaExecutor) Start() {
	go meca.cleaner()
}

func (meca *MecaExecutor) Execute(ctx context.Context, imageId string, rsrc ResourceLimit, input []byte) ([]byte, error) {
	if meca == nil {
		return nil, errInvalidMecaExecutor
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
	h.initializeOnce.Do(func() {
		// retry in port allocation
		port := port_alloc()
		retryCount := 0
		for {
			if err = h.task.Init(ctx, "", port); err == nil || retryCount > 10 {
				break
			}
			retryCount++
			port = port_alloc()
		}
	})
	if err != nil {
		return nil, err
	}
	log.Printf("task %v (CPU: %d core, MEM %dMB) added: %v ", imageId, rsrc.CPU, rsrc.MEM, h.task)
	return h.task.Execute(ctx, input)
}
