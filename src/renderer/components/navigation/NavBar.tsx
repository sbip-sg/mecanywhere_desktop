import { ReactNode } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { navBarItems, NavBarItem } from './navBarItems';
import { DrawerComponent } from './drawer';
import { MenuComponent } from './menu';

export default function NavBar({ children }: { children: ReactNode }) {
  const docs: NavBarItem[] = navBarItems.documents;
  return (
    <>
      {useSelector((state: RootState) => state.accountUser.authenticated) ? (
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <MenuComponent />
          <DrawerComponent docs={docs}/>
          <Box
            sx={{
              flexGrow: 1,
              position: 'relative',
              top: '64px',
              height: '100%',
            }}
          >
            {children}
          </Box>
        </Box>
      ) : (
        <>{children}</>
      )}
    </>
  );
}
