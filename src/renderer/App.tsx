import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import { Outlet, Navigate } from "react-router";
import ClientJobSubmission from "./components/ClientJobSubmission";
import ClientRegistration from "./components/ClientRegistration";
import HostRegistration from "./components/HostRegistration";
import ClientDashboard from "./components/ClientDashboard";
import HostDashboard from "./components/HostDashboard";
import NavBar from "./components/NavBar"
import Profile from "./components/Profile";
import Billing from "./components/Billing";
import Support from "./components/Support";
import Wallet from "./components/Wallet";
import Login from "./components/Login";
import Register from "./components/Register";
import { useSelector } from "react-redux";

function PrivateRoutes({ element, ...rest }) {
  return useSelector((state) => state.user.authenticated) ? <Outlet /> : <Navigate to="/clientjobsubmission" />
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
              <Route path="/clientjobsubmission" element={<ClientJobSubmission />} />
              <Route path="/clientregistration" element={<ClientRegistration />} />
              <Route path="/hostregistration" element={<HostRegistration />} />
              <Route path="/clientdashboard" element={<ClientDashboard />} />
              <Route path="/hostdashboard" element={<HostDashboard />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/support" element={<Support />} />          
              </Route>
          </Routes>
        </NavBar>
    </Router>
  );
}

// export default function App() {
//   return (
//     <Router>
//       <NavBar>
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <PrivateRoute path="/" element={<ClientJobSubmission />} />
//           <PrivateRoute
//             path="/clientregistration"
//             element={<ClientRegistration />}
//           />
//           <PrivateRoute path="/hostregistration" element={<HostRegistration />} />
//           <PrivateRoute path="/clientdashboard" element={<ClientDashboard />} />
//           <PrivateRoute path="/hostdashboard" element={<HostDashboard />} />
//           <PrivateRoute path="/wallet" element={<Wallet />} />
//           <PrivateRoute path="/profile" element={<Profile />} />
//           <PrivateRoute path="/billing" element={<Billing />} />
//           <PrivateRoute path="/support" element={<Support />} />
//         </Routes>
//       </NavBar>
//     </Router>
//   );
// }

