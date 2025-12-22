import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "../pages/auth/ProtectedRoute";

/* layout */
const DynamicLayout = lazy(() => import("../layouts/DynamicLayout"));

/* dashboard */
const DashboardPannel = lazy(() => import("../pages/labs/dashboard/DashboardPannel"));

/* patient management */
const AddPatienttest = lazy(() => import("../pages/labs/patientManagment/AddPatienttest"));
const PatientTests = lazy(() => import("../pages/labs/patientManagment/PatientTests"));
const EditPatientTest = lazy(() => import("../pages/labs/patientManagment/EditPatientTest"));

/* test management */
const AddTest = lazy(() => import("../pages/labs/testManagment/AddTest"));
const AllTests = lazy(() => import("../pages/labs/testManagment/AllTests"));
const TestsDetail = lazy(() => import("../pages/labs/testManagment/TestsDetail"));
const EditTest = lazy(() => import("../pages/labs/testManagment/AddTest"));

/* sample collection */
const SampleCollection = lazy(() => import("../pages/labs/SampleCollection/SampleCollection"));

/* test reports */
const TestReportPage = lazy(() => import("../pages/labs/testReport/TestReportPage"));
const UpdateReport = lazy(() => import("../pages/labs/testReport/updateReport"));
const ReportSummery = lazy(() => import("../pages/labs/testReport/ReportSummery"));
const CrtitcalForm = lazy(() => import("../pages/labs/critical Reports/CrtitcalForm"));

/* test billing */
const AllBillsPage = lazy(() => import("../pages/labs/testBilling/AllBills"));
const BillDetailPage = lazy(() => import("../pages/labs/testBilling/BillDetail"));
const LabBillSummary = lazy(() => import("../pages/labs/testBilling/LabBillSummary"));

/* radiology */
const CreateRadiologyReport = lazy(() => import("../pages/Radiology/CreateRadiologyReport"));
const RediologyPatientDetail = lazy(() => import("../pages/Radiology/RediologyPatientDetail"));
const RadiologyPennal = lazy(() => import("../pages/Radiology/RadiologyPennal"));
const RadiologyForm = lazy(() => import("../pages/Radiology/RadiologyForm"));
const RadiologySummer = lazy(() => import("../pages/Radiology/RadiologySummer"));

/* reception */
const Expenses = lazy(() => import("../pages/reception/ReceptionPages").then(m => ({ default: m.Expenses })));

const PageLoader = () => <div style={{ padding: 20 }}>Loading...</div>;

const LabRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<ProtectedRoute allowedRoles={["lab", "Admin"]} />}>
          <Route element={<DynamicLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />

            {/* dashboard */}
            <Route path="dashboard" element={<DashboardPannel />} />

            {/* patient management */}
            <Route path="patient-test" element={<AddPatienttest />} />
            <Route path="all-patients" element={<PatientTests />} />
            <Route path="patient-tests/edit/:id" element={<EditPatientTest />} />

            {/* test management */}
            <Route path="add-test" element={<AddTest />} />
            <Route path="all-tests" element={<AllTests />} />
            <Route path="test/:id" element={<TestsDetail />} />
            <Route path="test/edit/:id" element={<EditTest mode="edit" />} />

            {/* sample collection */}
            <Route path="sample-collection" element={<SampleCollection />} />
            <Route path="critical-reports" element={<CrtitcalForm />} />

            {/* test reports (duplicates removed, paths unchanged) */}
            <Route path="test-report" element={<TestReportPage />} />
            <Route path="update-report/:id" element={<UpdateReport />} />
            <Route path="test-report-Summery/:date" element={<ReportSummery />} />

            {/* billing */}
            <Route path="test-billing" element={<AllBillsPage />} />
            <Route path="bills/:id" element={<BillDetailPage />} />
            <Route path="bill-summery" element={<LabBillSummary />} />

            {/* radiology */}
            <Route path="createradiologyreport" element={<CreateRadiologyReport />} />
            <Route path="RadiologyForm" element={<RadiologyForm />} />
            <Route path="RadiologyPennal" element={<RadiologyPennal />} />
            <Route path="RediologyPatientDetail/:id" element={<RediologyPatientDetail />} />
            <Route path="radiology-summer/:date" element={<RadiologySummer />} />

            {/* expenses */}
            <Route path="expenses" element={<Expenses />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default LabRoutes;
