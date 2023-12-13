import { Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import Status from './Status';

const CustomTypography = ({ children, isExpanded }) => {
  return (
    <Typography
      style={{
        fontSize: '16px',
        padding: '0rem 1rem 0rem 0rem',
        color: isExpanded ? 'black' : 'text.primary',
        fontWeight: isExpanded ? '600' : '500',
        alignItems: 'center',
      }}
    >
      {children}
    </Typography>
  );
};

const AccordionHeader = ({ isExpanded, item, columnWidths }) => {
  return (
    <Grid container>
      <Grid
        item
        container
        xs={columnWidths.first}
        sx={{ justifyContent: 'start', paddingLeft: '1.8rem' }}
      >
        <CustomTypography isExpanded={isExpanded}>{item.date}</CustomTypography>
      </Grid>
      <Grid
        item
        container
        xs={columnWidths.second}
        sx={{
          justifyContent: 'start',
          paddingLeft: isExpanded ? '0.8rem' : '1.8rem',
        }}
      >
        <Status isExpanded={isExpanded}>{item.status}</Status>
      </Grid>
      <Grid
        item
        container
        xs={columnWidths.third}
        sx={{ justifyContent: 'start', paddingLeft: '1.8rem' }}
      />
      <Grid
        item
        container
        xs={columnWidths.fourth}
        sx={{ justifyContent: 'start', paddingLeft: '1.8rem' }}
      >
        <CustomTypography isExpanded={isExpanded}>
          {item.total_price.toFixed(2)}
        </CustomTypography>
      </Grid>
    </Grid>
  );
};

export default AccordionHeader;
