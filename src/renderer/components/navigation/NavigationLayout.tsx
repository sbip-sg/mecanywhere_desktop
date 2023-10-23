import { ReactNode } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { LeftDrawerComponent } from './leftDrawer';
import { MenuComponent } from './menu';

const NavigationLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Box sx={{ height: '100%' }} id="outermost-nav-container">
      {useSelector((state: RootState) => state.userReducer.authenticated) ? (
        <Box sx={{ display: 'flex', height: '100%' }} id="outer-nav-container">
          <CssBaseline />
          <MenuComponent />
          <LeftDrawerComponent />
          <Box
            id="main-nav-container"
            sx={{
              flexGrow: 1,
              position: 'relative',
              top: '64px',
              height: 'calc(100vh - 64px)',
              overflowY: 'hidden',
              overflowX: 'hidden',
            }}
          >
            {children}
          </Box>
        </Box>
      ) : (
        <>{children}</>
      )}
    </Box>
  );
};
export default NavigationLayout;
