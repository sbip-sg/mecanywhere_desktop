import List from '@mui/material/List';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PaidIcon from '@mui/icons-material/Paid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import { useNavigate } from 'react-router-dom';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';

const ProviderTab = () => {
  const navigate = useNavigate();
  const listTopBottomMargin = '0.5rem';
  const listItemSpacing = '8px';
  return (
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
          <SupervisorAccountIcon sx={{ marginRight: listItemSpacing }} />
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
  );
};

export default ProviderTab;