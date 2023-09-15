package executor

import (
	"os"

	"gopkg.in/yaml.v3"
)

type MecaExecutorConfig struct {
	Type           string  `yaml:"type"`
	Timeout        int     `yaml:"timeout"`
	Cpu            float64 `yaml:"cpu"`
	Mem            int     `yaml:"mem"`
	MicroVMRuntime string  `yaml:"microVM_runtime"`
}

func ParseMecaExecutorConfig(filename string) (MecaExecutorConfig, error) {
	configData, err := os.ReadFile(filename)
	if err != nil {
		return MecaExecutorConfig{}, err
	}

	var cfg MecaExecutorConfig
	err = yaml.Unmarshal(configData, &cfg)
	if err != nil {
		return MecaExecutorConfig{}, err
	}
	return cfg, nil
}

type MecaExecutorConfigReq struct {
	Timeout        int     `json:"timeout"`
	Cpu            float64 `json:"cpu" binding:"required,gt=0.0"`
	Mem            int     `json:"mem" binding:"required,gt=0"`
	MicroVMRuntime string  `json:"microVM_runtime"`
}
