export interface ExternalDataEntry {
  transaction_id: string;
  transaction_start_datetime: number;
  transaction_end_datetime: number;
  resource_cpu: number;
  resource_memory: number;
  price: number;
  task: string;
  duration: number;
  network_reliability: number;
}

export interface InternalDataEntry {
  transaction_id: string;
  transaction_start_datetime: number;
  transaction_end_datetime: number;
  did: string;
  host_did: string;
  po_did: string;
  host_po_did: string;
  resource_cpu: number;
  resource_memory: number;
  price: number;
  task: string;
  duration: number;
  network_reliability: number;
}
