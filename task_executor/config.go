package executor

type MecaExecutorConfig struct {
	Type    string  `yaml:"type"`
	Timeout int     `yaml:"timeout"`
	Cpu     float64 `yaml:"cpu"`
	Mem     int     `yaml:"mem"`
}
