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
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useTheme } from '@emotion/react';
import { IconButton } from '@mui/material';
import { ExternalDataEntry } from '../../common/dataTypes';
import { styled } from '@mui/material/styles';
import CustomTooltip from './CustomTooltip';

// import log from 'electron-log/main';

// Optional, initialize the logger for any renderer process
import log from 'electron-log/renderer';
log.info('Log from the renderer process');
interface GroupedData {
  month: string;
  resource_consumed: number;
}

interface CustomLineChartProps {
  yAxisLabel: string;
  data: ExternalDataEntry[];
}

const StyledDatePicker = styled(DatePicker)(({ theme }) => ({
  backgroundColor: theme.palette.darkBlack.main,
  color: theme.palette.violet.main,
  border: '0px',
  borderRadius: '2px',
  padding: '0.3rem',
  width: '15rem',
  fontSize: '14px',
  fontWeight: '600',
  textAlign: 'center',
}));

const CustomLineChart: React.FC<CustomLineChartProps> = ({
  data,
  yAxisLabel,
}) => {
  const [groupBy, setGroupBy] = useState<string>('month'); // Default grouping by month
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [startMinDate, setStartMinDate] = useState<Date | null>(null);
  const [startMaxDate, setStartMaxDate] = useState<Date | null>(null);
  const [endMinDate, setEndMinDate] = useState<Date | null>(null);
  const [endMaxDate, setEndMaxDate] = useState<Date | null>(null);
  const theme = useTheme();
  const groupingOptions = [
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
  ];

  useEffect(() => {
    if (data.length !== 0) {
      const dateObjects = data.map(
        (entry) => new Date(entry.session_start_datetime * 1000)
      );
      const initialMinDate = dateObjects.reduce((min, date) =>
        date < min ? date : min
      );
      const initialMaxDate = dateObjects.reduce((max, date) =>
        date > max ? date : max
      );
      setStartMinDate(initialMinDate);
      setEndMinDate(initialMinDate);
      setStartMaxDate(initialMaxDate);
      setEndMaxDate(initialMaxDate);
    }
  }, [data]);

  const handleChangeStartDate = (date: Date) => {
    setStartDate(date);
    setEndMinDate(date);
  };

  const handleChangeEndDate = (date: Date) => {
    setEndDate(date);
    setStartMaxDate(date);
  };

  const filteredData = data.filter((entry) => {
    if (startDate && endDate) {
      const entryDate = new Date(entry.session_start_datetime * 1000);
      return entryDate >= startDate && entryDate <= endDate;
    }
    return true;
  });
  
  // log.info('filteredData', filteredData);

  const groupedDataObject = filteredData.reduce((acc, entry) => {
    const entryDate = new Date(entry.session_start_datetime * 1000);
    let groupKey;

    if (groupBy === 'day') {
      groupKey = entryDate.toLocaleDateString();
    } else if (groupBy === 'week') {
      const weekStartDate = new Date(entryDate);
      weekStartDate.setDate(entryDate.getDate() - entryDate.getDay());
      groupKey = weekStartDate.toLocaleDateString();
    } else {
      groupKey = entryDate.toLocaleString('default', { month: 'long' });
    }
    acc[groupKey] = acc[groupKey] || { month: groupKey, resource_consumed: 0 };
    acc[groupKey].resource_consumed += Number(entry.resource_consumed);
    return acc;
  }, {} as { [key: string]: GroupedData });
  const groupedData: GroupedData[] = Object.values(groupedDataObject);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleChangeGroupby = (
    event: React.MouseEvent<HTMLElement>,
    newGroupBy: string | null
  ) => {
    if (newGroupBy !== null) {
      setGroupBy(newGroupBy);
    }
  };
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
        <Box id="widget-wrapper" sx={{ ml: 'auto' }}>
          <IconButton size="small" onClick={handleClick}>
            <CalendarMonthIcon fontSize="small" sx={{ color: 'white' }} />
          </IconButton>
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
          >
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: -260,
              }}
              sx={{
                '.MuiPaper-root': {
                  borderRadius: '10px',
                  backgroundColor: theme.palette.mediumBlack.main,
                },
              }}
            >
              <Box
                sx={{
                  width: '18rem',
                  backgroundColor: theme.palette.mediumBlack.main,
                  boxShadow: 24,
                  padding: '1.5rem',
                }}
              >
                <Typography
                  id="transition-modal-title"
                  style={{
                    fontSize: '14px',
                    letterSpacing: '0.2em',
                    margin: '0.5rem 0 0.1rem 0.2rem',
                    fontWeight: '500',
                  }}
                >
                  GROUP BY
                </Typography>
                <ToggleButtonGroup
                  sx={{
                    color: theme.palette.cerulean.main,
                    backgroundColor: theme.palette.mediumBlack.main,
                  }}
                  value={groupBy}
                  exclusive
                  onChange={handleChangeGroupby}
                >
                  {groupingOptions.map((option) => (
                    <ToggleButton
                      sx={{
                        minWidth: '5rem',
                        padding: '0.2rem 0.5rem 0.2rem 0.5rem',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: theme.palette.mintGreen.main,
                        backgroundColor: theme.palette.darkBlack.main,
                        '&.Mui-selected': {
                          color: theme.palette.darkBlack.main,
                          backgroundColor: theme.palette.violet.main,
                          fontSize: '14px',
                          fontWeight: '600',
                        },
                      }}
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
                <Typography
                  id="transition-modal-title"
                  style={{
                    fontSize: '14px',
                    letterSpacing: '0.2em',
                    margin: '0.5rem 0 0.1rem 0.2rem',
                    fontWeight: '500',
                  }}
                >
                  START DATE
                </Typography>
                <StyledDatePicker
                  popperProps={{ strategy: 'fixed' }}
                  selected={startDate}
                  onChange={handleChangeStartDate}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  placeholderText="Start Date"
                  minDate={startMinDate}
                  maxDate={startMaxDate}
                />
                <Typography
                  id="transition-modal-title"
                  style={{
                    fontSize: '14px',
                    letterSpacing: '0.2em',
                    margin: '0.5rem 0 0.1rem 0.2rem',
                    fontWeight: '500',
                  }}
                >
                  END DATE
                </Typography>
                <StyledDatePicker
                  popperProps={{ strategy: 'fixed' }}
                  selected={endDate}
                  onChange={handleChangeEndDate}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  placeholderText="End Date"
                  minDate={endMinDate}
                  maxDate={endMaxDate}
                />
              </Box>
            </Popover>
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
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }}>
              <Label
                value={yAxisLabel}
                position="insideLeft"
                angle={-90}
                style={{ textAnchor: 'middle', fontSize: 16 }}
              />
            </YAxis>
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="resource_consumed"
              stroke={theme.palette.violet.main}
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default CustomLineChart;
