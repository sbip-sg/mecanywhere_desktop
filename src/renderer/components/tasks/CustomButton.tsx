import { Box, Button, CircularProgress } from '@mui/material';
import React from 'react';
import BlockIcon from '@mui/icons-material/Block';

interface CustomButtonProps {
  label: string;
  onClick: () => void;
  color: string;
  backgroundColor: string;
  isLoading?: boolean;
  showBlockIcon?: boolean;
  fullWidth?: boolean;
  fontSize? : string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  onClick,
  color,
  backgroundColor,
  isLoading = false,
  showBlockIcon = false,
  fullWidth = true,
  fontSize = '1rem',
}) => {
  return (
    <Button
      onClick={onClick}
      sx={{
        color,
        backgroundColor,
        margin: '0 0 0.3rem 0',
        position: 'relative',
        '&:disabled': {
          backgroundColor,
          color: 'grey',
        },
        fontWeight: 600,
        fontSize, 
        opacity: isLoading ? 0.7 : 1,
        ...(showBlockIcon
          ? {
              '&:hover': {
                backgroundColor: 'background.disabledHover',
                cursor: 'not-allowed',
              },
            }
          : {}),
      }}
      disabled={showBlockIcon}
      startIcon={showBlockIcon ? <BlockIcon /> : null}
      fullWidth={fullWidth}
    >
      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {isLoading && (
          <CircularProgress
            size={24}
            sx={{
              color,
              marginRight: '4px',
            }}
          />
        )}
        {label}
      </Box>
    </Button>
  );
};

export default CustomButton;
