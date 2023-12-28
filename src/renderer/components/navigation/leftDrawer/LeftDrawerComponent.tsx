import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import ProviderTab from './ProviderTab';
import ClientHostTab from './ClientHostTab';
import actions from '../../../redux/actionCreators';

const LeftDrawerComponent = () => {
  useEffect(() => {
    const roleElectron = window.electron.store.get('role');
    actions.setRole(roleElectron);
  }, []);
  const role = useSelector((state: RootState) => state.roleReducer.role);
  return (
    <Drawer
      id="left-drawer"
      variant="permanent"
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
        {role === 'host' && <ClientHostTab />}
        {role === 'client' && <ClientHostTab />}
        {role === 'provider' && <ProviderTab />}
      </Box>
    </Drawer>
  );
};

export default LeftDrawerComponent;
