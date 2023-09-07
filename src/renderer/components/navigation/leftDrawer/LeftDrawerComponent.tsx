import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useState, useEffect } from 'react';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PaidIcon from '@mui/icons-material/Paid';
import AppShortcutIcon from '@mui/icons-material/AppShortcut';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@emotion/react';
import { Tab, Tabs } from '@mui/material';
import BackupIcon from '@mui/icons-material/Backup';
import { useSelector } from 'react-redux';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import HostSharingWidget from './HostSharingWidget';
import { RootState } from '../../redux/store';

const LeftDrawerComponent = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0); // State for the active tab index
  const listTopBottomMargin = '0.5rem';
  const listItemSpacing = '8px';

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
        width: 325,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 325,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar sx={{ backgroundColor: 'red' }} />
      <Box id="drawerlist-wrapper" sx={{ height: '100%', overflow: 'auto' }}>
        <Box id="drawerlist-wrapper" sx={{ height: '100%', overflow: 'auto' }}>
          {useSelector((state: RootState) => state.isProvider.isProvider) ? (
            // for provider
            <>
              <List disablePadding component="li" sx={{}}>
                <ListItemButton
                  onClick={() => navigate('/providertxndashboard')}
                  key="dashboard"
                >
                  <DashboardIcon sx={{ marginRight: listItemSpacing }} />
                  <Typography
                    margin={`${listTopBottomMargin} 0 ${listTopBottomMargin} 0`}
                  >
                    Dashboard
                  </Typography>
                </ListItemButton>
              </List>
              <Divider />
              <List disablePadding component="li">
                <ListItemButton
                  sx={{
                    '& .MuiButtonBase-root': {
                      height: '100%',
                    },
                    height: '100%',
                  }}
                  onClick={() => navigate('/usermanagement')}
                  key="usermanagement"
                >
                  <SupervisorAccountIcon
                    sx={{ marginRight: listItemSpacing }}
                  />
                  <Typography
                    margin={`${listTopBottomMargin} 0 ${listTopBottomMargin} 0`}
                  >
                    Manage Users
                  </Typography>
                </ListItemButton>
              </List>
              <Divider />
              <List disablePadding component="li">
                <ListItemButton
                  onClick={() => navigate('/providerpayment')}
                  key="billing"
                >
                  <PaidIcon sx={{ marginRight: listItemSpacing }} />
                  <Typography
                    margin={`${listTopBottomMargin} 0 ${listTopBottomMargin} 0`}
                  >
                    Settle Payment
                  </Typography>
                </ListItemButton>
              </List>
              <Divider />
            </>
          ) : (
            <>
              {/* <List disablePadding component="li">
              </List> */}
              
              <List disablePadding component="li">
                <HostSharingWidget />
                <Divider />
                <ListItemButton
                  onClick={() => navigate('/hosttxndashboard')}
                  key="dashboard"
                >
                  <DashboardIcon sx={{ marginRight: listItemSpacing }} />
                  <Typography
                    margin={`${listTopBottomMargin} 0 ${listTopBottomMargin} 0`}
                  >
                    Dashboard
                  </Typography>
                </ListItemButton>
              </List>
              <Divider />
              <List disablePadding component="li">
                <ListItemButton
                  onClick={() => navigate('/hostbillingdashboard')}
                  key="billing"
                >
                  <PaidIcon sx={{ marginRight: listItemSpacing }} />
                  <Typography
                    margin={`${listTopBottomMargin} 0 ${listTopBottomMargin} 0`}
                  >
                    Payout
                  </Typography>
                </ListItemButton>
              </List>
              <Divider />
            </>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default LeftDrawerComponent;
