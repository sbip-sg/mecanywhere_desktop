// import log from 'electron-log/renderer';
import {
  LineChart,
  Label,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import React, { useState, useEffect } from 'react';
import { useTheme } from '@emotion/react';
import { IconButton } from '@mui/material';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import RefreshIcon from '@mui/icons-material/Refresh';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import { RootState } from 'renderer/redux/store';
import CustomTooltip from './CustomTooltip';
import DatePickerPopover from './DatePickerPopover';
import DataKeySelectorPopover from './DataKeySelectorPopover';
import { ExternalDataEntry } from '../../../utils/dataTypes';

type GroupedData = {
  date: string;
  resource_cpu: number;
  resource_memory: number;
  duration: number;
  network_reliability: number;
  price: number;
};

interface CustomLineChartProps {
  yAxisLabel: string;
  data: ExternalDataEntry[];
  handleRefresh: () => void;
  appRole: string;
}

const filterByDate = (entries, startDate, endDate) => {
  return entries.filter((entry) => {
    if (startDate && endDate) {
      const entryDate = new Date(entry.transaction_start_datetime * 1000);
      return entryDate >= startDate && entryDate <= endDate;
    }
    return true;
  });
};

const filterByRole = (entries, selectedRole) => {
  return entries.filter((entry) => {
    if (selectedRole === 'client' && entry.is_client) {
      return true;
    }
    if (selectedRole === 'host' && entry.is_host) {
      return true;
    }
    if (selectedRole === 'both') {
      return true;
    }
    return false;
  });
};

const CustomLineChart: React.FC<CustomLineChartProps> = ({
  data,
  yAxisLabel,
  handleRefresh,
  appRole,
}) => {
  const theme = useTheme();
  const [groupBy, setGroupBy] = useState<string>('month');
  const [dataKey, setDataKey] = useState<string>('resource_memory');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [dateObjects, setDateObjects] = useState<Date[] | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('both');
  const [datePickerAnchorEl, setDatePickerAnchorEl] =
    React.useState<HTMLButtonElement | null>(null);
  const [dataKeySelectorAnchorEl, setDataKeySelectorAnchorEl] =
    React.useState<HTMLButtonElement | null>(null);

  const handleOpenDatePicker = (event: React.MouseEvent<HTMLButtonElement>) => {
    setDatePickerAnchorEl(event.currentTarget);
  };

  const handleOpenDataKeySelector = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setDataKeySelectorAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    setDateObjects(
      data.map((entry) => new Date(entry.transaction_start_datetime * 1000))
    );
  }, [data]);

  const dataFilteredByDate = filterByDate(data, startDate, endDate);
  const dataFilteredByRoleAndDate = filterByRole(
    dataFilteredByDate,
    selectedRole
  );
  console.log('dataFilteredByDate', dataFilteredByDate);
  console.log('dataFilteredByRoleAndDate', dataFilteredByRoleAndDate);

  let groupedDataAccumulator;
  let groupedData: GroupedData[];

  if (appRole === 'provider') {
    groupedDataAccumulator = dataFilteredByRoleAndDate.reduce(
      (accumulator, entry) => {
        const entryDate = new Date(entry.transaction_start_datetime * 1000);
        let groupKey;

        if (groupBy === 'day') {
          groupKey = entryDate.toLocaleDateString();
        } else if (groupBy === 'week') {
          const weekStartDate = new Date(entryDate);
          weekStartDate.setDate(entryDate.getDate() - entryDate.getDay());
          groupKey = weekStartDate.toLocaleDateString();
        } else {
          groupKey = `${entryDate.toLocaleString('default', {
            month: 'long',
          })} ${entryDate.getFullYear()}`;
        }

        accumulator[groupKey] = accumulator[groupKey] || {
          date: groupKey,
          client_resource_cpu: 0,
          host_resource_cpu: 0,
          client_resource_memory: 0,
          host_resource_memory: 0,
          client_duration: 0,
          host_duration: 0,
          client_network_reliability: 0,
          host_network_reliability: 0,
          client_price: 0,
          host_price: 0,
          client_count: 0,
          host_count: 0,
        };
        // console.log('entry', entry);
        if (entry.is_client) {
          accumulator[groupKey].client_resource_cpu += Number(
            entry.resource_cpu
          );
          accumulator[groupKey].client_resource_memory += Number(
            entry.resource_memory
          );
          accumulator[groupKey].client_duration += Number(entry.duration);
          accumulator[groupKey].client_network_reliability += Number(
            entry.network_reliability
          );
          accumulator[groupKey].client_price += Number(entry.price);
          accumulator[groupKey].client_count += 1;
        } else if (entry.is_host) {
          accumulator[groupKey].host_resource_cpu += Number(entry.resource_cpu);
          accumulator[groupKey].host_resource_memory += Number(
            entry.resource_memory
          );
          accumulator[groupKey].host_duration += Number(entry.duration);
          accumulator[groupKey].host_network_reliability += Number(
            entry.network_reliability
          );
          accumulator[groupKey].host_price += Number(entry.price);
          accumulator[groupKey].host_count += 1;
        }

        return accumulator;
      },
      {} as {
        [key: string]: GroupedData & {
          client_count: number;
          host_count: number;
        };
      }
    );

    console.log('groupedDataAccumulator', groupedDataAccumulator);
    groupedData = Object.values(groupedDataAccumulator).map((group) => {
      return {
        ...group,
        client_resource_cpu:
          group.client_count > 0
            ? group.client_resource_cpu / group.client_count
            : 0,
        host_resource_cpu:
          group.host_count > 0 ? group.host_resource_cpu / group.host_count : 0,
        client_resource_memory:
          group.client_count > 0
            ? group.client_resource_memory / group.client_count
            : 0,
        host_resource_memory:
          group.host_count > 0
            ? group.host_resource_memory / group.host_count
            : 0,
        client_avg_duration:
          group.client_count > 0
            ? group.client_duration / group.client_count
            : 0,
        host_avg_duration:
          group.host_count > 0 ? group.host_duration / group.host_count : 0,
        client_network_reliability:
          group.client_count > 0
            ? group.client_network_reliability / group.client_count
            : 0,
        host_network_reliability:
          group.host_count > 0
            ? group.host_network_reliability / group.host_count
            : 0,
      };
    });
    console.log('provider_grouped_data', groupedData);
  } else {
    groupedDataAccumulator = dataFilteredByRoleAndDate.reduce(
      (accumulator, entry) => {
        const entryDate = new Date(entry.transaction_start_datetime * 1000);
        let groupKey;

        if (groupBy === 'day') {
          groupKey = entryDate.toLocaleDateString();
        } else if (groupBy === 'week') {
          const weekStartDate = new Date(entryDate);
          weekStartDate.setDate(entryDate.getDate() - entryDate.getDay());
          groupKey = weekStartDate.toLocaleDateString();
        } else {
          groupKey = `${entryDate.toLocaleString('default', {
            month: 'long',
          })} ${entryDate.getFullYear()}`;
        }

        accumulator[groupKey] = accumulator[groupKey] || {
          date: groupKey,
          resource_cpu: 0,
          resource_memory: 0,
          duration: 0,
          network_reliability: 0,
          price: 0,
          count: 0,
        };

        accumulator[groupKey].resource_cpu += Number(entry.resource_cpu);
        accumulator[groupKey].resource_memory += Number(entry.resource_memory);
        accumulator[groupKey].duration += Number(entry.duration);
        accumulator[groupKey].network_reliability += Number(
          entry.network_reliability
        );
        accumulator[groupKey].price += Number(entry.price);
        accumulator[groupKey].count += 1;

        return accumulator;
      },
      {} as { [key: string]: GroupedData & { count: number } }
    );

    groupedData = Object.values(groupedDataAccumulator).map((group) => {
      return {
        ...group,
        resource_cpu: group.resource_cpu / group.count,
        resource_memory: group.resource_memory / group.count,
        avg_duration: group.duration / group.count,
        network_reliability: group.network_reliability / group.count,
      };
    });
    console.log('host_grouped_data', groupedData);
  }
  console.log('grouped_data', groupedData);
  // const groupedDataAccumulator = dataFilteredByRoleAndDate.reduce(
  //   (accumulator, entry) => {
  //     const entryDate = new Date(entry.transaction_start_datetime * 1000);
  //     let groupKey;

  //     if (groupBy === 'day') {
  //       groupKey = entryDate.toLocaleDateString();
  //     } else if (groupBy === 'week') {
  //       const weekStartDate = new Date(entryDate);
  //       weekStartDate.setDate(entryDate.getDate() - entryDate.getDay());
  //       groupKey = weekStartDate.toLocaleDateString();
  //     } else {
  //       groupKey = entryDate.toLocaleString('default', { month: 'long' });
  //     }

  //     accumulator[groupKey] = accumulator[groupKey] || {
  //       date: groupKey,
  //       resource_cpu: 0,
  //       resource_memory: 0,
  //       duration: 0,
  //       network_reliability: 0,
  //       price: 0,
  //       count: 0,
  //     };

  //     accumulator[groupKey].resource_cpu += Number(entry.resource_cpu);
  //     accumulator[groupKey].resource_memory += Number(entry.resource_memory);
  //     accumulator[groupKey].duration += Number(entry.duration);
  //     accumulator[groupKey].network_reliability += Number(
  //       entry.network_reliability
  //     );
  //     accumulator[groupKey].price += Number(entry.price);
  //     accumulator[groupKey].count += 1;

  //     return accumulator;
  //   },
  //   {} as { [key: string]: GroupedData & { count: number } }
  // );

  // const groupedData: GroupedData[] = Object.values(groupedDataAccumulator).map(
  //   (group) => {
  //     return {
  //       ...group,
  //       resource_cpu: group.resource_cpu / group.count,
  //       resource_memory: group.resource_memory / group.count,
  //       avg_duration: group.duration / group.count,
  //       network_reliability: group.network_reliability / group.count,
  //     };
  //   }
  // );
  // console.log('host_grouped_data', groupedData);
  const sortedGroupedData: GroupedData[] = groupedData.sort((a, b) => {
    const dateA = new Date(Date.parse(a.date));
    const dateB = new Date(Date.parse(b.date));
    return dateA.getTime() - dateB.getTime();
  });

  console.log('sortedGroupedDataxxx', sortedGroupedData);

  return (
    <Box
      id="line-chart-wrapper"
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
      }}
    >
      <Box
        id="title-widget-wrapper"
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: '10%',
          padding: '0 1rem 0 1rem',
        }}
      >
        <Box id="widget-wrapper" sx={{ ml: 'auto', padding: '1.5rem 0 0 0' }}>
          <IconButton size="small" onClick={handleRefresh}>
            <RefreshIcon fontSize="small" sx={{ color: 'white' }} />
          </IconButton>
          <IconButton size="small" onClick={handleOpenDataKeySelector}>
            <QueryStatsIcon fontSize="small" sx={{ color: 'white' }} />
          </IconButton>
          <IconButton size="small" onClick={handleOpenDatePicker}>
            <CalendarMonthIcon fontSize="small" sx={{ color: 'white' }} />
          </IconButton>
          <Backdrop
            sx={{ color: '#fff', zIndex: theme.zIndex.drawer + 1 }}
            open={Boolean(datePickerAnchorEl)}
          >
            <DatePickerPopover
              dateObjects={dateObjects}
              anchorEl={datePickerAnchorEl}
              groupBy={groupBy}
              setGroupBy={setGroupBy}
              setAnchorEl={setDatePickerAnchorEl}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              startDate={startDate}
              endDate={endDate}
            />
          </Backdrop>
          <Backdrop
            sx={{ color: '#fff', zIndex: theme.zIndex.drawer + 1 }}
            open={Boolean(dataKeySelectorAnchorEl)}
          >
            <DataKeySelectorPopover
              anchorEl={dataKeySelectorAnchorEl}
              setAnchorEl={setDataKeySelectorAnchorEl}
              datakey={dataKey}
              setDatakey={setDataKey}
              selectedRole={selectedRole}
              setSelectedRole={setSelectedRole}
            />
          </Backdrop>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          width: '100%',
          padding: '0 1rem 0 1rem',
        }}
      >
        <ResponsiveContainer width="100%" height="90%">
          <LineChart data={sortedGroupedData} margin={{ top: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }}>
              <Label
                value={yAxisLabel}
                position="insideLeft"
                angle={-90}
                style={{ textAnchor: 'middle', fontSize: 16 }}
              />
            </YAxis>
            <Tooltip content={<CustomTooltip />} />
            {/* Display for non-providers (i.e., host) */}
            {appRole !== 'provider' && (
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={theme.palette.violet.main}
                strokeWidth={3}
                animationDuration={500}
              />
            )}
            {/* Display for providers based on the selected role */}
            {appRole === 'provider' && (
              <>
                {selectedRole === 'client' || selectedRole === 'both' ? (
                  <Line
                    type="monotone"
                    dataKey={`client_${dataKey}`}
                    stroke={theme.palette.mintGreen.main}
                    strokeWidth={3}
                    animationDuration={500}
                  />
                ) : null}
                {selectedRole === 'host' || selectedRole === 'both' ? (
                  <Line
                    type="monotone"
                    dataKey={`host_${dataKey}`}
                    stroke={theme.palette.violet.main}
                    strokeWidth={3}
                    animationDuration={500}
                  />
                ) : null}
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
        {/* <ResponsiveContainer width="100%" height="90%">
          <LineChart data={sortedGroupedData} margin={{ top: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }}>
              <Label
                value={yAxisLabel}
                position="insideLeft"
                angle={-90}
                style={{ textAnchor: 'middle', fontSize: 16 }}
              />
            </YAxis>
            <Tooltip content={<CustomTooltip />} />
            {useSelector((state: RootState) => state.roleReducer.role) !==
              'provider' && (
              <Line
                type="monotone"
                dataKey={dataKey} // replace as dataKey + host (in future +client) (you also need to combine two sets of data and rename the datakeys with each of client and host)
                stroke={theme.palette.violet.main}
                strokeWidth={3}
                animationDuration={500}
              />
            )}
            {useSelector((state: RootState) => state.roleReducer.role) ===
              'provider' && (
              <Line
                type="monotone"
                dataKey={dataKey} // replace as dataKey + role
                stroke={theme.palette.violet.main}
                strokeWidth={3}
                animationDuration={500}
              />
            )}
          </LineChart>
        </ResponsiveContainer> */}
      </Box>
    </Box>
  );
};

