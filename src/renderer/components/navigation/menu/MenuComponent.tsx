import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { DropDownComponent } from '../dropdown';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import clientIcon from '../../../../../assets/icon-client.png';
import hostIcon from '../../../../../assets/icon-host.png';
import noroleIcon from '../../../../../assets/icon-norole.png';
import bothroleIcon from '../../../../../assets/icon-bothrole.png';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { MouseEvent, useState } from 'react';

const MenuComponent = () => {
  const isHost =
    useSelector((state: RootState) => state.accountUser.hostAccessToken).length !== 0;
  const isClient =
    useSelector((state: RootState) => state.accountUser.userAccessToken).length !== 0;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

    return (
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, height: '64px' }}>
        <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h1" noWrap component="div">
            MECAnywhere
          </Typography>
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
          <Button onClick={handleClick} sx={{pointerEvents: 'auto'}}>
            <img
              src={
                isHost && isClient
                  ? bothroleIcon
                  : isHost
                  ? hostIcon
                  : isClient
                  ? clientIcon
                  : noroleIcon
              }
              alt="Image"
              aria-label="role-icon"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              
            />
          </Button>
        </Box>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
          <DropDownComponent handleClose={handleClose}/>
        </Menu>
        </Toolbar>
      </AppBar>
    );
}

export default MenuComponent;
  
  