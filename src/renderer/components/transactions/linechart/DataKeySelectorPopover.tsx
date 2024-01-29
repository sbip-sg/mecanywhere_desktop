import React from 'react';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { datakeyOptions } from './dataKeys';

interface DatakeySelectorPopoverProps {
  anchorEl: HTMLElement | null;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
  datakey: string;
  setDatakey: React.Dispatch<React.SetStateAction<string>>;
  selectedRole: string;
  setSelectedRole: React.Dispatch<React.SetStateAction<string>>;
}

const roleOptions = [
  { label: 'Client', value: 'client' },
  { label: 'Host', value: 'host' },
  { label: 'Both', value: 'both' },
];

const DatakeySelectorPopover: React.FC<DatakeySelectorPopoverProps> = ({
  anchorEl,
  setAnchorEl,
  datakey,
  setDatakey,
  selectedRole,
  setSelectedRole,
}) => {
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeRole = (
    event: React.MouseEvent<HTMLElement>,
    newRole: string | null
  ) => {
    if (newRole !== null) {
      console.log('newrole', newRole);
      setSelectedRole(newRole);
    }
    handleClose();
  };

  const handleChangeDatakey = (
    event: React.MouseEvent<HTMLElement>,
    newDatakey: string | null
  ) => {
    if (newDatakey !== null) {
      setDatakey(newDatakey);
    }
    handleClose();
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
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Box
        sx={{
          width: '20rem',
          backgroundColor: 'background.paper',
          boxShadow: 24,
          padding: '1.2rem 2rem 2rem 2rem',
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            letterSpacing: '0.2em',
            margin: '0.5rem 0 0.1rem 0.2rem',
            fontWeight: '600',
            color: 'text.primary',
          }}
        >
          SELECT ROLE
        </Typography>
        <ToggleButtonGroup
          sx={{
            color: 'primary.main',
            backgroundColor: 'primary.dark',
            width: '100%',
          }}
          value={selectedRole}
          onChange={handleChangeRole}
          exclusive
        >
          {roleOptions.map((option) => (
            <ToggleButton
              sx={{
                minWidth: '5rem',
                width: '100%',
                padding: '0.2rem 0.5rem 0.2rem 0.5rem',
                fontSize: '14px',
                fontWeight: '600',
                color: 'primary.main',
                backgroundColor: 'background.paper',
                '&.Mui-selected': {
                  color: 'background.paper',
                  backgroundColor: 'secondary.contrastText',
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
          variant="subtitle1"
          sx={{
            letterSpacing: '0.2em',
            margin: '1.5rem 0 0.5rem 0.2rem',
            fontWeight: '600',
          }}
        >
          VIEW BY
        </Typography>
        <ToggleButtonGroup
          sx={{
            color: 'primary.main',
            backgroundColor: 'primary.dark',
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
                width: '100%',
                padding: '0.2rem 1rem 0.2rem 1rem',
                fontSize: '12px',
                fontWeight: '600',
                color: 'primary.main',
                backgroundColor: 'background.paper',
                '&.Mui-selected': {
                  color: 'background.paper',
                  backgroundColor: 'secondary.contrastText',
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
