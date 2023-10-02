import { Grid, Typography, Box } from '@mui/material';
import mockUserBillingData from '../../../../../assets/mockUserBillingData.json';
import CurrentBillingCard from '../components/cards/CurrentBillingCard';
import PastBillingCard from '../components/cards/PastBillingCard';
import PastBillingList from '../components/list/PastBillingList';
import { ExternalDataEntry } from '../../../utils/dataTypes';
import { useState, useEffect } from 'react';
import { registerHost } from '../../../services/RegistrationServices';
import actions from '../../../redux/actionCreators';
import { findDidHistory } from '../../../services/TransactionServices';

const HostBillingDashboard = () => {
  const [data, setData] = useState<ExternalDataEntry[]>([]);

  useEffect(() => {
    const credential = JSON.parse(window.electron.store.get('credential'));
    const did = window.electron.store.get('did');
    const getAccessToken = async () => {
      if (credential && did) {
        actions.setCredential(credential);
        try {
          const accessTokenResponse = await registerHost(did, credential);
          const { access_token } = accessTokenResponse;
          actions.setHostAccessToken(access_token);
          const didHistoryResponse = await findDidHistory(access_token, did);
          if (didHistoryResponse) {
            const responseBody = await didHistoryResponse.json();
            console.log('response body', responseBody);
            setData(responseBody);
          }
        } catch (error) {
          console.error('Error during registerHost:', error);
          // Handle error appropriately
        }
      }
    };

    getAccessToken();
    // setData(mockUserData);
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
        style={{ fontSize: '23px', padding: '1rem 1rem 0.5rem 2rem' }}
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
          <PastBillingCard data={data} />
        </Grid>
      </Grid>

      <Box>
        <Typography
          variant="h1"
          style={{ fontSize: '23px', padding: '1rem 1rem 0.5rem 2rem' }}
        >
          Payout History
        </Typography>
      </Box>
      <Box sx={{ padding: '1rem 1rem 0.5rem 2rem' }}>
        <PastBillingList />
      </Box>
    </Box>
  );
};

export default HostBillingDashboard;
