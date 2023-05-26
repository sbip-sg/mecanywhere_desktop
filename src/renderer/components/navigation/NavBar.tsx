import { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CustomListItem from './CustomListItem';
import { navBarItems } from './navBarItems';
import CustomDropDownMenu from './CustomDropDownMenu';

export default function NavBar({ children }) {
  const docs = navBarItems.documents;
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {useSelector((state) => state.accountUser.authenticated) ? (
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />

          <AppBar
            position="fixed"
            sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, height: '64px' }}
          >
            <Toolbar
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="h1" noWrap component="div">
                MECAnywhere
              </Typography>
              <CustomDropDownMenu
                anchorEl={anchorEl}
                handleClose={handleClose}
                handleClick={handleClick}
              />
            </Toolbar>
          </AppBar>
          <Drawer
            className="drawer"
            variant="permanent"
            sx={{
              width: 240,
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: {
                width: 240,
                boxSizing: 'border-box',
              },
            }}
          >
            <Toolbar />
            <Box sx={{ overflow: 'auto' }}>
              <List component="nav" aria-labelledby="nested-list-subheader">
                {docs.map((doc, i) => {
                  return <CustomListItem key={i} doc={doc} />;
                })}
              </List>
            </Box>
          </Drawer>
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
