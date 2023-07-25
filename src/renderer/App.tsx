import {
  MemoryRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import { Outlet, Navigate } from 'react-router';
import { useSelector } from 'react-redux';
import NavBar from './components/navigation/NavBar';
import Transitions from './components/Transition';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Mnemonics from './components/auth/Mnemonics';
import UserDashboard from './components/client/UserDashboard';
import HostDashboard from './components/host/HostDashboard';
import Profile from './components/profile/Profile';
import Billing from './components/payment/Billing';
import Support from './components/misc/Support';
import NavBarTransitionWrapper from './components/navigation/NavBarTransitionWrapper';
import { RootState } from './redux/store';

const PrivateRoutes = () => {
  const authenticated = useSelector((state: RootState) => state.accountUser.authenticated);
  return authenticated ? <Outlet /> : <Navigate to="/userdashboard" />;
}

const Animated = () => {
  const location = useLocation();
  return (
    <Routes location={location} key={location.pathname}>
      {window.electron.store.get('did') === '' ? (
        <Route
          path="/"
          element={
            <Transitions>
              <Register />
            </Transitions>
          }
        />
      ) : (
        <Route
          path="/"
          element={
            <Transitions>
              <Login />
            </Transitions>
          }
        />
      )}
      <Route
        path="/login"
        element={
          <Transitions>
            <Login />
          </Transitions>
        }
      />
      <Route
        path="/register"
        element={
          <Transitions>
            <Register />
          </Transitions>
        }
      />
      <Route
        path="/mnemonics"
        element={
          <Transitions>
            <Mnemonics />
          </Transitions>
        }
      />
      <Route element={<PrivateRoutes />}>
        <Route
          path="/userdashboard"
          element={
            <Transitions>
              <UserDashboard />
            </Transitions>
          }
        />
        <Route
          path="/profile"
          element={
            <Transitions>
              <Profile />
            </Transitions>
          }
        />
        <Route
          path="/billing"
          element={
            <Transitions>
              <Billing />
            </Transitions>
          }
        />
        <Route
          path="/support"
          element={
            <Transitions>
              <Support />
            </Transitions>
          }
        />
        <Route
          path="/hostdashboard"
          element={
            <Transitions>
              <HostDashboard />
            </Transitions>
          }
        />
      </Route>
    </Routes>
  );
};

export default function App() {
  return (
    <Router>
      <NavBarTransitionWrapper>
        <NavBar>
          <Animated />
        </NavBar>
      </NavBarTransitionWrapper>
    </Router>
  );
}
