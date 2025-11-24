import {
  AddPatienttest,
  CreateRadiologyReport,
  RediologyPatientDetail,
  RadiologyPennal,
  RadiologySummer,
  PatientTests,
  DashboardPannel,
  AddTest,
  AllTests,
  EditTest,
  TestsDetail,
  ReportSummery,
  SampleCollection,
  TestReportPage,
  AllBillsPage,
  UpdateReport,
  BillDetailPage,
  EditPatientTest,
  LabBillSummary,
  RadiologyForm,
} from '../pages/labs/labsPages'
import { Navigate, Route, Routes } from 'react-router-dom';
import DynamicLayout from '../layouts/DynamicLayout';
import ProtectedRoute from '../pages/auth/ProtectedRoute';
import CrtitcalForm from '../pages/labs/critical Reports/CrtitcalForm';
import { Expenses} from '../pages/reception/ReceptionPages';

const LabRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={["lab", 'Admin',]} />}>
        <Route element={<DynamicLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          {/* dashboard  */}
          <Route path="dashboard" element={<DashboardPannel />} />

          {/* patient test routes */}
          <Route path="patient-test" element={<AddPatienttest />} />
          <Route path="all-patients" element={<PatientTests />} />
          <Route path="patient-tests/edit/:id" element={<EditPatientTest />} />

          {/* test managemnt routes */}
          <Route path="add-test" element={<AddTest />} />
          <Route path="all-tests" element={<AllTests />} />
          <Route path="test/:id" element={<TestsDetail />} />
          <Route path="test/edit/:id" element={<EditTest mode="edit" />} />

          {/* test samples */}
          <Route path="sample-collection" element={<SampleCollection />} />
          <Route path='critical-reports' element={<CrtitcalForm />} />

          {/* test reports */}
          <Route path='test-report' element={<TestReportPage />} />
          <Route path='update-report/:id' element={<UpdateReport />} />
          <Route path='test-report-Summery/:date' element={<ReportSummery />} />
          <Route path="test-report" element={<TestReportPage />} />
          <Route path="update-report/:id" element={<UpdateReport />} />
          <Route path="test-report-Summery/:date" element={<ReportSummery />} />
          {/* test billing */}
          <Route path="test-billing" element={<AllBillsPage />} />
          <Route path="bills/:id" element={<BillDetailPage />} />
          <Route
            path="createradiologyreport"
            element={<CreateRadiologyReport />}
          />
          <Route path='RadiologyForm' element={<RadiologyForm />} />
          <Route path="RadiologyPennal" element={<RadiologyPennal />} />
          <Route
            path="RediologyPatientDetail/:id"
            element={<RediologyPatientDetail />}
          />
          <Route
            path="radiology-summer/:date"
            element={<RadiologySummer />}
          />
          <Route path="expenses" element={<Expenses />} />
          <Route
            path="bill-summery"
            element={<LabBillSummary />}
          />
        </Route>
      </Route>
    </Routes>
  );
};

export default LabRoutes;
