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
import groupData from '../../../utils/groupData';

interface CustomLineChartProps {
  yAxisLabel: string;
  data: ExternalDataEntry[];
  handleRefresh: () => void;
  handleAddDummyData: (role: string) => void;
  appRole: string;
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
  const [dataKey, setDataKey] = useState<string>('avg_resource_memory');
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

  const groupedData = groupData(
    data,
    startDate,
    endDate,
    groupBy,
    selectedRole,
    selfDid,
    appRole
  );

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
          <IconButton size="small" onClick={() => handleAddDummyData(appRole)}>
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
          <LineChart data={groupedData} margin={{ top: 0 }}>
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
