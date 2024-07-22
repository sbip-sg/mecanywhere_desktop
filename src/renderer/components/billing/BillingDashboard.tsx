import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box } from '@mui/material';
import PastBillingCard from './cards/PastBillingCard';
import PastBillingList from './list/PastBillingList';
import { DataEntry, GroupedDataEntry } from '../../utils/dataTypes';
import groupData from '../componentsCommon/groupData';
import fetchTransactionHistory from '../componentsCommon/fetchTransactionHistory';

const BillingDashboard: React.FC = () => {
  const [data, setData] = useState<DataEntry[]>([]);
  const [groupedData, setGroupedData] = useState<GroupedDataEntry[]>([]);

  useEffect(() => {
    const getCurrentDateMinusMonths = (months: number) => {
      const date = new Date();
      date.setMonth(date.getMonth() - months);
      return date;
    };

    const endDate = new Date();
    const startDate = getCurrentDateMinusMonths(6);
    const groupedDataTemp = groupData(
      data,
      startDate,
      endDate,
      'month',
      'both'
    );
    setGroupedData(groupedDataTemp);
  }, [data]);

  const fetchAndSetData = async () => {
    try {
      const transactionHistory = await fetchTransactionHistory();
      setData(transactionHistory);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    const retrieveData = async () => {
      await fetchAndSetData();
    };
    retrieveData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box
      sx={{
        height: '100%',
        overflowY: 'scroll',
        padding: '1rem',
      }}
    >
      <Typography
        variant="h3"
        style={{
          padding: '1rem 0 0.5rem 2rem',
        }}
      >
        Billing Overview
      </Typography>

      <Grid container justifyContent="center" alignItems="center" height="40%">
        <Grid
          item
          xs={7}
          sx={{
            padding: '0.5rem 2rem 0.5rem 0.5rem',
            height: '100%',
          }}
        >
          <PastBillingCard groupedData={groupedData} />
        </Grid>
      </Grid>

      <Box sx={{ padding: '1rem 1rem 0.5rem 2rem' }}>
        <PastBillingList groupedData={groupedData} />
      </Box>
    </Box>
  );
};

export default BillingDashboard;
