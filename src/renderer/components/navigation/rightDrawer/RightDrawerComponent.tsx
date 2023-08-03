import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography/Typography';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { useState } from 'react'
import Avatar from '../menu/Avatar';
import Divider from '@mui/material/Divider/Divider';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import InfoIcon from '@mui/icons-material/Info';
import HelpIcon from '@mui/icons-material/Help';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import themeOptions from 'renderer/utils/theme';
import { useTheme } from '@mui/material/styles';

// import ExitToAppIcon from '@mui/icons-material/ExitToApp';

interface RightDrawerComponentProps {
  isOpen: boolean;
  onClose: (event: React.MouseEvent) => void;
}

const CustomListItemText: React.FC<{ text: string }> = ({ text }) => {
  return (
    <ListItemText primaryTypographyProps={{ style: { fontSize: 20 } }} primary={text} />
  )
};

const RightDrawerComponent: React.FC<RightDrawerComponentProps> = ({ isOpen, onClose }) => {
  const theme = useTheme();
  return (
        <Drawer anchor="right" open={isOpen} onClose={onClose} 
          sx={{ zIndex: 1500 }} 
          PaperProps={{
            sx: {
              backgroundColor: theme.palette.primary.main,
              color: "white",
            }
          }}>
          <Box
            sx={{ width: '20rem'}}
            // onClick={onClose}
          >
            <List >
              <ListItem >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'right',
                    margin: '0 1rem 1rem 0.5rem'
                  }}
                  onMouseEnter={() => console.log('Hovering over the image')}
                  >
                    <Avatar />
                </Box>
                <Typography variant="h5" fontSize="18px" paddingBottom="0.5rem">
                  jeryong@gmail.com
                </Typography>
              </ListItem >
              <ListItem disablePadding>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'right',
                    margin: '0 1rem 1rem 1.5rem'
                  }}>
                <Typography variant="h5" fontSize="16px" >
                Resource sharing enabled.
                <Box paddingTop="0.5rem" >
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
              </Typography>        
      
                </Box>
              </ListItem >
              <Divider variant="middle" color="white" sx={{margin:"0.5rem"}}/>

              <ListItem key={"Account"} disablePadding sx={{ marginLeft: "0.5rem" }}>
                <ListItemButton>
                  <ListItemIcon><ManageAccountsIcon style={{ fontSize: 28, color: "white" }}/></ListItemIcon>
                  <CustomListItemText text="Account"/>
                </ListItemButton>
              </ListItem>
              <ListItem key={"Settings"} disablePadding sx={{ marginLeft: "0.5rem" }}>
                <ListItemButton>
                  <ListItemIcon><SettingsIcon style={{ fontSize: 28, color: "white" }}/></ListItemIcon>
                  <CustomListItemText text="Settings"/>
                </ListItemButton>
              </ListItem>
              <Divider variant="middle" color="white" sx={{margin:"0.5rem"}}/>
              <ListItem key={"About"} disablePadding sx={{ marginLeft: "0.5rem" }}>
                <ListItemButton>
                  <ListItemIcon><InfoIcon style={{ fontSize: 28, color: "white" }}/></ListItemIcon>
                  <CustomListItemText text="About"/>
                </ListItemButton>
              </ListItem>
              <ListItem key={"Support"} disablePadding sx={{ marginLeft: "0.5rem" }}>
                <ListItemButton>
                  <ListItemIcon><HelpIcon style={{ fontSize: 28, color: "white" }}/></ListItemIcon>
                  <CustomListItemText text="Support"/>
                </ListItemButton>
              </ListItem>
              <Divider variant="middle" color="white" sx={{margin:"0.5rem"}}/>
              <ListItem key={"Sign Out"} disablePadding sx={{ marginLeft: "0.5rem" }}>
                <ListItemButton>
                  <ListItemIcon><LogoutIcon style={{ fontSize: 28, color: "white" }}/></ListItemIcon>
                  <CustomListItemText text="Sign Out"/>
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
}

export default RightDrawerComponent