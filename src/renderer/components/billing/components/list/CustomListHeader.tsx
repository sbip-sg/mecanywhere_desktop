import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import { useTheme } from '@emotion/react';

const CustomTypography = ({ children }) => {
  const theme = useTheme();

  return (
    <Typography
      style={{
        fontSize: '18px',
        padding: '0rem 0rem 0rem 2rem',
        color: theme.palette.cerulean.main,
      }}
    >
      {children}
    </Typography>
  );
};

const CustomListHeader = () => {
  const theme = useTheme();
  return (
    <Card
      id="billing-list-header"
      sx={{
        marginBottom: 0,
        backgroundColor: theme.palette.darkBlack.main,
        margin: 0,
      }}
    >
      <CardContent
        sx={{
          padding: 0,
          '&:last-child': {
            paddingBottom: '0.5rem',
          },
        }}
      >
        <Grid container alignItems="center" sx={{ paddingRight: '3.5rem' }}>
          <Grid item container xs={3} sx={{ justifyContent: 'start' }}>
            <CustomTypography>Date</CustomTypography>
          </Grid>
          <Grid item container xs={3} sx={{ justifyContent: 'start' }}>
            <CustomTypography>Status</CustomTypography>
          </Grid>
          <Grid item container xs={3} sx={{ justifyContent: 'start' }}>
            <CustomTypography>Resource Consumed</CustomTypography>
          </Grid>
          <Grid item container xs={3} sx={{ justifyContent: 'start' }}>
            <CustomTypography>Amount</CustomTypography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CustomListHeader;
