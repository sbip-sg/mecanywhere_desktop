import { useSelector } from 'react-redux';
import { ReactNode, FC } from 'react';
import Transitions from '../transitions/Transition';
import { RootState } from '../../redux/store';

interface NavigationLayoutTransitionWrapperProps {
  children: ReactNode;
}

const NavigationLayoutTransitionWrapper: FC<
  NavigationLayoutTransitionWrapperProps
> = ({ children }) => {
  return useSelector((state: RootState) => state.userReducer.authenticated) ? (
    <Transitions>{children}</Transitions>
  ) : (
    <div id="navigationlayouttransitionwrapper">{children}</div>
  );
};

export default NavigationLayoutTransitionWrapper;
