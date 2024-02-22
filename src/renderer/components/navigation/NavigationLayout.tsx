import { ReactNode, useState } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import LeftDrawerComponent from './leftDrawer/LeftDrawerComponent';
import RightDrawerComponent from './rightDrawer/RightDrawerComponent';
import MenuComponent from './menu/MenuComponent';

const NavigationLayout = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.userReducer.authenticated
  );
  const [isRightDrawerOpen, setRightDrawerOpen] = useState(false);
  const toggleRightDrawer = (open: boolean) => () => {
    setRightDrawerOpen(open);
  };
  return (
    <Box sx={{ height: '100%' }} id="outermost-nav-container">
      {isAuthenticated ? (
        <Box sx={{ display: 'flex', height: '100%' }} id="outer-nav-container">
          <CssBaseline />
          <MenuComponent toggleRightDrawer={toggleRightDrawer} />
          <RightDrawerComponent
            isOpen={isRightDrawerOpen}
            onClose={toggleRightDrawer(false)}
          />
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
