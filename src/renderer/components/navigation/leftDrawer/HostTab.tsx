import List from '@mui/material/List';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PaidIcon from '@mui/icons-material/Paid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@emotion/react';
import HostSharingWidget from './HostSharingWidget/HostSharingWidget';

const HostTab = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const listTopBottomMargin = '0.5rem';
  const listItemSpacing = '8px';

  return (
    <>
      <List disablePadding component="li">
        <HostSharingWidget />
        <Divider />
        <ListItemButton
          onClick={() => navigate('/hosttxndashboard')}
          key="hosttxn"
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
          key="hostbilling"
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
      <List disablePadding component="li">
        <ListItemButton onClick={() => navigate('/testapi')} key="testapi">
          <PaidIcon sx={{ marginRight: listItemSpacing }} />
          <Typography
            margin={`${listTopBottomMargin} 0 ${listTopBottomMargin} 0`}
          >
            TestAPI
          </Typography>
        </ListItemButton>
      </List>
      <Divider />
    </>
  );
};

export default HostTab;
