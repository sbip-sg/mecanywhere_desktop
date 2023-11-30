import { convertEpochToStandardTimeWithDate } from '../../utils/unitConversion';
import { useNavigate } from 'react-router-dom';
import { FC } from 'react';
import { Grid, Typography, Box, Button } from '@mui/material';
import { useTheme } from '@emotion/react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import reduxStore from 'renderer/redux/store';

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
      color='primary.main'
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
  // const params = useParams();
  // const { TransactionId } = params;
  const theme = useTheme();
  const navigate = useNavigate();
  const data = reduxStore.getState().transactionDetailsReducer.transactionDetails;
  console.log("transaction", data)
  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <Grid container sx={{ height: '100%' }}>
      <Box
        sx={{
          margin: '1.5rem 0 0 1.8rem',
        }}
      >
        <Button onClick={() => navigate(-1)} sx={{ width: '7rem' }}>
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
        <Typography color='secondary.contrastText' fontSize="20px">
          {data.transaction_id}
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
          backgroundColor: 'customBackground.main',
          borderRadius: '12px',
          padding: '1rem 0.5rem 0.5rem 0.5rem',
        }}
      >
        <Grid item xs={4.5} sx={{}}>
          <TitleTypography title="Transaction ID:" />
          <TitleTypography title="DID:" />
          {/* <TitleTypography title="Issuer DID:" /> */}
          <TitleTypography title="Transaction Start Datetime:" />
          <TitleTypography title="Transaction End Datetime:" />
          <TitleTypography title="Duration:" />
          <TitleTypography title="Network Reliability:" />
          <TitleTypography title="Task:" />
          {/* <TitleTypography title="Role (Client/Host):" /> */}
          <TitleTypography title="Memory Utilized (MB):" />
          <TitleTypography title="CPU Utilized (cores):" />
          <TitleTypography title="Usage Charge/Earned:" />
        </Grid>
        <Grid item xs={7.5}>
          <DataTypography data={data.transaction_id} />
          <DataTypography data={window.electron.store.get('did')} />
          {/* <DataTypography data={data.provider_did} /> */}
          <DataTypography
            data={convertEpochToStandardTimeWithDate(
              data.transaction_start_datetime
            )}
          />
          <DataTypography
            data={convertEpochToStandardTimeWithDate(data.transaction_end_datetime)}
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
          <DataTypography data={data.task_name} />
          <DataTypography data={data.resource_memory} />
          <DataTypography data={data.resource_cpu} />
          <DataTypography data={data.price} />
          {/* <DataTypography data={data.is_host ? 'Host' : 'Client'} /> */}
          {/* <DataTypography
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
          /> */}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default TransactionDetails;
