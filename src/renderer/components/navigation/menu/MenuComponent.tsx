import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { DropDownComponent } from '../dropdown';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import Avatar from './Avatar'
import logoTest from '../../../../../assets/logo-test.png';

import { MouseEvent, useState } from 'react';
import { RightDrawerComponent } from '../rightDrawer';
import { useTheme } from '@emotion/react';

const MenuComponent = () => {

  const [isRightDrawerOpen, setRightDrawerOpen] = useState(false);
  const toggleRightDrawer = (open: boolean) => (event: React.MouseEvent) => {
    setRightDrawerOpen(open);
  };
  const theme = useTheme();
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, height: '64px', backgroundColor: theme.palette.mediumBlack.main }}>
        <RightDrawerComponent isOpen={isRightDrawerOpen} onClose={toggleRightDrawer(false)}/>
        <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'left',
            }}>
            <img src={logoTest} width="10%" height="10%" style={{ margin: '0 0.5rem 0 0' }}/>
            <Typography variant="h1" noWrap component="div" 
              sx={{color: theme.palette.cerulean.main, marginLeft: '0.5rem'}}
              >
              MECAnywhere
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'right',
              width: '60px',
              height: '60px',
            }}
            onMouseEnter={() => console.log('Hovering over the image')}
          >
            <Button onClick={toggleRightDrawer(true)} 
            sx={{
              pointerEvents: 'auto',
              backgroundColor: theme.palette.mediumBlack.main,
            }}>
              <Avatar />
            </Button>
        </Box>
        </Toolbar>
      </AppBar>
    );
}

export default MenuComponent;
  
  