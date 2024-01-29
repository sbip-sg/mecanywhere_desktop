import { Grid, Typography, Card, CardContent } from '@mui/material';
import { useTheme } from '@mui/material/styles';
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
import CustomTooltip from '../../../transactions/linechart/CustomTooltip';

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
  groupedData: GroupedDataEntry[];
}

const PastBillingCard: React.FC<PastBillingCardProps> = ({
  groupedData,
}) => {
  const theme = useTheme();
  console.log("groupedData", groupedData)
  return (
    <Card
      sx={{
        minWidth: 220,
        height: '100%',
        backgroundColor: 'background.default',
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
                <XAxis dataKey="date" tick={{ fontSize: 12 }}>
                  <Label style={{ fontSize: 12 }} />
                </XAxis>
                <YAxis tick={{ fontSize: 12 }}>
                  <Label
                    value="Resource Consumed"
                    position="insideLeft"
                    angle={-90}
                    style={{ textAnchor: 'middle', fontSize: 12 }}
                    offset={10}
                  />
                </YAxis>
                <Tooltip content={<CustomTooltip />} />

                    <Bar
                      type="monotone"
                      dataKey="total_price"
                      barSize={40}
                      fill={theme.palette.primary.main}
                      legendType="rect"
                      name="Total Items"
                    />
                    <Line
                      type="linear"
                      strokeLinejoin="round"
                      dataKey="total_price"
                      stroke={theme.palette.secondary.contrastText}
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
