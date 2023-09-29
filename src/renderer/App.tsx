import {
  MemoryRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import { Outlet, Navigate } from 'react-router';
import { useSelector } from 'react-redux';
import NavigationLayout from './components/navigation/NavigationLayout';
import Transitions from './components/transitions/Transition';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Mnemonics from './components/auth/Mnemonics';
import Profile from './components/profile/Profile';
import AppView from './components/appview/AppView';
import NavigationLayoutTransitionWrapper from './components/navigation/NavigationLayoutTransitionWrapper';
import { RootState } from './redux/store';
import ClientTxnDashboard from './components/transactions/ClientTxnDashboard';
import HostTxnDashboard from './components/transactions/HostTxnDashboard';
import ProviderTxnDashboard from './components/transactions/ProviderTxnDashboard';
import ClientBillingDashboard from './components/billing/dashboard/ClientBillingDashboard';
import HostBillingDashboard from './components/billing/dashboard/HostBillingDashboard';
import ProviderBillingDashboard from './components/billing/dashboard/ProviderBillingDashboard';
import ClientBillingHistory from './components/billing/history/ClientBillingHistory';
import HostBillingHistory from './components/billing/history/HostBillingHistory';
import ProviderBillingHistory from './components/billing/history/ProviderBillingHistory';
import ClientPayment from './components/misc/ClientPayment';
import HostWithdrawal from './components/misc/HostWithdrawal';
import TransactionDetails from './components/transactions/TransactionDetails';
import RoleSelection from './components/auth/RoleSelection';
import UserManagement from './components/parentOrganization/UserManagement';
import ProviderPayment from './components/payment/ProviderPayment';
import Settings from './components/settings/Settings';
import useHeartbeatHook from './components/host/useHeartbeatHook';

const PrivateRoutes = () => {
  const authenticated = useSelector(
    (state: RootState) => state.accountUser.authenticated
  );
  return authenticated ? <Outlet /> : <Navigate to="/clienttxndashboard" />;
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
          path="/clienttxndashboard"
          element={
            <Transitions>
              <ClientTxnDashboard />
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
          path="/clientbillingdashboard"
          element={
            <Transitions>
              <ClientBillingDashboard />
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
          path="/clientbillinghistory"
          element={
            <Transitions>
              <ClientBillingHistory />
            </Transitions>
          }
        />
        <Route
          path="/hostbillinghistory"
          element={
            <Transitions>
              <HostBillingHistory />
            </Transitions>
          }
        />
        <Route
          path="/providerbillinghistory"
          element={
            <Transitions>
              <ProviderBillingHistory />
            </Transitions>
          }
        />
        <Route
          path="/appview"
          element={
            <Transitions>
              <AppView />
            </Transitions>
          }
        />
        <Route
          path="/clientpayment"
          element={
            <Transitions>
              <ClientPayment />
            </Transitions>
          }
        />
        <Route
          path="/hostpayment"
          element={
            <Transitions>
              <HostWithdrawal />
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
          path="/providerpayment"
          element={
            <Transitions>
              <ProviderPayment />
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

export default function App() {
  useHeartbeatHook();

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
