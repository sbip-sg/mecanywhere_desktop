import { Card, CardContent, Typography, Grid } from '@mui/material';
import { useTheme } from '@emotion/react';
import { useSelector } from 'react-redux';
import { RootState } from 'renderer/redux/store';

const CustomTypography = ({ children, isAnyAccordionExpanded }) => {
  const themeColor = useSelector(
    (state: RootState) => state.themeReducer.color
  );

  return (
    <Typography
      style={{
        fontSize: '15px',
        padding: '0rem 0rem 0rem 2rem',
        // color: theme.palette.text.primary,
        color:
          themeColor === 'light'
            ? isAnyAccordionExpanded
              ? 'black'
              : 'white'
            : 'white',
      }}
    >
      {children}
    </Typography>
  );
};

const CustomListHeader = ({ isAnyAccordionExpanded }) => {
  const firstColumnWidth = 3.9;
  const secondColumnWidth = 2.8;
  const thirdColumnWidth = 3;
  const fourthColumnWidth = 2.3;
  return (
    <Card
      id="billing-list-header"
      elevation={0}
      sx={{
        marginBottom: 0,
        backgroundColor: isAnyAccordionExpanded
          ? 'background.default'
          : 'primary.dark',
        padding: '1rem 0rem 0.5rem 0rem',
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
          <Grid
            item
            container
            xs={firstColumnWidth}
            sx={{ justifyContent: 'start' }}
          >
            <CustomTypography isAnyAccordionExpanded={isAnyAccordionExpanded}>
              Date
            </CustomTypography>
          </Grid>
          <Grid
            item
            container
            xs={secondColumnWidth}
            sx={{ justifyContent: 'start' }}
          >
            <CustomTypography isAnyAccordionExpanded={isAnyAccordionExpanded}>
              Status
            </CustomTypography>
          </Grid>
          <Grid
            item
            container
            xs={thirdColumnWidth}
            sx={{ justifyContent: 'start' }}
          >
            {/* <CustomTypography>Resource Consumed</CustomTypography> */}
          </Grid>
          <Grid
            item
            container
            xs={fourthColumnWidth}
            sx={{ justifyContent: 'start' }}
          >
            <CustomTypography isAnyAccordionExpanded={isAnyAccordionExpanded}>
              Amount
            </CustomTypography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CustomListHeader;
