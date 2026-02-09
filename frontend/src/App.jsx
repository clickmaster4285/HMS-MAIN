import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import React, { Suspense, lazy } from "react";
import { selectCurrentUser } from './features/auth/authSlice';
import { MantineProvider } from "@mantine/core";
import { useSelector } from 'react-redux';

const ReceptionRoutes = lazy(() => import("./routes/ReceptionRoutes"));
const AdminRoutes = lazy(() => import("./routes/AdminRoutes"));
const ProfileRoutes = lazy(() => import("./pages/profile/profileRoutes"));
const RadiologyRoutes = lazy(() => import("./routes/RadiologyRoutes"));
const DoctorRoutes = lazy(() => import("./routes/DoctorRoutes"));
const LabRoutes = lazy(() => import("./routes/LabRoutes"));
const Landing_Page = lazy(() => import("./pages/landing-page/Index"));
const AuthRoutes = lazy(() => import("./routes/AuthRoutes"));

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const App = () => {
  const currentUser = useSelector(selectCurrentUser);
  const userAccess = currentUser?.user_Access?.toLowerCase();

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
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
        </Suspense>
      </Router>
    </MantineProvider>
  );
};

export default App;
