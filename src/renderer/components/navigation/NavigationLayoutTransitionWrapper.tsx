import { useSelector } from 'react-redux';
import { ReactNode } from 'react';
import Transitions from '../transitions/Transition';
import { RootState } from '../../redux/store';

interface NavigationLayoutTransitionWrapperProps {
  children: ReactNode;
}

const NavigationLayoutTransitionWrapper: React.FC<
  NavigationLayoutTransitionWrapperProps
> = ({ children }) => {
  return useSelector((state: RootState) => state.accountUser.authenticated) ? (
    <Transitions>{children}</Transitions>
  ) : (
    <div id="CCCCC">{children}</div>
  );
};

export default NavigationLayoutTransitionWrapper;
