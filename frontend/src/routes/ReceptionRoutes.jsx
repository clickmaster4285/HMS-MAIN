import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import DynamicLayout from "../layouts/DynamicLayout";
import ProtectedRoute from "../pages/auth/ProtectedRoute";

/* ================= Lazy Imports ================= */

// Dashboard
const Dashboard = lazy(() =>
  import("../pages/admin/dashboard/AdminDashboard")
);

// Room management
const Ward = lazy(() =>
  import("../pages/reception/ward/WardManagment")
);
const BedDetails = lazy(() =>
  import("../pages/reception/ward/BedDetails")
);

// OPD
const NewOpd = lazy(() =>
  import("../pages/reception/opd/NewOpd")
);
const ManageOpd = lazy(() =>
  import("../pages/reception/opd/ManageOpd")
);

// IPD
const IPDForm = lazy(() =>
  import("../pages/reception/ipd/Ipdform")
);
const IPDAdmission = lazy(() =>
  import("../pages/reception/ipd/Admision")
);
const AdmittedPatientDetails = lazy(() =>
  import("../pages/reception/ipd/AdmittedPatientDetails")
);

// Appointment
const PatientAppointment = lazy(() =>
  import("../pages/reception/appointment/PatientAppointment")
);
const DeletedAppointmentsPage = lazy(() =>
  import("../components/ui/DeletedAppointmentsPage")
);

// Inventory
const Inventory = lazy(() =>
  import("../pages/reception/inventory/Inventory")
);

// Accounts
const BillList = lazy(() =>
  import("../pages/reception/accounts/BillList")
);

// Pharmacy
const MedicineList = lazy(() =>
  import("../pages/reception/pharmacy/MedicalList")
);
const PrescriptionManagement = lazy(() =>
  import("../pages/reception/pharmacy/PrescriptionManagement")
);
const StockManagement = lazy(() =>
  import("../pages/reception/pharmacy/StockManagement")
);

// Calendar
const Calendar = lazy(() =>
  import("../pages/reception/calendar/Calendar")
);

// OT
const OTMain = lazy(() =>
  import("../pages/reception/operationTheater/OTMain")
);
const OTPatientDetails = lazy(() =>
  import("../pages/reception/operationTheater/OTPatientDetails")
);

// Refund
const RefundManagement = lazy(() =>
  import("../pages/reception/refund/AddRefund")
);
const OpdRefundList = lazy(() =>
  import("../pages/reception/refund/OpdRefundList")
);
const OpdRefundDetail = lazy(() =>
  import("../pages/reception/refund/RefundDeatil")
);

// Expenses & Summary
const Expenses = lazy(() =>
  import("../pages/reception/Expenses/expenses")
);
const Summary = lazy(() =>
  import("../pages/reception/summary/Summary")
);

/* ================= Component ================= */

const ReceptionRoutes = () => {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <Routes>
        <Route element={<ProtectedRoute allowedRoles={["Receptionist", "Admin"]} />}>
          <Route element={<DynamicLayout />}>

            {/* Dashboard */}
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />

            {/* Rooms */}
            <Route path="ward-management" element={<Ward />} />
            <Route path="beds/:bedId" element={<BedDetails />} />

            {/* IPD */}
            <Route path="ipd/ssp" element={<IPDForm mode="create" />} />
            <Route path="ipd/private" element={<IPDForm mode="create" />} />
            <Route path="ipd/edit/:mrNo" element={<IPDForm mode="edit" />} />
            <Route path="ipd/Admitted" element={<IPDAdmission />} />
            <Route path="patient-details/:mrno" element={<AdmittedPatientDetails />} />

            {/* OPD */}
            <Route path="opd/newopd" element={<NewOpd mode="create" />} />
            <Route path="opd/edit/:patientMRNo" element={<NewOpd mode="edit" />} />
            <Route path="opd/manage" element={<ManageOpd />} />

            {/* Appointment */}
            <Route path="patient-appointment" element={<PatientAppointment />} />
            <Route
              path="appointment/patient-appointment/deleted"
              element={<DeletedAppointmentsPage />}
            />

            {/* OT */}
            <Route path="OTMain" element={<OTMain />} />
            <Route path="OTPatientDetails/:mrno" element={<OTPatientDetails />} />

            {/* Inventory */}
            <Route path="inventory" element={<Inventory />} />

            {/* Accounts */}
            <Route path="account/bill-list" element={<BillList />} />

            {/* Pharmacy */}
            <Route path="Med-list" element={<MedicineList />} />
            <Route
              path="prescription-management"
              element={<PrescriptionManagement />}
            />
            <Route path="stock-management" element={<StockManagement />} />

            {/* Calendar */}
            <Route path="calendar" element={<Calendar />} />

            {/* Refund */}
            <Route path="refunds" element={<RefundManagement />} />
            <Route path="manage-refunds" element={<OpdRefundList />} />
            <Route path="refund/details/:id" element={<OpdRefundDetail />} />

            {/* Expenses */}
            <Route path="expenses" element={<Expenses />} />
            <Route path="summary" element={<Summary />} />

          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default ReceptionRoutes;
