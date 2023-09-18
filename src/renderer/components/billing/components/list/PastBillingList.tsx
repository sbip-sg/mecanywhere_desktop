import React from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import { useTheme } from '@emotion/react';
import mockUserBillingData from './mockUserBillingData';
import CustomListHeader from './CustomListHeader';
import CustomListItem from './CustomListItem';

const PastBillingList = () => {
  const theme = useTheme();
  return (
    <Box display="flex" flexDirection="column">
      <CustomListHeader />
      {mockUserBillingData.map((item) => (
        <CustomListItem key={item.did} item={item} />
      ))}
    </Box>
  );
};

export default PastBillingList;
