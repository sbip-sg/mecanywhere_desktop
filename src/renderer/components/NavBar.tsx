import {useState} from 'react'
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import Collapse from '@mui/material/Collapse';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import actions from "./states/actionCreators";
import clientIcon from '../../../assets/icon-client.png';
import hostIcon from '../../../assets/icon-host.png';
import noroleIcon from '../../../assets/icon-norole.png';
import bothroleIcon from '../../../assets/icon-bothrole.png';
import { handleRegisterClient, handleRegisterHost, handleDeregisterClient, handleDeregisterHost } from './utils/handleRegistration';
import {NavBarItems} from './utils/NavBarItems'
import { deleteAccount } from './utils/deleteAccount';

const drawerWidth = 240;

  const CustomizedListItem = ({ doc }) => {
    const [open, setOpen] = useState(false);
    const handleClick = () => {
      setOpen(!open);
    };
    const navigate = useNavigate();
  
    return (
      <div>
        <ListItem key={doc.Id} onClick={handleClick} disablePadding>
        <ListItemButton >
          <ListItemText primary={<Typography variant="body1">{doc.Name}</Typography>} />
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItemButton>
        </ListItem>
        <Collapse key={doc.Sheets.Id} in={open} timeout="auto" unmountOnExit>
          <List component="li" disablePadding key={doc.Id}>
            {doc.Sheets.map((sheet) => {
              return (
                <ListItem key={sheet.Id} disablePadding>
                    <ListItemButton>
                  <ListItemText key={sheet.Id} primary={sheet.Title}  onClick={()=> {navigate(sheet.Link);}}/>
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Collapse>
        <Divider />
      </div>
    );
  };
  
  const CustomButton = ({ onClick, actionText, buttonText }) => (
    <Button
    onClick={onClick}
    variant="contained"
    color="primary"
    style={{ marginRight: '8px',}}
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      width: '9rem'
    }}
  >
    <Box>
      {actionText && (
        <Typography variant="body1" component="span" display="block" style={{ fontSize: '12px' }}>
          {actionText}
        </Typography>
      )}
      <Typography variant="body1" component="span" display="block" style={{ fontSize: '12px' }}>
        {buttonText}
      </Typography>
    </Box>
  </Button>
  );

export default function NavBar({ children }) {
    const docs = NavBarItems.documents
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const isHost = useSelector((state) => state.accountUser.hostAccessToken).length !== 0
    const isClient = useSelector((state) => state.accountUser.userAccessToken).length !== 0
    
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    const handleLogout = () => {
      handleClose();
      actions.setAuthenticated(false);
      navigate("/login")
    };

    const handleDeleteAccount = () => {
      handleClose();
      deleteAccount()
      actions.setAuthenticated(false);
      navigate("/register")
    };
  
  
  return (
    <>
    {useSelector((state) => state.accountUser.authenticated) ? (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, height: '64px'}}>
        <Toolbar sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
          <Typography variant="h1" noWrap component="div">
            MECAnywhere
          </Typography>

          <Box sx={{display: "flex", alignItems: "center", justifyContent: "right", width: "60px", height: "60px"}}>

          <Button onClick={handleClick}>
          <img
            src={isHost && isClient
              ? bothroleIcon
              : isHost
              ? hostIcon
              : isClient
              ? clientIcon
              : noroleIcon}
            alt="Image"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Button>
     
          </Box>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
          <List>
  <ListItem>
    <Box display="flex" justifyContent="center" width="100%" style={{ paddingTop: '0', paddingBottom: "0" }}>
      
    <ListItemText>
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
  </ListItem>

  <ListItem style={{ paddingTop: '0', marginBottom: "1rem" }}>
  <Box display="flex" justifyContent="center" flexWrap="wrap" width="100%">
    {isClient 
    ? <CustomButton onClick={handleDeregisterClient} actionText="Deregister" buttonText="as Client" /> 
    : <CustomButton onClick={handleRegisterClient} actionText="Register" buttonText="as Client" />}
    {isHost 
    ? <CustomButton onClick={handleDeregisterHost} actionText="Deregister" buttonText="as Host" /> 
    : <CustomButton onClick={handleRegisterHost} actionText="Register" buttonText="as Host" />}
    
  </Box>
  </ListItem>
  <Divider />
  <ListItemButton onClick={handleLogout}>
    <ListItemText primary="Log out"  sx={{ textAlign: 'center' }}/>
  </ListItemButton>
  <ListItemButton onClick={handleDeleteAccount}>
    <ListItemText primary="Delete account"  sx={{ textAlign: 'center' }}/>
  </ListItemButton>
</List>
      </Menu>
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
      <List component="nav" aria-labelledby="nested-list-subheader">
        {docs.map((doc) => {
          return <CustomizedListItem key={doc.id} doc={doc} />;
        })}
      </List>
        </Box>
        
      </Drawer>
      <Box sx={{ flexGrow: 1, position: "relative", top: "64px", height: "100%"}}>
        {children}
      </Box>
    </Box>
    ) : <>{children}</>}
        </>
  );
}