import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  LineChart,
  Label,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
} from '@mui/material';
import { useTheme } from '@emotion/react';
import { Link } from 'react-router-dom';

interface DataEntry {
  session_id: string;
  did: string;
  resource_consumed: number;
  session_start_datetime: number;
  session_end_datetime: number;
  task: string;
  duration: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface GroupedData {
  month: string;
  resource_consumed: number;
}

function convertEpochToStandardTimeWithDate(epochTimeInSeconds) {
  const dateObj = new Date(epochTimeInSeconds * 1000);
  const year = dateObj.getUTCFullYear().toString().slice(-2);
  const month = (dateObj.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = dateObj.getUTCDate().toString().padStart(2, '0');
  const hours = dateObj.getUTCHours().toString().padStart(2, '0');
  const minutes = dateObj.getUTCMinutes().toString().padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

const getRandomPercent = () => Math.floor(Math.random() * 50) + 10; // Random percent between 10 and 60

const ClientBilling = () => {
  const theme = useTheme();
  const [data, setData] = useState<DataEntry[]>([]);
  const tasks = ['game_render', 'ml_lstm', 'vr_render', 'ml_dbn'];
  const usageData = tasks.map((task) => ({
    name: task,
    value: getRandomPercent(),
  }));
  console.log('usageData', usageData);
  useEffect(() => {
    const csvFilePath = 'http://localhost:3000/data'; // Replace with the correct endpoint URL where your server is serving the CSV data.
    fetch(csvFilePath)
      .then((response) => response.json()) // Assuming your server sends JSON data instead of raw text.
      .then((responseData) => {
        console.log('responseData', responseData);
        setData(responseData);
      });
  }, []);
  const last10Rows = data.slice(-33);
  console.log('last10Rows', last10Rows);
  // Group data by resource_consumed per month
  const groupedDataObject = data.reduce((acc, entry) => {
    const month = new Date(entry.session_start_datetime * 1000).toLocaleString(
      'default',
      { month: 'long' }
    );
    acc[month] = acc[month] || { month, resource_consumed: 0 };
    acc[month].resource_consumed += Number(entry.resource_consumed) / 100; // Divide by 100 to get Amount in SGD.
    return acc;
  }, {} as { [key: string]: GroupedData });

  console.log('groupedDataObject', groupedDataObject);

  const groupedData: GroupedData[] = Object.values(groupedDataObject);
  console.log('groupedData', groupedData);

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
          <Card
            sx={{
              minWidth: 220,
              height: 230,
              backgroundColor: theme.palette.lightBlack.main,
            }}
          >
            <CardContent sx={{ width: '100%', height: '100%' }}>
              <Grid container sx={{ width: '100%', height: '100%' }}>
                <Grid xs={12}>
                  <Typography
                    sx={{ fontSize: 14, marginBottom: '1rem' }}
                    color={theme.palette.cerulean.main}
                    gutterBottom
                  >
                    Current Billing Cycle
                  </Typography>
                </Grid>
                <Grid xs={12}>
                  <Typography variant="h5" component="div" textAlign="end">
                    36.12 SGD
                  </Typography>
                </Grid>
                <Grid xs={12}>
                  <Typography
                    sx={{ mb: 1.8 }}
                    color="text.secondary"
                    textAlign="end"
                  >
                    Amount Due
                  </Typography>
                </Grid>
                <Grid
                  xs={12}
                  sx={{
                    height: '30%',
                    display: 'flex',
                    justifyContent: 'end',
                    alignItems: 'center',
                  }}
                >
                  <Button
                    sx={{
                      backgroundColor: '#00FF89',
                      height: '90%',
                      width: '90%',
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="h3" fontSize="16px" textAlign="center">
                      Settle Payment
                    </Typography>
                  </Button>
                </Grid>
                <Grid
                  xs={12}
                  sx={{
                    display: 'flex',
                    justifyContent: 'end',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    variant="body1"
                    fontSize="10px"
                    textAlign="end"
                    width="90%"
                  >
                    You will be redirected to your provider's payment gateway
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Right card */}
        <Grid item xs={6}>
          <Card
            sx={{
              minWidth: 220,
              height: 230,
              backgroundColor: theme.palette.lightBlack.main,
            }}
          >
            <CardContent
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography
                sx={{ fontSize: 16, marginBottom: '2rem' }}
                color={theme.palette.cerulean.main}
                gutterBottom
              >
                Usage percent by Tasks
              </Typography>
              <PieChart width={240} height={180}>
                <Pie
                  dataKey="value"
                  labelLine={false}
                  data={usageData}
                  cx={80}
                  cy={80}
                  outerRadius={80}
                  fill="#8884d8"
                  label={({
                    cx,
                    cy,
                    midAngle,
                    innerRadius,
                    outerRadius,
                    percent,
                    index,
                  }) => {
                    const RADIAN = Math.PI / 180;
                    const radius =
                      innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);

                    const labelRadius = radius * 1.1; // Adjust this factor as needed

                    const labelX =
                      cx + labelRadius * Math.cos(-midAngle * RADIAN);
                    const labelY =
                      cy + labelRadius * Math.sin(-midAngle * RADIAN);
                    const isLeftHalf = x > cx;

                    return (
                      <text
                        x={labelX}
                        y={labelY}
                        fill="white"
                        textAnchor={isLeftHalf ? 'start' : 'end'}
                        dominantBaseline="central"
                        fontSize={12}
                      >
                        {`${tasks[index]}: ${(percent * 100).toFixed(0)}%`}
                      </text>
                    );
                  }}
                >
                  {usageData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </CardContent>
          </Card>
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
        <ResponsiveContainer width="85%" height="90%">
          <BarChart data={groupedData} margin={{ top: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }}>
              <Label
                value="Amount Billed (SGD) by Month"
                position="insideLeft"
                angle={-90}
                style={{ textAnchor: 'middle', fontSize: 16 }}
              />
            </YAxis>
            <Tooltip />
            <Bar dataKey="resource_consumed" fill="#8884d8" barSize={60} />
          </BarChart>
        </ResponsiveContainer>
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
        <Link to="/clientpasttxn" style={{ textDecoration: 'none' }}>
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

export default ClientBilling;
