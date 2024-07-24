export interface Event {
  address: string;
  args: any;
  blockHash: string;
  blockNumber: number;
  event: string;
  logIndex: number;
  transactionHash: string;
  transactionIndex: number;
}

export interface DataEntry {
  duration: number; // TaskSent - TaskFinished
  price: number; // TaskFinished fee
  resource_cpu: number; // from ipfs
  resource_memory: number; // from ipfs
  role: 'host' | 'client';
  task_name: string; // from ipfs
  transaction_end_datetime: number; // TaskFinished
  transaction_start_datetime: number; // TaskSent
  transaction_id: string; // TaskFinished transactionHash
}

export interface GroupedDataEntry {
  avg_resource_cpu: number;
  avg_resource_memory: number;
  client_avg_resource_cpu: number;
  client_avg_resource_memory: number;
  client_total_duration: number;
  client_total_price: number;
  date: string;
  half_total_price: number;
  host_avg_resource_cpu: number;
  host_avg_resource_memory: number;
  host_total_duration: number;
  host_total_price: number;
  total_duration: number;
  total_price: number;
}

export interface EditedDataEntry extends GroupedDataEntry {
  status: 'Completed' | 'Pending';
  startDate: string;
  endDate: string;
}

export type AccumulatorType = {
  [key: string]: {
    date: string;
    client_resource_cpu: number;
    client_resource_memory: number;
    client_duration: number;
    client_price: number;
    client_count: number;
    host_resource_cpu: number;
    host_resource_memory: number;
    host_duration: number;
    host_price: number;
    host_count: number;
  };
};

export interface ExecutorSettings {
  option: string;
  cpu_cores: number;
  memory_mb: number;
  gpus: number;
}

export interface ResourcesLog {
  total_cpu: number;
  total_mem: number;
  used_cpu: number;
  used_mem: number;
  task_cpu: number;
  task_mem: number;
  task_used_cpu: number;
  task_used_mem: number;
  gpu_model: string;
  task_gpu: number;
  task_used_gpu: number;
}

export interface UserState {
  authenticated: boolean;
}

export interface ThemeState {
  color: string;
}

export interface ImportingAccountState {
  importingAccount: boolean;
}

type Job = {
  id: string;
  content: string;
};

type JobResult = {
  id: string;
  content: string;
};

export interface JobsState {
  jobs: Job[];
  jobResults: JobResult[];
}

export interface DeviceStats {
  totalCpuCores: number;
  totalMem: number;
  totalGpus: number;
  gpuModel: string;
}

export interface TaskList {
  built: string[];
  tested: string[];
  activated: string[];
}

export enum ComputingType {
  CPU = 'CPU',
  GPU = 'GPU',
  SGX = 'SGX',
}

export interface Task {
  tag: string;
  taskName: string;
  cid: string;
  cidBytes: string;
  sizeFolder: number;
  sizeIo: number;
  computingType: ComputingType;
  fee: number;
  description: string;
  owner: string;
}

export interface ExecutorStatus {
  running: boolean;
}

export interface Tower {
  owner: string;
  sizeLimit: number;
  publicConnection: string;
  feeType: number;
  fee: number;
  stake: number;
}

export interface TowerList {
  unregistered: string[];
  registered: string[];
}
