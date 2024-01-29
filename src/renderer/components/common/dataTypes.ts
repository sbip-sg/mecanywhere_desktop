export interface DataEntry {
  duration: number;
  network_reliability: number;
  price: number;
  resource_cpu: number;
  resource_memory: number;
  role: string;
  task_name: string;
  transaction_end_datetime: number;
  transaction_start_datetime: number;
  transaction_id: string;
}

export interface DataEntryWithoutRole extends Omit<DataEntry, 'role'> {}

export interface GroupedDataEntry {
  avg_network_reliability: number;
  avg_resource_cpu: number;
  avg_resource_memory: number;
  client_avg_network_reliability: number;
  client_avg_resource_cpu: number;
  client_avg_resource_memory: number;
  client_total_duration: number;
  client_total_price: number;
  date: string;
  half_total_price: number;
  host_avg_network_reliability: number;
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
  dueDate: string;
}

export type AccumulatorType = {
  [key: string]: {
    date: string;
    client_resource_cpu: number;
    client_resource_memory: number;
    client_duration: number;
    client_network_reliability: number;
    client_price: number;
    client_count: number;
    host_resource_cpu: number;
    host_resource_memory: number;
    host_duration: number;
    host_network_reliability: number;
    host_price: number;
    host_count: number;
  };
};
