import { useSelector } from 'react-redux';
import { RootState } from 'renderer/redux/store';

const useIsLightTheme = () => {
  const themeColor = useSelector(
    (state: RootState) => state.themeReducer.color
  );
  return themeColor === 'light';
};

export default useIsLightTheme;
