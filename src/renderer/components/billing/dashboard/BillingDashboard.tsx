import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box } from '@mui/material';
import reduxStore from 'renderer/redux/store';
import CurrentBillingCard from '../components/cards/CurrentBillingCard';
import PastBillingCard from '../components/cards/PastBillingCard';
import PastBillingList from '../components/list/PastBillingList';
import { ExternalDataEntry } from '../../common/dataTypes';
import {
  findHostHistory,
  findClientHistory,
} from '../../../services/TransactionServices';
import groupData from '../../common/groupData';

interface GroupedDataEntry {
  month: string;
  number_of_sessions: number;
  total_resource_consumed: number;
  total_usage_hours: number;
  total_tasks_run: number;
  billing_amount: number;
  average_network_reliability: number;
}
interface BillingDashboardProps {
  appRole: string;
}

const BillingDashboard: React.FC<BillingDashboardProps> = ({ appRole }) => {
  const did = window.electron.store.get('did');
  const [data, setData] = useState<ExternalDataEntry[]>([]);
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
      'both',
    );
    setGroupedData(groupedDataTemp);
  }, [data]);
  
  function combineHistories(hostDidHistory, clientDidHistory) {
    const hostWithRole = hostDidHistory.map((item) => ({
      ...item,
      role: 'host',
    }));
    const clientWithRole = clientDidHistory.map((item) => ({
      ...item,
      role: 'client',
    }));
    return [...hostWithRole, ...clientWithRole];
  }

  const fetchAndSetData = async (accessToken: string) => {
    try {
      const hostDidHistoryResponse = await findHostHistory(accessToken, did);
      const clientDidHistoryResponse = await findClientHistory(
        accessToken,
        did
      );
      const hostDidHistory = await hostDidHistoryResponse?.json();
      const clientDidHistory = await clientDidHistoryResponse?.json();
      const transactionHistory = combineHistories(
        hostDidHistory,
        clientDidHistory
      );
      console.log('transactionHistory', transactionHistory);

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
  }, []);

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
          <PastBillingCard groupedData={groupedData}/>
        </Grid>
      </Grid>

      <Box>
        <Typography
          variant="h3"
          style={{
            padding: '1rem 1rem 0.5rem 2rem',
          }}
        >
          Payout History
        </Typography>
      </Box>
      <Box sx={{ padding: '1rem 1rem 0.5rem 2rem' }}>
        <PastBillingList groupedData={groupedData} appRole={appRole} />
      </Box>
    </Box>
  );
};

export default BillingDashboard;
