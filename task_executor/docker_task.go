package executor

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
	"github.com/docker/go-connections/nat"
)

const (
	dockerTaskPrefix = "meca"
	dockerInitMark   = "meca-init-done"
	dockerReadyRetry = 5
)

var (
	ErrContainerFailedToStartInTime = errors.New("container failed to start in time")
	ErrInitEntryNotFound            = errors.New("container init entry not found")
	ErrFailedToDecodeTaskResponse   = errors.New("failed to decode task response")
)

var _ Task = (*DockerTask)(nil)
var _ TaskFactory = (*DockerTaskFactory)(nil)

type DockerTask struct {
	taskId      string
	containerId string
	port        int
	cli         *client.Client
}

func NewDockerTask(id string, cli *client.Client) *DockerTask {
	return &DockerTask{
		taskId: id,
		cli:    cli,
	}
}

// extract just the image name then add meca prefix and port suffix
func createContainerName(id string, port int) string {
	first_colon_idx := strings.Index(id, ":")
	if first_colon_idx == -1 {
		first_colon_idx = len(id)
	}
	last_slash_idx := strings.LastIndex(id, "/") + 1
	return fmt.Sprintf("%s_%s_%d", dockerTaskPrefix, id[last_slash_idx:first_colon_idx], port)
}

func (t *DockerTask) checkForReadyLogEntry(ctx context.Context) error {
	logs, err := t.cli.ContainerLogs(ctx, t.containerId, types.ContainerLogsOptions{
		ShowStdout: true,
	})
	if err != nil {
		return err
	}
	logBytes, err := io.ReadAll(logs)
	if err != nil {
		return err
	}
	defer logs.Close()
	if !strings.Contains(string(logBytes), dockerInitMark) {
		return ErrInitEntryNotFound
	}
	return nil
}

// detect that the container is already initialized
// with docker logs
func (t *DockerTask) waitForTaskReady(ctx context.Context) error {
	retry := 0
	for {
		if err := t.checkForReadyLogEntry(ctx); err == nil {
			return nil
		} else if err != ErrInitEntryNotFound {
			return err
		}
		// exceeds specified number of retries
		if retry > dockerReadyRetry {
			return ErrContainerFailedToStartInTime
		}
		time.Sleep(time.Millisecond)
	}
}

func (t *DockerTask) GetId() string {
	return t.taskId
}

// start the container which should run a server
// to replace with using docker bridge network only
func (t *DockerTask) Init(ctx context.Context, _ string, port int) error {
	log.Printf("init started %d", time.Now().UnixMicro())
	portBindings := nat.PortMap{
		nat.Port("8080/tcp"): []nat.PortBinding{
			{
				HostIP:   "localhost",             // only allow internal traffic
				HostPort: fmt.Sprintf("%d", port), // should be replaced with a proper port allocation
			},
		},
	}

	log.Printf("container name: %s", createContainerName(t.taskId, port))

	resp, err := t.cli.ContainerCreate(ctx, &container.Config{Image: t.taskId}, &container.HostConfig{PortBindings: portBindings}, nil, nil, createContainerName(t.taskId, port))
	if err != nil {
		return err
	}
	log.Printf("init container created %d", time.Now().UnixMicro())

	// start the container
	t.containerId = resp.ID
	if err := t.cli.ContainerStart(ctx, resp.ID, types.ContainerStartOptions{}); err != nil {
		// TODO: check port is already allocated error here
		return err
	}
	log.Printf("init container started %d", time.Now().UnixMicro())
	// ensure task server is ready
	if err := t.waitForTaskReady(ctx); err != nil {
		return err
	}
	t.port = port
	log.Printf("init finished %d", time.Now().UnixMicro())
	return nil
}

// pass the input to the container
func (t *DockerTask) Execute(ctx context.Context, input []byte) ([]byte, error) {
	// send the request to the task server
	cli := http.DefaultClient
	url := fmt.Sprintf("http://localhost:%d", t.port)
	if resp, err := cli.Post(url, "application/json", bytes.NewReader(input)); err != nil {
		return nil, err
	} else {
		defer resp.Body.Close()
		if body, err := io.ReadAll(resp.Body); err != nil {
			return nil, ErrFailedToDecodeTaskResponse
		} else {
			return body, nil
		}
	}
}

func (t *DockerTask) CleanUp() error {
	ctx := context.TODO()
	return t.cli.ContainerRemove(ctx, t.containerId, types.ContainerRemoveOptions{
		Force:         true,
		RemoveVolumes: true,
	})
}

type DockerTaskFactory struct {
	cli *client.Client
}

func NewDockerTaskFactory(cli *client.Client) *DockerTaskFactory {
	return &DockerTaskFactory{
		cli: cli,
	}
}

func (f *DockerTaskFactory) Build(taskId string) (Task, error) {
	return NewDockerTask(taskId, f.cli), nil
}

func newDockerMecaExecutor(timeout int) *MecaExecutor {
	cli, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	if err != nil {
		return nil
	}
	return &MecaExecutor{
		timeout: timeout,
		tracker: newTaskTracker(),
		repo:    NewLocalDockerRepo(cli),
		fac:     NewDockerTaskFactory(cli),
	}
}
