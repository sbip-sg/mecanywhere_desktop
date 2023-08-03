import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import DashboardIcon from '@mui/icons-material/Dashboard';import { useState } from 'react';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PaidIcon from '@mui/icons-material/Paid';
import AppShortcutIcon from '@mui/icons-material/AppShortcut';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@emotion/react';
import { Tab, Tabs } from '@mui/material';
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch, { SwitchProps } from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack'
import HostSharingWidget from './HostSharingWidget';
import { useEffect } from 'react'
import BackupIcon from '@mui/icons-material/Backup';
const LeftDrawerComponent = () => {
  const theme = useTheme()
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0); // State for the active tab index
  const listTopBottomMargin = '0.5rem'
  const listItemSpacing = '8px'
  // useEffect(() => {
  //   setActiveTab(0)
  //   window.dispatchEvent(new CustomEvent("resize"));
  // }, []);
  
  return (
    <Drawer
      id="left-drawer"
      variant="permanent"
      PaperProps={{
        sx: {
          backgroundColor: theme.palette.lightBlack.main,
          color: 'white',
        },
      }}
      sx={{
        width: 300,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 300,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar sx={{ backgroundColor: 'red' }} />
      <Box id="drawerlist-wrapper" sx={{ height: '100%', overflow: 'auto' }}>
        <Tabs value={activeTab} onChange={
          (event, newValue) => {
            console.log("tab changed ", newValue);
            if (newValue===0) {
              navigate('/clientdashboard')
            } else if (newValue===1) {
              navigate('/hostdashboard')
            } else {
              console.error("uncaught error")
            }
            setActiveTab(newValue)
          }
        } variant="fullWidth"
         sx={{
          '& .MuiTabs-indicator': {
            backgroundColor: theme.palette.lightBlack.main,
          },
          '& .MuiButtonBase-root.MuiTab-root' : {
            borderRadius: "15px 15px 0 0",
            paddingTop: "1rem",
          },
          backgroundColor: theme.palette.darkBlack.main,
          '& .Mui-selected': {
            backgroundColor: theme.palette.lightBlack.main,
            paddingTop: "1rem",
            height: "3rem",
            color: 'white !important',
          },
          // '& .MuiButtonBase-root.MuiTab-root.Mui-selected': {
          //   borderRadius: "15px 15px 0 0",
          // }
        }}
        >
          <Tab label="Client" />
          <Tab label="Host" />
        </Tabs>
        <div role="tabpanel" hidden={activeTab !== 0}>
          {/* Content for Tab 1 */}
          <List disablePadding component="li" sx={{}}>
            <ListItemButton onClick={() => navigate('/clientdashboard')} key="dashboard">
            <DashboardIcon sx={{marginRight: listItemSpacing}} /> 
              <Typography margin={`${listTopBottomMargin} 0 ${listTopBottomMargin} 0`}>Dashboard</Typography>
            </ListItemButton>
          </List>
          <Divider />
          <List disablePadding component="li">
            <ListItemButton onClick={() => navigate('/clientbilling')} key="billing">
              <AccountBalanceWalletIcon sx={{marginRight: listItemSpacing}} />
              <Typography margin={`${listTopBottomMargin} 0 ${listTopBottomMargin} 0`}>Billing</Typography>
            </ListItemButton>
          </List>
          <Divider />
          <List disablePadding component="li">
            <ListItemButton sx={{
              '& .MuiButtonBase-root': {
                  height:"100%"
                },
                height:"100%"
              }} 
              onClick={() => navigate('/appview')} key="appview">
              <AppShortcutIcon  sx={{marginRight: listItemSpacing}} />
              <Typography margin={`${listTopBottomMargin} 0 ${listTopBottomMargin} 0`}>Installed Apps</Typography>
            </ListItemButton>
          </List>
          <Divider />
          <List disablePadding component="li">
            <ListItemButton onClick={() => navigate('/clientpayment')} key="billing">
              <PaidIcon sx={{marginRight: listItemSpacing}} />
              <Typography margin={`${listTopBottomMargin} 0 ${listTopBottomMargin} 0`}>PO Payment</Typography>
            </ListItemButton>
          </List>
          <Divider />
          <List disablePadding component="li">
            <ListItemButton onClick={() => navigate('/userjobsubmission')} key="billing">
              <BackupIcon sx={{marginRight: listItemSpacing}} />
              <Typography margin={`${listTopBottomMargin} 0 ${listTopBottomMargin} 0`}>Test Job Submission</Typography>
            </ListItemButton>
          </List>
          <Divider />
        </div>
        <div role="tabpanel" hidden={activeTab !== 1}>
          {/* Content for Tab 2 */}
          <List disablePadding component="li" >
            <HostSharingWidget />
          </List>
          <List disablePadding component="li">
            <ListItemButton onClick={() => navigate('/hostdashboard')} key="dashboard">
              <DashboardIcon sx={{marginRight: listItemSpacing}} /> 
              <Typography margin={`${listTopBottomMargin} 0 ${listTopBottomMargin} 0`}>Dashboard</Typography>
            </ListItemButton>
          </List>
          <Divider />
          <List disablePadding component="li">
            <ListItemButton onClick={() => navigate('/hostbilling')} key="billing">
              <PaidIcon sx={{marginRight: listItemSpacing}} />
              <Typography margin={`${listTopBottomMargin} 0 ${listTopBottomMargin} 0`}>Earnings</Typography>
            </ListItemButton>
          </List>
          <Divider />
          <List disablePadding component="li">
            <ListItemButton onClick={() => navigate('/hostpayment')} key="billing">
              <AccountBalanceWalletIcon sx={{marginRight: listItemSpacing}} />
              <Typography margin={`${listTopBottomMargin} 0 ${listTopBottomMargin} 0`}>PO Withdrawal</Typography>
            </ListItemButton>
          </List>
          <Divider />
        </div>
      </Box>
    </Drawer>
  );
};

export default LeftDrawerComponent

// const IOSSwitch = styled((props: SwitchProps) => (
//   <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
// ))(({ theme }) => ({
//   width: 42,
//   height: 26,
//   padding: 0,
//   '& .MuiSwitch-switchBase': {
//     padding: 0,
//     margin: 2,
//     transitionDuration: '300ms',
//     '&.Mui-checked': {
//       transform: 'translateX(16px)',
//       color: '#fff',
//       '& + .MuiSwitch-track': {
//         backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
//         opacity: 1,
//         border: 0,
//       },
//       '&.Mui-disabled + .MuiSwitch-track': {
//         opacity: 0.5,
//       },
//     },
//     '&.Mui-focusVisible .MuiSwitch-thumb': {
//       color: '#33cf4d',
//       border: '6px solid #fff',
//     },
//     '&.Mui-disabled .MuiSwitch-thumb': {
//       color:
//         theme.palette.mode === 'light'
//           ? theme.palette.grey[100]
//           : theme.palette.grey[600],
//     },
//     '&.Mui-disabled + .MuiSwitch-track': {
//       opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
//     },
//   },
//   '& .MuiSwitch-thumb': {
//     boxSizing: 'border-box',
//     width: 22,
//     height: 22,
//   },
//   '& .MuiSwitch-track': {
//     borderRadius: 26 / 2,
//     backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
//     opacity: 1,
//     transition: theme.transitions.create(['background-color'], {
//       duration: 500,
//     }),
//   },
// }));