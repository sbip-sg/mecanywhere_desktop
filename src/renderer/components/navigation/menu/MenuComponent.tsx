import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import { MouseEvent, useState } from 'react';
import { useTheme } from '@emotion/react';
import Avatar from './Avatar';
import logoTest from '../../../../../assets/logo-test.png';

import { RightDrawerComponent } from '../rightDrawer';
import { DropDownComponent } from '../dropdown';

const MenuComponent = () => {
  const [isRightDrawerOpen, setRightDrawerOpen] = useState(false);
  const toggleRightDrawer = (open: boolean) => (event: React.MouseEvent) => {
    setRightDrawerOpen(open);
  };
  const theme = useTheme();
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        height: '64px',
        backgroundColor: 'customBackground.main',
      }}
    >
      <RightDrawerComponent
        isOpen={isRightDrawerOpen}
        onClose={toggleRightDrawer(false)}
      />
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'left',
          }}
        >
          <img
            src={logoTest}
            width="8%"
            height="8%"
            style={{ margin: '0 0.5rem 0 0' }}
          />
          <Typography
            variant="h1"
            noWrap
            component="div"
            sx={{ color: 'primary.main', marginLeft: '0.5rem' }}
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
          <Button
            onClick={toggleRightDrawer(true)}
            sx={{
              pointerEvents: 'auto',
              backgroundColor: 'customBackground.main',
            }}
          >
            <Avatar />
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default MenuComponent;
