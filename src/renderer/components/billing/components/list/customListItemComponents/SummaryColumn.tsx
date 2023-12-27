import { Grid, Typography, Box } from '@mui/material';
import React from 'react';
import { CaptionTypography, DetailTypography } from './CustomTypography';

interface ColumnProps {
  item: any;
  columnWidth: any;
  appRole: any;
}

const CenteredGridItem = ({ xs, children, alignItems }) => (
  <Grid
    item
    container
    xs={xs}
    sx={{
      display: 'flex',
      justifyContent: 'end',
      alignItems,
    }}
  >
    {children}
  </Grid>
);

const SummaryColumn: React.FC<ColumnProps> = ({
  item,
  columnWidth,
  appRole,
}) => {
  return (
    <Grid
      item
      xs={columnWidth}
      container
      sx={{
        borderRadius: '10px',
        padding: '0rem 0rem 0rem 0.5rem',
      }}
    >
      <Grid item container xs={12}>
        {appRole === 'provider' && (
          <>
            <CenteredGridItem xs={6} alignItems="end">
              <CaptionTypography>Client</CaptionTypography>
            </CenteredGridItem>
            <CenteredGridItem xs={6} alignItems="end">
              <CaptionTypography>Host</CaptionTypography>
            </CenteredGridItem>
            <CenteredGridItem xs={6} alignItems="start">
              <DetailTypography
                sx={{ color: 'secondary.contrastText', fontWeight: '600' }}
              >
                {-item.client_total_price.toFixed(2)}
              </DetailTypography>
            </CenteredGridItem>
            <CenteredGridItem xs={6} alignItems="start">
              <DetailTypography
                sx={{ color: 'secondary.main', fontWeight: '600' }}
              >
                {item.host_total_price.toFixed(2)}
              </DetailTypography>
            </CenteredGridItem>
          </>
        )}
      </Grid>
      <Box sx={{ width: '100%' }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: '600',
            padding: '0.1rem 0rem 0.1rem 0rem',
            textAlign: 'end',
          }}
        >
          Total Amount
        </Typography>
        <Typography
          variant="h2"
          sx={{
            color: 'text.primary',
            fontWeight: '600',
            padding: '0.1rem 0rem 0rem 0rem',
            textAlign: 'end',
          }}
        >
          {`${
            appRole === 'provider'
              ? -(item.host_total_price - item.client_total_price).toFixed(2)
              : item.total_price.toFixed(2)
          } SGD`}
        </Typography>
        <Typography
          sx={{
            color: 'text.primary',
            fontSize: '14px',
            padding: '0rem 0rem 0.1rem 0rem',
            alignItems: 'right',
            textAlign: 'end',
            width: '100%',
          }}
        >
          {appRole === 'provider'
            ? item.host_total_price - item.client_total_price > 0
              ? 'receivable'
              : 'payable'
            : 'payable'}
        </Typography>
      </Box>
    </Grid>
  );
};

export default SummaryColumn;