export default CustomLineChart;

// const halfLength = Math.ceil(groupedData.length / 2);
// const topHalf = groupedData.slice(0, halfLength);
// const bottomHalf = groupedData.slice(halfLength);

// const swappedData = [...bottomHalf, ...topHalf].map((entry) => ({
//   month: entry.month,
//   fake_resource_consumed: entry.resource_consumed,
// }));

// groupedData.forEach((entry, index) => {
//   entry.fake_resource_consumed = swappedData[index].fake_resource_consumed;
// });
// const thirtyPercentLength = Math.floor(groupedData.length * 0.3);
// const first30Percent = groupedData.slice(0, thirtyPercentLength);
// const remaining70Percent = groupedData.slice(thirtyPercentLength);

// const doubleFakeData = [...remaining70Percent, ...first30Percent].map(
//   (entry) => ({
//     month: entry.month,
//     double_fake_resource_consumed: entry.resource_consumed,
//   })
// );

// groupedData.forEach((entry, index) => {
//   entry.double_fake_resource_consumed =
//     doubleFakeData[index].double_fake_resource_consumed;
// });
{
  /* {useSelector((state: RootState) => state.roleReducer.role) ===
              'host' && (
              <Line
                type="monotone"
                dataKey="resource_consumed"
                stroke={theme.palette.violet.main}
                strokeWidth={3}
              />
            )}
            {useSelector((state: RootState) => state.roleReducer.role) ===
              'provider' && (
              <Line
                type="monotone"
                dataKey="fake_resource_consumed"
                stroke={theme.palette.violet.main}
                strokeWidth={3}
              />
            )}
            {useSelector((state: RootState) => state.roleReducer.role) ===
              'provider' && (
              <Line
                type="monotone"
                dataKey="double_fake_resource_consumed"
                stroke={theme.palette.mintGreen.main} // A different color, you can change this
                strokeWidth={3}
              />
            )} */
}
