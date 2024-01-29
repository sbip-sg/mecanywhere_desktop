import React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography/Typography';
import Divider from '@mui/material/Divider/Divider';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import KeyIcon from '@mui/icons-material/Key';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import InfoIcon from '@mui/icons-material/Info';
import HelpIcon from '@mui/icons-material/Help';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import deleteAccount from 'renderer/electron-store';
import useIsLightTheme from 'renderer/components/common/useIsLightTheme';
import actions from '../../../redux/actionCreators';
import KeyExportPopover from './KeyExportPopover';
import { RootState } from '../../../redux/store';

interface RightDrawerComponentProps {
  isOpen: boolean;
  onClose: (event: React.MouseEvent) => void;
}

const CustomListItem = ({ text, onClick, iconComponent: IconComponent }) => (
  <ListItem key={text} sx={{ paddingLeft: '0.5rem' }}>
    <ListItemButton onClick={onClick}>
      <ListItemIcon>
        <IconComponent style={{ fontSize: 28, color: 'text.primary' }} />
      </ListItemIcon>
      <ListItemText
        primaryTypographyProps={{ style: { fontSize: '18px' } }}
        primary={text}
      />
    </ListItemButton>
  </ListItem>
);

const RightDrawerComponent: React.FC<RightDrawerComponentProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const isLightTheme = useIsLightTheme();
  const appRole = useSelector((state: RootState) => state.roleReducer.role);

  const handleThemeChange = () => {
    const newColor = isLightTheme ? 'dark' : 'light';
    actions.setColor(newColor);
  };

  const handleSignOut = () => {
    actions.setAuthenticated(false);
    navigate('/login');
  };

  const handleDeleteAccount = () => {
    deleteAccount();
    handleSignOut();
  };
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(true);
    onClose(event);
  };

  const handleNavigateAccount = () => {};
  const handleNavigateAbout = () => {};
  const handleNavigateSupport = () => {};
  const handleNavigateSettings = () => {};

  return (
    <>
      <KeyExportPopover open={open} setOpen={setOpen} />
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={onClose}
        sx={{ zIndex: 1500 }}
        PaperProps={{
          sx: {
            backgroundColor: 'text.secondary',
            color: 'text.primary',
          },
        }}
      >
        <Box sx={{ width: '20rem' }}>
          <List>
            <ListItem
              sx={{
                '&:hover': {
                  background: 'none',
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'right',
                  margin: '1rem 1rem 0rem 0.5rem',
                }}
              >
                <AccountCircleIcon style={{ fontSize: '50px' }} />
              </Box>
              <Typography
                variant="h5"
                fontSize="18px"
                fontWeight="600"
                padding="1rem 0rem 0rem 0rem"
              >
                jeryong@gmail.com
              </Typography>
            </ListItem>
            <ListItem
              sx={{
                '&:hover': {
                  background: 'none',
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  margin: '0 1rem 1rem 1.5rem',
                }}
              >
                <Box paddingTop="0.5rem">
                  Device Information:
                  <Box paddingLeft="1rem" paddingTop="0.5rem">
                    <Typography variant="body1" fontSize="13px">
                      Type: PC
                      <br />
                      OS: Windows 10
                      <br />
                      Processor: Intel Core i7
                      <br />
                      RAM: 16 GB
                      <br />
                      GPU: NVIDIA GeForce GTX 1660 Ti
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    paddingTop: '1rem',
                  }}
                >
                  <Typography variant="h5" fontSize="16px" textAlign="start">
                    Registered as a{' '}
                    {appRole ==! 'provider' ? 'parent organization' : 'host'}.
                  </Typography>
                </Box>
              </Box>
            </ListItem>
            <Divider variant="middle" sx={{ margin: '0.5rem' }} />
            <CustomListItem
              text="Export Key"
              iconComponent={KeyIcon}
              onClick={handleClickOpen}
            />
            <CustomListItem
              text={isLightTheme ? 'Dark Mode' : 'Light Mode'}
              iconComponent={isLightTheme ? DarkModeIcon : LightModeIcon}
              onClick={handleThemeChange}
            />
            <Divider variant="middle" sx={{ margin: '0.5rem' }} />
            <CustomListItem
              text="Account"
              iconComponent={ManageAccountsIcon}
              onClick={handleNavigateAccount}
            />
            <CustomListItem
              text="Settings"
              iconComponent={SettingsIcon}
              onClick={handleNavigateSettings}
            />
            <CustomListItem
              text="About"
              iconComponent={InfoIcon}
              onClick={handleNavigateAbout}
            />
            <CustomListItem
              text="Support"
              iconComponent={HelpIcon}
              onClick={handleNavigateSupport}
            />
            <Divider variant="middle" sx={{ margin: '0.5rem' }} />
            <CustomListItem
              text="Sign Out"
              iconComponent={LogoutIcon}
              onClick={handleSignOut}
            />
            <CustomListItem
              text="Delete Account (Dev)"
              iconComponent={DeleteForeverIcon}
              onClick={handleDeleteAccount}
            />
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default RightDrawerComponent;
