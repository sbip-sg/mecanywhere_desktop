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
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import RefreshIcon from '@mui/icons-material/Refresh';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import AddIcon from '@mui/icons-material/Add';
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
  handleAddDummyData: () => void;
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

const CustomLineChart: React.FC<CustomLineChartProps> = ({
  data,
  yAxisLabel,
  handleRefresh,
  handleAddDummyData,
  appRole,
}) => {
  const selfDid = window.electron.store.get('did');
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
    {} as { [key: string]: GroupedData & { count: number } }
  );

  const groupedData = Object.values(groupedDataAccumulator).map((group) => {
    return {
      ...group,
      resource_cpu: group.resource_cpu / group.count,
      resource_memory: group.resource_memory / group.count,
      avg_duration: group.duration / group.count,
      network_reliability: group.network_reliability / group.count,
    };
  });

  const sortedGroupedData: GroupedData[] = groupedData.sort((a, b) => {
    const dateA = new Date(Date.parse(a.date));
    const dateB = new Date(Date.parse(b.date));
    return dateA.getTime() - dateB.getTime();
  });

  // console.log('groupedDataAccumulator', groupedDataAccumulator);
  // console.log('grouped_data', groupedData);
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
        <Box id="widget-wrapper" sx={{ ml: 'auto', padding: '1.2rem 0 0 0' }}>
          <IconButton size="small" onClick={handleAddDummyData}>
            <AddIcon fontSize="small" sx={{ color: 'text.primary' }} />
          </IconButton>
          <IconButton size="small" onClick={handleRefresh}>
            <RefreshIcon fontSize="small" sx={{ color: 'text.primary' }} />
          </IconButton>
          <IconButton size="small" onClick={handleOpenDataKeySelector}>
            <QueryStatsIcon fontSize="small" sx={{ color: 'text.primary' }} />
          </IconButton>
          <IconButton size="small" onClick={handleOpenDatePicker}>
            <CalendarMonthIcon
              fontSize="small"
              sx={{ color: 'text.primary' }}
            />
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
                stroke={theme.palette.secondary.contrastText}
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
                    stroke={theme.palette.secondary.main}
                    strokeWidth={3}
                    animationDuration={500}
                  />
                ) : null}
                {selectedRole === 'host' || selectedRole === 'both' ? (
                  <Line
                    type="monotone"
                    dataKey={`host_${dataKey}`}
                    stroke={theme.palette.secondary.contrastText}
                    strokeWidth={3}
                    animationDuration={500}
                  />
                ) : null}
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default CustomLineChart;
