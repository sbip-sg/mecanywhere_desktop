import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import useIsLightTheme from 'renderer/utils/useIsLightTheme';
import List from '@mui/material/List';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ListAltIcon from '@mui/icons-material/ListAlt';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import { useNavigate } from 'react-router-dom';
import HostSharingWidget from './HostSharingWidget';

const LeftDrawerComponent = () => {
  const navigate = useNavigate();
  const listTopBottomMargin = '0.5rem';
  const listItemSpacing = '8px';
  const isLightTheme = useIsLightTheme();

  return (
    <Drawer
      id="left-drawer"
      variant="permanent"
      sx={{
        width: 325,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 325,
          boxSizing: 'border-box',
        },
        scrollbarGutter: 'stable',
      }}
    >
      <Toolbar />
      <Box
        id="drawerlist-wrapper"
        sx={{
          height: '100%',
          overflow: 'overlay',
          backgroundColor: isLightTheme ? '' : 'primary.dark',
        }}
      >
        <List disablePadding component="li">
          <HostSharingWidget />
          <Divider />
          <ListItemButton
            onClick={() => navigate('/txndashboard')}
            key="hosttxn"
          >
            {/* 
              
            */}
            <DashboardIcon
              sx={{ marginRight: listItemSpacing, color: 'text.primary' }}
            />
            <Typography
              margin={`${listTopBottomMargin} 0 ${listTopBottomMargin} 0`}
              sx={{ color: 'text.primary' }}
            >
              Dashboard
            </Typography>
          </ListItemButton>
        </List>
        <Divider />
        <List disablePadding component="li">
          <ListItemButton
            onClick={() => navigate('/billingdashboard')}
            key="billing"
          >
            <AccountBalanceIcon
              sx={{ marginRight: listItemSpacing, color: 'text.primary' }}
            />
            <Typography
              margin={`${listTopBottomMargin} 0 ${listTopBottomMargin} 0`}
              sx={{ color: 'text.primary' }}
            >
              Billing
            </Typography>
          </ListItemButton>
        </List>
        <Divider />
        <List disablePadding component="li">
          <ListItemButton
            onClick={() => {
              navigate('/payment');
            }}
            key="payment"
          >
            <MonetizationOnIcon
              sx={{ marginRight: listItemSpacing, color: 'text.primary' }}
            />
            <Typography
              margin={`${listTopBottomMargin} 0 ${listTopBottomMargin} 0`}
              sx={{ color: 'text.primary' }}
            >
              Payment
            </Typography>
          </ListItemButton>
        </List>
        <Divider />
        <List disablePadding component="li">
          <ListItemButton
            onClick={() => {
              navigate('/tasksmanagement');
            }}
            key="tasks"
          >
            <ListAltIcon
              sx={{ marginRight: listItemSpacing, color: 'text.primary' }}
            />
            <Typography
              margin={`${listTopBottomMargin} 0 ${listTopBottomMargin} 0`}
              sx={{ color: 'text.primary' }}
            >
              Tasks Management
            </Typography>
          </ListItemButton>
        </List>
        <Divider />
        <List disablePadding component="li">
          <ListItemButton
            onClick={() => {
              navigate('/test');
              console.log("aaa")
            }}
            key="test"
          >
            <ListAltIcon
              sx={{ marginRight: listItemSpacing, color: 'text.primary' }}
            />
            <Typography
              margin={`${listTopBottomMargin} 0 ${listTopBottomMargin} 0`}
              sx={{ color: 'text.primary' }}
            >
              Test
            </Typography>
          </ListItemButton>
        </List>
        <Divider />
      </Box>
    </Drawer>
  );
};

export default LeftDrawerComponent;
