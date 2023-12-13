import TableRow, { tableRowClasses } from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';

interface StyledTableRowProps extends React.ComponentPropsWithoutRef<'tr'> {
  maxRowHeight: number;
  isheader: boolean;
}

const StyledTableRow = styled(TableRow, {
  shouldForwardProp: (prop) => prop !== 'maxRowHeight',
})<StyledTableRowProps>(({ theme, maxRowHeight, isheader = false }) => ({
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  ...(isheader && {
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
