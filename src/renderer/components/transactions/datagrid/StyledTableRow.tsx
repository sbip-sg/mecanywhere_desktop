import React from 'react';
import TableRow, { tableRowClasses } from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';

interface StyledTableRowProps extends React.ComponentPropsWithoutRef<'tr'> {
  maxRowHeight: number;
  isheader: number;
}

const StyledTableRow = styled(TableRow, {
  shouldForwardProp: (prop) => prop !== 'maxRowHeight',
})<StyledTableRowProps>(({ theme, maxRowHeight, isheader }) => ({
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  ...(isheader === 1 && {
    '&:hover': {
      backgroundColor: `${theme.palette.background.default} !important`,
    },
  }),
  '& td': {
    cursor: 'pointer',
  },
  [`&.${tableRowClasses.root}`]: {
    height: `${maxRowHeight}px`,
  },
}));

export default StyledTableRow;
