import React from 'react';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import useIsLightTheme from 'renderer/utils/useIsLightTheme';
import { toolbarMinHeight } from './datagridUtils/TableParams';

interface CustomToolbarProps {
  isTableExpanded: Boolean;
  setIsTableExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

const CustomToolbar: React.FC<CustomToolbarProps> = ({
  isTableExpanded,
  setIsTableExpanded,
}) => {
  const handleClickExpandButton = () => {
    setIsTableExpanded((prev) => !prev);
  };
  const isLightTheme = useIsLightTheme();

  return (
    <Toolbar
      id="datagrid-toolbar"
      variant="dense"
      sx={{
        minHeight: `${toolbarMinHeight}px`,
        backgroundColor: 'primary.dark',
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        borderRadius: '0.5em 0.5em 0 0',
      }}
    >
      <Typography
        sx={{
          flex: '1 1 100%',
          whiteSpace: 'nowrap',
          color: isLightTheme ? 'text.secondary' : 'text.primary',
        }}
        variant="body1"
        id="tableTitle"
        component="div"
      >
        Past Transactions
      </Typography>
      <Tooltip title={isTableExpanded ? 'Collapse Table' : 'Expand Table'}>
        <IconButton onClick={handleClickExpandButton}>
          {isTableExpanded ? (
            <ExpandMoreIcon
              sx={{ color: isLightTheme ? 'text.secondary' : 'text.primary' }}
            />
          ) : (
            <ExpandLessIcon
              sx={{ color: isLightTheme ? 'text.secondary' : 'text.primary' }}
            />
          )}
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
};

export default CustomToolbar;
