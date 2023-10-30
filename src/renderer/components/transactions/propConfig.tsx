import { convertEpochToStandardTimeWithDate } from 'renderer/utils/unitConversion';
import { ExternalDataEntry, InternalDataEntry } from '../../utils/dataTypes';

export interface PropConfig<T> {
  property: keyof T;
  renderer: (data: T) => React.ReactNode;
  label: string;
}

export const InternalPropConfigList: PropConfig<InternalDataEntry>[] = [
  {
    property: 'transaction_id',
    renderer: (data: InternalDataEntry) => `${data.transaction_id.slice(0, 10)}...`,
    label: 'transaction ID',
  },
  {
    property: 'did',
    renderer: (data: InternalDataEntry) => `${data.did.slice(0, 10)}...`,
    label: 'DID',
  },
  {
    property: 'provider_did',
    renderer: (data: InternalDataEntry) =>
      `${data.provider_did.slice(0, 10)}...`,
    label: "Provider's DID",
  },
  {
    property: 'resource_consumed',
    renderer: (data: InternalDataEntry) => data.resource_consumed.toString(),
    label: 'Resource Consumed, CC',
  },
  {
    property: 'transaction_start_datetime',
    renderer: (data: InternalDataEntry) =>
      convertEpochToStandardTimeWithDate(data.transaction_start_datetime),
    label: 'transaction Start Datetime',
  },
  {
    property: 'transaction_end_datetime',
    renderer: (data: InternalDataEntry) =>
      convertEpochToStandardTimeWithDate(data.transaction_end_datetime),
    label: 'transaction End Datetime',
  },
  {
    property: 'task',
    renderer: (data: InternalDataEntry) => data.task,
    label: 'Task',
  },
  {
    property: 'duration',
    renderer: (data: InternalDataEntry) => data.duration,
    label: 'Duration (min)',
  },
  {
    property: 'network_reliability',
    renderer: (data: InternalDataEntry) => data.network_reliability,
    label: 'Network Reliability, %',
  },
  // {
  //     property: 'is_host',
  //     renderer: (data: InternalDataEntry) => (data.is_host ? 'Yes' : 'No'),
  //     label: 'Is Host'
  // },
  {
    property: 'task_run',
    renderer: (data: InternalDataEntry) => data.task_run,
    label: 'Tasks Ran',
  },
  {
    property: 'usage_charge',
    renderer: (data: InternalDataEntry) => data.usage_charge,
    label: 'Usage Charge, SGD',
  },
];

export const ExternalPropConfigList: PropConfig<ExternalDataEntry>[] = [
  {
    property: 'transaction_id',
    // renderer: (data: ExternalDataEntry) => `${data.transaction_id.slice(0, 10)}...`,
    renderer: (data: ExternalDataEntry) => `${data.transaction_id.slice(0, 10)}...`,
    label: 'Transaction ID',
  },
  {
    property: 'resource_memory',
    renderer: (data: ExternalDataEntry) => data.resource_consumed.toString(),
    label: 'Memory Utilized (MB)',
  },
  {
    property: 'resource_cpu',
    renderer: (data: ExternalDataEntry) => data.resource_consumed.toString(),
    label: 'CPU Utilized (cores)',
  },
  {
    property: 'transaction_start_datetime',
    renderer: (data: ExternalDataEntry) =>
      convertEpochToStandardTimeWithDate(data.transaction_start_datetime),
    label: 'Start Datetime',
  },
  {
    property: 'transaction_end_datetime',
    renderer: (data: ExternalDataEntry) =>
      convertEpochToStandardTimeWithDate(data.transaction_end_datetime),
    label: 'End Datetime',
  },
  // {
  //   property: 'task',
  //   renderer: (data: ExternalDataEntry) => data.task,
  //   label: 'Task',
  // },
  {
    property: 'duration',
    renderer: (data: ExternalDataEntry) => data.duration,
    label: 'Duration (min)',
  },
];
