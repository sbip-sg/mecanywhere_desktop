// import { useEffect, useState } from 'react';
// import ClientOverviewCard from '../components/cards/ClientOverviewCard';
// import PieChartCard from '../components/cards/PieChartCard';
// import { ExternalBillingDataEntry } from '../components/table/dataTypes';
// import CustomBarChart from './barchart/CustomBarChart';
// import { Grid, Typography } from '@mui/material';
// import { Link } from 'react-router-dom';
// import mockUserData from '../../../../assets/mockUserData.json';
// import { convertEpochToStandardTimeWithDate } from 'renderer/utils/unitConversion';

interface GroupedData {
  month: string;
  resource_consumed: number;
}

const ClientBillingDashboard = () => {
  return (
    <div>acasca</div>
  )
  // const [data, setData] = useState<ExternalBillingDataEntry[]>([]);
  // useEffect(() => {
  //   setData(mockUserData);
  // }, []);
  // const groupedDataObject = data.reduce((acc, entry) => {
  //   const billingStartDate =
  //     typeof entry.billing_start_date === 'string'
  //       ? parseInt(entry.billing_start_date)
  //       : entry.billing_start_date;
  //   const month = new Date(sessionStartDatetime * 1000).toLocaleString(
  //     'default',
  //     { month: 'long' }
  //   );
  //   acc[month] = acc[month] || { month, resource_consumed: 0 };
  //   acc[month].resource_consumed += Number(entry.resource_consumed);
  //   return acc;
  // }, {} as { [key: string]: GroupedData });
  // const groupedData: GroupedData[] = Object.values(groupedDataObject);

  // return (
  //   <Grid
  //     container
  //     direction="column"
  //     height="100%"
  //     justifyContent="center"
  //     alignItems="center"
  //   >
  //     <Grid container item xs={1} justifyContent="center" alignItems="center">
  //       <Typography
  //         variant="h1"
  //         style={{ fontSize: '23px', margin: '1.5rem 0 1.5rem 0' }}
  //       >
  //         Billing Overview
  //       </Typography>
  //     </Grid>

  //     <Grid
  //       container
  //       item
  //       xs={4}
  //       justifyContent="center"
  //       alignItems="center"
  //       height="20%"
  //     >
  //       {/* Left card */}
  //       <Grid item marginRight="1rem" xs={4}>
  //         <ClientOverviewCard />
  //       </Grid>
  //       {/* Right card */}
  //       <Grid item xs={6}>
  //         <PieChartCard />
  //       </Grid>
  //     </Grid>
  //     <Grid
  //       container
  //       item
  //       xs={5.8}
  //       height="100%"
  //       justifyContent="center"
  //       alignItems="center"
  //       sx={{ padding: '1rem 0 1rem 0' }}
  //     >
  //       <CustomBarChart groupedData={groupedData} />
  //     </Grid>
  //     <Grid
  //       container
  //       item
  //       xs={0.7}
  //       height="100%"
  //       justifyContent="end"
  //       alignItems="center"
  //       paddingRight="4rem"
  //     >
  //       <Link to="/clientpasttxn" style={{ textDecoration: 'none' }}>
  //         <Typography
  //           variant="h1"
  //           fontSize="15px"
  //           textAlign="right"
  //           color="white"
  //         >
  //           View Past Billing Cycles
  //         </Typography>
  //       </Link>
  //     </Grid>
  //   </Grid>
  );
};

export default ClientBillingDashboard;