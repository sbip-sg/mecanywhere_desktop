import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Typography } from '@mui/material';
import mockUserBillingData from '../../../../../assets/mockUserBillingData.json';
import { ExternalBillingDataEntry } from '../components/table/dataTypes';
import HostOverviewCard from '../components/cards/HostOverviewCard';
import PieChartCard from '../components/cards/PieChartCard';
import CustomBarChart from '../components/barchart/CustomBarChart';


interface GroupedData {
  month: string;
  resource_consumed: number;
}

const ClientBillingDashboard = () => {
  const groupedData: GroupedData[] = mockUserBillingData.map(entry => {
    const billingStartDate = new Date(
      entry.billing_start_date.replace(/(\d{2})\/(\d{2})\/(\d{2})/, '20$3-$1-$2')
    );
    const month = billingStartDate.toLocaleString('default', { month: 'long' });
    return {
      month,
      resource_consumed: entry.total_resource_consumed,
    };
  });
  console.log(groupedData);
  return (
    <Grid
      container
      direction="column"
      height="100%"
      justifyContent="center"
      alignItems="center"
    >
      <Grid container item xs={1} justifyContent="center" alignItems="center">
        <Typography
          variant="h1"
          style={{ fontSize: '23px', margin: '1.5rem 0 1.5rem 0' }}
        >
          Billing Overview
        </Typography>
      </Grid>

      <Grid
        container
        item
        xs={4}
        justifyContent="center"
        alignItems="center"
        height="20%"
      >
        {/* Left card */}
        <Grid item marginRight="1rem" xs={4}>
          <HostOverviewCard />
        </Grid>
        {/* Right card */}
        <Grid item xs={6}>
          <PieChartCard />
        </Grid>
      </Grid>
      <Grid
        container
        item
        xs={5.8}
        height="100%"
        justifyContent="center"
        alignItems="center"
        sx={{ padding: '1rem 0 1rem 0' }}
      >
        <CustomBarChart groupedData={groupedData}/>
      </Grid>
      <Grid
        container
        item
        xs={0.7}
        height="100%"
        justifyContent="end"
        alignItems="center"
        paddingRight="4rem"
      >
        <Link to="/hostbillinghistory" style={{ textDecoration: 'none' }}>
          <Typography
            variant="h1"
            fontSize="15px"
            textAlign="right"
            color="white"
          >
            View Past Billing Cycles
          </Typography>
        </Link>
      </Grid>
    </Grid>
  );
};

export default ClientBillingDashboard;
