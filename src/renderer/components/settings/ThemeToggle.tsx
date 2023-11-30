import { Switch } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from 'renderer/redux/store';
import actions from '../../redux/actionCreators';

const ThemeToggle = () => {
  const handleModeChange = (event) => {
    actions.setColor(event.target.checked ? 'dark' : 'light');
    console.log('event.target.checked ', event.target.checked);
  };
  return (
    <Switch
      checked={
        useSelector((state: RootState) => state.themeReducer.color) === 'dark'
      }
      onChange={handleModeChange}
    />
  );
};

export default ThemeToggle;
