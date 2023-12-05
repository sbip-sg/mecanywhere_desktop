import { useSelector } from 'react-redux';
import { RootState } from 'renderer/redux/store';

const useThemeTextColor = () => {
  const themeColor = useSelector((state: RootState) => state.themeReducer.color);
  return themeColor === 'light' ? 'text.secondary' : 'text.primary';
};

export default useThemeTextColor;