import React, { useState } from 'react';
import { Grid } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Divider from '@mui/material/Divider';
import DateColumn from './customListItemComponents/DateColumn';
import SummaryColumn from './customListItemComponents/SummaryColumn';
import UtilizationColumn from './customListItemComponents/UtilizationColumn';
import AccordionHeader from './customListItemComponents/AccordionHeader';

const CustomListItem = ({ item, onAccordionChange, columnWidths }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const handleExpansion = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    onAccordionChange(newExpandedState);
  };
  return (
    <Accordion
      expanded={isExpanded}
      onChange={handleExpansion}
      sx={{
        margin: '0rem 0rem 0.8rem 0rem',
        borderRadius: '10px',
        backgroundColor: 'background.default',
        '&:not(:last-child)': {
          borderBottom: 0,
        },
        '&:before': {
          display: 'none',
        },
      }}
    >
      <AccordionSummary
        sx={{
          padding: isExpanded
            ? '0.5rem 1.5rem 0.5rem 0rem'
            : '1rem 1.5rem 1rem 0rem',
          borderRadius: '10px',
          flexDirection: 'row',
          '&.Mui-expanded': {
            backgroundColor: 'primary.main',
            borderBottomRightRadius: '0',
            borderBottomLeftRadius: '0',
          },
          '&:not(.Mui-expanded)': {
            backgroundColor: 'background.default',
            '&:hover': {
              backgroundColor: 'customColor.lightGrey',
            },
          },
          '& .AccordionSummary-expandIconWrapper.Mui-expanded': {
            transform: 'rotate(180deg)',
          },
          '& .AccordionSummary-content': {
            // content sx here
          },
        }}
        expandIcon={
          <ExpandMoreIcon sx={{ color: 'text.primary', fontSize: '2rem' }} />
        }
      >
        <AccordionHeader
          isExpanded={isExpanded}
          item={item}
          columnWidths={columnWidths}
        />
      </AccordionSummary>
      <AccordionDetails
        sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }}
      >
        <Grid container>
          <DateColumn item={item} columnWidth={columnWidths.first} />
          <UtilizationColumn
            item={item}
            columnWidth={columnWidths.second + columnWidths.third}
          />
          <Divider orientation="vertical" flexItem />
          <SummaryColumn item={item} columnWidth={columnWidths.fourth} />
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};
export default CustomListItem;
