import React from 'react';
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';

interface StatusProps {
  children: React.ReactNode;
  isExpanded: boolean;
}

const Status: React.FC<StatusProps> = ({ children, isExpanded }) => {
  let statusColor;
  let bgColor;
  if (isExpanded) {
    statusColor = 'text.primary';
    bgColor = 'primary.main';
  } else if (children === 'Pending') {
    statusColor = '#E49B03';
    bgColor = '#FFF5D9';
  } else if (children === 'Completed') {
    statusColor = 'background.paper';
    bgColor = 'secondary.main';
  } else {
    console.error('Invalid status');
    return <Box sx={{ color: 'red' }}>Invalid status</Box>;
  }
  return (
    <Box
      sx={{
        color: statusColor,
        backgroundColor: bgColor,
        borderRadius: '5px',
      }}
    >
      <Typography
        sx={{
          fontSize: isExpanded ? '16px' : '14px',
          fontWeight: '600',
          padding: '0.1rem 0.7rem 0.1rem 0.7rem',
          alignItems: 'center',
        }}
      >
        {children}
      </Typography>
    </Box>
  );
};

export default Status;
