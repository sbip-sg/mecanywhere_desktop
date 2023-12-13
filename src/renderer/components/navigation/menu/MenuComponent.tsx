import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import useIsLightTheme from 'renderer/components/common/useIsLightTheme';
import { RightDrawerComponent } from '../rightDrawer';
import { ReactComponent as Logo } from '../../../../../assets/LogoColor.svg';

const MenuComponent = () => {
  const [isRightDrawerOpen, setRightDrawerOpen] = useState(false);
  const toggleRightDrawer = (open: boolean) => () => {
    setRightDrawerOpen(open);
  };
  const isLightTheme = useIsLightTheme();
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const defaultStyle = {
    cursor: 'pointer',
    filter: 'brightness(100%)',
    width: '20%',
    height: '20%',
  };
  const role = window.electron.store.get('role');

  const hoveredStyle = {
    ...defaultStyle,
    filter: 'brightness(120%)',
  };

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
            style={isHovered ? hoveredStyle : defaultStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => {
              if (role === 'host') {
                navigate('/hosttxndashboard');
              } else if (role === 'provider') {
                navigate('/providertxndashboard');
              } else {
                console.error('invalid role');
              }
            }}
          />
          <Typography
            variant="h3"
            noWrap
            component="div"
            sx={{
              color: isLightTheme ? 'text.secondary' : 'text.primary',
              marginLeft: '1.7rem',
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
          // onMouseEnter={() => console.log('Hovering over the image')}
        >
          <Button
            onClick={toggleRightDrawer(true)}
            sx={{
              backgroundColor: 'primary.dark',
              '&:hover': {
                filter: 'brightness(85%)',
                backgroundColor: 'primary.dark',
              },
            }}
          >
            <AccountCircleIcon
              sx={{
                color: 'white',
                fontSize: '50px',
              }}
            />
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default MenuComponent;
