export const datakeyOptions = [
  { label: 'Avg. Memory Utilized (MB)', value: 'avg_resource_memory' },
  { label: 'Avg. CPU Utilized (cores)', value: 'avg_resource_cpu' },
  { label: 'Total Duration', value: 'total_duration' },
  { label: 'Total Price (SGD)', value: 'total_price' },
  { label: 'Avg. Network Reliability', value: 'avg_network_reliability' },
];

export const datakeyLookUps = [
  { label: 'Avg. Memory Utilized (MB)', value: 'avg_resource_memory' },
  { label: 'Avg. CPU Utilized (cores)', value: 'avg_resource_cpu' },
  {
    label: 'Client Avg. Memory Utilized (MB)',
    value: 'client_avg_resource_memory',
  },
  {
    label: 'Client Avg. CPU Utilized (cores)',
    value: 'client_avg_resource_cpu',
  },
  {
    label: 'Host Avg. Memory Utilized (MB)',
    value: 'host_avg_resource_memory',
  },
  { label: 'Host Avg. CPU Utilized (cores)', value: 'host_avg_resource_cpu' },
  { label: 'Total Duration', value: 'total_duration' },
  { label: 'Client Total Duration', value: 'client_total_duration' },
  { label: 'Host Total Duration', value: 'host_total_duration' },
  { label: 'Total Price (SGD)', value: 'total_price' },
  { label: 'Client Total Price (SGD)', value: 'client_total_price' },
  { label: 'Host Total Price (SGD)', value: 'host_total_price' },
  { label: 'Avg. Network Reliability', value: 'avg_network_reliability' },
  {
    label: 'Client Avg. Network Reliability',
    value: 'client_avg_network_reliability',
  },
  {
    label: 'Host Avg. Network Reliability',
    value: 'host_avg_network_reliability',
  },
];

export const getLabelForDataKey = (dataKey: any) => {
  const entry = datakeyLookUps.find((option) => option.value === dataKey);
  return entry ? entry.label : dataKey; // Fallback to dataKey if no label is found
};

export const getRole = (dataKey: any) => {
  return dataKey.split('_')[0];
};

export const isClient = (dataKey: any) => {
  return getRole(dataKey) === 'client';
};

export const isHost = (dataKey: any) => {
  return getRole(dataKey) === 'host';
};
