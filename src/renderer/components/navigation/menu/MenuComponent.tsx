import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';
import { RootState } from 'renderer/redux/store';
import { useState } from 'react';
import Avatar from './Avatar';
import { RightDrawerComponent } from '../rightDrawer';
import { ReactComponent as Logo } from '../../../../../assets/LogoColorHorizontal.svg';

const MenuComponent = () => {
  const [isRightDrawerOpen, setRightDrawerOpen] = useState(false);
  const toggleRightDrawer = (open: boolean) => () => {
    setRightDrawerOpen(open);
  };
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
          <Logo
            width="20%"
            height="20%"
            style={{ cursor: 'pointer', color: 'white' }}
            // onClick={handleLogoClick}
          />
          <Typography
            variant="h1"
            noWrap
            component="div"
            sx={{
              color:
                useSelector((state: RootState) => state.themeReducer.color) ===
                'light'
                  ? 'text.secondary'
                  : 'text.primary',
              marginLeft: '0.5rem',
            }}
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
