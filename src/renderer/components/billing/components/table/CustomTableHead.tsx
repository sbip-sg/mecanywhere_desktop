import React from 'react';
import TableHead from '@mui/material/TableHead';
import TableSortLabel from '@mui/material/TableSortLabel';
import Box from '@mui/material/Box';
import { visuallyHidden } from '@mui/utils';
import StyledTableCell from './StyledTableCell';
import StyledTableRow from './StyledTableRow';
import { Order } from './comparatorUtils';
import { InternalBillingDataEntry, ExternalBillingDataEntry } from './dataTypes';
import { PropConfig } from '../propConfig';

interface CustomTableHeadProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof InternalBillingDataEntry | keyof ExternalBillingDataEntry
  ) => void;
  order: Order;
  orderBy: string;
  propConfigList:
    | PropConfig<InternalBillingDataEntry>[]
    | PropConfig<ExternalBillingDataEntry>[];
  addRightPadding: boolean;
  maxRowHeight: number;
}

const CustomTableHead = (props: CustomTableHeadProps) => {
  const {
    order,
    orderBy,
    onRequestSort,
    propConfigList,
    addRightPadding,
    maxRowHeight,
  } = props;

  const createSortHandler =
    (property: keyof InternalBillingDataEntry | keyof ExternalBillingDataEntry) =>
    (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <StyledTableRow maxRowHeight={maxRowHeight}>
        {propConfigList.map((config) => (
          <StyledTableCell
            addRightPadding={addRightPadding}
            key={config.property}
            sortDirection={orderBy === config.property ? order : false}
          >
            <TableSortLabel
              sx={{
                '&.Mui-active': {
                  color: 'white',
                },
              }}
              hideSortIcon
              active={false}
              direction={orderBy === config.property ? order : 'asc'}
              onClick={createSortHandler(config.property)}
            >
              {config.label}
              {orderBy === config.property ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </StyledTableCell>
        ))}
      </StyledTableRow>
    </TableHead>
  );
};

export default CustomTableHead;
