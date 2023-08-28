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
              {/* <List disablePadding component="li">
                <ListItemButton
                  onClick={() => navigate('/providerbilling')}
                  key="billing"
                >
                  <AccountBalanceWalletIcon
                    sx={{ marginRight: listItemSpacing }}
                  />
                  <Typography
                    margin={`${listTopBottomMargin} 0 ${listTopBottomMargin} 0`}
                  >
                    Billing
                  </Typography>
                </ListItemButton>
              </List>
              <Divider /> */}
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
              <Tabs
                value={activeTab}
                onChange={(event, newValue) => {
                  console.log('tab changed ', newValue);
                  if (newValue === 0) {
                    navigate('/clienttxndashboard');
                  } else if (newValue === 1) {
                    navigate('/hosttxndashboard');
                  } else {
                    console.error('uncaught error');
                  }
                  setActiveTab(newValue);
                }}
                variant="fullWidth"
                sx={{
                  '& .MuiTabs-indicator': {
                    backgroundColor: theme.palette.lightBlack.main,
                  },
                  '& .MuiButtonBase-root.MuiTab-root': {
                    borderRadius: '15px 15px 0 0',
                    paddingTop: '1rem',
                  },
                  backgroundColor: theme.palette.darkBlack.main,
                  '& .Mui-selected': {
                    backgroundColor: theme.palette.lightBlack.main,
                    paddingTop: '1rem',
                    height: '3rem',
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
                  <ListItemButton
                    onClick={() => navigate('/clienttxndashboard')}
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
                    onClick={() => navigate('/clientbillingdashboard')}
                    key="billing"
                  >
                    <AccountBalanceWalletIcon
                      sx={{ marginRight: listItemSpacing }}
                    />
                    <Typography
                      margin={`${listTopBottomMargin} 0 ${listTopBottomMargin} 0`}
                    >
                      Billing
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
                    onClick={() => navigate('/appview')}
                    key="appview"
                  >
                    <AppShortcutIcon sx={{ marginRight: listItemSpacing }} />
                    <Typography
                      margin={`${listTopBottomMargin} 0 ${listTopBottomMargin} 0`}
                    >
                      Installed Apps
                    </Typography>
                  </ListItemButton>
                </List>
                <Divider />
                {/* <List disablePadding component="li">
                  <ListItemButton
                    sx={{
                      '& .MuiButtonBase-root': {
                        height: '100%',
                      },
                      height: '100%',
                    }}
                    onClick={() => navigate('/testpage')}
                    key="testpage"
                  >
                    <AppShortcutIcon sx={{ marginRight: listItemSpacing }} />
                    <Typography
                      margin={`${listTopBottomMargin} 0 ${listTopBottomMargin} 0`}
                    >
                      Test Page
                    </Typography>
                  </ListItemButton>
                </List> */}
                {/* <Divider />
      <List disablePadding component="li">
        <ListItemButton onClick={() => navigate('/clientpayment')} key="billing">
          <PaidIcon sx={{marginRight: listItemSpacing}} />
          <Typography margin={`${listTopBottomMargin} 0 ${listTopBottomMargin} 0`}>PO Payment</Typography>
        </ListItemButton>
      </List> */}
                <Divider />
                <List disablePadding component="li">
                  <ListItemButton
                    onClick={() => navigate('/userjobsubmission')}
                    key="billing"
                  >
                    <BackupIcon sx={{ marginRight: listItemSpacing }} />
                    <Typography
                      margin={`${listTopBottomMargin} 0 ${listTopBottomMargin} 0`}
                    >
                      Test Job Submission
                    </Typography>
                  </ListItemButton>
                </List>
                <Divider />
              </div>
              <div role="tabpanel" hidden={activeTab !== 1}>
                {/* Content for Tab 2 */}
                <List disablePadding component="li">
                  <HostSharingWidget />
                </List>
                <List disablePadding component="li">
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
                      Earnings
                    </Typography>
                  </ListItemButton>
                </List>
                <Divider />
                {/* <List disablePadding component="li">
        <ListItemButton onClick={() => navigate('/hostpayment')} key="billing">
          <AccountBalanceWalletIcon sx={{marginRight: listItemSpacing}} />
          <Typography margin={`${listTopBottomMargin} 0 ${listTopBottomMargin} 0`}>PO Withdrawal</Typography>
        </ListItemButton>
      </List>
      <Divider /> */}
              </div>
            </>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default LeftDrawerComponent;