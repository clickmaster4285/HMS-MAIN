import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import DynamicLayout from "../layouts/DynamicLayout";
import ProtectedRoute from "../pages/auth/ProtectedRoute";

/* ================= Lazy Imports ================= */

// Dashboard
const AdminDashboard = lazy(() =>
  import("../pages/admin/dashboard/AdminDashboard")
);

// Staff
const StaffPannel = lazy(() =>
  import("../pages/admin/staff/StaffPannel")
);
const StaffListPage = lazy(() =>
  import("../pages/admin/staff/StaffPannel")
);
const AddStaff = lazy(() =>
  import("../pages/admin/staff/AddStaff")
);

// Doctors
const DoctorPannel = lazy(() =>
  import("../pages/admin/doctor/DoctorPannel")
);
const AddNewDoctor = lazy(() =>
  import("../pages/admin/doctor/AddNewDoctor")
);
const DoctorDetails = lazy(() =>
  import("../pages/admin/doctor/DoctorDetails")
);

// Departments
const Departments = lazy(() =>
  import("../pages/admin/departments/Departments")
);

// Finance
const OpdFinance = lazy(() =>
  import("../pages/admin/finance/OpdFinance")
);
const IpdFinance = lazy(() =>
  import("../pages/admin/finance/IpdFinance")
);

// Reception
const ManageOpd = lazy(() =>
  import("../pages/reception/opd/ManageOpd")
);
const NewOpd = lazy(() =>
  import("../pages/reception/opd/NewOpd")
);

// Labs
const TestReportPage = lazy(() =>
  import("../pages/labs/testReport/TestReportPage")
);
const AllBillsPage = lazy(() =>
  import("../pages/labs/testBilling/AllBills")
);
const BillDetailPage = lazy(() =>
  import("../pages/labs/testBilling/BillDetail")
);

// Radiology
const RadiologyPanel = lazy(() =>
  import("../pages/Radiology/RadiologyPennal")
);

/* ================= Component ================= */

const AdminRoutes = () => {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <Routes>
        <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
          <Route element={<DynamicLayout />}>

            {/* Dashboard */}
            <Route path="dashboard" element={<AdminDashboard />} />

            {/* Staff */}
            <Route path="StaffPannel" element={<StaffPannel />} />
            <Route path="staff" element={<StaffListPage />} />
            <Route path="staff/new" element={<AddStaff />} />
            <Route path="staff/edit/:id" element={<AddStaff />} />

            {/* Doctors */}
            <Route path="doctors" element={<DoctorPannel />} />
            <Route path="add-doctor" element={<AddNewDoctor mode="create" />} />
            <Route
              path="edit-doctor/:doctorId"
              element={<AddNewDoctor mode="edit" />}
            />
            <Route
              path="doctor-details/:doctorId"
              element={<DoctorDetails />}
            />

            {/* OPD */}
            <Route path="OPD/manage" element={<ManageOpd />} />
            <Route path="opd/newopd" element={<NewOpd mode="create" />} />
            <Route
              path="opd/edit/:patientMRNo"
              element={<NewOpd mode="edit" />}
            />

            {/* Departments */}
            <Route path="departments" element={<Departments />} />

            {/* Radiology */}
            <Route path="RadiologyPennal" element={<RadiologyPanel />} />

            {/* Finance */}
            <Route path="opd-finance" element={<OpdFinance />} />
            <Route path="ipd-finance" element={<IpdFinance />} />

            {/* Labs */}
            <Route path="test-report" element={<TestReportPage />} />
            <Route path="test-billing" element={<AllBillsPage />} />
            <Route path="bills/:id" element={<BillDetailPage />} />

          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AdminRoutes;
