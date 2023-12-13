import React from 'react';
import TableBody from '@mui/material/TableBody';
import StyledTableCell from './StyledTableCell';
import StyledTableRow from './StyledTableRow';
import { InternalDataEntry, ExternalDataEntry } from '../../common/dataTypes';
import { PropConfig } from '../propConfig';

interface CustomTableBodyProps<T> {
  visibleRows: T[];
  handleTableRowClick: (query: string) => void;
  propConfigList:
    | PropConfig<InternalDataEntry>[]
    | PropConfig<ExternalDataEntry>[];
  emptyRows: number;
  addRightPadding: boolean;
  maxRowHeight: number;
}
const CustomTableBody: React.FC<
  CustomTableBodyProps<InternalDataEntry | ExternalDataEntry>
> = ({
  visibleRows,
  handleTableRowClick,
  propConfigList,
  emptyRows,
  addRightPadding,
  maxRowHeight,
}) => {
  return (
    <TableBody>
      {visibleRows.map((data) => {
        return (
          <StyledTableRow
            onClick={() => handleTableRowClick(data.transaction_id)}
            key={data.transaction_id}
            maxRowHeight={maxRowHeight}
          >
            {propConfigList.map((config) => (
              <StyledTableCell
                addRightPadding={addRightPadding}
                key={config.property}
              >
                {config.renderer(data as any)}
              </StyledTableCell>
            ))}
          </StyledTableRow>
        );
      })}
      {emptyRows > 0 && (
        <StyledTableRow
          maxRowHeight={maxRowHeight}
          hover
          style={{
            height: 13 * emptyRows,
          }}
        >
          <StyledTableCell
            addRightPadding={addRightPadding}
            colSpan={propConfigList.length}
          />
        </StyledTableRow>
      )}
    </TableBody>
  );
};

export default CustomTableBody;
