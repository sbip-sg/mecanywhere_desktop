import TablePagination from '@mui/material/TablePagination';

interface CustomTablePaginationProps {
    totalRows: number,
    rowsPerPage: number,
    page: number,
    onPageChange: (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => void,
    onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    backgroundColor: string;
  }
  
const CustomTablePagination: React.FC<CustomTablePaginationProps> = ({totalRows, rowsPerPage, page, onPageChange, onRowsPerPageChange, backgroundColor}) => {  
    return (
      <TablePagination  id='pagination'  
        // rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage={"Your text"}
        rowsPerPageOptions={[]}
        component="div"
        count={totalRows}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        sx={{
          backgroundColor: backgroundColor,
          // borderRadius: '0 0 0.5em 0.5em',
          minHeight: "52px",
          '.MuiTablePagination-toolbar': {
            maxHeight: "50px",
          },
          ".MuiTablePagination-displayedRows": { /* Class generated from your code */
            display: "none"
          }
      }} />  
    )
  }
  
export default CustomTablePagination