import Box from '@mui/material/Box';
import { useTheme } from '@emotion/react';
import { TooltipProps } from 'recharts';
import {
  ValueType,
  NameType,
} from 'recharts/types/component/DefaultTooltipContent';

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  const theme = useTheme();
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          backgroundColor: 'customBackground.light',
          padding: '1rem 1rem 1rem 1rem',
          borderRadius: '7px',
          minWidth: 150,
        }}
      >
        <Box sx={{ color: 'secondary.main', fontSize: '20px' }}>
          {label}
        </Box>
        <Box>
          {payload.map((pld: any, index: number) => (
            <Box key={index}>
              <Box
                sx={{
                  color: 'secondary.contrastText',
                  textAlign: 'right',
                  fontSize: '18px',
                }}
              >
                {pld.value}
              </Box>
              <Box
                sx={{
                  color: 'text.secondary',
                  textAlign: 'right',
                  fontSize: '14px',
                }}
              >
                resource consumed
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    );
  }
  return null;
};

export default CustomTooltip;
