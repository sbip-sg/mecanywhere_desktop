package executor

import "context"

type Task interface {
	GetId() string
	Init(ctx context.Context, config string, port int) error
	Execute(ctx context.Context, input []byte) ([]byte, error)
	CleanUp() error
}

type TaskFactory interface {
	Build(taskId string) (Task, error)
}
