import { Routes, Route, Navigate } from "react-router-dom";
import DynamicLayout from "../layouts/DynamicLayout";
import ProtectedRoute from "../pages/auth/ProtectedRoute";

import RDashboard from "../pages/Radiology/dashboard/RDashboard";
import RadiologyPennal from "../pages/Radiology/RadiologyPennal";
import RediologyPatientDetail from "../pages/Radiology/RediologyPatientDetail";
import RadiologySummer from "../pages/Radiology/RadiologySummer";
import CreateRadiologyReport from "../pages/Radiology/CreateRadiologyReport";
import RadiologyForm from "../pages/Radiology/RadiologyForm";

const RadiologyRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={["Radiology", "Admin"]} />}>
        <Route element={<DynamicLayout />}>

          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<RDashboard />} />
          <Route path="panel" element={<RadiologyPennal />} />
          <Route path="create-report" element={<CreateRadiologyReport />} />
          <Route path="form/:id" element={<RadiologyForm />} />
          <Route path="patient/:id" element={<RediologyPatientDetail />} />
          <Route path="summary/:date" element={<RadiologySummer />} />

        </Route>
      </Route>
    </Routes>
  );
};

export default RadiologyRoutes;
