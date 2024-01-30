import { IconButton } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import actions from '../../redux/actionCreators';
import useIsLightTheme from '../../utils/useIsLightTheme';

const ThemeToggle = () => {
  const isLightTheme = useIsLightTheme();
  const handleModeChange = () => {
    const newColor = isLightTheme ? 'dark' : 'light';
    actions.setColor(newColor);
  };

  return (
    <IconButton onClick={handleModeChange}>
      {isLightTheme ? <DarkModeIcon /> : <LightModeIcon />}
    </IconButton>
  );
};

export default ThemeToggle;
