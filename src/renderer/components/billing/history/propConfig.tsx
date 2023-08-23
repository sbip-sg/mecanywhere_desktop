import { ExternalBillingDataEntry, InternalBillingDataEntry } from './table/dataTypes';

export interface PropConfig<T> {
  property: keyof T;
  renderer: (data: T) => React.ReactNode;
  label: string;
}

export const InternalPropConfigList: PropConfig<InternalBillingDataEntry>[] = [
  {
    property: 'did',
    renderer: (data: InternalBillingDataEntry) => `${data.did.slice(0, 10)}...`,
    label: 'DID',
  },
  {
    property: 'billing_start_date',
    renderer: (data: InternalBillingDataEntry) => data.billing_start_date,
    label: "Billing Cycle",
  },
  {
    property: 'total_resource_consumed',
    renderer: (data: InternalBillingDataEntry) => data.total_resource_consumed.toString(),
    label: 'Total Resource Consumed, CC',
  },
  {
    property: 'number_of_sessions',
    renderer: (data: InternalBillingDataEntry) => data.number_of_sessions.toString(),
    label: 'Number of session',
  },
  {
    property: 'total_usage_hours',
    renderer: (data: InternalBillingDataEntry) => data.total_usage_hours.toString(),
    label: 'Total Usage Hours, CC',
  },
  {
    property: 'total_tasks_run',
    renderer: (data: InternalBillingDataEntry) => data.total_tasks_run.toString(),
    label: 'Total tasks run',
  },
  {
    property: 'billing_amount',
    renderer: (data: InternalBillingDataEntry) => data.billing_amount.toString(),
    label: 'Billing Amount',
  },
  {
    property: 'billing_due_date',
    renderer: (data: InternalBillingDataEntry) => data.billing_due_date,
    label: "Billing Due Date",
  },
  {
    property: 'payment_date',
    renderer: (data: InternalBillingDataEntry) => data.payment_date,
    label: "Payment Date",
  },
];

export const ExternalPropConfigList: PropConfig<ExternalBillingDataEntry>[] = [
  {
    property: 'did',
    renderer: (data: ExternalBillingDataEntry) => `${data.did.slice(0, 10)}...`,
    label: 'DID',
  },
  {
    property: 'billing_start_date',
    renderer: (data: ExternalBillingDataEntry) => data.billing_start_date,
    label: "Billing Cycle",
  },
  {
    property: 'total_resource_consumed',
    renderer: (data: ExternalBillingDataEntry) => data.total_resource_consumed.toString(),
    label: 'Total Resource Consumed, CC',
  },
  {
    property: 'number_of_sessions',
    renderer: (data: ExternalBillingDataEntry) => data.number_of_sessions.toString(),
    label: 'Number of session',
  },
  {
    property: 'total_usage_hours',
    renderer: (data: ExternalBillingDataEntry) => data.total_usage_hours.toString(),
    label: 'Total Usage Hours, CC',
  },
  {
    property: 'total_tasks_run',
    renderer: (data: ExternalBillingDataEntry) => data.total_tasks_run.toString(),
    label: 'Total tasks run',
  },
  {
    property: 'billing_amount',
    renderer: (data: ExternalBillingDataEntry) => data.billing_amount.toString(),
    label: 'Billing Amount',
  },
  {
    property: 'billing_due_date',
    renderer: (data: ExternalBillingDataEntry) => data.billing_due_date,
    label: "Billing Due Date",
  },
  {
    property: 'payment_date',
    renderer: (data: ExternalBillingDataEntry) => data.payment_date,
    label: "Payment Date",
  },
];