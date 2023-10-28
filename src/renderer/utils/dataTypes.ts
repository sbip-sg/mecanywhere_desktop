export interface ExternalDataEntry {
  transaction_id: string;
  resource_consumed: number;
  resource_cpu: number;
  resource_memory: number;
  transaction_start_datetime: number;
  transaction_end_datetime: number;
  task: string;
  duration: number;
  network_reliability: number;
  price: number;
}

export interface InternalDataEntry {
  transaction_id: string;
  resource_consumed: number;
  resource_cpu: number;
  resource_memory: number;
  transaction_start_datetime: number;
  transaction_end_datetime: number;
  task: string;
  duration: number;
  network_reliability: number;
  price: number;
  host_did: string;
  client_did: string;
  host_po_did: string;
  client_po_did: string;
}
