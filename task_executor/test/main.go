package main

import (
	"context"
	"fmt"
	"io"
	"log"
	"strings"
	"time"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
	"github.com/docker/go-connections/nat"
)

// type album struct {
// 	ID     string  `json:"id"`
// 	Title  string  `json:"title"`
// 	Artist string  `json:"artist"`
// 	Price  float64 `json:"price"`
// }

// // albums slice to seed record album data.
// var albums = []album{
// 	{ID: "1", Title: "Blue Train", Artist: "John Coltrane", Price: 56.99},
// 	{ID: "2", Title: "Jeru", Artist: "Gerry Mulligan", Price: 17.99},
// 	{ID: "3", Title: "Sarah Vaughan and Clifford Brown", Artist: "Sarah Vaughan", Price: 39.99},
// }

// func getAlbums(c *gin.Context) {
// 	c.IndentedJSON(http.StatusOK, albums)
// }

// func postAlbums(c *gin.Context) {
// 	var newAlbum album
// 	if err := c.BindJSON(&newAlbum); err != nil {
// 		return
// 	}
// 	albums = append(albums, newAlbum)
// 	c.IndentedJSON(http.StatusCreated, newAlbum)
// }

// func getAlbumByID(c *gin.Context) {
// 	id := c.Param("id")
// 	for _, a := range albums {
// 		if a.ID == id {
// 			c.IndentedJSON(http.StatusOK, a)
// 			return
// 		}
// 	}
// 	c.IndentedJSON(http.StatusNotFound, gin.H{"message": "Album not found"})
// }

func main() {
	// router := gin.Default()
	// router.GET("/albums", getAlbums)
	// router.GET("/albums/:id", getAlbumByID)
	// router.POST("/albums", postAlbums)
	// router.Run("localhost:8080")

	cli, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	if err != nil {
		panic(err)
	}
	ctx := context.TODO()
	// images, err := cli.ImageList(ctx, types.ImageListOptions{
	// 	Filters: filters.NewArgs(filters.Arg("reference", "goserver:latest")),
	// })
	// if err != nil {
	// 	panic(err)
	// }
	// im := images[0]
	// log.Printf("container: %v, id: %v, labels: %v, repo tag: %v, repo digest: %v", im.Containers, im.ID, im.Labels, im.RepoTags, im.RepoDigests)
	// log.Printf("match: %v", strings.HasPrefix(im.ID[7:], "2eebac"))
	// pullId := "hugy718/goserver"
	// ret, err := cli.ImagePull(ctx, pullId, types.ImagePullOptions{})
	// if err != nil {
	// 	panic(err)
	// }
	// defer ret.Close()
	// io.Copy(os.Stdout, ret)

	portBindings := nat.PortMap{
		nat.Port("8080/tcp"): []nat.PortBinding{
			{
				HostIP:   "127.0.0.1",             // only allow internal traffic
				HostPort: fmt.Sprintf("%d", 8080), // should be replaced with a proper port allocation
			},
		},
	}
	log.Printf("container create: %d", time.Now().UnixMicro())

	resp, err := cli.ContainerCreate(ctx, &container.Config{Image: "goserver:v2"}, &container.HostConfig{PortBindings: portBindings}, nil, nil, "test-container")
	if err != nil {
		panic(err)
	}

	log.Printf("container created: %d", time.Now().UnixMicro())
	// start the container
	if err := cli.ContainerStart(ctx, resp.ID, types.ContainerStartOptions{}); err != nil {
		panic(err)
	}
	// log.Printf("container id: %v", resp.ID)

	logs, err := cli.ContainerLogs(ctx, resp.ID, types.ContainerLogsOptions{
		ShowStdout: true,
	})
	if err != nil {
		panic(err)
	}
	logBytes, err := io.ReadAll(logs)
	if err != nil {
		panic(err)
	}
	defer logs.Close()
	log.Println(string(logBytes))
	if !strings.Contains(string(logBytes), "meca-init-done") {
		panic("cannot find init record")
	}

	// cli.ContainerRemove(ctx, resp.ID, types.ContainerRemoveOptions{
	// 	Force:         true,
	// 	RemoveVolumes: true,
	// })
}
