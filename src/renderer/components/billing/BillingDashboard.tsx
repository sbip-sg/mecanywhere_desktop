import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box } from '@mui/material';
import reduxStore from 'renderer/redux/store';
import CurrentBillingCard from './cards/CurrentBillingCard';
import PastBillingCard from './cards/PastBillingCard';
import PastBillingList from './list/PastBillingList';
import { DataEntry, GroupedDataEntry } from '../../utils/dataTypes';
import groupData from '../componentsCommon/groupData';
import fetchTransactionHistory from '../componentsCommon/fetchTransactionHistory';

const BillingDashboard: React.FC = () => {
  const did = window.electron.store.get('did');
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

  const fetchAndSetData = async (accessToken: string) => {
    try {
      const transactionHistory = await fetchTransactionHistory(
        accessToken,
        did
      );
      setData(transactionHistory);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    const credential = JSON.parse(window.electron.store.get('credential'));
    const retrieveData = async () => {
      if (credential) {
        const { accessToken } = reduxStore.getState().userReducer;
        await fetchAndSetData(accessToken);
      } else {
        console.error('Credential or DID is missing');
      }
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

      <Grid
        container
        xs={12}
        justifyContent="center"
        alignItems="center"
        height="40%"
      >
        {/* Left card */}
        <Grid
          item
          xs={5}
          sx={{
            padding: '0.5rem 0.5rem 0.5rem 2rem',
            height: '100%',
          }}
        >
          <CurrentBillingCard />
        </Grid>
        {/* Right card */}
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

      <Box>
        <Typography
          variant="h3"
          style={{
            padding: '1rem 1rem 0.5rem 2rem',
          }}
        >
          Billing History
        </Typography>
      </Box>
      <Box sx={{ padding: '1rem 1rem 0.5rem 2rem' }}>
        <PastBillingList groupedData={groupedData} />
      </Box>
    </Box>
  );
};

export default BillingDashboard;
