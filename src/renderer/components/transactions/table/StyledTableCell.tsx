import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';

interface StyledTableCellProps extends React.ComponentProps<typeof TableCell> {
  addRightPadding: boolean;
}

const StyledTableCell = styled(({ addRightPadding, ...otherProps }) => (
  <TableCell {...otherProps} />
))<StyledTableCellProps>(({ theme, addRightPadding }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.mediumBlack.main,
    color: theme.palette.cerulean.main,
    textAlign: 'right',
    fontSize: '14px',
    padding: '0',
    '&:last-child': {
      padding: addRightPadding ? '0rem 1rem 0rem 0rem' : '0rem 0rem 0rem 0rem',
    },
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: '14px',
    textAlign: 'right',
    padding: '0',
    '&:last-child': {
      padding: addRightPadding ? '0rem 1rem 0rem 0rem' : '0rem 0rem 0rem 0rem',
    },
    borderColor: theme.palette.lightPurple.main,
  },
}));

export default StyledTableCell;
