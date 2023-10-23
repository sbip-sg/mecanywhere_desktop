import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@emotion/react';
import ProviderTab from './ProviderTab';
import HostTab from './HostTab';

const LeftDrawerComponent = () => {
  const theme = useTheme();
  const role = window.electron.store.get('role');

  return (
    <Drawer
      id="left-drawer"
      variant="permanent"
      PaperProps={{
        sx: {
          backgroundColor: theme.palette.lightBlack.main,
          color: 'white',
        },
      }}
      sx={{
        width: 325,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 325,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar sx={{ backgroundColor: 'red' }} />
      <Box id="drawerlist-wrapper" sx={{ height: '100%', overflow: 'auto' }}>
        <Box id="drawerlist-wrapper" sx={{ height: '100%', overflow: 'auto' }}>
          {role === 'host' && <HostTab />}
          {role === 'provider' && <ProviderTab />}
          {/* {role === 'client' && <ClientTab />} */}
        </Box>
      </Box>
    </Drawer>
  );
};

export default LeftDrawerComponent;
