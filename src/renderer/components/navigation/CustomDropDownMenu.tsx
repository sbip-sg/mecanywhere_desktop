import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CustomButton from './CustomButton';
import actions from '../../redux/actionCreators';
import clientIcon from '../../../../assets/icon-client.png';
import hostIcon from '../../../../assets/icon-host.png';
import noroleIcon from '../../../../assets/icon-norole.png';
import bothroleIcon from '../../../../assets/icon-bothrole.png';
import {
  handleRegisterClient,
  handleRegisterHost,
  handleDeregisterClient,
  handleDeregisterHost,
} from '../../utils/handleRegistration';
import { deleteAccount } from '../../electron-store';

const CustomDropDownMenu = ({ anchorEl, handleClose, handleClick }) => {
  const navigate = useNavigate();

  const isHost =
    useSelector((state) => state.accountUser.hostAccessToken).length !== 0;
  const isClient =
    useSelector((state) => state.accountUser.userAccessToken).length !== 0;
  const handleLogout = () => {
    handleClose();
    actions.setAuthenticated(false);
    navigate('/login');
  };

  const handleDeleteAccount = () => {
    handleClose();
    deleteAccount();
    actions.setAuthenticated(false);
    navigate('/register');
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'right',
          width: '60px',
          height: '60px',
        }}
      >
        <Button onClick={handleClick}>
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
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </Button>
      </Box>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <List>
          <Box
            display="flex"
            justifyContent="center"
            width="100%"
            style={{ paddingTop: '0', paddingBottom: '0' }}
          >
            <ListItemText style={{ marginLeft: '1rem' }}>
              <Typography fontStyle="italic">
                {isHost && isClient
                  ? 'Registered as both client and host'
                  : isHost
                  ? 'Registered as host'
                  : isClient
                  ? 'Registered as client'
                  : 'Currently not registered'}
              </Typography>
            </ListItemText>
          </Box>

          <ListItem style={{ paddingTop: '0', marginBottom: '1rem' }}>
            <Box
              display="flex"
              justifyContent="center"
              flexWrap="wrap"
              width="100%"
            >
              {isClient ? (
                <CustomButton
                  onClick={handleDeregisterClient}
                  actionText="Deregister"
                  buttonText="as Client"
                />
              ) : (
                <CustomButton
                  onClick={handleRegisterClient}
                  actionText="Register"
                  buttonText="as Client"
                />
              )}
              {isHost ? (
                <CustomButton
                  onClick={handleDeregisterHost}
                  actionText="Deregister"
                  buttonText="as Host"
                />
              ) : (
                <CustomButton
                  onClick={handleRegisterHost}
                  actionText="Register"
                  buttonText="as Host"
                />
              )}
            </Box>
          </ListItem>
          <Divider />
          <ListItemButton sx={{ textAlign: 'center' }} onClick={handleLogout}>
            <Typography>Log out</Typography>
          </ListItemButton>
          <ListItemButton onClick={handleDeleteAccount}>
            <Typography sx={{ textAlign: 'center' }}>Delete account</Typography>
          </ListItemButton>
        </List>
      </Menu>
    </>
  );
};

export default CustomDropDownMenu;
