import React from 'react';
import TablePagination from '@mui/material/TablePagination';
import { tablePaginationMinHeight } from './TableParams';

interface CustomTablePaginationProps {
  totalRows: number;
  rowsPerPage: number;
  page: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    page: number
  ) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomTablePagination: React.FC<CustomTablePaginationProps> = ({
  totalRows,
  rowsPerPage,
  page,
  onPageChange,
  onRowsPerPageChange,
}) => {
  return (
    <TablePagination
      id="pagination"
      labelRowsPerPage="Your text"
      rowsPerPageOptions={[]}
      component="div"
      count={totalRows}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      sx={{
        color: 'white',
        backgroundColor: 'primary.dark',
        borderRadius: '0 0 0.5em 0.5em',
        minHeight: `${tablePaginationMinHeight}px`,
        // '.MuiTablePagination-toolbar': {
        //   maxHeight: '50px',
        // }, // forgot whats the purpose
        '.MuiTablePagination-displayedRows': {
          display: 'none',
        },
      }}
    />
  );
};

export default CustomTablePagination;
