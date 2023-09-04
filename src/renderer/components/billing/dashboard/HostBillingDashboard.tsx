import { Grid, Typography, Box } from '@mui/material';
import mockUserBillingData from '../../../../../assets/mockUserBillingData.json';
import CurrentBillingCard from '../components/cards/CurrentBillingCard';
import PastBillingCard from '../components/cards/PastBillingCard';
import PastBillingList from '../components/list/PastBillingList';

const HostBillingDashboard = () => {
  return (
    <Box
      sx={{
        height: '100%',
        overflowY: 'scroll',
        padding: '1rem',
      }}
    >
      <Typography variant="h1" style={{ fontSize: '23px', padding: '1rem 1rem 0.5rem 2rem', }}>
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
          <PastBillingCard data={mockUserBillingData} />
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
      <Box sx={{padding: '1rem 1rem 0.5rem 2rem'}}>
        <PastBillingList />
      </Box>
    </Box>
  );
};

export default HostBillingDashboard;
