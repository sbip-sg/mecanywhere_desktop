import { useState } from 'react';
import { Grid, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from '@emotion/react';
import { styled } from '@mui/material/styles';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

const CustomTypography = ({ children, isExpanded }) => {
  const theme = useTheme();
  return (
    <Typography
      style={{
        fontSize: '16px',
        padding: '0rem 1rem 0rem 0rem',
        color: isExpanded ? 'black' : theme.palette.offWhite.main,
        fontWeight: isExpanded ? '600' : '500',
        alignItems: 'center',
      }}
    >
      {children}
    </Typography>
  );
};

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  backgroundColor: theme.palette.mediumBlack.main,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary {...props} />
))(({ theme }) => ({
  padding: '1rem 1.5rem 1rem 0rem',
  borderRadius: '10px',
  flexDirection: 'row',
  '&.Mui-expanded': {
    backgroundColor: theme.palette.deepCerulean.main,
    borderBottomRightRadius: '0',
    borderBottomLeftRadius: '0',
  },
  '&:not(.Mui-expanded)': {
    backgroundColor: theme.palette.lightBlack.main,
  },
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(180deg)',
  },
  '& .MuiAccordionSummary-content': {
    // marginLeft: '2rem',
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  borderBottomLeftRadius: '10px',
  borderBottomRightRadius: '10px',
}));

const CustomStatus = ({ children, isExpanded }) => {
  const theme = useTheme();
  let statusColor;
  let bgColor;
  if (isExpanded) {
    statusColor = theme.palette.offWhite.main;
    bgColor = theme.palette.cerulean.main;
  } else if (children === 'Pending') {
    statusColor = '#E49B03';
    bgColor = '#FFF5D9';
  } else if (children === 'Completed') {
    statusColor = theme.palette.darkBlack.main;
    bgColor = theme.palette.mintGreen.main;
  } else {
    console.error('Invalid status');
    return <Box sx={{ color: 'red' }}>Invalid status</Box>;
  }
  return (
    <Box
      sx={{
        color: statusColor,
        backgroundColor: bgColor,
        borderRadius: '5px',
      }}
    >
      <Typography
        style={{
          fontSize: '14px',
          fontWeight: '600',
          padding: '0.1rem 0.7rem 0.1rem 0.7rem',
          alignItems: 'center',
        }}
      >
        {children}
      </Typography>
    </Box>
  );
};

const CaptionTypography = ({ children }) => {
  const theme = useTheme();
  return (
    <Typography
      style={{
        color: theme.palette.violet.main,
        fontSize: '14px',
        letterSpacing: `0.1em`,
        fontWeight: '600',
        padding: '0.1rem 0rem 0.1rem 0rem',
        alignItems: 'center',
      }}
    >
      {children}
    </Typography>
  );
};

const DetailTypography = ({ children }) => {
  const theme = useTheme();
  return (
    <Typography
      style={{
        color: theme.palette.offWhite.main,
        fontSize: '16px',
        padding: '0.1rem 0rem 0.1rem 0rem',
        alignItems: 'center',
        wordWrap: 'break-word',
        width: '100%',
      }}
    >
      {children}
    </Typography>
  );
};

const FirstColumnGrid = ({ item, columnWidth }) => {
  return (
    <Grid
      item
      xs={columnWidth}
      container
      sx={{
        borderRadius: '10px',
        padding: '0rem 3rem 0rem 0.5rem',
      }}
    >
      <Grid item container xs={12}>
        <CaptionTypography>Start Date</CaptionTypography>
      </Grid>
      <Grid item container xs={12}>
        <DetailTypography>{item.date}</DetailTypography>
      </Grid>
      <Grid item container xs={12}>
        <CaptionTypography>DID</CaptionTypography>
      </Grid>
      <Grid item container xs={12}>
        <DetailTypography>{item.did}</DetailTypography>
      </Grid>
    </Grid>
  );
};

const SecondColumnGrid = ({ item, columnWidth }) => {
  return (
    <Grid
      item
      container
      xs={columnWidth}
      sx={{
        borderRadius: '10px',
        // padding: '1rem',
      }}
    >
      <Grid item container xs={12}>
        <CaptionTypography>Total Resource Consumed</CaptionTypography>
      </Grid>
      <Grid item container xs={12}>
        <DetailTypography>{item.total_resource_consumed}</DetailTypography>
      </Grid>
      <Grid item container xs={12}>
        <CaptionTypography>Total Hours</CaptionTypography>
      </Grid>
      <Grid item container xs={12}>
        <DetailTypography>{item.total_hours}</DetailTypography>
      </Grid>
    </Grid>
  );
};

