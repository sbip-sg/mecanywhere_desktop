import { Box } from '@mui/material';
import React, { useState } from 'react';
import CustomListHeader from './CustomListHeader';
import CustomListItem from './CustomListItem';

interface PastBillingListProps {
  groupedData;
  appRole;
}
const columnWidths = {
  first: 4,
  second: 3,
  third: 2.5,
  fourth: 2.4,
};
const PastBillingList: React.FC<PastBillingListProps> = ({
  groupedData,
  appRole,
}) => {
  const [isAnyAccordionExpanded, setIsAnyAccordionExpanded] = useState(false);

  const handleAccordionChange = (isExpanded: boolean) => {
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

  return (
    <Box display="flex" flexDirection="column">
      <CustomListHeader
        isAnyAccordionExpanded={isAnyAccordionExpanded}
        columnWidths={columnWidths}
      />
      {editedData.map((item) => (
        <CustomListItem
          key={item.date}
          item={item}
          onAccordionChange={handleAccordionChange}
          columnWidths={columnWidths}
          appRole={appRole}
        />
      ))}
    </Box>
  );
};

export default PastBillingList;
