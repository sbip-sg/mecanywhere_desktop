import * as React from 'react';
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
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Collapse from '@mui/material/Collapse';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';
import { Navigate } from "react-router";
import { useSelector } from "react-redux";
import actions from "./states/actionCreators";
import { store } from "./states/store";
const drawerWidth = 240;

const listData = {
    documents: [
      {
        Id: 1,
        Name: "CLIENT",
        Sheets: [
          {
            Id: 1,
            Title: "Register as Client",
            Link: "/clientregistration"
          },
          {
            Id: 2,
            Title: "Job Submission",
            Link: "/clientjobsubmission"
          },
          {
            Id: 3,
            Title: "Dashboard",
            Link: "/clientdashboard"
          },
        ]
      },
      {
        Id: 1,
        Name: "HOST",
        Sheets: [
          {
            Id: 1,
            Title: "Register as Host",
            Link: "/hostregistration"
          },
          {
            Id: 2,
            Title: "Dashboard",
            Link: "/hostdashboard"
          },
        ]
      },
      {
        Id: 1,
        Name: "ACCOUNT",
        Sheets: [
            // {
            //     Id: 1,
            //     Title: "Wallet",
            //     Link: "/wallet"
            //   },
          {
            Id: 1,
            Title: "Profile",
            Link: "/profile"
          },
          {
            Id: 2,
            Title: "Billing Information",
            Link: "/billing"
          },
          {
            Id: 3,
            Title: "Support",
            Link: "/support"
          },
          // {
          //   Id: 5,
          //   Title: "Login",
          //   Link: "/login"
          // },
          // {
          //   Id: 6,
          //   Title: "Register",
          //   Link: "/register"
          // },
        ]
      }
    ]
  };

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
          <ListItemText primary={<Typography sx={{ fontWeight: 'bold', fontSize: '15px' }}>{doc.Name}</Typography>} />
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
  

export default function NavBar({ children }) {
    const docs = listData.documents
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    const handleLogout = () => {
      console.log("log out");
      handleClose();
      actions.setUserAuthenticated(false);
      console.log("aaa")
      navigate("/login")
      console.log("bb")

    };
  
  return (
    <>
    {useSelector((state) => state.user.authenticated) ? (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, height: '64px'}}>
        <Toolbar sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
          <Typography variant="h6" noWrap component="div">
            MECAnywhere
          </Typography>
          <Avatar sx={{ bgcolor: "primary.main", mr: 2, cursor: "pointer", // Add this line to change cursor to pointer on hover
    "&:hover": {
      bgcolor: "primary.dark"
    }}} onClick={handleClick} >
            {/* Add your avatar icon here */}
          </Avatar>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            <MenuItem onClick={handleLogout}>Log out</MenuItem>
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