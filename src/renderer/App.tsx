import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import { Outlet, Navigate } from "react-router";
import UserJobSubmission from "./components/UserJobSubmission";
import UserDashboard from "./components/UserDashboard";
import HostDashboard from "./components/HostDashboard";
import NavBar from "./components/NavBar"
import Profile from "./components/Profile";
import Billing from "./components/Billing";
import Support from "./components/Support";
import Login from "./components/Login";
import Register from "./components/Register";
import { useSelector } from "react-redux";

function PrivateRoutes({ element, ...rest }) {
  return useSelector((state) => state.accountUser.authenticated) ? <Outlet /> : <Navigate to="/Userjobsubmission" />
}

export default function App() {
  return (
    <Router>
        <NavBar>
      <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<PrivateRoutes />}>
              <Route path="/userjobsubmission" element={<UserJobSubmission />} />
              <Route path="/userdashboard" element={<UserDashboard />} />
              <Route path="/hostdashboard" element={<HostDashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/support" element={<Support />} />
              </Route>
          </Routes>
        </NavBar>
    </Router>
  );
}