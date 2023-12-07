import React, { CSSProperties, useState } from 'react';
import { Grid, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { useTheme } from '@emotion/react';
import useThemeTextColor from '../../../../utils/useThemeTextColor';

interface TypographyProps {
  children: React.ReactNode;
  style?: CSSProperties; // Making style optional
}
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

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={1} square {...props} />
))(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
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
    backgroundColor: theme.palette.primary.main,
    borderBottomRightRadius: '0',
    borderBottomLeftRadius: '0',
  },
  '&:not(.Mui-expanded)': {
    backgroundColor: theme.palette.background.default,
    '&:hover': {
      backgroundColor: theme.palette.customColor.lightGrey,
    },
  },
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(180deg)',
  },
  '& .MuiAccordionSummary-content': {
    // marginLeft: '2rem',
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(() => ({
  borderBottomLeftRadius: '10px',
  borderBottomRightRadius: '10px',
}));

const CustomStatus = ({ children, isExpanded }) => {
  const theme = useTheme();
  let statusColor;
  let bgColor;
  if (isExpanded) {
    statusColor = theme.palette.text.primary;
    bgColor = theme.palette.primary.main;
  } else if (children === 'Pending') {
    statusColor = '#E49B03';
    bgColor = '#FFF5D9';
  } else if (children === 'Completed') {
    statusColor = theme.palette.background.paper;
    bgColor = theme.palette.secondary.main;
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

const CaptionTypography: React.FC<TypographyProps> = ({ children, style }) => {
  // const theme = useTheme();
  const textColor = useThemeTextColor();

  const defaultStyle = {
    color: textColor,
    fontSize: '14px',
    letterSpacing: `0.1em`,
    fontWeight: '600',
    padding: '0.1rem 0rem 0.1rem 0rem',
    alignItems: 'center',
  };
  const combinedStyle = { ...defaultStyle, ...style };
  return <Typography style={combinedStyle}>{children}</Typography>;
};

const DetailTypography: React.FC<TypographyProps> = ({ children, style }) => {
  const theme = useTheme();
  const defaultStyle = {
    color: theme.palette.text.primary,
    fontSize: '16px',
    padding: '0.1rem 0rem 0.1rem 0rem',
    alignItems: 'center',
    width: '100%',
  };
  const combinedStyle = { ...defaultStyle, ...style };
  return <Typography style={combinedStyle}>{children}</Typography>;
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
        <DetailTypography>{item.startDate}</DetailTypography>
      </Grid>
      <Grid item container xs={12}>
        <CaptionTypography>Due Date</CaptionTypography>
      </Grid>
      <Grid item container xs={12}>
        <DetailTypography>{item.dueDate}</DetailTypography>
      </Grid>
      <Grid item container xs={12}>
        <CaptionTypography>Date paid</CaptionTypography>
      </Grid>
      <Grid item container xs={12}>
        <DetailTypography>N/A</DetailTypography>
      </Grid>
    </Grid>
  );
};

const SecondColumnGrid = ({ item, columnWidth }) => {
  const theme = useTheme();
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
        <CaptionTypography
          style={{
            fontSize: '16px',
            fontWeight: '600',
            color: theme.palette.secondary.contrastText,
          }}
        >
          Client
        </CaptionTypography>
      </Grid>
      <Grid item container xs={12}>
        <CaptionTypography>Avg. Mem Utilized (MB)</CaptionTypography>
      </Grid>
      <Grid item container xs={12}>
        <DetailTypography>
          {item.host_avg_resource_memory.toFixed(2)}
        </DetailTypography>
      </Grid>
      <Grid item container xs={12}>
        <CaptionTypography>Avg. CPU Utilized (cores)</CaptionTypography>
      </Grid>
      <Grid item container xs={12}>
        <DetailTypography>
          {item.host_avg_resource_cpu.toFixed(2)}
        </DetailTypography>
      </Grid>
      <Grid item container xs={12}>
        <CaptionTypography>Total Hours</CaptionTypography>
      </Grid>
      <Grid item container xs={12}>
        <DetailTypography>
          {item.host_total_duration.toFixed(2)}
        </DetailTypography>
      </Grid>
    </Grid>
  );
};

const ThirdColumnGrid = ({ item, columnWidth }) => {
  const theme = useTheme();

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
        <CaptionTypography
          style={{
            fontSize: '16px',
            fontWeight: '600',
            color: theme.palette.secondary.contrastText,
          }}
        >
          Host
        </CaptionTypography>
      </Grid>
      <Grid item container xs={12}>
        <CaptionTypography>Avg. Mem Utilized (MB)</CaptionTypography>
      </Grid>
      <Grid item container xs={12}>
        <DetailTypography>
          {item.client_avg_resource_memory.toFixed(2)}
        </DetailTypography>
      </Grid>
      <Grid item container xs={12}>
        <CaptionTypography>Avg. CPU Utilized (cores)</CaptionTypography>
      </Grid>
      <Grid item container xs={12}>
        <DetailTypography>
          {item.client_avg_resource_cpu.toFixed(2)}
        </DetailTypography>
      </Grid>
      <Grid item container xs={12}>
        <CaptionTypography>Total Hours</CaptionTypography>
      </Grid>
      <Grid item container xs={12}>
        <DetailTypography>
          {item.client_total_duration.toFixed(2)}
        </DetailTypography>
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
        <Grid item container xs={6}>
          <CaptionTypography>Client</CaptionTypography>
        </Grid>
        <Grid item container xs={6}>
          <CaptionTypography>Host</CaptionTypography>
        </Grid>
        <Grid item container xs={6}>
          <DetailTypography>
            {-item.client_total_price.toFixed(2)}
          </DetailTypography>
        </Grid>
        <Grid item container xs={6}>
          <DetailTypography>
            {item.host_total_price.toFixed(2)}
          </DetailTypography>
        </Grid>
      </Grid>
      <Grid item container xs={12}>
        <Typography
          style={{
            color: theme.palette.secondary.contrastText,
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
            color: theme.palette.text.primary,
            fontSize: '28px',
            padding: '0.1rem 0rem 0rem 0rem',
            alignItems: 'right',
            textAlign: 'end',
            // wordWrap: 'break-word',
            width: '100%',
          }}
        >
          {item.total_price.toFixed(2)} SGD
        </Typography>
      </Grid>
      <Grid item container xs={12}>
        <Typography
          style={{
            color: theme.palette.text.primary,
            fontSize: '14px',
            padding: '0rem 0rem 0.1rem 0rem',
            alignItems: 'right',
            textAlign: 'end',
            // wordWrap: 'break-word',
            width: '100%',
          }}
        >
          {item.total_price > 0 ? 'receivable' : 'payable'}
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
        sx={{ justifyContent: 'start', paddingLeft: '1.8rem' }}
      >
        <CustomTypography isExpanded={isExpanded}>{item.date}</CustomTypography>
      </Grid>
      <Grid
        item
        container
        xs={secondColumnWidth}
        sx={{ justifyContent: 'start', paddingLeft: '0.7rem' }}
      >
        <CustomStatus isExpanded={isExpanded}>{item.status}</CustomStatus>
      </Grid>
      <Grid
        item
        container
        xs={thirdColumnWidth}
        sx={{ justifyContent: 'start', paddingLeft: '2rem' }}
      />
      <Grid
        item
        container
        xs={fourthColumnWidth}
        sx={{ justifyContent: 'start', paddingLeft: '2.5rem' }}
      >
        <CustomTypography isExpanded={isExpanded}>
          {item.total_price.toFixed(2)}
        </CustomTypography>
      </Grid>
    </Grid>
  );
};

const CustomListItem = ({ item, onAccordionChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const handleExpansion = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    onAccordionChange(newExpandedState); // Notify parent about the change
  };
  const firstColumnWidth = 4;
  const secondColumnWidth = 3;
  const thirdColumnWidth = 2.5;
  const fourthColumnWidth = 2.4;
  return (
    <Accordion
      expanded={isExpanded}
      onChange={handleExpansion}
      // onChange={() => setIsExpanded(!isExpanded)}
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
                ? 'primary.main'
                : 'background.default',
              borderRadius: '5px',
              height: '1.8rem',
              width: '1.8rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ExpandMoreIcon sx={{ color: 'text.primary', fontSize: '2rem' }} />
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
          <Divider orientation="vertical" flexItem />
          <FourthColumnGrid item={item} columnWidth={fourthColumnWidth - 0.1} />
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};
export default CustomListItem;
