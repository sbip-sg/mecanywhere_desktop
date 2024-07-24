import { Grid } from '@mui/material';
import React from 'react';
import { CaptionTypography, DetailTypography } from './CustomTypography';

interface ColumnProps {
  item: any;
  columnWidth: any;
}

const secondsToString = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${remainingSeconds}s`;
};

const UtilizationColumn: React.FC<ColumnProps> = ({ item, columnWidth }) => {
  return (
    <Grid
      item
      container
      xs={columnWidth}
      sx={{
        borderRadius: '10px',
      }}
    >
      <Grid item container xs={6} sx={{ flexDirection: 'column' }}>
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
        <CaptionTypography>Total Time</CaptionTypography>
        <DetailTypography>
          {secondsToString(item.client_total_duration)}
        </DetailTypography>
      </Grid>
      <Grid item container xs={6} sx={{ flexDirection: 'column' }}>
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
        <CaptionTypography>Total Time</CaptionTypography>
        <DetailTypography>
          {secondsToString(item.host_total_duration)}
        </DetailTypography>
      </Grid>
    </Grid>
  );
};

export default UtilizationColumn;
