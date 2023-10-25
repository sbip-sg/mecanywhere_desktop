import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
// import { useNavigate } from 'react-router-dom';
import Toolbar from '@mui/material/Toolbar';
import { useEffect } from 'react';
import { useTheme } from '@emotion/react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import ProviderTab from './ProviderTab';
import HostTab from './HostTab';
import actions from '../../../redux/actionCreators';

const LeftDrawerComponent = () => {
  const theme = useTheme();
  // actions.setRole(window.electron.store.get('role'));
  // const role = useSelector((state: RootState) => state.roleReducer.role);
  useEffect(() => {
    const roleElectron = window.electron.store.get('role');
    actions.setRole(roleElectron);
  }, []);
  const role = useSelector((state: RootState) => state.roleReducer.role);
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
        </Box>
      </Box>
    </Drawer>
  );
};

export default LeftDrawerComponent;
