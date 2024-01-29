import React from 'react';
import TableHead from '@mui/material/TableHead';
import TableSortLabel from '@mui/material/TableSortLabel';
import Box from '@mui/material/Box';
import { visuallyHidden } from '@mui/utils';
import useIsLightTheme from 'renderer/components/common/useIsLightTheme';
import StyledTableCell from './StyledTableCell';
import StyledTableRow from './StyledTableRow';
import { Order } from './comparatorUtils';
import { DataEntry } from '../../common/dataTypes';
import { PropConfig } from '../propConfig';

interface CustomTableHeadProps {
  onRequestSort: (
    _event: React.MouseEvent<unknown>,
    _property: keyof DataEntry
  ) => void;
  order: Order;
  orderBy: string;
  propConfigList: PropConfig<DataEntry>[] | PropConfig<DataEntry>[];
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
  const isLightTheme = useIsLightTheme();
  const createSortHandler =
    (property: keyof DataEntry) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <StyledTableRow maxRowHeight={maxRowHeight} isheader>
        {propConfigList.map((config) => (
          <StyledTableCell
            addRightPadding={addRightPadding}
            key={config.property}
            sortDirection={orderBy === config.property ? order : false}
          >
            <TableSortLabel
              hideSortIcon
              active={false}
              direction={orderBy === config.property ? order : 'asc'}
              onClick={createSortHandler(config.property)}
              sx={{
                color: isLightTheme ? 'primary.dark' : 'text.primary',
                '&:hover': {
                  color: 'secondary.contrastText',
                },
                '&:focus': {
                  color: 'secondary.contrastText',
                },
              }}
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
