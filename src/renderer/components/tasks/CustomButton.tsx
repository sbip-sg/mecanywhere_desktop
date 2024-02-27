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
}

const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  onClick,
  color,
  backgroundColor,
  isLoading = false,
  showBlockIcon = false,
}) => {
  return (
    <Button
      onClick={onClick}
      sx={{
        color,
        backgroundColor,
        width: '14rem',
        margin: '0 0 0.3rem 0',
        position: 'relative',
        '&:disabled': {
          backgroundColor,
          color: 'grey',
        },
        fontWeight: 600,
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
    >
      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {isLoading && (
          <CircularProgress
            size={24}
            sx={{
              color,
              marginRight: '8px',
            }}
          />
        )}
        {label}
      </Box>
    </Button>
  );
};

export default CustomButton;
