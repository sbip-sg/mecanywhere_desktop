import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import { useNavigate } from 'react-router-dom';
import actions from '../../../redux/actionCreators';
import RegistrationComponent from './RegistrationComponent';
import { deleteAccount } from '../../../electron-store';

interface DropDownComponentProps {
  handleClose: () => void;
}

const DropDownComponent: React.FC<DropDownComponentProps> = ({ handleClose }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    handleClose();
    actions.setAuthenticated(false);
    navigate('/login');
  };
  const handleDeleteAccount = () => {
    handleClose();
    deleteAccount();
    actions.setAuthenticated(false);
    navigate('/register');
  };

  return (
    <Box >
        <RegistrationComponent/>   
        <Divider />
        <List>
          <ListItemButton sx={{ textAlign: 'center' }} onClick={handleLogout}>
            <Typography>Log out</Typography>
          </ListItemButton>
          <ListItemButton onClick={handleDeleteAccount}>
            <Typography sx={{ textAlign: 'center' }}>Delete account</Typography>
          </ListItemButton>
        </List>
    </Box>
  );
};

export default DropDownComponent;
