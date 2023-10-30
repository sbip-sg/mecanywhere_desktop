import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useTheme } from '@emotion/react';

interface DatePickerPopoverProps {
  dateObjects: Date[] | null;
  groupBy: string;
  setGroupBy: (_value: string) => void;
  anchorEl: HTMLElement | null;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
  startDate: Date | null;
  setStartDate: (_value: Date | null) => void;
  endDate: Date | null;
  setEndDate: (_value: Date | null) => void;
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

const groupingOptions = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
];

const DatePickerPopover: React.FC<DatePickerPopoverProps> = ({
  dateObjects,
  anchorEl,
  setAnchorEl,
  groupBy,
  setGroupBy,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}) => {
  const theme = useTheme();
  const [startMinDate, setStartMinDate] = useState<Date | null>(null);
  const [startMaxDate, setStartMaxDate] = useState<Date | null>(null);
  const [endMinDate, setEndMinDate] = useState<Date | null>(null);
  const [endMaxDate, setEndMaxDate] = useState<Date | null>(null);
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
    handleClose();
  };
  const handleChangeStartDate = (date: Date) => {
    setStartDate(date);
    setEndMinDate(date);
  };
  const handleChangeEndDate = (date: Date) => {
    setEndDate(date);
    setStartMaxDate(date);
  };
  useEffect(() => {
    if (dateObjects && dateObjects.length !== 0) {
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
  }, [dateObjects]);

  return (
    <Popover
      open={Boolean(anchorEl)}
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
  );
};

export default DatePickerPopover;
