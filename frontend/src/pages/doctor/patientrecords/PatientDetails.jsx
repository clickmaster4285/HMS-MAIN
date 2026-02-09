import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPatientById } from '../../../features/patient/patientSlice';
const API_URL = import.meta.env.VITE_API_URL;

import {
  FaUser, FaIdCard, FaPhone, FaMapMarkerAlt,
  FaHeartbeat, FaNotesMedical, FaCalendarAlt,
  FaUserShield, FaFileMedicalAlt, FaProcedures
} from 'react-icons/fa';
import { getRoleRoute } from '../../../utils/getRoleRoute';

const PatientDetails = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
const { selectedPatient: currentPatient, selectedPatientStatus: status, error } = useSelector(state => state.patients);


  useEffect(() => {
    if (patientId) {
      dispatch(fetchPatientById(patientId));
    }
  }, [patientId, dispatch]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentPatient) {
    return <div className="text-center py-8 text-primary-500">No patient data found</div>;
  }
  // Safely get nested properties
  const patientData = {
    name: currentPatient.patient_Name || 'N/A',
    mrNo: currentPatient.patient_MRNo || 'N/A',
    bloodType: currentPatient.patient_BloodType || 'N/A',
    age: currentPatient.patient_Age || 'N/A',
    dob: currentPatient.patient_DateOfBirth || null,
    contact: currentPatient.patient_ContactNo || 'N/A',
    address: currentPatient.patient_Address || 'N/A',
    cnic: currentPatient.patient_CNIC || 'N/A',
    maritalStatus: currentPatient.patient_MaritalStatus || 'N/A',
    allergies: currentPatient.patient_Allergies || 'None reported',
    conditions: currentPatient.patient_ChronicConditions || 'None reported',
    medications: currentPatient.patient_Medications || [],
    guardian: currentPatient.patient_Guardian || {},
    hospitalInfo: currentPatient.patient_HospitalInformation || {},
    createdAt: currentPatient.createdAt || null
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <button
          onClick={() => navigate(getRoleRoute('patient-records'))}
          className="text-primary-600 hover:text-primary-800"
        >
          Patient Records
        </button>
        <span className="mx-2">/</span>
        <span>Details</span>
      </div>

      {/* Patient Header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="bg-linear-to-r from-primary-500 to-primary-700 p-6 text-white">
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <div className="mr-6 mb-4 md:mb-0">
              <img
                src={`https://api.dicebear.com/6.x/avataaars/svg?seed=${encodeURIComponent(patientData.mrNo || patientData.name || "Patient")}`}
                alt={patientData.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{patientData.name}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="bg-white text-primary-600 text-xs px-3 py-1 rounded-full font-semibold">
                  MR: {patientData.mrNo}
                </span>
                {patientData.bloodType !== 'N/A' && (
                  <span className="bg-white text-primary-600 text-xs px-3 py-1 rounded-full font-semibold">
                    Blood: {patientData.bloodType}
                  </span>
                )}
                <span className="bg-white text-primary-600 text-xs px-3 py-1 rounded-full font-semibold">
                  Age: {patientData.age}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaUser className="mr-2 text-primary-600" />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem icon={<FaIdCard />} label="MR Number" value={patientData.mrNo} />
              <DetailItem icon={<FaCalendarAlt />} label="Date of Birth" value={formatDate(patientData.dob)} />
              <DetailItem icon={<FaPhone />} label="Contact" value={patientData.contact} />
              <DetailItem icon={<FaMapMarkerAlt />} label="Address" value={patientData.address} />
              <DetailItem icon={<FaFileMedicalAlt />} label="CNIC" value={patientData.cnic} />
              <DetailItem icon={<FaHeartbeat />} label="Marital Status" value={patientData.maritalStatus} />
            </div>
          </div>

          {/* Medical Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaNotesMedical className="mr-2 text-primary-600" />
              Medical Information
            </h2>
            <div className="space-y-4">
              <DetailItem icon={<FaHeartbeat />} label="Blood Type" value={patientData.bloodType} />
              <DetailItem icon={<FaProcedures />} label="Allergies" value={patientData.allergies} />
              <DetailItem icon={<FaFileMedicalAlt />} label="Chronic Conditions" value={patientData.conditions} />
              <DetailItem icon={<FaNotesMedical />} label="Current Medications" value={
                patientData.medications.length > 0 ?
                  patientData.medications.map(med => `${med.name} (${med.dosage})`).join(', ') :
                  'None'
              } />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Guardian Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaUserShield className="mr-2 text-primary-600" />
              Guardian Information
            </h2>
            <div className="space-y-4">
              <DetailItem label="Name" value={patientData.guardian.guardian_Name || 'N/A'} />
              <DetailItem label="Relation" value={patientData.guardian.guardian_Relation || 'N/A'} />
              <DetailItem label="Contact" value={patientData.guardian.guardian_Contact || 'N/A'} />
            </div>
          </div>

          {/* Hospital Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaProcedures className="mr-2 text-primary-600" />
              Hospital Information
            </h2>
            <div className="space-y-4">
              <DetailItem label="Doctor" value={patientData.hospitalInfo.doctor_Name || 'N/A'} />
              <DetailItem label="Department" value={patientData.hospitalInfo.doctor_Department || 'N/A'} />
              <DetailItem label="Specialization" value={patientData.hospitalInfo.doctor_Specialization || 'N/A'} />
              <DetailItem label="Consultation Fee" value={`Rs. ${patientData.hospitalInfo.doctor_Fee || '0'}`} />
              <DetailItem label="Referred By" value={patientData.hospitalInfo.referredBy || 'N/A'} />
              <DetailItem label="Registration Date" value={formatDate(patientData.createdAt)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Detail Item Component
const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start">
    {icon && <span className="mr-3 text-primary-500 mt-1">{icon}</span>}
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-base font-normal text-gray-800">{value || 'N/A'}</p>
    </div>
  </div>
);

export default PatientDetails;