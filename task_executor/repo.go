package executor

// version can be a hash
type TaskRepo interface {
	Exists(id, version string) (bool, error)
	Fetch(id, remote, version string) error
}
