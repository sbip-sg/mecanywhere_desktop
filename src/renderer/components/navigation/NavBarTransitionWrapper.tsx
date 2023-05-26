import Transitions from '../Transition';
import { useSelector } from 'react-redux';

const NavBarTransitionWrapper = ({ children }) => {
  return useSelector((state) => state.accountUser.authenticated) ? (
    <Transitions>{children}</Transitions>
  ) : (
    <>{children}</>
  );
};

export default NavBarTransitionWrapper;
