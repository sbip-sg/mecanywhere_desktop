export interface ExternalDataEntry {
  transaction_id: string;
  // did: string;
  resource_consumed: number;
  transaction_start_datetime: number;
  transaction_end_datetime: number;
  task: string;
  duration: number;
  network_reliability: number;
  price: number;
}

export interface InternalDataEntry {
  transaction_id: string;
  did: string;
  provider_did: string;
  resource_consumed: number;
  transaction_start_datetime: number;
  transaction_end_datetime: number;
  task: string;
  duration: number;
  network_reliability: number;
  is_host: Boolean;
  task_run: number;
  usage_charge: number;
}
