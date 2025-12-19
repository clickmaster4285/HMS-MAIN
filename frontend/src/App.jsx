import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import React, { useEffect } from "react";
import { selectCurrentUser } from './features/auth/authSlice';
import { MantineProvider } from "@mantine/core";
import { useSelector } from 'react-redux';
import ReceptionRoutes from "./routes/ReceptionRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import ProfileRoutes from "./pages/profile/profileRoutes";
import RadiologyRoutes from "./routes/RadiologyRoutes";
import DoctorRoutes from "./routes/DoctorRoutes";
import LabRoutes from "./routes/LabRoutes";
import Landing_Page from "./pages/landing-page/Index";
import AuthRoutes from "./routes/AuthRoutes"
// import { setUser, logout } from "./features/auth/authSlice";
const API_URL = import.meta.env.VITE_REACT_APP_API_URL;



const App = () => {
  const currentUser = useSelector(selectCurrentUser);
  const userAccess = currentUser?.user_Access?.toLowerCase();

  

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing_Page />} />
          <Route path="/*" element={<AuthRoutes />} />

          {/* Protected routes */}
          {userAccess === 'admin' && <Route path="/admin/*" element={<AdminRoutes />} />}
          {userAccess === 'receptionist' && <Route path="/receptionist/*" element={<ReceptionRoutes />} />}
          {userAccess === 'lab' && <Route path="/lab/*" element={<LabRoutes />} />}
          {userAccess === 'doctor' && <Route path="/doctor/*" element={<DoctorRoutes />} />}
          <Route path="/radiology/*" element={<RadiologyRoutes />} />


          {/* Unified profile route */}
          <Route path="/profile" element={<ProfileRoutes />} />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </MantineProvider>
  );
};

export default App;
