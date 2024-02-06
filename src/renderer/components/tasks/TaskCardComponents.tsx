import { Typography, Box, Button, CircularProgress } from '@mui/material';
import React from 'react';

interface LabelWithValueProps {
  label: string;
  value: string;
}
interface CustomButtonProps {
  label: string;
  onClick: () => void;
  color: string;
  backgroundColor: string;
  isLoading: boolean;
}

export const LabelWithValue: React.FC<LabelWithValueProps> = ({
  label,
  value,
}) => {
  return (
    <Typography variant="subtitle2" sx={{ margin: '0 0 0.2rem 0' }}>
      <span style={{ fontWeight: 600 }}>{label}</span>: {value}
    </Typography>
  );
};

export const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  onClick,
  color,
  backgroundColor,
  isLoading,
}) => {
  return (
    <Button
      onClick={onClick}
      sx={{
        color,
        backgroundColor,
        width: '15rem',
        margin: '0 0 0.3rem 0',
        position: 'relative',
        '&:disabled': {
          backgroundColor,
          color: 'text.disabled',
        },
        fontWeight: 600,
      }}
      disabled={isLoading}
    >
      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {isLoading && (
          <CircularProgress
            size={24}
            sx={{
              color: 'text.primary',
              marginRight: '8px',
            }}
          />
        )}
        {label}
      </Box>
    </Button>
  );
};
