package executor

import (
	"fmt"
	"log"

	"github.com/NVIDIA/go-nvml/pkg/nvml"
)

type GPUUtil struct {
	compute uint32
	memory  uint32
}

func InitGPUMonitor() error {
	ret := nvml.Init()
	if ret != nvml.SUCCESS {
		log.Printf("Unable to initialize NVML: %v", nvml.ErrorString(ret))
		return fmt.Errorf("unable to initialize NVML: %v", nvml.ErrorString(ret))
	}
	return nil
}

func ShutdownGPUMonitor() error {
	ret := nvml.Shutdown()
	if ret != nvml.SUCCESS {
		log.Printf("Unable to shutdown NVML: %v", nvml.ErrorString(ret))
		return fmt.Errorf("unable to shutdown NVML: %v", nvml.ErrorString(ret))
	}
	return nil
}

func GetGPUCount() (int, error) {
	if count, ret := nvml.DeviceGetCount(); ret != nvml.SUCCESS {
		return 0, fmt.Errorf("unable to get device count: %s", nvml.ErrorString(ret))
	} else {
		return int(count), nil
	}
}

// assuming a machine has only one type of GPU
func GetGPUModel() (string, error) {
	if device, ret := nvml.DeviceGetHandleByIndex(0); ret != nvml.SUCCESS {
		return "", fmt.Errorf("unable to get device at index 0: %s", nvml.ErrorString(ret))
	} else if model, ret := device.GetName(); ret != nvml.SUCCESS {
		return "", fmt.Errorf("unable to get model of device at index 0: %s", nvml.ErrorString(ret))
	} else {
		return model, nil
	}
}

func GetGPUUtilization() ([]GPUUtil, error) {
	count, err := GetGPUCount()
	if err != nil {
		return nil, err
	}
	utils := make([]GPUUtil, count)
	for i := 0; i < count; i++ {
		if device, ret := nvml.DeviceGetHandleByIndex(i); ret != nvml.SUCCESS {
			utils[i].compute = 100
		} else if util, ret := device.GetUtilizationRates(); ret != nvml.SUCCESS {
			utils[i].compute = 100
		} else if memInfo, ret := device.GetMemoryInfo(); ret != nvml.SUCCESS {
			utils[i].compute = 100
			utils[i].memory = 100
		} else {
			utils[i].compute = util.Gpu
			utils[i].memory = uint32((memInfo.Used >> 20) * 100 / (memInfo.Total >> 20))
		}
	}
	return utils, nil
}
