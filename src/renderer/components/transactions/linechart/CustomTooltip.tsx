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
          backgroundColor: theme.palette.lightBlack.main,
          padding: '1rem 1rem 1rem 1rem',
          borderRadius: '7px',
          minWidth: 150,
        }}
      >
        <Box sx={{ color: theme.palette.mintGreen.main, fontSize: '20px' }}>
          {label}
        </Box>
        <Box>
          {payload.map((pld: any, index: number) => (
            <Box key={index}>
              <Box
                sx={{
                  color: theme.palette.violet.main,
                  textAlign: 'right',
                  fontSize: '18px',
                }}
              >
                {pld.value}
              </Box>
              <Box
                sx={{
                  color: theme.palette.lightPurple.main,
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
