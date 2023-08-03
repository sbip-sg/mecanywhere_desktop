import Transitions from '../transitions/Transition';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { ReactNode } from 'react';

interface NavigationLayoutTransitionWrapperProps {
  children: ReactNode;
}

const NavigationLayoutTransitionWrapper: React.FC<NavigationLayoutTransitionWrapperProps> = ({ children }) => { 
  return useSelector((state: RootState) => state.accountUser.authenticated) ? (
    <Transitions>{children}</Transitions>
  ) : (
    <div id="CCCCC">{children}</div >
  );
};

export default NavigationLayoutTransitionWrapper;
