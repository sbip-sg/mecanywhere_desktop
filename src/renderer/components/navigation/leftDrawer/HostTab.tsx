import List from '@mui/material/List';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PaidIcon from '@mui/icons-material/Paid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@emotion/react';
import HostSharingWidget from './HostSharingWidget/HostSharingWidget';
import actions from '../../../redux/actionCreators';
import deleteAccount from 'renderer/electron-store';

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
        <ListItemButton
          onClick={() => {
            navigate('/providertxndashboard');
            // deleteAccount();
            actions.setRole('provider');
          }}
          key="switch_view_to_provider"
        >
          <PaidIcon sx={{ marginRight: listItemSpacing }} />
          <Typography
            margin={`${listTopBottomMargin} 0 ${listTopBottomMargin} 0`}
          >
            Switch To Provider View (Dev)
          </Typography>
        </ListItemButton>
      </List>
      <Divider />
    </>
  );
};

export default HostTab;
