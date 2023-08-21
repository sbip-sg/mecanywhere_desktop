package executor

import (
	"context"
	"errors"
	"fmt"
	"io"
	"log"
	"os"
	"strings"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/filters"
	"github.com/docker/docker/client"
)

var (
	errUnFoundImageVersion = errors.New("unfound image version")
)

var _ TaskRepo = (*LocalDockerRepo)(nil)

type LocalDockerRepo struct {
	cli *client.Client
}

func NewLocalDockerRepo(cli *client.Client) *LocalDockerRepo {
	return &LocalDockerRepo{cli: cli}
}

// image id is suffixed with :version
func checkVersion(tag, version string) bool {
	if len(version) == 0 {
		// skip checking
		return true
	}
	return strings.HasSuffix(tag, fmt.Sprintf(":%s", version))
}

func (r *LocalDockerRepo) Exists(id, version string) (bool, error) {
	ctx := context.TODO()
	images, err := r.cli.ImageList(ctx, types.ImageListOptions{Filters: filters.NewArgs(filters.Arg("reference", id))})
	if err != nil {
		return false, err
	}
	for _, im := range images {
		for _, t := range im.RepoTags {
			if checkVersion(t, version) {
				return true, nil
			}
		}
	}
	return false, errUnFoundImageVersion
}

func build_pull_tag(id, remote, version string) string {
	ret := ""
	if len(remote) > 0 {
		ret = fmt.Sprintf("%s/", remote)
	}
	ret = fmt.Sprintf("%s%s", ret, id)
	if len(version) > 0 {
		ret = fmt.Sprintf("%s:%s", ret, version)
	}
	return ret
}

func (r *LocalDockerRepo) Fetch(id, remote, version string) error {
	ctx := context.TODO()
	pullTag := build_pull_tag(id, remote, version)
	log.Printf("pulling image: %s", pullTag)
	if out, err := r.cli.ImagePull(ctx, pullTag, types.ImagePullOptions{}); err != nil {
		return err
	} else {
		_, err = io.Copy(os.Stdout, out)
		if err != nil {
			return err
		}
		out.Close()
		log.Printf("pulling image done: %s", pullTag)
		return nil
	}
}
