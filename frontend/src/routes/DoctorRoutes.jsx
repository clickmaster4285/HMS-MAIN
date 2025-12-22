import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import DynamicLayout from "../layouts/DynamicLayout";
import ProtectedRoute from "../pages/auth/ProtectedRoute";

/* ================= Lazy Imports ================= */

// Dashboard
const DoctorDashboard = lazy(() =>
  import("../pages/doctor/Dashboard/Component1")
);

// Appointments
const Appointment = lazy(() =>
  import("../pages/doctor/appointments/Appointment")
);

// Patients
const PatientRecords = lazy(() =>
  import("../pages/doctor/patientrecords/PatientRecord")
);
const PatientDetails = lazy(() =>
  import("../pages/doctor/patientrecords/PatientDetails")
);

// Prescription
const Prescription = lazy(() =>
  import("../pages/doctor/presption/Prescription")
);

// Reports
const Report = lazy(() =>
  import("../pages/doctor/reports/Report")
);

// Notes
const Note = lazy(() =>
  import("../pages/doctor/notes/Notes")
);

// Settings
const Settings = lazy(() =>
  import("../pages/doctor/settings/Settings")
);

/* ================= Component ================= */

const DoctorRoutes = () => {
  return (
    <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
      <Routes>
        <Route
          element={<ProtectedRoute allowedRoles={["Doctor", "Admin"]} />}
        >
          <Route element={<DynamicLayout />}>

            {/* Default */}
            <Route index element={<Navigate to="dashboard" replace />} />

            {/* Dashboard */}
            <Route path="dashboard" element={<DoctorDashboard />} />

            {/* Appointments */}
            <Route path="book-appointments" element={<Appointment />} />

            {/* Patients */}
            <Route path="patient-records" element={<PatientRecords />} />
            <Route
              path="patient-records/:patientId"
              element={<PatientDetails />}
            />

            {/* Prescriptions */}
            <Route path="prescriptions" element={<Prescription />} />

            {/* Reports */}
            <Route path="reports" element={<Report />} />

            {/* Notes */}
            <Route path="notes" element={<Note />} />

            {/* Settings */}
            <Route path="settings" element={<Settings />} />

          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default DoctorRoutes;
