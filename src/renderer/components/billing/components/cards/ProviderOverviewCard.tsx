import { Grid, Typography, Button, Card, CardContent } from '@mui/material';
import { useTheme } from '@emotion/react';

const OverviewCard = () => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        minWidth: 220,
        height: 230,
        backgroundColor: 'customBackground.light',
      }}
    >
      <CardContent sx={{ width: '100%', height: '100%' }}>
        <Grid container sx={{ width: '100%', height: '100%' }}>
          <Grid xs={12}>
            <Typography
              sx={{ fontSize: 14, marginBottom: '1rem' }}
              color='primary.main'
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
            <Typography sx={{ mb: 1.8 }} color="text.secondary" textAlign="end">
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
  );
};

export default OverviewCard;
