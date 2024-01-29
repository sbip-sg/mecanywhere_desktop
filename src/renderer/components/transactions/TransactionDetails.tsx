import { useNavigate } from 'react-router-dom';
import React from 'react';
import {
  Grid,
  Box,
  Typography,
  Stack,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ExternalPropConfigList } from './propConfig';
import reduxStore from '../../redux/store';

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

const TransactionDetails: React.FC = () => {
  const propConfigList = ExternalPropConfigList;
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
        paddingBottom: '2rem',
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
          <CardContent sx={{ overflow: 'auto' }}>
            <Box sx={{ minWidth: '30rem' }}>
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
                </Grid>
                <Grid item xs={7.5}>
                  {propConfigList.map((config) => (
                    <DataTypography data={config.renderer(data as any)} />
                  ))}
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Stack>
    </Stack>
  );
};

export default TransactionDetails;
