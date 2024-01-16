import List from '@mui/material/List';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import useIsLightTheme from 'renderer/components/common/useIsLightTheme';
import actions from '../../../redux/actionCreators';

const ClientTab = () => {
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
        <ListItemButton
          onClick={() => navigate('/clienttxndashboard')}
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
          <AccountBalanceIcon
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

export default ClientTab;
