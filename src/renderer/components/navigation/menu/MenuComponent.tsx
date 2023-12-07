import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useState } from 'react';
import { RightDrawerComponent } from '../rightDrawer';
import { ReactComponent as Logo } from '../../../../../assets/LogoColorHorizontal.svg';
import useThemeTextColor from '../../../utils/useThemeTextColor';

const MenuComponent = () => {
  const [isRightDrawerOpen, setRightDrawerOpen] = useState(false);
  const toggleRightDrawer = (open: boolean) => () => {
    setRightDrawerOpen(open);
  };
  const textColor = useThemeTextColor();

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        height: '64px',
        backgroundColor: 'primary.dark',
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
            style={{ cursor: 'pointer' }}
            // onClick={handleLogoClick}
          />
          <Typography
            variant="h1"
            noWrap
            component="div"
            sx={{
              color: textColor,
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
              backgroundColor: 'primary.dark',
            }}
          >
            <AccountCircleIcon style={{ fontSize: '50px' }} />

            {/* <Avatar /> */}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default MenuComponent;
