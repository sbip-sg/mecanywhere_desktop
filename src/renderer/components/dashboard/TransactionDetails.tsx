import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, FC } from 'react';
import { Grid, Typography, Box, Button } from '@mui/material';
import { useTheme } from '@emotion/react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { convertEpochToStandardTimeWithDate } from '../../utils/unitConversion';

interface DataEntry {
  session_id: string;
  did: string;
  provider_did: string;
  resource_consumed: number;
  session_start_datetime: number;
  session_end_datetime: number;
  task: string;
  duration: number;
  network_reliability: number;
  is_host: Boolean;
  task_run: number;
  usage_charge: number;
}
interface TitleTypographyProps {
  title: string;
}
interface DataTypographyProps {
  data: any;
}

const TitleTypography: FC<TitleTypographyProps> = ({ title }) => {
  const theme = useTheme();
  return (
    <Typography
      color={theme.palette.cerulean.main}
      letterSpacing="0.05em"
      fontSize="16px"
      sx={{ margin: '1rem 1rem 1rem 1rem' }}
    >
      {title}
    </Typography>
  );
};
const DataTypography: FC<DataTypographyProps> = ({ data }) => {
  return (
    <Typography fontSize="16px" sx={{ margin: '1rem 1rem 1rem 1rem' }}>
      {data}
    </Typography>
  );
};

function randomNormalDistribution(mean, standardDeviation) {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();

  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  const scaledValue = mean + standardDeviation * z;

  return Math.max(Math.min(scaledValue, 100), 50); // Clamping the value between 50 and 100
}

function limitDecimalPlaces(number, decimalPlaces) {
  return Number(number.toFixed(decimalPlaces));
}

const TransactionDetails: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { sessionId } = params;
  console.log('sessionId', sessionId);
  const [data, setData] = useState<DataEntry | null>(null);

  useEffect(() => {
    console.log('data', data);
  }, [data]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/providerdata?session_id=${sessionId}`
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const responseData = await response.json();
        console.log('responseData', responseData);
        setData(responseData[0]);
      } catch (error) {
        console.error('Error fetching data:', error);
        setData(null);
      }
    };

    fetchData();
  }, [sessionId]);

  if (!data) {
    return <div>Loading...</div>;
  }

  const theme = useTheme();
  // Display the fetched data
  return (
    <Grid container sx={{ height: '100%' }}>
      <Box
        sx={{
          margin: '1.5rem 0 0 1.8rem',
        }}
      >
        <Button
          onClick={() => navigate('/clientdashboard')}
          sx={{ width: '7rem' }}
        >
          <ArrowBackIcon style={{ fontSize: '16px', marginRight: '0.5rem' }} />
          <Typography variant="h3" fontSize="15px" paddingTop="2px">
            BACK
          </Typography>
        </Button>
      </Box>
      <Grid
        container
        item
        xs={12}
        sx={{
          height: '7%',
          justifyContent: 'left',
          alignItems: 'center',
          padding: '0 0 0 2.5rem',
        }}
      >
        <Typography variant="h1" fontSize="20px">
          TRANSACTION #
        </Typography>
        <Typography color={theme.palette.cerulean.main} fontSize="20px">
          {data.session_id}
        </Typography>
      </Grid>
      <Grid
        container
        item
        xs={12}
        sx={{
          height: '80%',
          justifyContent: 'center',
          alignItems: 'top',
          margin: '0 1rem 1.5rem 1.5rem',
          backgroundColor: theme.palette.mediumBlack.main,
          borderRadius: '12px',
          padding: '1rem 0.5rem 0.5rem 0.5rem',
        }}
      >
        <Grid item xs={4.5} sx={{}}>
          <TitleTypography title="Session ID:" />
          <TitleTypography title="DID:" />
          <TitleTypography title="Issuer DID:" />
          <TitleTypography title="Session Start Datetime:" />
          <TitleTypography title="Session End Datetime:" />
          <TitleTypography title="Duration:" />
          <TitleTypography title="Network Reliability:" />
          <TitleTypography title="Task:" />
          <TitleTypography title="Role (Client/Host):" />
          <TitleTypography title="Resource Consumed/Provided:" />
          <TitleTypography title="Usage Charge/Earned:" />
        </Grid>
        <Grid item xs={7.5}>
          <DataTypography data={data.session_id} />
          <DataTypography data={data.did} />
          <DataTypography data={data.provider_did} />
          <DataTypography
            data={convertEpochToStandardTimeWithDate(
              data.session_start_datetime
            )}
          />
          <DataTypography
            data={convertEpochToStandardTimeWithDate(data.session_end_datetime)}
          />
          <DataTypography
            data={`${limitDecimalPlaces(data.duration / 60 / 60, 2)} hours`}
          />
          <DataTypography
            data={`${limitDecimalPlaces(
              randomNormalDistribution(85, 10),
              2
            )} %`}
          />
          <DataTypography data={data.task} />
          <DataTypography data={data.is_host ? 'Host' : 'Client'} />
          <DataTypography
            data={`${limitDecimalPlaces(
              data.resource_consumed * 10,
              2
            )} compute credits`}
          />
          <DataTypography
            data={`${limitDecimalPlaces(
              data.resource_consumed * 3 * 0.4334,
              2
            )} SGD`}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default TransactionDetails;
