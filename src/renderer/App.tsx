import {
  MemoryRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import { Outlet, Navigate } from 'react-router';
import NavigationLayout from './components/navigation/NavigationLayout';
import Transitions from './components/transitions/Transition';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Mnemonics from './components/auth/Mnemonics';
import Profile from './components/profile/Profile';
import NavigationLayoutTransitionWrapper from './components/navigation/NavigationLayoutTransitionWrapper';
import HostTxnDashboard from './components/transactions/HostTxnDashboard';
import ProviderTxnDashboard from './components/transactions/ProviderTxnDashboard';
import HostBillingDashboard from './components/billing/dashboard/HostBillingDashboard';
import ProviderBillingDashboard from './components/billing/dashboard/ProviderBillingDashboard';
import TransactionDetails from './components/transactions/TransactionDetails';
import RoleSelection from './components/auth/RoleSelection';
import UserManagement from './components/userManagement/UserManagement';
import Settings from './components/settings/Settings';
import useHeartbeatHook from './utils/useHeartbeatHook';
import useHandleAppExitHook from './utils/useHandleAppExitHook';

const PrivateRoutes = () => {
  // const authenticated = useSelector(
  //   (state: RootState) => state.accountUser.authenticated
  // );
  // return authenticated ? <Outlet /> : <Navigate to="/clienttxndashboard" />;
  const authenticated = true;
  return authenticated ? <Outlet /> : <Navigate to="/login" />;
};

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
      <Route
        path="/roleselection"
        element={
          <Transitions>
            <RoleSelection />
          </Transitions>
        }
      />
      <Route element={<PrivateRoutes />}>
        <Route
          path="/profile"
          element={
            <Transitions>
              <Profile />
            </Transitions>
          }
        />
        <Route
          path="/hosttxndashboard"
          element={
            <Transitions>
              <HostTxnDashboard />
            </Transitions>
          }
        />
        <Route
          path="/providertxndashboard"
          element={
            <Transitions>
              <ProviderTxnDashboard />
            </Transitions>
          }
        />
        <Route
          path="/hostbillingdashboard"
          element={
            <Transitions>
              <HostBillingDashboard />
            </Transitions>
          }
        />
        <Route
          path="/providerbillingdashboard"
          element={
            <Transitions>
              <ProviderBillingDashboard />
            </Transitions>
          }
        />
        <Route
          path="/details/:sessionId"
          element={
            <Transitions>
              <TransactionDetails />
            </Transitions>
          }
        />
        <Route
          path="/usermanagement"
          element={
            <Transitions>
              <UserManagement />
            </Transitions>
          }
        />
        <Route
          path="/settings"
          element={
            <Transitions>
              <Settings />
            </Transitions>
          }
        />
      </Route>
    </Routes>
  );
};

const App = () => {
  useHeartbeatHook();
  useHandleAppExitHook();
  return (
    <Router>
      <NavigationLayoutTransitionWrapper>
        <NavigationLayout>
          <Animated />
        </NavigationLayout>
      </NavigationLayoutTransitionWrapper>
    </Router>
  );
};

export default App;
