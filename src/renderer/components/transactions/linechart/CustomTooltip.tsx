import Box from '@mui/material/Box';
import { TooltipProps } from 'recharts';
import {
  ValueType,
  NameType,
} from 'recharts/types/component/DefaultTooltipContent';
import { isClient, isHost, getLabelForDataKey } from './dataKeys';

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          backgroundColor: 'background.default',
          padding: '1rem',
          borderRadius: '7px',
          minWidth: 150,
        }}
      >
        <Box
          sx={{ color: 'text.primary', fontSize: '16px', fontWeight: '600' }}
        >
          {label}
        </Box>
        <Box>
          {payload
            .filter((pld: any) => pld.name !== 'half_total_price')
            .map((pld: any) => (
              <Box key={pld.name}>
                <Box
                  sx={{
                    color: isClient(pld.name)
                      ? 'secondary.main'
                      : isHost(pld.name)
                      ? 'secondary.contrastText'
                      : 'secondary.contrastText',
                    textAlign: 'right',
                    fontSize: '18px',
                    fontWeight: '600',
                  }}
                >
                  {pld.value.toFixed(2)}
                </Box>
                <Box
                  sx={{
                    color: 'text.primary',
                    textAlign: 'right',
                    fontSize: '14px',
                  }}
                >
                  {getLabelForDataKey(pld.name)}
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
