package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	executor "github.com/sbip-sg/meca"
)

type Request struct {
	ID       string                 `json:"id"`
	Resource executor.ResourceLimit `json:"resource"`
	Input    string                 `json:"input"`
}

type Response struct {
	Success bool   `json:"success"`
	Msg     string `json:"msg"`
}

func main() {
	cfg := executor.MecaExecutorConfig{
		Type:    "docker",
		Timeout: 1,
	}
	mecaExecutor := executor.NewMecaExecutorFromConfig(cfg)
	mecaExecutor.Start()
	meca_exec := func(c *gin.Context) {
		var req Request
		if err := c.BindJSON(&req); err != nil {
			return
		}
		var ret Response
		if resp, err := mecaExecutor.Execute(c, req.ID, req.Resource, []byte(req.Input)); err != nil {
			ret.Success = false
			ret.Msg = err.Error()
		} else {
			ret.Success = true
			ret.Msg = string(resp)
		}
		c.IndentedJSON(http.StatusOK, ret)
	}

	router := gin.Default()
	router.POST("/", meca_exec)
	router.Run(":2591")
}

// curl http://localhost:2591 -X POST -H "Content-Type: application/json" -d '{"id": "goserver:v2", "input": "{\"name\": \"sbip\"}"}'
