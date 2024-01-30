import React from 'react';
import { DataEntry } from '../../utils/dataTypes';

const convertEpochToStandardTimeWithDate = (epochTimeInSeconds: number) => {
  const dateObj = new Date(epochTimeInSeconds * 1000);
  const year = dateObj.getUTCFullYear().toString().slice(-2);
  const month = (dateObj.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = dateObj.getUTCDate().toString().padStart(2, '0');
  const hours = dateObj.getUTCHours().toString().padStart(2, '0');
  const minutes = dateObj.getUTCMinutes().toString().padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export interface PropConfig<T> {
  property: keyof T;
  renderer: (_data: T) => React.ReactNode;
  label: string;
}

export const renderWithOptionalSlice = (
  value: string,
  shouldSlice: boolean = true
): string => {
  return shouldSlice ? `${value.slice(0, 10)}...` : value;
};

export const PropConfigList: PropConfig<DataEntry>[] = [
  {
    property: 'transaction_id',
    renderer: (data: DataEntry, shouldSlice?: boolean) =>
      renderWithOptionalSlice(data.transaction_id, shouldSlice),
    label: 'Transaction ID',
  },
  {
    property: 'transaction_start_datetime',
    renderer: (data: DataEntry) =>
      convertEpochToStandardTimeWithDate(data.transaction_start_datetime),
    label: 'Start Datetime',
  },
  {
    property: 'transaction_end_datetime',
    renderer: (data: DataEntry) =>
      convertEpochToStandardTimeWithDate(data.transaction_end_datetime),
    label: 'End Datetime',
  },
  {
    property: 'resource_cpu',
    renderer: (data: DataEntry) => data.resource_cpu.toString(),
    label: 'CPU Utilized (cores)',
  },
  {
    property: 'resource_memory',
    renderer: (data: DataEntry) => data.resource_memory.toString(),
    label: 'Memory Utilized (MB)',
  },
  {
    property: 'duration',
    renderer: (data: DataEntry) => data.duration,
    label: 'Duration (s)',
  },
];
