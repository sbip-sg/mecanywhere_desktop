package executor

import (
	"context"
	"fmt"
)

type ResourceLimit struct {
	CPU int64 `json:"cpu"` // core
	MEM int64 `json:"mem"` // MB
}

func (l ResourceLimit) isDefault() bool {
	return l.CPU == 0 && l.MEM == 0
}

func (l ResourceLimit) String() string {
	return fmt.Sprintf("c%d-m%d", l.CPU, l.MEM)
}

func GetTaskId(imageId string, rsrc ResourceLimit) string {
	return fmt.Sprintf("%s_%v", imageId, rsrc)
}

type Task interface {
	GetId() string
	Init(ctx context.Context, config string, port int) error
	Execute(ctx context.Context, input []byte) ([]byte, error)
	GetResource() ResourceLimit // get resource limit of the task
	CleanUp() error
}

type TaskFactory interface {
	// a task is specified by its id and the amount of resource intended to use
	Build(taskId string, resource ResourceLimit) (Task, error)
}
