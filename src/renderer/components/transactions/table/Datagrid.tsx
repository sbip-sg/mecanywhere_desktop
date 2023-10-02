import * as React from 'react';
import { useEffect, useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import { useTheme } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { InternalDataEntry, ExternalDataEntry } from '../../../utils/dataTypes';
import { PropConfig } from '../propConfig';
import { Order, stableSort, getComparator } from './comparatorUtils';
import CustomTableHead from './CustomTableHead';
import CustomTableBody from './CustomTableBody';
import CustomTablePagination from './CustomTablePagination';
import CustomToolbar from './CustomToolbar';
import actions from 'renderer/redux/actionCreators';
import { RootState } from 'renderer/redux/store';
import reduxStore from 'renderer/redux/store';


interface DatagridProps {
  data: InternalDataEntry[] | ExternalDataEntry[];
  isTableExpanded: boolean;
  setIsTableExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  propConfigList:
    | PropConfig<InternalDataEntry>[]
    | PropConfig<ExternalDataEntry>[];
}

const Datagrid: React.FC<DatagridProps> = ({
  data,
  isTableExpanded,
  setIsTableExpanded,
  propConfigList,
}) => {
  const unexpandedRowPerPage = 5;
  const expandedRowPerPage = 25;
  const maxRowHeight = 30; // px
  const theme = useTheme();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<
    keyof InternalDataEntry | keyof ExternalDataEntry
  >('session_start_datetime');
  const [page, setPage] = useState(0);
  const [tableOverflow, setTableOverflow] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(expandedRowPerPage);
  const [addRightPadding, setAddRightPadding] = useState(true);
  const [maxTableHeight, setMaxTableHeight] = useState(
    maxRowHeight * (unexpandedRowPerPage + 1) + unexpandedRowPerPage - 1
  );
  const handleTableRowClick = (sessionId: string) => {
    const sessionDetails = data.find((entry) => entry.session_id === sessionId);
    // navigate(`/details/${sessionId}`);
    if (sessionDetails) {
      actions.setTransactionDetails(sessionDetails);
      navigate(`/details/${sessionId}`);
    } else {
      console.error('entry doesnt exist');
    }
  };
  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof ExternalDataEntry | keyof InternalDataEntry
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;
  const visibleRows = useMemo(
    () =>
      stableSort<InternalDataEntry | ExternalDataEntry>(
        data,
        getComparator(order, orderBy)
      ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, data]
  );
  // table expansion effect
  useEffect(() => {
    if (isTableExpanded) {
      setTableOverflow(true);
      setAddRightPadding(false);
      setMaxTableHeight(
        maxRowHeight * (expandedRowPerPage + 1) + expandedRowPerPage - 1
      );
    } else {
      setMaxTableHeight(
        maxRowHeight * (expandedRowPerPage + 1) + expandedRowPerPage - 1
      );
      setTableOverflow(false);
      setAddRightPadding(true);
    }
  }, [isTableExpanded]);

  return (
    <Box
      id="datagrid-container-inner"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
        height: '100%',
        width: '100%',
        position: 'relative',
      }}
    >
      <CustomToolbar
        isTableExpanded={isTableExpanded}
        setIsTableExpanded={setIsTableExpanded}
        backgroundColor={theme.palette.lightBlack.main}
      />
      <TableContainer
        id="tablecontainer"
        sx={{
          maxHeight: `${maxTableHeight}px`,
          overflowY: tableOverflow ? 'none' : 'hidden',
        }}
      >
        <Table
          sx={{
            minWidth: 750,
            '& .MuiTableRow-root:hover': {
              backgroundColor: 'primary.light',
            },
          }}
          size="small"
        >
          <CustomTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            propConfigList={propConfigList}
            addRightPadding={addRightPadding}
            maxRowHeight={maxRowHeight}
          />
          <CustomTableBody
            visibleRows={visibleRows}
            handleTableRowClick={handleTableRowClick}
            propConfigList={propConfigList}
            emptyRows={emptyRows}
            addRightPadding={addRightPadding}
            maxRowHeight={maxRowHeight}
          />
        </Table>
      </TableContainer>
      <CustomTablePagination
        totalRows={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        backgroundColor={theme.palette.mediumBlack.main}
      />
    </Box>
  );
};

export default Datagrid;
