import Transitions from '../Transition';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { ReactNode } from 'react';

interface NavBarTransitionWrapperProps {
  children: ReactNode;
}

const NavBarTransitionWrapper: React.FC<NavBarTransitionWrapperProps> = ({ children }) => { 
  return useSelector((state: RootState) => state.accountUser.authenticated) ? (
    <Transitions>{children}</Transitions>
  ) : (
    <>{children}</>
  );
};

export default NavBarTransitionWrapper;
