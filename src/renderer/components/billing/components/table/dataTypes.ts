export interface ExternalBillingDataEntry {
  did: string;
  billing_start_date: string;
  total_resource_consumed: number;
  number_of_sessions: number;
  total_usage_hours: number;
  total_tasks_run: number;
  billing_amount: number;
  billing_due_date: number | string;
  payment_date: number | string;
}

export interface InternalBillingDataEntry {
  did: string;
  billing_start_date: string;
  total_resource_consumed: number;
  number_of_sessions: number;
  total_usage_hours: number;
  total_tasks_run: number;
  billing_amount: number;
  billing_due_date: number | string;
  payment_date: number | string;
}