package executor

import (
	"errors"
	"log"
	"sync/atomic"
	"time"

	"github.com/shirou/gopsutil/v3/cpu"
	"github.com/shirou/gopsutil/v3/mem"
)

var (
	errMECANotEnoughResource = errors.New("MECA not enough resources")
)

// monitor the availble resource on the host
type ResourceMonitor interface {
	Start() bool          // start monitoring
	Stop()                // stop monitoring
	GetCPU() int          // in core count
	GetMEM() int          // in MB
	GetCPUUsed() float64  // in core count
	GetMEMUsed() float64  // in MB
	GetCPUAvail() float64 // in core count
	GetMEMAvail() float64 // in MB
}

var _ ResourceMonitor = (*resourceMonitor)(nil)

type resourceMonitor struct {
	cpuCount    int
	memTotal    uint64        // in MB
	lastCPUUsed atomic.Uint64 // in per mille
	lastmemUsed atomic.Uint64 // in per mille
	stopChn     chan<- struct{}
}

func NewResourceMonitor() *resourceMonitor {
	return &resourceMonitor{}
}

func (m *resourceMonitor) Start() bool {
	// initialize the host resources
	if ms, err := mem.VirtualMemory(); err != nil {
		return false
	} else {
		log.Printf("mem total: %d used: %d", ms.Total, ms.Used)
		m.memTotal = ms.Total >> 20
		m.lastmemUsed.Store((ms.Used >> 10) / (ms.Total >> 20))
	}
	if cs, err := cpu.Info(); err != nil {
		return false
	} else if cu, err := cpu.Percent(time.Second, false); err != nil {
		return false
	} else {
		log.Printf("cpu count: %d", len(cs))
		m.cpuCount = len(cs)
		m.lastCPUUsed.Store(uint64(cu[0] * 10))
	}

	// launch a goroutine to update the value in background
	stopChn := make(chan struct{})
	m.stopChn = stopChn
	go func() {
		for {
			select {
			case <-stopChn:
				// stop the goroutine
				return
			default:
				// perform resource measurement and update: update cpu first which does sleep internally
				if cu, err := cpu.Percent(time.Second, false); err != nil {
					// perform no update
				} else {
					m.lastCPUUsed.Store(uint64(cu[0] * 10))
				}

				// update memory
				if ms, err := mem.VirtualMemory(); err != nil {
					// perform no update
				} else {
					m.lastmemUsed.Store((ms.Used >> 10) / (ms.Total >> 20))
				}

				log.Printf("[Resource monitor] cpu: %.2f%%, mem %.2f%%", float64(m.lastCPUUsed.Load())/10, float64(m.lastmemUsed.Load())/10)
			}
		}
	}()
	return true
}

func (m *resourceMonitor) Stop() {
	m.stopChn <- struct{}{}
}

func (m *resourceMonitor) GetCPU() int {
	return m.cpuCount
}

func (m *resourceMonitor) GetMEM() int {
	return int(m.memTotal)
}

func (m *resourceMonitor) GetCPUUsed() float64 {
	return float64(m.lastCPUUsed.Load()) / 10
}

func (m *resourceMonitor) GetMEMUsed() float64 {
	return float64(m.lastmemUsed.Load()) / 10
}

func (m *resourceMonitor) GetCPUAvail() float64 {
	return 100 - float64(m.lastCPUUsed.Load())/10
}

func (m *resourceMonitor) GetMEMAvail() float64 {
	return 100 - float64(m.lastmemUsed.Load())/10
}

type ResourceStats struct {
	TotalCPU    int     `json:"total_cpu"`     // core
	TotalMEM    int     `json:"total_mem"`     // MB
	UsedCPU     float64 `json:"used_cpu"`      // %
	UsedMEM     float64 `json:"used_mem"`      // %
	TaskCPU     float64 `json:"task_cpu"`      // core
	TaskMEM     int     `json:"task_mem"`      // MB
	TaskUsedCPU float64 `json:"task_used_cpu"` // %
	TaskUsedMEM float64 `json:"task_used_mem"` // %
}

func (rs *ResourceStats) IsEmpty() bool {
	return rs.TotalCPU == 0
}

// controls the allocation of resources to tasks.
type ResourceManager interface {
	Start() bool
	Stop()
	Reserve(cpu float64, mem int) error
	Release(cpu float64, mem int) error
	Stats() ResourceStats
}

