// src/components/dashboard/Dashboard.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  StatCards,
  RevenueChart,
  DepartmentDistribution,
  DoctorsTable,
  PatientsOverview,
  LabTestsOverview,
  CriticalPatients,
  RecentAdmissions
} from './index';
import { LoadingSpinner, ErrorMessage } from '../../../components/Display/StatusComponents';
import { fetchAllDoctors } from '../../../features/doctor/doctorSlice';
import { fetchPatients } from '../../../features/patient/patientSlice';
import { fetchPatientTestAll } from '../../../features/patientTest/patientTestSlice';
import { getAllAdmittedPatients } from '../../../features/ipdPatient/IpdPatientSlice';
import { getAllWards } from '../../../features/ward/Wardslice';
import { getallDepartments } from '../../../features/department/DepartmentSlice';

const Dashboard = () => {
  const dispatch = useDispatch();

  // Fetch all data on component mount
  useEffect(() => {
    dispatch(fetchAllDoctors());
    dispatch(fetchPatients());
    dispatch(fetchPatientTestAll());
    dispatch(getAllAdmittedPatients());
    dispatch(getAllWards());
    dispatch(getallDepartments());
  }, [dispatch]);

  // Get data from Redux store with proper loading states
  const {
    doctors = [],
    loading: doctorsLoading,
    error: doctorsError
  } = useSelector(state => state.doctor);

  const {
    patientsList: admittedPatients = [],  // From ipdPatient slice
    loading: admittedLoading,
    error: admittedError
  } = useSelector(state => state.ipdPatient);
 
  const {
    patients: opdPatients = [],
    loading: opdLoading,
    error: opdError
  } = useSelector(state => state.patients);

  const {
    allPatientTests: labTests = [],  // From patientTest slice
    loading: testsLoading,
    error: testsError
  } = useSelector(state => state.patientTest);

  const {
    departments = [],
    loading: deptLoading,
    error: deptError
  } = useSelector(state => state.department);

  const {
    allWards: wards = [],
    loading: wardsLoading,
    error: wardsError
  } = useSelector(state => state.ward);
  // Check if any data is still loading
  const isLoading = doctorsLoading || admittedLoading || opdLoading ||
    testsLoading || deptLoading || wardsLoading;

  // Check if any errors occurred
  const hasError = doctorsError || admittedError || opdError ||
    testsError || deptError || wardsError;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (hasError) {
    // Combine all error messages
    const errorMessages = [
      doctorsError,
      admittedError,
      opdError,
      testsError,
      deptError,
      wardsError
    ].filter(Boolean).join('\n');

    return <ErrorMessage error={errorMessages} />;
  }

  // Calculate statistics
  // Calculate average percentages and monetary values
  const totalDoctors = doctors.length;
  const avgHospitalPercentage = totalDoctors > 0
    ? doctors.reduce((sum, doctor) => sum + (doctor.doctor_Contract?.hospital_Percentage || 0), 0) / totalDoctors
    : 0;

  const avgDoctorPercentage = totalDoctors > 0
    ? doctors.reduce((sum, doctor) => sum + (doctor.doctor_Contract?.doctor_Percentage || 0), 0) / totalDoctors
    : 0;

  // Calculate monetary values based on revenues
  const totalOpdRevenue = opdPatients.reduce((sum, patient) =>
    sum + (patient.patient_HospitalInformation?.total_Fee || 0), 0);

  const totalIpdRevenue = admittedPatients.reduce((sum, patient) =>
    sum + (patient.financials?.total_Charges || 0), 0);

  const totalLabRevenue = labTests.reduce((sum, test) => sum + test.totalAmount, 0);

  const hospitalRevenueShare = (avgHospitalPercentage / 100) * (totalOpdRevenue + totalIpdRevenue);
  const doctorRevenueShare = (avgDoctorPercentage / 100) * (totalOpdRevenue + totalIpdRevenue);

  const totalAdmittedPatients = admittedPatients.length;
  const totalOpdPatients = opdPatients.length;
  const totalLabPatients = labTests.length;
  const totalExternalLabPatients = labTests.filter(test => test.isExternalPatient).length;
  const totalInternalLabPatients = totalLabPatients - totalExternalLabPatients;
  const totalTests = labTests.reduce((sum, test) => sum + test.selectedTests.length, 0);
  const totalTestRevenue = labTests.reduce((sum, test) => sum + test.totalAmount, 0);

  const totalWards = wards.length;
  const totalBeds = wards.reduce((sum, ward) => {
    // Access beds either from ward.beds or ward.assignedBed
    const bedsArray = ward.beds || ward.assignedBed || [];
    return sum + bedsArray.length;
  }, 0);

  const totalDepartments = departments.length;

  // Critical patients (filter those with critical status)
  const criticalPatients = admittedPatients.filter(patient =>
    patient.status === 'Critical' || patient.financials?.payment_Status === 'Unpaid'
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">Hospital Overview</h1>

          {/* Stat Cards */}
          <StatCards
            totalAdmittedPatients={totalAdmittedPatients}
            totalOpdPatients={totalOpdPatients}
            avgHospitalPercentage={avgHospitalPercentage}
            avgDoctorPercentage={avgDoctorPercentage}
            hospitalRevenueShare={hospitalRevenueShare}
            doctorRevenueShare={doctorRevenueShare}
            totalWards={totalWards}
            totalBeds={totalBeds}
            totalDepartments={totalDepartments}
            totalOpdRevenue={totalOpdRevenue}
            totalIpdRevenue={totalIpdRevenue}
            totalLabRevenue={totalLabRevenue}
            totalInternalLabPatients={totalInternalLabPatients}
            totalExternalLabPatients={totalExternalLabPatients}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Chart */}
            <div className="lg:col-span-2">
              <RevenueChart
                admittedPatients={admittedPatients}
                opdPatients={opdPatients}
              />
            </div>

            {/* Department Distribution */}
            <div className="lg:col-span-1">
              <DepartmentDistribution
                departments={departments}
                doctors={doctors}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Doctors Table */}
            <DoctorsTable
              doctors={doctors}
              opdPatients={opdPatients}
              admittedPatients={admittedPatients}
            />

            {/* Patients Overview */}
            <PatientsOverview
              admittedPatients={admittedPatients}
              opdPatients={opdPatients}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lab Tests Overview */}
            <LabTestsOverview
              patientTests={labTests}  // Changed from patientTests to labTests
              totalTests={totalTests}
              totalTestRevenue={totalTestRevenue}
            />

            {/* Critical Patients */}
            <CriticalPatients patients={criticalPatients} />
          </div>

          {/* Recent Admissions */}
          <RecentAdmissions patients={admittedPatients.slice(0, 5)} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;