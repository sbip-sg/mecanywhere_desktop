package executor

import (
	"context"
	"fmt"
)

const (
	TaskTypeMicroVM   = "microVM"
	TaskTypeContainer = "container"
)

type TaskConfig struct {
	ImageId string        `json:"imageid"`
	Runtime string        `json:"runtime"`
	Rsrc    ResourceLimit `json:"resource_limit"`
}

func (c TaskConfig) String() string {
	return fmt.Sprintf("image: %s runtime: %s (CPU: %d core, MEM %dMB)", c.ImageId, c.Runtime, c.Rsrc.CPU, c.Rsrc.MEM)
}

func NewTaskConfig(id, rt string, rsrc ResourceLimit) TaskConfig {
	if (rt == TaskTypeMicroVM) || (rt == TaskTypeContainer) {
		return TaskConfig{id, rt, rsrc}
	}
	return TaskConfig{ImageId: id, Rsrc: rsrc}
}

type ResourceLimit struct {
	CPU      int64 `json:"cpu"` // core
	MEM      int64 `json:"mem"` // MB
	UseGPU   bool  `json:"use_gpu"`
	GPUCount int64 `json:"gpu_count"`
}

func getDefaultResourceLimit() ResourceLimit {
	return ResourceLimit{CPU: 1, MEM: 128}
}

func (l ResourceLimit) isEmpty() bool {
	return l.CPU == 0 && l.MEM == 0
}

func (l ResourceLimit) String() string {
	if !l.UseGPU {
		return fmt.Sprintf("c%d-m%d", l.CPU, l.MEM)
	} else {
		return fmt.Sprintf("c%d-m%d-g%d", l.CPU, l.MEM, l.GPUCount)
	}
}

func GetTaskId(cfg TaskConfig) string {
	if len(cfg.Runtime) == 0 {
		return fmt.Sprintf("%s_%v", cfg.ImageId, cfg.Rsrc)
	}
	return fmt.Sprintf("%s_%s_%v", cfg.ImageId, cfg.Runtime, cfg.Rsrc)
}

type Task interface {
	GetId() string
	Init(ctx context.Context, config string, port int, gpus []int) error
	Execute(ctx context.Context, input []byte) ([]byte, error)
	GetResource() ResourceLimit // get resource limit of the task
	CleanUp() error
}

type TaskFactory interface {
	// a task is specified by its id, the runtime and the amount of resource intended to use
	Build(taskId string, cfg TaskConfig) (Task, error)
}
