import { Grid, Stack } from '@mui/material';
import React from 'react';
import { CaptionTypography, DetailTypography } from './CustomTypography';

interface ColumnProps {
  item: any;
  columnWidth: any;
}

const DateColumn: React.FC<ColumnProps> = ({ item, columnWidth }) => {
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
        <CaptionTypography>Start Date</CaptionTypography>
        <DetailTypography> {item.startDate}</DetailTypography>
        <CaptionTypography>Due Date</CaptionTypography>
        <DetailTypography>{item.dueDate}</DetailTypography>
        <CaptionTypography>Date paid</CaptionTypography>
        <DetailTypography>N/A</DetailTypography>
      </Stack>
    </Grid>
  );
};

export default DateColumn;
