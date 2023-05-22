import {
  MemoryRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import { Outlet, Navigate } from 'react-router';
import { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import NavBar from './components/navigation/NavBar';

const Register = lazy(() => import('./components/auth/Register'));
const Login = lazy(() => import('./components/auth/Login'));
const Mnemonics = lazy(() => import('./components/auth/Mnemonics'));
const UserJobSubmission = lazy(() => import('./components/client/UserJobSubmission'));
const UserDashboard = lazy(() => import('./components/client/UserDashboard'));
const HostDashboard = lazy(() => import('./components/host/HostDashboard'));
const Profile = lazy(() => import('./components/profile/Profile'));
const Billing = lazy(() => import('./components/payment/Billing'));
const Support = lazy(() => import('./components/misc/Support'));

function PrivateRoutes({ element, ...rest }) {
  return useSelector((state) => state.accountUser.authenticated) ? (
    <Outlet />
  ) : (
    <Navigate to="/Userjobsubmission" />
  );
}

export default function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <NavBar>
          <Routes>
            {window.electron.store.get('did') === '' ? (
              <Route path="/" element={<Register />} />
            ) : (
              <Route path="/" element={<Login />} />
            )}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/mnemonics" element={<Mnemonics />} />
            <Route element={<PrivateRoutes />}>
              <Route
                path="/userjobsubmission"
                element={<UserJobSubmission />}
              />
              <Route path="/userdashboard" element={<UserDashboard />} />
              <Route path="/hostdashboard" element={<HostDashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/support" element={<Support />} />
            </Route>
          </Routes>
        </NavBar>
      </Suspense>
    </Router>
  );
}
