package executor

import (
	"os"

	"gopkg.in/yaml.v3"
)

const (
	SGXBindDevice = "/dev/sgx/enclave"
	SGXBindAesmd  = "/var/run/aesmd"
)

type SGXConfig struct {
	Enable    bool   `yaml:"enable"`
	SGXDevice string `yaml:"sgx_device"`
	AesmdPath string `yaml:"aesmd_path"`
}

type MecaExecutorConfig struct {
	Type           string    `yaml:"type"`
	Timeout        int       `yaml:"timeout"`
	Cpu            float64   `yaml:"cpu"`
	Mem            int       `yaml:"mem"`
	HasGPU         bool      `yaml:"has_gpu"`
	MicroVMRuntime string    `yaml:"microVM_runtime"`
	SGX            SGXConfig `yaml:"sgx"`
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
	HasGPU         int     `json:"has_gpu"`
	MicroVMRuntime string  `json:"microVM_runtime"`
}
