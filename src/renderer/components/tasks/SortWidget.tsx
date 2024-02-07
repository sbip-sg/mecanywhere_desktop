import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import React from 'react';

const sortOptions = [
  { value: 'taskName', label: 'Task Name' },
  { value: 'inputSizeLimit', label: 'Input Size Limit' },
  { value: 'outputSizeLimit', label: 'Output Size Limit' },
  { value: 'cpuGas', label: 'CPU Gas' },
  { value: 'gpuGas', label: 'GPU Gas' },
  { value: 'blockTimeOut', label: 'Block Timeout' },
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
  console.log('sortBy', sortBy);
  return (
    <FormControl
      variant="outlined"
      sx={{
        minWidth: '9rem',
        '& .MuiSelect-nativeInput': { display: 'none' },
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
          <MenuItem value={field.value}>{field.label}</MenuItem>
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
