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
import InfoIcon from '@mui/icons-material/Info';
import HelpIcon from '@mui/icons-material/Help';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import deleteAccount from 'renderer/electron-store';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useSelector } from 'react-redux';
import { RootState } from 'renderer/redux/store';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import actions from '../../../redux/actionCreators';
import KeyIcon from '@mui/icons-material/Key';
interface RightDrawerComponentProps {
  isOpen: boolean;
  onClose: (event: React.MouseEvent) => void;
}

const CustomListItemText: React.FC<{ text: string }> = ({ text }) => {
  return (
    <ListItemText
      primaryTypographyProps={{ style: { fontSize: '18px' } }}
      primary={text}
    />
  );
};

const RightDrawerComponent: React.FC<RightDrawerComponentProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const getMnemonics = () => {
    const mnemonics = window.electron.store.get('mnemonic');
    console.log('mnemonics', mnemonics);
  };
  const currentColor = useSelector(
    (state: RootState) => state.themeReducer.color
  );
  const handleModeChange = () => {
    const newColor = currentColor === 'light' ? 'dark' : 'light';
    actions.setColor(newColor);
  };
  const handleSignOut = () => {
    // handleClose();
    actions.setAuthenticated(false);
    navigate('/login');
  };
  const themeColor = useSelector(
    (state: RootState) => state.themeReducer.color
  );
  // const [dataKeySelectorAnchorEl, setDataKeySelectorAnchorEl] =
  //   React.useState<HTMLButtonElement | null>(null);

  // const handleOpenDataKeySelector = (
  //   event: React.MouseEvent<HTMLButtonElement>
  // ) => {
  //   setDataKeySelectorAnchorEl(event.currentTarget);
  // };
  // <Backdrop
  //   sx={{ color: '#fff', zIndex: theme.zIndex.drawer + 1 }}
  //   open={Boolean(dataKeySelectorAnchorEl)}
  // >
  //   <DataKeySelectorPopover
  //     anchorEl={dataKeySelectorAnchorEl}
  //     setAnchorEl={setDataKeySelectorAnchorEl}
  //     datakey={dataKey}
  //     setDatakey={setDataKey}
  //     selectedRole={selectedRole}
  //     setSelectedRole={setSelectedRole}
  //   />
  // </Backdrop>;
  return (
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
      <Box
        sx={{ width: '20rem' }}
        // onClick={onClose}
      >
        <List>
          <ListItem>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'right',
                margin: '1rem 1rem 0rem 0.5rem',
              }}
              onMouseEnter={() => console.log('Hovering over the image')}
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
          <ListItem disablePadding>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'right',
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
              {/* <Typography variant="h5" fontSize="16px" >
                Registered as a parent organization.
              </Typography>         */}
            </Box>
          </ListItem>
          <Divider
            variant="middle"
            // color="text.primary"
            sx={{ margin: '0.5rem' }}
          />

          <ListItem key="Account" disablePadding sx={{ marginLeft: '0.5rem' }}>
            <ListItemButton>
              <ListItemIcon>
                <ManageAccountsIcon
                  style={{ fontSize: 28, color: 'text.primary' }}
                />
              </ListItemIcon>
              <CustomListItemText text="Account" />
            </ListItemButton>
          </ListItem>
          <ListItem key="Settings" disablePadding sx={{ marginLeft: '0.5rem' }}>
            <ListItemButton onClick={() => navigate('/settings')}>
              <ListItemIcon>
                <SettingsIcon style={{ fontSize: 28, color: 'text.primary' }} />
              </ListItemIcon>
              <CustomListItemText text="Settings" />
            </ListItemButton>
          </ListItem>
          <ListItem key="theme" disablePadding sx={{ marginLeft: '0.5rem' }}>
            <ListItemButton onClick={handleModeChange}>
              <ListItemIcon>
                {currentColor === 'light' ? (
                  <DarkModeIcon
                    style={{ fontSize: 28, color: 'text.primary' }}
                  />
                ) : (
                  <LightModeIcon
                    style={{ fontSize: 28, color: 'text.primary' }}
                  />
                )}
              </ListItemIcon>
              <CustomListItemText
                text={themeColor === 'light' ? 'Dark Mode' : 'Light Mode'}
              />
            </ListItemButton>
          </ListItem>
          <ListItem
            key="Export Key"
            disablePadding
            sx={{ marginLeft: '0.5rem' }}
          >
            <ListItemButton onClick={getMnemonics}>
              <ListItemIcon>
                <KeyIcon style={{ fontSize: 28, color: 'text.primary' }} />
              </ListItemIcon>
              <CustomListItemText text="Export Key" />
            </ListItemButton>
          </ListItem>
          <Divider variant="middle" sx={{ margin: '0.5rem' }} />
          <ListItem key="About" disablePadding sx={{ marginLeft: '0.5rem' }}>
            <ListItemButton>
              <ListItemIcon>
                <InfoIcon style={{ fontSize: 28, color: 'text.primary' }} />
              </ListItemIcon>
              <CustomListItemText text="About" />
            </ListItemButton>
          </ListItem>
          <ListItem key="Support" disablePadding sx={{ marginLeft: '0.5rem' }}>
            <ListItemButton>
              <ListItemIcon>
                <HelpIcon style={{ fontSize: 28, color: 'text.primary' }} />
              </ListItemIcon>
              <CustomListItemText text="Support" />
            </ListItemButton>
          </ListItem>
          <Divider variant="middle" sx={{ margin: '0.5rem' }} />
          <ListItem key="Sign Out" disablePadding sx={{ marginLeft: '0.5rem' }}>
            <ListItemButton onClick={handleSignOut}>
              <ListItemIcon>
                <LogoutIcon style={{ fontSize: 28, color: 'text.primary' }} />
              </ListItemIcon>
              <CustomListItemText text="Sign Out" />
            </ListItemButton>
          </ListItem>
          <ListItem
            key="Delete Account (Dev)"
            disablePadding
            sx={{ marginLeft: '0.5rem' }}
          >
            <ListItemButton
              onClick={() => {
                deleteAccount();
                handleSignOut();
              }}
            >
              <ListItemIcon>
                <LogoutIcon style={{ fontSize: 28, color: 'text.primary' }} />
              </ListItemIcon>
              <CustomListItemText text="Delete Account (Dev)" />
            </ListItemButton>
          </ListItem>
          {/* <ListItem key={"Exit App"} disablePadding>
                <ListItemButton>
                  <ListItemIcon><LogoutIcon style={{ fontSize: 28, color: "white" }}/></ListItemIcon>
                  <CustomListItemText text="Exit App"/>
                </ListItemButton>
              </ListItem> */}
        </List>
      </Box>
    </Drawer>
  );
};

export default RightDrawerComponent;
