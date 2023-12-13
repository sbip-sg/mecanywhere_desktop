import { convertEpochToStandardTimeWithDate } from 'renderer/components/common/unitConversion';
import { ExternalDataEntry, InternalDataEntry } from '../common/dataTypes';

export interface PropConfig<T> {
  property: keyof T;
  renderer: (data: T) => React.ReactNode;
  label: string;
}

export const InternalPropConfigList: PropConfig<InternalDataEntry>[] = [
  {
    property: 'transaction_id',
    renderer: (data: InternalDataEntry) =>
      `${data.transaction_id.slice(0, 10)}...`,
    label: 'transaction ID',
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
    property: 'did',
    renderer: (data: InternalDataEntry) => `${data.did.slice(0, 10)}...`,
    label: 'Client DID',
  },
  {
    property: 'host_did',
    renderer: (data: InternalDataEntry) => `${data.host_did.slice(0, 10)}...`,
    label: 'Host DID',
  },
  {
    property: 'po_did',
    renderer: (data: InternalDataEntry) => `${data.po_did.slice(0, 10)}...`,
    label: 'Provider DID of Client',
  },
  {
    property: 'host_po_did',
    renderer: (data: InternalDataEntry) =>
      `${data.host_po_did.slice(0, 10)}...`,
    label: 'Provider DID of Host',
  },
  {
    property: 'resource_cpu',
    renderer: (data: InternalDataEntry) => data.resource_cpu,
    label: 'CPU Utilized (cores)',
  },
  {
    property: 'resource_memory',
    renderer: (data: ExternalDataEntry) => data.resource_memory.toString(),
    label: 'Memory Utilized (MB)',
  },
  {
    property: 'price',
    renderer: (data: InternalDataEntry) => data.price,
    label: 'Usage Price (SGD)',
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
];

export const ExternalPropConfigList: PropConfig<ExternalDataEntry>[] = [
  {
    property: 'transaction_id',
    renderer: (data: ExternalDataEntry) =>
      `${data.transaction_id.slice(0, 10)}...`,
    label: 'Transaction ID',
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
  {
    property: 'resource_cpu',
    renderer: (data: ExternalDataEntry) => data.resource_cpu.toString(),
    label: 'CPU Utilized (cores)',
  },
  {
    property: 'resource_memory',
    renderer: (data: ExternalDataEntry) => data.resource_memory.toString(),
    label: 'Memory Utilized (MB)',
  },
  {
    property: 'duration',
    renderer: (data: ExternalDataEntry) => data.duration,
    label: 'Duration (min)',
  },
];
