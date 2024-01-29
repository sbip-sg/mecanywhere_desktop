import { DataEntry, AccumulatorType } from './dataTypes';

const filterByDate = (entries: DataEntry[], startDate: Date, endDate: Date) => {
  return entries.filter((entry: DataEntry) => {
    if (startDate && endDate) {
      const entryDate = new Date(entry.transaction_start_datetime * 1000);
      return entryDate >= startDate && entryDate <= endDate;
    }
    return true;
  });
};

const filterByRole = (entries: DataEntry[], selectedRole: string) => {
  return entries.filter(() => {
    if (selectedRole === 'client') {
      return true;
    }
    if (selectedRole === 'host') {
      return true;
    }
    if (selectedRole === 'both') {
      return true;
    }
    return false;
  });
};

function getGroupKey(entryDate: Date, groupBy: string) {
  if (groupBy === 'day') {
    return entryDate.toLocaleDateString();
  }
  if (groupBy === 'week') {
    const weekStartDate = new Date(entryDate);
    weekStartDate.setDate(entryDate.getDate() - entryDate.getDay());
    return weekStartDate.toLocaleDateString();
  }
  return `${entryDate.toLocaleString('default', {
    month: 'long',
  })} ${entryDate.getFullYear()}`;
}

function initializeAccumulator(groupKey: string) {
  return {
    date: groupKey,
    client_resource_cpu: 0,
    client_resource_memory: 0,
    client_duration: 0,
    client_network_reliability: 0,
    client_price: 0,
    client_count: 0,
    host_resource_cpu: 0,
    host_resource_memory: 0,
    host_duration: 0,
    host_network_reliability: 0,
    host_price: 0,
    host_count: 0,
  };
}

function updateAccumulator(
  accumulator: AccumulatorType,
  entry: DataEntry,
  groupKey: string
) {
  if (entry.role === 'client') {
    accumulator[groupKey].client_count += 1;
    accumulator[groupKey].client_resource_cpu += Number(entry.resource_cpu);
    accumulator[groupKey].client_resource_memory += Number(
      entry.resource_memory
    );
    accumulator[groupKey].client_duration += Number(entry.duration);
    accumulator[groupKey].client_network_reliability += Number(
      entry.network_reliability
    );
    accumulator[groupKey].client_price += Number(entry.price);
  } else if (entry.role === 'host') {
    accumulator[groupKey].host_count += 1;
    accumulator[groupKey].host_resource_cpu += Number(entry.resource_cpu);
    accumulator[groupKey].host_resource_memory += Number(entry.resource_memory);
    accumulator[groupKey].host_duration += Number(entry.duration);
    accumulator[groupKey].host_network_reliability += Number(
      entry.network_reliability
    );
    accumulator[groupKey].host_price += Number(entry.price);
  }
  return accumulator;
}

function groupData(
  data: DataEntry[],
  startDate: Date,
  endDate: Date,
  groupBy: string,
  selectedRole: string
) {
  const dataFilteredByDate = filterByDate(data, startDate, endDate);
  const dataFilteredByRoleAndDate = filterByRole(
    dataFilteredByDate,
    selectedRole
  );

  const groupedDataAccumulator = dataFilteredByRoleAndDate.reduce(
    (accumulator: AccumulatorType, entry) => {
      const entryDate = new Date(entry.transaction_start_datetime * 1000);
      const groupKey = getGroupKey(entryDate, groupBy);
      accumulator[groupKey] =
        accumulator[groupKey] || initializeAccumulator(groupKey);
      return updateAccumulator(accumulator, entry, groupKey);
    },
    {}
  );
  const groupedData = Object.values(groupedDataAccumulator).map((group) => {
    return {
      // Averages and totals for client data
      client_avg_resource_cpu:
        group.client_count > 0
          ? group.client_resource_cpu / group.client_count
          : 0,
      client_avg_resource_memory:
        group.client_count > 0
          ? group.client_resource_memory / group.client_count
          : 0,
      client_total_duration: group.client_duration,
      client_avg_network_reliability:
        group.client_count > 0
          ? group.client_network_reliability / group.client_count
          : 0,
      client_total_price: group.client_price,

      // Averages and totals for host data
      host_avg_resource_cpu:
        group.host_count > 0 ? group.host_resource_cpu / group.host_count : 0,
      host_avg_resource_memory:
        group.host_count > 0
          ? group.host_resource_memory / group.host_count
          : 0,
      host_total_duration: group.host_duration,
      host_avg_network_reliability:
        group.host_count > 0
          ? group.host_network_reliability / group.host_count
          : 0,
      host_total_price: group.host_price,

      // Combined averages for both client and host
      avg_resource_cpu:
        (group.client_resource_cpu + group.host_resource_cpu) /
        (group.client_count + group.host_count),
      avg_resource_memory:
        (group.client_resource_memory + group.host_resource_memory) /
        (group.client_count + group.host_count),
      total_duration: group.client_duration + group.host_duration,
      avg_network_reliability:
        (group.client_network_reliability + group.host_network_reliability) /
        (group.client_count + group.host_count),
      total_price: group.client_price + group.host_price,
      half_total_price: (group.client_price + group.host_price) / 2,
      date: group.date,
    };
  });
  return groupedData.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

export default groupData;
