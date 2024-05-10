import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import React from 'react';

const sortOptions = [
  { value: 'taskName', label: 'Task Name' },
  { value: 'cid', label: 'CID' },
  { value: 'size_folder', label: 'Folder Size' },
  { value: 'size_io', label: 'I/O Size' },
  { value: 'computing_type', label: 'Computing Type' },
  { value: 'fee', label: 'Fee' },
];

const orderOptions = [
  { value: 'asc', label: 'Ascending' },
  { value: 'desc', label: 'Descending' },
];

interface CustomFormControlProps {
  sortLabel: string;
  sortBy: string;
  handleSortByChange: any;
  options: any;
}

const CustomFormControl: React.FC<CustomFormControlProps> = ({
  sortLabel,
  sortBy,
  handleSortByChange,
  options,
}) => {
  return (
    <FormControl
      variant="outlined"
      sx={{
        minWidth: '9rem',
        '& .MuiSelect-nativeInput': { display: 'none' },
        margin: { xs: '0 0 2rem 0', md: "0" }
            }}
    >
      <InputLabel
        shrink
        sx={{
          color: 'text.primary',
          '&.Mui-focused': {
            color: 'text.primary',
          },
        }}
      >
        {sortLabel}
      </InputLabel>
      <Select
        label={sortLabel}
        value={sortBy}
        onChange={handleSortByChange}
        notched
        defaultValue=""
        sx={{
          '& .MuiSelect-select': {
            paddingBottom: '0',
            paddingTop: '1rem',
          },
          fontSize: '14px',
          '& .MuiSvgIcon-root': {
            color: 'text.primary',
            marginTop: '0.4rem',
          },
          boxShadow: 'none',
          '.MuiOutlinedInput-notchedOutline': { border: 0 },
          '&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
            border: 0,
          },
          '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
            {
              border: 0,
            },
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              bgcolor: 'background.default',
              '& .MuiMenuItem-root': {
                fontSize: '14px',
              },
            },
          },
        }}
      >
        {options.map((field) => (
          <MenuItem value={field.value} key={field.value}>
            {field.label}
          </MenuItem>
        ))}{' '}
      </Select>
    </FormControl>
  );
};

const SortWidget = ({
  sortField,
  handleSortFieldChange,
  sortDirection,
  handleSortDirectionChange,
}) => {
  return (
    <>
      <CustomFormControl
        sortLabel="Sort Field"
        sortBy={sortField}
        handleSortByChange={handleSortFieldChange}
        options={sortOptions}
      />
      <CustomFormControl
        sortLabel="Sort Direction"
        sortBy={sortDirection}
        handleSortByChange={handleSortDirectionChange}
        options={orderOptions}
      />
    </>
  );
};

export default SortWidget;
