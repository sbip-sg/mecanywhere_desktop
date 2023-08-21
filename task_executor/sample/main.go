package main

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type echoRequest struct {
	Name string `json:"name"`
}

func getHandle(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, gin.H{"message": "hello world"})
}

func postHandle(c *gin.Context) {
	var req echoRequest
	if err := c.BindJSON(&req); err != nil {
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": fmt.Sprintf("hello %s", req.Name)})
}

func main() {
	router := gin.Default()
	router.GET("/", getHandle)
	router.POST("/", postHandle)
	fmt.Println("meca-init-done")
	router.Run(":8080")
}

// curl http://localhost:8080 -X POST -H "Content-Type: application/json" -d '{"name": "sbip"}'
