import { Grid, Stack } from '@mui/material';
import React from 'react';
import { CaptionTypography, DetailTypography } from './CustomTypography';

interface ColumnProps {
  item: any;
  columnWidth: any;
}

const SecondColumn: React.FC<ColumnProps> = ({ item, columnWidth }) => {
  return (
    <Grid
      item
      container
      xs={columnWidth}
      sx={{
        borderRadius: '10px',
      }}
    >
      <Stack>
        <CaptionTypography sx={{ color: 'secondary.contrastText' }}>
          Client
        </CaptionTypography>
        <CaptionTypography>Avg. Mem Utilized (MB)</CaptionTypography>
        <DetailTypography>
          {item.client_avg_resource_memory.toFixed(2)}
        </DetailTypography>
        <CaptionTypography>Avg. CPU Utilized (cores)</CaptionTypography>
        <DetailTypography>
          {item.client_avg_resource_cpu.toFixed(2)}
        </DetailTypography>
        <CaptionTypography>Total Hours</CaptionTypography>
        <DetailTypography>
          {item.client_total_duration.toFixed(2)}
        </DetailTypography>
      </Stack>
    </Grid>
  );
};

export default SecondColumn;
