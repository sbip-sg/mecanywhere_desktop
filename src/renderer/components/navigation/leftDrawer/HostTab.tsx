import List from '@mui/material/List';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PaidIcon from '@mui/icons-material/Paid';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import { Box } from '@mui/material';
import useIsLightTheme from 'renderer/components/common/useIsLightTheme';
import { useNavigate } from 'react-router-dom';
import HostSharingWidget from './HostSharingWidget/HostSharingWidget';
import actions from '../../../redux/actionCreators';

const HostTab = () => {
  const navigate = useNavigate();
  const listTopBottomMargin = '0.5rem';
  const listItemSpacing = '8px';
  const isLightTheme = useIsLightTheme();

  return (
    <Box
      sx={{
        backgroundColor: isLightTheme ? '' : 'primary.dark',
        height: '100%',
      }}
    >
      <List disablePadding component="li">
        <HostSharingWidget />
        <Divider />
        <ListItemButton
          onClick={() => navigate('/hosttxndashboard')}
          key="hosttxn"
        >
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
          onClick={() => navigate('/hostbillingdashboard')}
          key="hostbilling"
        >
          <PaidIcon
            sx={{ marginRight: listItemSpacing, color: 'text.primary' }}
          />
          <Typography
            margin={`${listTopBottomMargin} 0 ${listTopBottomMargin} 0`}
            sx={{ color: 'text.primary' }}
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
          <SwapHorizIcon
            sx={{ marginRight: listItemSpacing, color: 'text.primary' }}
          />
          <Typography
            margin={`${listTopBottomMargin} 0 ${listTopBottomMargin} 0`}
            sx={{ color: 'text.primary' }}
          >
            Switch To Provider View (Dev)
          </Typography>
        </ListItemButton>
      </List>
      <Divider />
    </Box>
  );
};

export default HostTab;
