import { Typography, TypographyProps } from '@mui/material';
import React from 'react';

interface CustomTypographyProps extends TypographyProps {
  children: React.ReactNode;
}

export const CaptionTypography: React.FC<CustomTypographyProps> = (props) => {
  return (
    <Typography
      variant="subtitle1"
      {...props}
      sx={{
        color: 'text.primary',
        fontWeight: '600',
        padding: '0.1rem 0rem 0.1rem 0rem',
        alignItems: 'center',
        ...props.sx,
      }}
    />
  );
};

export const DetailTypography: React.FC<CustomTypographyProps> = (props) => {
  return (
    <Typography
      variant="body1"
      {...props}
      sx={{
        color: 'text.primary',
        padding: '0.1rem 0rem 0.1rem 0rem',
        alignItems: 'center',
        ...props.sx,
      }}
    />
  );
};
