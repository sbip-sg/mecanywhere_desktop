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
import Profile from './components/profile/Profile';
import ClientBilling from './components/billing/ClientBilling';
import HostBilling from './components/billing/HostBilling';
import AppView from './components/appview/AppView';
import DatagridTransition from './components/transitions/DatagridTransition'
import ClientDashboardNoChart from './components/dashboard/ClientDashboardNoChart';
import HostDashboardNoChart from './components/dashboard/HostDashboardNoChart';
import NavigationLayoutTransitionWrapper from './components/navigation/NavigationLayoutTransitionWrapper';
import { RootState } from './redux/store';
import ClientPastTxn from './components/billing/ClientPastTxn';
import HostPastTxn from './components/billing/HostPastTxn';
import ClientPayment from './components/misc/ClientPayment';
import HostWithdrawal from './components/misc/HostWithdrawal';

// import Support from './components/misc/Support';
// import Payment from './components/misc/Payment';
// import Dashboard from './components/dashboard/ClientDashboard'

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
      {/* <Route
        path="/payment"
        element={
            <Payment />
        }
      /> */}
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
          path="/profile"
          element={
            <Transitions>
              <Profile />
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
          path="/hostdashboard"
          element={
            <Transitions>
              <HostDashboard />
            </Transitions>
          }
        />
        <Route
          path="/clientdashboardnochart"
          element={
            <Transitions>
              <ClientDashboardNoChart />
            </Transitions>
          }
        />
        <Route
          path="/hostdashboardnochart"
          element={
            <DatagridTransition>
              <HostDashboardNoChart />
            </DatagridTransition>
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
