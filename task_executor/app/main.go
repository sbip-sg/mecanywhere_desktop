package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/gin-gonic/gin"
	executor "github.com/sbip-sg/meca"
)

var (
	config = flag.String("config", "", "the executor config yaml (optional)")
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

func startTerminationHdl(executor *executor.MecaExecutor) {
	interruptChn := make(chan os.Signal)
	signal.Notify(interruptChn, os.Interrupt, syscall.SIGTERM)
	go func() {
		<-interruptChn
		fmt.Println("\nProrgram interrupted. Cleaning up...")
		executor.Stop()
		os.Exit(0)
	}()
}

func main() {
	flag.Parse()
	cfg := executor.MecaExecutorConfig{
		Type:    "docker",
		Timeout: 1,
		Cpu:     4,
		Mem:     4096,
	}
	if len(*config) > 0 {
		// overwrite the default
		if parsed, err := executor.ParseMecaExecutorConfig(*config); err != nil {
			log.Printf("failed to parse config: %v; using default %v", err.Error(), cfg)
		} else {
			log.Printf("Using config %s: %v", *config, parsed)
			cfg = parsed
		}
	}

	mecaExecutor := executor.NewMecaExecutorFromConfig(cfg)

	// add interrupt handler to stop the executor and GC the tasks
	startTerminationHdl(mecaExecutor)

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
	meca_stop := func(c *gin.Context) {
		log.Println("\nMECA executor stopped. Cleaning up...")
		mecaExecutor.Stop()
		os.Exit(0)
	}
	meca_pause := func(c *gin.Context) {
		log.Println("\nMECA executor pausing")
		mecaExecutor.Pause()
	}
	meca_unpause := func(c *gin.Context) {
		log.Println("\nMECA executor unpausing")
		mecaExecutor.UnPause()
	}
	meca_stats := func(c *gin.Context) {
		stats := mecaExecutor.Stats()
		if stats.IsEmpty() {
			ret := Response{
				Success: false,
				Msg:     "failed to retrieve resource stats",
			}
			c.IndentedJSON(http.StatusOK, ret)
		} else {
			c.IndentedJSON(http.StatusOK, stats)
		}
	}

	router := gin.Default()
	router.POST("/", meca_exec)
	router.POST("/stop", meca_stop)
	router.POST("/pause", meca_pause)
	router.POST("/unpause", meca_unpause)
	router.POST("/stats", meca_stats)

	router.Run(":2591")
}

// curl http://localhost:2591 -X POST -H "Content-Type: application/json" -d '{"id": "goserver:v2", "input": "{\"name\": \"sbip\"}"}'
