import TableRow, { tableRowClasses } from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';

interface StyledTableRowProps {
  maxRowHeight: number;
}

const StyledTableRow = styled(TableRow)<StyledTableRowProps>(
  ({ theme, maxRowHeight }) => ({
    '&:last-child td, &:last-child th': {
      // hide last border
      border: 0,
    },
    hover: {
      '&:hover': {
        backgroundColor: 'green !important',
      },
    },
    '& td': {
      cursor: 'pointer',
    },
    [`&.${tableRowClasses.root}`]: {
      height: `${maxRowHeight}px`,
    },
  })
);

export default StyledTableRow;
