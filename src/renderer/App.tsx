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
import ClientDashboard from './components/dashboard/ClientDashboard';
import HostDashboard from './components/dashboard/HostDashboard';
import ProviderDashboard from './components/dashboard/ProviderDashboard';
import Profile from './components/profile/Profile';
import ClientBilling from './components/billing/ClientBilling';
import HostBilling from './components/billing/HostBilling';
import AppView from './components/appview/AppView';
import NavigationLayoutTransitionWrapper from './components/navigation/NavigationLayoutTransitionWrapper';
import { RootState } from './redux/store';
import ClientPastTxn from './components/billing/ClientPastTxn';
import HostPastTxn from './components/billing/HostPastTxn';
import ClientPayment from './components/misc/ClientPayment';
import HostWithdrawal from './components/misc/HostWithdrawal';
import UserDashboard from './components/client/UserDashboard';
import TransactionDetails from './components/dashboard/TransactionDetails';
import RoleSelection from './components/auth/RoleSelection';
import UserManagement from './components/parentOrganization/UserManagement';
import ProviderPastTxn from './components/billing/ProviderPastTxn';
import ProviderBilling from './components/billing/ProviderBilling';
import ProviderPayment from './components/payment/ProviderPayment';
import Settings from './components/settings/Settings';

const PrivateRoutes = () => {
  const authenticated = useSelector(
    (state: RootState) => state.accountUser.authenticated
  );
  return authenticated ? <Outlet /> : <Navigate to="/clientdashboard" />;
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
          path="/userdashboard"
          element={
            <Transitions>
              <UserDashboard />
            </Transitions>
          }
        />
        <Route
          path="/clientdashboard"
          element={
            <Transitions>
              <ClientDashboard />
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
          path="/hostdashboard"
          element={
            <Transitions>
              <HostDashboard />
            </Transitions>
          }
        />
        <Route
          path="/clientbilling"
          element={
            <Transitions>
              <ClientBilling />
            </Transitions>
          }
        />
        <Route
          path="/hostbilling"
          element={
            <Transitions>
              <HostBilling />
            </Transitions>
          }
        />
        <Route
          path="/clientpasttxn"
          element={
            <Transitions>
              <ClientPastTxn />
            </Transitions>
          }
        />
        <Route
          path="/hostpasttxn"
          element={
            <Transitions>
              <HostPastTxn />
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
          path="/userjobsubmission"
          element={
            <Transitions>
              <UserDashboard />
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
          path="/providerdashboard"
          element={
            <Transitions>
              <ProviderDashboard />
            </Transitions>
          }
        />
        <Route
          path="/providerbilling"
          element={
            <Transitions>
              <ProviderBilling />
            </Transitions>
          }
        />
        <Route
          path="/providerpasttxn"
          element={
            <Transitions>
              <ProviderPastTxn />
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
  return (
    <Router>
      <NavigationLayoutTransitionWrapper>
        <NavigationLayout>
          <Animated />
        </NavigationLayout>
      </NavigationLayoutTransitionWrapper>
    </Router>
  );
}
