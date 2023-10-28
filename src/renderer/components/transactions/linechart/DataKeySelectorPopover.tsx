import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useTheme } from '@emotion/react';

interface DatakeySelectorPopoverProps {
  anchorEl: HTMLElement | null;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
  datakey: string;
  setDatakey: React.Dispatch<React.SetStateAction<string>>;
  selectedRoles: string[];
  setSelectedRoles: React.Dispatch<React.SetStateAction<string[]>>;
}

const datakeyOptions = [
  { label: 'Avg. Memory Utilized (MB)', value: 'resource_memory' },
  { label: 'Avg. CPU Utilized (cores)', value: 'resource_cpu' },
  { label: 'Avg. Duration', value: 'avg_duration' },
  { label: 'Total Duration', value: 'duration' },
  { label: 'Total Price (SGD)', value: 'price' },
  { label: 'Network Reliability', value: 'network_reliability' },
];

const roleOptions = [
  { label: 'Client', value: 'client' },
  { label: 'Host', value: 'host' },
];

const DatakeySelectorPopover: React.FC<DatakeySelectorPopoverProps> = ({
  anchorEl,
  setAnchorEl,
  datakey,
  setDatakey,
  selectedRoles,
  setSelectedRoles,
}) => {
  const theme = useTheme();

  useEffect(() => {
    console.log('selectedRoles', selectedRoles);
  }, [selectedRoles]);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeRole = (
    event: React.MouseEvent<HTMLElement>,
    newRoles: string[]
  ) => {
    if (newRoles.length !== 0) {
      setSelectedRoles(newRoles);
    }
  };

  const handleChangeDatakey = (
    event: React.MouseEvent<HTMLElement>,
    newDatakey: string | null
  ) => {
    if (newDatakey !== null) {
      setDatakey(newDatakey);
    }
  };
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
          width: '20rem',
          backgroundColor: theme.palette.mediumBlack.main,
          boxShadow: 24,
          padding: '1.2rem 2rem 2rem 2rem',
        }}
      >
        <Typography
          id="transition-modal-title"
          style={{
            fontSize: '15px',
            letterSpacing: '0.2em',
            margin: '0.5rem 0 0.5rem 0.2rem',
            fontWeight: '600',
          }}
        >
          SELECT ROLE
        </Typography>
        <ToggleButtonGroup
          sx={{
            color: theme.palette.cerulean.main,
            backgroundColor: theme.palette.mediumBlack.main,
            width: '100%',
          }}
          value={selectedRoles}
          onChange={handleChangeRole}
        >
          {roleOptions.map((option) => (
            <ToggleButton
              sx={{
                minWidth: '5rem',
                padding: '0.2rem 1rem 0.2rem 1rem',
                fontSize: '14px',
                fontWeight: '600',
                color: theme.palette.mintGreen.main,
                backgroundColor: theme.palette.darkBlack.main,
                '&.Mui-selected': {
                  color: theme.palette.darkBlack.main,
                  backgroundColor: theme.palette.deepCerulean.main,
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
            fontSize: '15px',
            letterSpacing: '0.2em',
            margin: '1.5rem 0 0.5rem 0.2rem',
            fontWeight: '600',
          }}
        >
          VIEW BY
        </Typography>
        <ToggleButtonGroup
          sx={{
            color: theme.palette.cerulean.main,
            backgroundColor: theme.palette.mediumBlack.main,
            width: '100%',
          }}
          value={datakey}
          exclusive
          onChange={handleChangeDatakey}
          orientation="vertical"
        >
          {datakeyOptions.map((option) => (
            <ToggleButton
              sx={{
                minWidth: '5rem',
                padding: '0.2rem 1rem 0.2rem 1rem',
                fontSize: '12px',
                fontWeight: '600',
                color: theme.palette.mintGreen.main,
                backgroundColor: theme.palette.darkBlack.main,
                '&.Mui-selected': {
                  color: theme.palette.darkBlack.main,
                  backgroundColor: theme.palette.violet.main,
                  fontSize: '12px',
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
      </Box>
    </Popover>
  );
};

export default DatakeySelectorPopover;
