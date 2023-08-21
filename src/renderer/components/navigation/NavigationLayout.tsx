import { ReactNode } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { useSelector } from 'react-redux';
import { useTheme } from '@emotion/react';
import { RootState } from '../../redux/store';
import { LeftDrawerComponent } from './leftDrawer';
import { RightDrawerComponent } from './rightDrawer';
import { LeftDrawerComponent } from './leftDrawer';
import { RightDrawerComponent } from './rightDrawer';
import { MenuComponent } from './menu';
import { useTheme } from '@emotion/react';

export default function NavigationLayout({
  children,
}: {
  children: ReactNode;
}) {
  const theme = useTheme();
  return (
    <Box sx={{ height: '100%' }} id="aaaaaaaa">
      {useSelector((state: RootState) => state.accountUser.authenticated) ? (
        <Box sx={{ display: 'flex', height: '100%' }} id="bbbbb">
          <CssBaseline />
          <MenuComponent />
          <LeftDrawerComponent />
          <Box
            id="main-nav-container"
            id="main-nav-container"
            sx={{
              flexGrow: 1,
              position: 'relative',
              top: '64px',
              height: 'calc(100vh - 64px)',
              // backgroundColor: theme.palette.primary.main
              overflowY: 'hidden',
              overflowX: 'auto',
            }}
          >
            {children}
          </Box>
        </Box>
      ) : (
        <>{children}</>
      )}
    </Box>
    </Box>
  );
}
