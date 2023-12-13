import { useNavigate } from 'react-router-dom';
import React from 'react';
import {
  Grid,
  Typography,
  Stack,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import reduxStore from 'renderer/redux/store';
import { convertEpochToStandardTimeWithDate } from '../common/unitConversion';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { ExternalPropConfigList, InternalPropConfigList } from './propConfig';

interface TitleTypographyProps {
  title: string;
}

interface DataTypographyProps {
  data: any;
}

const TitleTypography: React.FC<TitleTypographyProps> = ({ title }) => {
  return (
    <Typography
      color="text.primary"
      variant="body1"
      fontWeight="600"
      sx={{ margin: '1rem 1rem 1rem 0rem' }}
    >
      {title}
    </Typography>
  );
};
const DataTypography: React.FC<DataTypographyProps> = ({ data }) => {
  return (
    <Typography
      color="text.primary"
      variant="body1"
      sx={{ margin: '1rem 1rem 1rem 0rem' }}
    >
      {data}
    </Typography>
  );
};

function randomNormalDistribution(mean: number, standardDeviation: number) {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();

  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  const scaledValue = mean + standardDeviation * z;

  return Math.max(Math.min(scaledValue, 100), 50); // Clamping the value between 50 and 100
}

function limitDecimalPlaces(number: number, decimalPlaces: number) {
  return Number(number.toFixed(decimalPlaces));
}

const TransactionDetails: React.FC = () => {
  const appRole = useSelector((state: RootState) => state.roleReducer.role);
  const propConfigList =
    appRole === 'provider' ? InternalPropConfigList : ExternalPropConfigList;
  const navigate = useNavigate();
  const data =
    reduxStore.getState().transactionDetailsReducer.transactionDetails;
  console.log('transaction', data);
  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <Stack
      sx={{
        height: '100%',
        margin: '1.5rem 0 0 1.8rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Stack
        sx={{
          height: '100%',
          width: '80%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Button
          onClick={() => navigate(-1)}
          sx={{ width: '7rem', marginBottom: '1.5rem' }}
        >
          <ArrowBackIcon style={{ fontSize: '16px', marginRight: '0.5rem' }} />
          <Typography
            sx={{
              fontSize: '15px',
              paddingTop: '2px',
              fontWeight: '600',
            }}
          >
            BACK
          </Typography>
        </Button>
        <Card
          sx={{
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '2.5rem',
            minHeight: '80%',
            backgroundColor: 'background.default',
          }}
        >
          <CardContent>
            <Grid sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: '600' }}>
                TRANSACTION
              </Typography>
              <Typography
                variant="h4"
                sx={{ color: 'secondary.contrastText', whiteSpace: 'pre' }}
              >
                {'   #'}
                {data.transaction_id}
              </Typography>
            </Grid>
            <Grid
              container
              item
              xs={12}
              sx={{
                borderRadius: '12px',
                padding: '1rem 0.5rem 0.5rem 0rem',
              }}
            >
              <Grid item xs={4.5} sx={{}}>
                {propConfigList.map((config) => (
                  <TitleTypography title={config.label} />
                ))}
                {/* <TitleTypography title="Transaction ID:" />
                <TitleTypography title="DID:" />
                <TitleTypography title="Transaction Start Datetime:" />
                <TitleTypography title="Transaction End Datetime:" />
                <TitleTypography title="Duration:" />
                <TitleTypography title="Network Reliability:" />
                <TitleTypography title="Task:" />
                <TitleTypography title="Memory Utilized (MB):" />
                <TitleTypography title="CPU Utilized (cores):" />
                <TitleTypography title="Usage Charge/Earned:" /> */}
              </Grid>
              <Grid item xs={7.5}>
                {propConfigList.map((config) => (
                  <DataTypography data={config.renderer(data as any, false)} />
                ))}
                {/* <DataTypography data={data.transaction_id} />
                <DataTypography data={window.electron.store.get('did')} />
                <DataTypography
                  data={convertEpochToStandardTimeWithDate(
                    data.transaction_start_datetime
                  )}
                />
                <DataTypography
                  data={convertEpochToStandardTimeWithDate(
                    data.transaction_end_datetime
                  )}
                />
                <DataTypography
                  data={`${limitDecimalPlaces(
                    data.duration / 60 / 60,
                    2
                  )} hours`}
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
                <DataTypography data={data.price} /> */}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Stack>
    </Stack>
  );
};

export default TransactionDetails;
