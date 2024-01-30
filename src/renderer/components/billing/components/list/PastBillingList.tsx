import { Box } from '@mui/material';
import React, { useState } from 'react';
import {
  GroupedDataEntry,
  EditedDataEntry,
} from 'renderer/utils/dataTypes';
import CustomListHeader from './CustomListHeader';
import CustomListItem from './CustomListItem';

const columnWidths: Record<string, number> = {
  first: 4,
  second: 3,
  third: 2.5,
  fourth: 2.4,
};

const PastBillingList: React.FC<{ groupedData: GroupedDataEntry[] }> = ({
  groupedData,
}) => {
  const [isAnyAccordionExpanded, setIsAnyAccordionExpanded] = useState(false);

  const handleAccordionChange = (isExpanded: boolean) => {
    setIsAnyAccordionExpanded(isExpanded);
  };
  const editedData: EditedDataEntry[] = groupedData.map(
    (item: GroupedDataEntry) => {
      const status = Math.random() > 0.5 ? 'Completed' : 'Pending';
      const [month, year] = item.date.split(' ');
      const startDate = new Date(`${month} 1, ${year}`);
      const dueDate = new Date(
        Number(year),
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
    }
  );

  return (
    <Box display="flex" flexDirection="column">
      <CustomListHeader
        isAnyAccordionExpanded={isAnyAccordionExpanded}
        columnWidths={columnWidths}
      />
      {editedData.map((item: EditedDataEntry) => (
        <CustomListItem
          key={item.date}
          item={item}
          onAccordionChange={handleAccordionChange}
          columnWidths={columnWidths}
        />
      ))}
    </Box>
  );
};

export default PastBillingList;
