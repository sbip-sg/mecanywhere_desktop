import { Grid, Typography, Card, CardContent } from '@mui/material';
import { useTheme } from '@emotion/react';
import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  Label,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { ExternalBillingDataEntry } from '../table/dataTypes';
import { ExternalDataEntry } from '../../../common/dataTypes';
import { useEffect, useState } from 'react';

interface GroupedData {
  month: string;
  resource_consumed: number;
}

interface GroupedDataEntry {
  month: string;
  number_of_sessions: number;
  total_resource_consumed: number;
  total_usage_hours: number;
  total_tasks_run: number;
  billing_amount: number;
  average_network_reliability: number;
}

interface PastBillingCardProps {
  data: ExternalDataEntry[];
}

const PastBillingCard: React.FC<PastBillingCardProps> = ({ data }) => {
  const theme = useTheme();
  const [groupedData, setGroupedData] = useState<GroupedDataEntry[]>([]);

  useEffect(() => {
    const today = new Date();
    // Filtering data to get entries of the last 6 months including the current month
    const sixMonthsData = data.filter(entry => {
      // Convert the timestamp to milliseconds before creating Date object
      const entryDate = new Date(entry.session_start_datetime * 1000);
      const monthDifference = today.getMonth() - entryDate.getMonth() +
        (12 * (today.getFullYear() - entryDate.getFullYear()));
      return monthDifference < 6;
    });
  
    // Sorting data in ascending order of session_start_datetime
    sixMonthsData.sort((a, b) => a.session_start_datetime - b.session_start_datetime);
  
    const grouped = sixMonthsData.reduce((acc, entry) => {
      const entryDate = new Date(entry.session_start_datetime * 1000);
      const month = entryDate.toLocaleString('default', { month: 'long' });
  
      if (!acc[month]) {
        acc[month] = {
          month,
          number_of_sessions: 0,
          total_resource_consumed: 0,
          total_usage_hours: 0,
          total_tasks_run: 0,
          billing_amount: 0,
          average_network_reliability: 0,
        };
      }
  
      acc[month].number_of_sessions += 1;
      acc[month].total_resource_consumed += entry.resource_consumed;
      acc[month].total_usage_hours += entry.duration;
      acc[month].total_tasks_run += 1; // assuming one task per entry
      acc[month].billing_amount += entry.price;
      acc[month].average_network_reliability += entry.network_reliability;
  
      return acc;
    }, {} as { [key: string]: GroupedDataEntry });
  
    const groupedArray = Object.values(grouped).map(entry => {
      entry.average_network_reliability /= entry.number_of_sessions;
      return entry;
    });
  
    setGroupedData(groupedArray);
    console.log("groupedArray", groupedArray)
  }, [data]);

  // const groupedData: GroupedData[] = data.slice(-6).map((entry) => {
  //   // need to change to take date from today() instead of slice
  //   const billingStartDate = new Date(
  //     entry.billing_start_date.replace(
  //       /(\d{2})\/(\d{2})\/(\d{2})/,
  //       '20$3-$1-$2'
  //     )
  //   );
  //   const month = billingStartDate.toLocaleString('default', { month: 'long' });
  //   return {
  //     month,
  //     resource_consumed: entry.total_resource_consumed,
  //   };
  // });

  return (
    <Card
      sx={{
        minWidth: 220,
        height: '100%',
        backgroundColor: theme.palette.lightBlack.main,
      }}
    >
      <CardContent sx={{ width: '100%', height: '100%' }}>
        <Grid container sx={{ width: '100%', height: '100%' }}>
          <Grid xs={12}>
            <Typography
              sx={{ fontSize: 14, padding: '0 0 1rem 0' }}
              color="text.primary"
              gutterBottom
            >
              Past 6 Month Payouts
            </Typography>
          </Grid>
          <Grid xs={12}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={groupedData} margin={{ top: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }}>
                  <Label
                    value="Resource Consumed"
                    position="insideLeft"
                    angle={-90}
                    style={{ textAnchor: 'middle', fontSize: 12 }}
                    offset={10}
                  />
                </YAxis>
                <Tooltip />
                <Bar
                  type="monotone"
                  dataKey="total_resource_consumed"
                  barSize={40}
                  fill={theme.palette.cerulean.main}
                  legendType="rect"
                  name="Total Items"
                />
                <Line
                  type="linear"
                  strokeLinejoin="round"
                  dataKey="total_resource_consumed"
                  stroke={theme.palette.violet.main}
                  strokeWidth={3}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PastBillingCard;
