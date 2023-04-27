import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
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

export default function App() {
  return (
    <Router>
        <NavBar>
      <Routes>
          <Route path="/" element={<ClientJobSubmission />} />
          <Route path="/clientregistration" element={<ClientRegistration />} />
          <Route path="/hostregistration" element={<HostRegistration />} />
          <Route path="/clientdashboard" element={<ClientDashboard />} />
          <Route path="/hostdashboard" element={<HostDashboard />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/support" element={<Support />} />
      </Routes>
        </NavBar>
    </Router>
  );
}