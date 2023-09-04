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

interface GroupedData {
  month: string;
  resource_consumed: number;
}

interface PastBillingCardProps {
  data: ExternalBillingDataEntry[];
}

const PastBillingCard: React.FC<PastBillingCardProps> = ({ data }) => {
  const theme = useTheme();
  const groupedData: GroupedData[] = data.slice(-6).map((entry) => {
    // need to change to take date from today() instead of slice
    const billingStartDate = new Date(
      entry.billing_start_date.replace(
        /(\d{2})\/(\d{2})\/(\d{2})/,
        '20$3-$1-$2'
      )
    );
    const month = billingStartDate.toLocaleString('default', { month: 'long' });
    return {
      month,
      resource_consumed: entry.total_resource_consumed,
    };
  });

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
                  dataKey="resource_consumed"
                  barSize={40}
                  fill={theme.palette.cerulean.main}
                  legendType="rect"
                  name="Total Items"
                />
                <Line
                  type="linear"
                  strokeLinejoin="round"
                  dataKey="resource_consumed"
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
