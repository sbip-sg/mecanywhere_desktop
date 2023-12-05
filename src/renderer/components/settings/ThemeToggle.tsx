import { useSelector } from 'react-redux';
import { RootState } from 'renderer/redux/store';
import { IconButton } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import actions from '../../redux/actionCreators';

const ThemeToggle = () => {
  const currentColor = useSelector(
    (state: RootState) => state.themeReducer.color
  );
  const handleModeChange = () => {
    const newColor = currentColor === 'light' ? 'dark' : 'light';
    actions.setColor(newColor);
  };

  return (
    <IconButton onClick={handleModeChange}>
      {currentColor === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
    </IconButton>
  );
};

export default ThemeToggle;
