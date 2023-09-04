import React from 'react';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

interface CustomToolbarProps {
  // isTableExpanded: Boolean;
  // setIsTableExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  backgroundColor: string;
}

const CustomToolbar: React.FC<CustomToolbarProps> = ({
  // isTableExpanded,
  // setIsTableExpanded,
  backgroundColor,
}) => {
  // const handleClickExpandButton = () => {
  //   setIsTableExpanded((prev) => !prev);
  // };
  return (
    <Toolbar
      id="datagrid-toolbar"
      variant="dense"
      sx={{
        minHeight: '50px',
        backgroundColor,
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        borderRadius: '0.5em 0.5em 0 0',
      }}
    >
      <Typography
        sx={{ flex: '1 1 100%', whiteSpace: 'nowrap' }}
        variant="body1"
        id="tableTitle"
        component="div"
      >
        Past Transactions
      </Typography>
      <Tooltip title="Expand Table">
      </Tooltip>
    </Toolbar>
  );
};

export default CustomToolbar;
