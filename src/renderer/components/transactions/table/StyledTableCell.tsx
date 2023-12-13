import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';

interface StyledTableCellProps extends React.ComponentProps<typeof TableCell> {
  addRightPadding: boolean;
}

const StyledTableCell = styled(({ addRightPadding, ...otherProps }) => (
  <TableCell {...otherProps} />
))<StyledTableCellProps>(({ theme, addRightPadding }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: 'primary.dark',
    color: 'primary.main',
    textAlign: 'right',
    fontSize: '14px',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    padding: '0 0.3rem',
    '&:last-child': {
      padding: addRightPadding ? '0rem 1rem 0rem 0rem' : '0rem 0rem 0rem 0rem',
    },
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: '14px',
    textAlign: 'right',
    padding: '0 0.3rem',
    whiteSpace: 'nowrap',
    '&:last-child': {
      padding: addRightPadding ? '0rem 1rem 0rem 0rem' : '0rem 0rem 0rem 0rem',
    },
    borderColor: 'text.secondary',
  },
}));

export default StyledTableCell;
