import { Grid, Typography, Card, CardContent, Button } from '@mui/material';

const CurrentBillingCard = () => {
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
            <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
              Current Billing Cycle
            </Typography>
          </Grid>
          <Grid xs={12}>
            <Typography
              variant="h2"
              component="div"
              textAlign="end"
              style={{ color: 'text.primary'}}
            >
              103.12 SGD
            </Typography>
          </Grid>
          <Grid xs={12}>
            <Typography sx={{}} color="text.primary" textAlign="end">
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
            <Button
              sx={{
                padding: '0.5rem 1rem 0.5rem 1rem',
                backgroundColor: 'primary.main',
              }}
            >
              <Typography
                fontWeight="600"
                fontSize="16px"
                textAlign="end"
                width="100%"
              >
                Settle Billing
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CurrentBillingCard;
