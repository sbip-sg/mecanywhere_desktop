import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box } from '@mui/material';
import reduxStore from 'renderer/redux/store';
import CurrentBillingCard from '../components/cards/CurrentBillingCard';
import PastBillingCard from '../components/cards/PastBillingCard';
import PastBillingList from '../components/list/PastBillingList';
import { ExternalDataEntry } from '../../../utils/dataTypes';
import {
  findHostHistory,
  findPoHistory,
} from '../../../services/TransactionServices';
import groupData from '../../../utils/groupData';

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
  const selfDid = window.electron.store.get('did');

  useEffect(() => {
    const getCurrentDateMinusMonths = (months: number) => {
      const date = new Date();
      date.setMonth(date.getMonth() - months);
      return date;
    };

    const endDate = new Date();
    const startDate = getCurrentDateMinusMonths(6);
    const groupedDataPreview = groupData(
      data,
      startDate,
      endDate,
      'month',
      'both',
      selfDid,
      appRole
    );
    setGroupedData(groupedDataPreview);
  }, [data, appRole, selfDid]);

  const fetchAndSetData = async (accessToken: string, role: string) => {
    try {
      const didHistoryResponse = await (role === 'provider'
        ? findPoHistory(accessToken, did)
        : findHostHistory(accessToken, did));
      if (didHistoryResponse) {
        const responseBody = await didHistoryResponse.json();
        setData(responseBody);
      } else {
        console.error('No response from didHistory');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    const credential = JSON.parse(window.electron.store.get('credential'));
    const retrieveData = async () => {
      if (credential) {
        const { accessToken } = reduxStore.getState().userReducer;
        await fetchAndSetData(accessToken, appRole);
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
        variant="h1"
        style={{
          fontSize: '23px',
          padding: '1rem 1rem 0.5rem 2rem',
          fontWeight: '600',
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
          <PastBillingCard groupedData={groupedData} appRole={appRole} />
        </Grid>
      </Grid>

      <Box>
        <Typography
          variant="h1"
          style={{
            fontSize: '23px',
            padding: '1rem 1rem 0.5rem 2rem',
            fontWeight: '600',
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