var _ ResourceManager = (*resourceManager)(nil)

type resourceManager struct {
	monitor      ResourceMonitor
	totalCPUCfg  float64
	totalMEMCfg  int
	taskTotalCPU uint64 // keep one decimal after core count
	taskTotalMEM uint64
	taskAvailCPU atomic.Uint64 // keep one decimal after core count
	taskAvailMEM atomic.Uint64
}

func NewResourceManager(totalCPU float64, totalMem int) *resourceManager {
	return &resourceManager{
		monitor:     NewResourceMonitor(),
		totalCPUCfg: totalCPU,
		totalMEMCfg: totalMem,
	}
}

func (m *resourceManager) adjustResourceConfig() {
	// adjust cpu
	if hc := m.monitor.GetCPU(); hc < int(m.totalCPUCfg) {
		m.taskTotalCPU = uint64(hc * 10)
	} else {
		m.taskTotalCPU = uint64(m.totalCPUCfg * 10)
	}

	// adjust mem (we allow at most 80% mem allocated)
	if hm := m.monitor.GetMEM(); hm*8 < m.totalMEMCfg*10 {
		m.taskTotalMEM = uint64(hm * 8 / 10)
	} else {
		m.taskTotalMEM = uint64(m.totalMEMCfg)
	}
	m.taskAvailCPU.Store(m.taskTotalCPU)
	m.taskAvailMEM.Store(m.taskTotalMEM)
}

func (m *resourceManager) Start() bool {
	if !m.monitor.Start() {
		return false
	}
	// adjust based on the host info
	m.adjustResourceConfig()
	log.Printf("meca task executor resource manager started with cpu %f core, mem %d MB", float64(m.taskTotalCPU)/10, m.taskTotalMEM)
	return true
}

func (m *resourceManager) Stop() {
	m.monitor.Stop()
}

func (m *resourceManager) Reserve(cpu float64, mem int) error {
	cpu_10 := uint64(cpu * 10)
	for {
		// check violation first before trying to update
		ham := int(float64(m.monitor.GetMEM()) * m.monitor.GetMEMAvail() / 100)
		tam := m.taskAvailMEM.Load()
		hac := int(float64(m.monitor.GetCPU()) * m.monitor.GetCPUAvail() / 10)
		tac := m.taskAvailCPU.Load()
		log.Printf("ham: %d, tam: %d, hac: %d, tac: %d", ham, tam, hac, tac)

		if ham < mem || tam < uint64(mem) || hac < int(cpu_10) || tac < cpu_10 {
			return errMECANotEnoughResource
		}
		// try to update
		targetm := tam - uint64(mem)
		if !m.taskAvailMEM.CompareAndSwap(tam, targetm) {
			continue
		}
		targetc := tac - cpu_10
		if m.taskAvailCPU.CompareAndSwap(tac, targetc) {
			break
		}
		m.taskAvailMEM.Add(uint64(mem))
	}
	log.Printf("reserved cpu %.2f, mem %d; now task cpu %d, task mem %d", cpu, mem, m.taskAvailCPU.Load(), m.taskAvailMEM.Load())
	return nil
}

func (m *resourceManager) Release(cpu float64, mem int) error {
	// release cpu resources
	m.taskAvailCPU.Add(uint64(cpu) * 10)
	m.taskAvailMEM.Add(uint64(mem))
	log.Printf("released cpu %.2f, mem %d; now task cpu %d, task mem %d", cpu, mem, m.taskAvailCPU.Load(), m.taskAvailMEM.Load())
	return nil
}

func (m *resourceManager) Stats() (stats ResourceStats) {
	stats.TotalCPU = m.monitor.GetCPU()
	stats.TotalMEM = m.monitor.GetMEM()
	stats.UsedCPU = m.monitor.GetCPUUsed()
	stats.UsedMEM = m.monitor.GetMEMUsed()
	stats.TaskCPU = float64(m.taskTotalCPU) / 10
	stats.TaskMEM = int(m.taskTotalMEM)
	stats.TaskUsedCPU = 100 - 100*float64(m.taskAvailCPU.Load())/float64(m.taskTotalCPU)
	stats.TaskUsedMEM = 100 - 100*float64(m.taskAvailMEM.Load())/float64(m.taskTotalMEM)
	return
}
