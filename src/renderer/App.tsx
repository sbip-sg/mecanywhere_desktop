import {
  MemoryRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import { Outlet, Navigate } from 'react-router';
import {
  ThemeProvider,
  CssBaseline,
  createTheme,
  PaletteMode,
} from '@mui/material';
import { StyledEngineProvider } from '@mui/material/styles';
import { Helmet } from 'react-helmet';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'renderer/redux/store';
import NavigationLayout from './components/navigation/NavigationLayout';
import Transitions from './utils/Transition';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import ImportSeedPhrase from './components/auth/ImportSeedPhrase';
import Mnemonics from './components/auth/Mnemonics';
import Profile from './components/profile/Profile';
import NavigationLayoutTransitionWrapper from './components/navigation/NavigationLayoutTransitionWrapper';
import TxnDashboard from './components/transactions/TxnDashboard';
import BillingDashboard from './components/billing/BillingDashboard';
import TransactionDetails from './components/transactions/TransactionDetails';
import Payment from './components/payment/Payment';
import Settings from './components/settings/Settings';
import { getDesignTokens } from './utils/theme';
import useHandleAppExitHook from './utils/useHandleAppExitHook';
import useClientHooks from './utils/useClientHooks';
// import useHeartbeatHook from './utils/useHeartbeatHook';

const PrivateRoutes = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.userReducer.authenticated
  );
  return isAuthenticated ? <Outlet /> : <Navigate to="/txndashboard" />;
};

const RootRoute = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.userReducer.authenticated
  );
  const did = window.electron.store.get('did');

  if (isAuthenticated) {
    return <Navigate to="/txndashboard" />;
  }
  return did === '' ? <Register /> : <Login />;
};

const Animated = () => {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route
        path="/"
        element={
          <Transitions>
            <RootRoute />
          </Transitions>
        }
      />

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
        path="/import-seed-phrase"
        element={
          <Transitions>
            <ImportSeedPhrase />
          </Transitions>
        }
      />
      <Route element={<PrivateRoutes />}>
        <Route
          path="/"
          element={
            <Transitions>
              <TxnDashboard />
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
          path="/txndashboard"
          element={
            <Transitions>
              <TxnDashboard />
            </Transitions>
          }
        />
        <Route
          path="/billingdashboard"
          element={
            <Transitions>
              <BillingDashboard />
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
          path="/settings"
          element={
            <Transitions>
              <Settings />
            </Transitions>
          }
        />
      </Route>
      <Route
        path="/payment"
        element={
          <Transitions>
            <Payment />
          </Transitions>
        }
      />
    </Routes>
  );
};

const App = () => {
  const mode: PaletteMode = useSelector(
    (state: RootState) => state.themeReducer.color
  ) as PaletteMode;
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);
  // useHeartbeatHook();
  useHandleAppExitHook();
  useClientHooks();
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Helmet>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Nunito+Sans&display=swap"
          />
        </Helmet>
        <Router>
          <NavigationLayoutTransitionWrapper>
            <NavigationLayout>
              <Animated />
            </NavigationLayout>
          </NavigationLayoutTransitionWrapper>
        </Router>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
