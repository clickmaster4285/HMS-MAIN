import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import DynamicLayout from "../layouts/DynamicLayout";
import ProtectedRoute from "../pages/auth/ProtectedRoute";

/* ================= Lazy Imports ================= */

const RDashboard = lazy(() =>
  import("../pages/Radiology/dashboard/RDashboard")
);
const RadiologyPennal = lazy(() =>
  import("../pages/Radiology/RadiologyPennal")
);
const RediologyPatientDetail = lazy(() =>
  import("../pages/Radiology/RediologyPatientDetail")
);
const RadiologySummer = lazy(() =>
  import("../pages/Radiology/RadiologySummer")
);
const CreateRadiologyReport = lazy(() =>
  import("../pages/Radiology/CreateRadiologyReport")
);
const RadiologyForm = lazy(() =>
  import("../pages/Radiology/RadiologyForm")
);

/* ================= Component ================= */

const RadiologyRoutes = () => {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
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
    </Suspense>
  );
};

export default RadiologyRoutes;
