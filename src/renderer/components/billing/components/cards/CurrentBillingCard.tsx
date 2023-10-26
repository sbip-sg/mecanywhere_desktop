import { Grid, Typography, Card, CardContent, Button } from '@mui/material';
import { useTheme } from '@emotion/react';

const CurrentBillingCard = () => {
  const theme = useTheme();

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
            <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
              Current Billing Cycle
            </Typography>
          </Grid>
          <Grid xs={12}>
            <Typography
              variant="h5"
              component="div"
              textAlign="end"
              style={{ color: theme.palette.mintGreen.main, fontSize: '40px' }}
            >
              103.12 SGD
            </Typography>
          </Grid>
          <Grid xs={12}>
            <Typography sx={{}} color="text.secondary" textAlign="end">
              Total Earnings
            </Typography>
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
              fontSize="13px"
              textAlign="end"
              width="90%"
            >
              The outstanding amount you currently owe.
            </Typography>
          </Grid>
          <Grid
            xs={12}
            sx={{
              display: 'flex',
              justifyContent: 'end',
              alignItems: 'center',
            }}
          >
            <Button sx={{ padding: '0.5rem 1rem 0.5rem 1rem', backgroundColor: theme.palette.violet.main }}>
              <Typography
                // variant="body1"
                fontWeight="600"
                fontSize="16px"
                textAlign="end"
                width="100%"
              >
                Settle Payment
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CurrentBillingCard;