const ThirdColumnGrid = ({ item, columnWidth }) => {
  return (
    <Grid
      item
      container
      xs={columnWidth}
      sx={{
        borderRadius: '10px',
        // padding: '1rem',
      }}
    >
      <Grid item container xs={12}>
        <CaptionTypography>Due Date</CaptionTypography>
      </Grid>
      <Grid item container xs={12}>
        <DetailTypography>{item.due_date}</DetailTypography>
      </Grid>
      <Grid item container xs={12}>
        <CaptionTypography>Date paid</CaptionTypography>
      </Grid>
      <Grid item container xs={12}>
        <DetailTypography>{item.payment_date}</DetailTypography>
      </Grid>
    </Grid>
  );
};

const FourthColumnGrid = ({ item, columnWidth }) => {
  const theme = useTheme();
  return (
    <Grid
      item
      container
      xs={columnWidth}
      sx={{
        borderRadius: '10px',
        padding: '0rem 0rem 0rem 1rem',
      }}
    >
      <Grid item container xs={12}>
        <Typography
          style={{
            color: theme.palette.violet.main,
            fontSize: '14px',
            letterSpacing: `0.1em`,
            fontWeight: '600',
            padding: '0.1rem 0rem 0.1rem 0rem',
            alignItems: 'center',
          }}
        >
          Amount
        </Typography>
      </Grid>
      <Grid item container xs={12}>
        <Typography
          style={{
            color: theme.palette.offWhite.main,
            fontSize: '32px',
            padding: '0.1rem 0rem 0.1rem 0rem',
            alignItems: 'right',
            textAlign: 'end',
            wordWrap: 'break-word',
            width: '100%',
          }}
        >
          {item.amount}
        </Typography>
      </Grid>
    </Grid>
  );
};

const CustomHeader = ({
  isExpanded,
  item,
  firstColumnWidth,
  secondColumnWidth,
  thirdColumnWidth,
  fourthColumnWidth,
}) => {
  return (
    <Grid container alignItems="center">
      <Grid
        item
        container
        xs={firstColumnWidth}
        sx={{ justifyContent: 'start', paddingLeft: '2rem' }}
      >
        <CustomTypography isExpanded={isExpanded}>{item.date}</CustomTypography>
      </Grid>
      <Grid
        item
        container
        xs={secondColumnWidth}
        sx={{ justifyContent: 'start', paddingLeft: '2rem' }}
      >
        <CustomStatus isExpanded={isExpanded}>{item.status}</CustomStatus>
      </Grid>
      <Grid
        item
        container
        xs={thirdColumnWidth}
        sx={{ justifyContent: 'start', paddingLeft: '2rem' }}
      >
        <CustomTypography isExpanded={isExpanded}>
          {item.total_resource_consumed}
        </CustomTypography>
      </Grid>
      <Grid
        item
        container
        xs={fourthColumnWidth}
        sx={{ justifyContent: 'start', paddingLeft: '2rem' }}
      >
        <CustomTypography isExpanded={isExpanded}>
          {item.amount}
        </CustomTypography>
      </Grid>
    </Grid>
  );
};

const CustomListItem = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const theme = useTheme();
  const firstColumnWidth = 4;
  const secondColumnWidth = 3;
  const thirdColumnWidth = 2.5;
  const fourthColumnWidth = 2.4;
  return (
    <Accordion
      expanded={isExpanded}
      onChange={() => setIsExpanded(!isExpanded)}
      sx={{
        margin: '0rem 0rem 0.8rem 0rem',
        borderRadius: '10px',
      }}
    >
      <AccordionSummary
        expandIcon={
          <Box
            sx={{
              backgroundColor: isExpanded
                ? theme.palette.cerulean.main
                : theme.palette.mediumBlack.main,
              borderRadius: '5px',
              height: '1.8rem',
              width: '1.8rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ExpandMoreIcon sx={{ color: 'white', fontSize: '2rem' }} />
          </Box>
        }
      >
        <CustomHeader
          isExpanded={isExpanded}
          item={item}
          firstColumnWidth={firstColumnWidth}
          secondColumnWidth={secondColumnWidth}
          thirdColumnWidth={thirdColumnWidth + 0.05}
          fourthColumnWidth={fourthColumnWidth - 0.05}
        />
      </AccordionSummary>
      <AccordionDetails>
        <Grid container>
          <FirstColumnGrid item={item} columnWidth={firstColumnWidth} />
          <SecondColumnGrid item={item} columnWidth={secondColumnWidth} />
          <ThirdColumnGrid item={item} columnWidth={thirdColumnWidth} />
          <Divider orientation="vertical" flexItem color="white" />
          <FourthColumnGrid item={item} columnWidth={fourthColumnWidth - 0.1} />
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};
export default CustomListItem;
