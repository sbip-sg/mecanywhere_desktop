import React from 'react';
import { Box } from '@mui/material';
import CustomListHeader from './CustomListHeader';
import CustomListItem from './CustomListItem';
import { useState } from 'react';

interface PastBillingListProps {
  groupedData;
  appRole: string;
}

const PastBillingList: React.FC<PastBillingListProps> = ({
  groupedData,
  appRole,
}) => {
  const [isAnyAccordionExpanded, setIsAnyAccordionExpanded] = useState(false);

  const handleAccordionChange = (isExpanded) => {
    setIsAnyAccordionExpanded(isExpanded);
  };
  const editedData = groupedData.map((item) => {
    const status = Math.random() > 0.5 ? 'Completed' : 'Pending';
    const [month, year] = item.date.split(' ');
    const startDate = new Date(`${month} 1, ${year}`);
    const dueDate = new Date(
      year,
      new Date(`${month} 1, ${year}`).getMonth() + 1,
      0
    );
    const startDateFormat = startDate.toLocaleDateString('default', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const dueDateFormat = dueDate.toLocaleDateString('default', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return {
      ...item,
      status,
      startDate: startDateFormat,
      dueDate: dueDateFormat,
    };
  });
  console.log('editedData', editedData);
  return (
    <Box display="flex" flexDirection="column">
      <CustomListHeader isAnyAccordionExpanded={isAnyAccordionExpanded}/>
      {editedData.map((item) => (
        <CustomListItem
          key={item.date}
          item={item}
          onAccordionChange={handleAccordionChange}
          isAnyAccordionExpanded={isAnyAccordionExpanded}
        />
      ))}
      {/* {mockUserBillingData.map((item) => (
        <CustomListItem key={item.did} item={item} />
      ))} */}
    </Box>
  );
};

export default PastBillingList;
