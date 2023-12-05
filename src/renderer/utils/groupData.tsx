const filterByDate = (entries, startDate, endDate) => {
  return entries.filter((entry) => {
    if (startDate && endDate) {
      const entryDate = new Date(entry.transaction_start_datetime * 1000);
      return entryDate >= startDate && entryDate <= endDate;
    }
    return true;
  });
};

const filterByRole = (entries, selectedRole, selfDid) => {
  return entries.filter((entry) => {
    if (selectedRole === 'client' && entry.po_did === selfDid) {
      return true;
    }
    if (selectedRole === 'host' && entry.host_po_did === selfDid) {
      return true;
    }
    if (selectedRole === 'both') {
      return true;
    }
    return false;
  });
};

function getGroupKey(entryDate, groupBy) {
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

function initializeAccumulator(groupKey, isProvider) {
  if (isProvider) {
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
  return {
    date: groupKey,
    resource_cpu: 0,
    resource_memory: 0,
    duration: 0,
    network_reliability: 0,
    price: 0,
    count: 0,
  };
}

function updateAccumulator(accumulator, entry, groupKey, isProvider, selfDid) {
  if (isProvider) {
    if (entry.po_did === selfDid) {
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
    } else if (entry.host_po_did === selfDid) {
      accumulator[groupKey].host_count += 1;
      accumulator[groupKey].host_resource_cpu += Number(entry.resource_cpu);
      accumulator[groupKey].host_resource_memory += Number(
        entry.resource_memory
      );
      accumulator[groupKey].host_duration += Number(entry.duration);
      accumulator[groupKey].host_network_reliability += Number(
        entry.network_reliability
      );
      accumulator[groupKey].host_price += Number(entry.price);
    }
  } else {
    accumulator[groupKey].count += 1;
    accumulator[groupKey].resource_cpu += Number(entry.resource_cpu);
    accumulator[groupKey].resource_memory += Number(entry.resource_memory);
    accumulator[groupKey].duration += Number(entry.duration);
    accumulator[groupKey].network_reliability += Number(
      entry.network_reliability
    );
    accumulator[groupKey].price += Number(entry.price);
  }
  return accumulator;
}

function groupData(
  data,
  startDate,
  endDate,
  groupBy,
  selectedRole,
  selfDid,
  appRole
) {
  console.log('appRole', appRole);
  const dataFilteredByDate = filterByDate(data, startDate, endDate);
  const dataFilteredByRoleAndDate = filterByRole(
    dataFilteredByDate,
    selectedRole,
    selfDid
  );

  const groupedDataAccumulator = dataFilteredByRoleAndDate.reduce(
    (accumulator, entry) => {
      const entryDate = new Date(entry.transaction_start_datetime * 1000);
      const groupKey = getGroupKey(entryDate, groupBy);
      accumulator[groupKey] =
        accumulator[groupKey] ||
        initializeAccumulator(groupKey, appRole === 'provider');
      return updateAccumulator(
        accumulator,
        entry,
        groupKey,
        appRole === 'provider',
        selfDid
      );
    },
    {}
  );
  const groupedData = Object.values(groupedDataAccumulator).map((group) => {
    if (appRole === 'provider') {
      return {
        // ...group,
        // Averages and totals for the provider's client data
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

        // Averages and totals for the provider's host data
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
    }
    // Data for non-provider
    return {
      //   ...group,
      avg_resource_cpu: group.count > 0 ? group.resource_cpu / group.count : 0,
      avg_resource_memory:
        group.count > 0 ? group.resource_memory / group.count : 0,
      avg_network_reliability:
        group.count > 0 ? group.network_reliability / group.count : 0,
      total_duration: group.duration,
      total_price: group.price,
      date: group.date,
    };
  });

  console.log('groupedData', groupedData);

  return groupedData.sort((a, b) => new Date(a.date) - new Date(b.date));
}

export default groupData;
