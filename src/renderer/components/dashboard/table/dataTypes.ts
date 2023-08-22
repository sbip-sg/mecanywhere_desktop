export interface ExternalDataEntry {
  session_id: string;
  did: string;
  resource_consumed: number;
  session_start_datetime: number | string;
  session_end_datetime: number | string;
  task: string;
  duration: number;
}

export interface InternalDataEntry {
  session_id: string;
  did: string;
  provider_did: string;
  resource_consumed: number;
  session_start_datetime: number | string;
  session_end_datetime: number | string;
  task: string;
  duration: number;
  network_reliability: number;
  is_host: Boolean;
  task_run: number;
  usage_charge: number;
}
