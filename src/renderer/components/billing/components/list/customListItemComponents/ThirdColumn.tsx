import { Grid, Stack } from '@mui/material';
import React from 'react';
import { CaptionTypography, DetailTypography } from './CustomTypography';

interface ColumnProps {
  item: any;
  columnWidth: any;
}

const ThirdColumn: React.FC<ColumnProps> = ({ item, columnWidth }) => {
  return (
    <Grid
      item
      xs={columnWidth}
      container
      sx={{
        borderRadius: '10px',
        padding: '0rem 3rem 0rem 0.5rem',
      }}
    >
      <Stack>
        <CaptionTypography sx={{ color: 'secondary.contrastText' }}>
          Host
        </CaptionTypography>
        <CaptionTypography>Avg. Mem Utilized (MB)</CaptionTypography>
        <DetailTypography>
          {item.host_avg_resource_memory.toFixed(2)}
        </DetailTypography>
        <CaptionTypography>Avg. CPU Utilized (cores)</CaptionTypography>
        <DetailTypography>
          {item.host_avg_resource_cpu.toFixed(2)}
        </DetailTypography>
        <CaptionTypography>Total Hours</CaptionTypography>
        <DetailTypography>
          {item.host_total_duration.toFixed(2)}
        </DetailTypography>
      </Stack>
    </Grid>
  );
};

export default ThirdColumn;
