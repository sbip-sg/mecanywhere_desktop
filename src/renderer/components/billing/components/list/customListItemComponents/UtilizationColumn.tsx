import { Grid, Stack } from '@mui/material';
import React from 'react';
import { CaptionTypography, DetailTypography } from './CustomTypography';

interface ColumnProps {
  item: any;
  columnWidth: any;
  appRole: any;
}

const UtilizationColumn: React.FC<ColumnProps> = ({
  item,
  columnWidth,
  appRole,
}) => {
  return (
    <Grid
      item
      container
      xs={columnWidth}
      sx={{
        borderRadius: '10px',
      }}
    >
      {appRole === 'provider' ? (
        <>
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
            <CaptionTypography>Total Hours</CaptionTypography>
            <DetailTypography>
              {item.client_total_duration.toFixed(2)}
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
            <CaptionTypography>Total Hours</CaptionTypography>
            <DetailTypography>
              {item.host_total_duration.toFixed(2)}
            </DetailTypography>
          </Grid>
        </>
      ) : (
        <Grid item container xs={6} sx={{ flexDirection: 'column' }}>
          <CaptionTypography>Avg. Mem Utilized (MB)</CaptionTypography>
          <DetailTypography>
            {item.avg_resource_memory.toFixed(2)}
          </DetailTypography>
          <CaptionTypography>Avg. CPU Utilized (cores)</CaptionTypography>
          <DetailTypography>
            {item.avg_resource_cpu.toFixed(2)}
          </DetailTypography>
          <CaptionTypography>Total Hours</CaptionTypography>
          <DetailTypography>{item.total_duration.toFixed(2)}</DetailTypography>
        </Grid>
      )}
    </Grid>
  );
};

export default UtilizationColumn;
