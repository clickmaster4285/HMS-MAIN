import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { fetchDoctorById } from '../../../features/doctor/doctorSlice';
import { FaUserMd, FaIdCard, FaEnvelope, FaPhone, FaMapMarkerAlt, FaStethoscope, FaFileSignature, FaMoneyBillWave, FaFileContract } from 'react-icons/fa';
import DoctorPatients from './DoctorPatients';
import { getRoleRoute } from "../../../utils/getRoleRoute"

const DoctorDetails = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
  const { currentDoctor, patients = [], status, error } = useSelector(state => state.doctor);

  useEffect(() => {
    if (doctorId) {
      dispatch(fetchDoctorById(doctorId)).unwrap()
        .catch(error => {
          console.error('Failed to fetch doctor:', error);
          // You might want to navigate back or show a toast notification
        });
    }
  }, [doctorId, dispatch]);

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

  if (!currentDoctor) {
    return <div className="text-center py-8 text-primary-500">No doctor data found</div>;
  }

  // Format qualifications for display

  return (
    <div className="container mx-auto p-4 border border-primary-600 rounded-lg ">
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <button
          onClick={() => navigate(getRoleRoute('doctors'))}
          className="text-primary-600 hover:text-primary-800"
        >
          Doctors
        </button>
        <span className="mx-2">/</span>
        <span>Details</span>
      </div>

      {/* Header Section */}
      <div className="flex items-center mb-8">
        <div className="bg-primary-100 p-3 rounded-full mr-4">
          <FaUserMd className="text-primary-600 text-2xl" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Doctor Details</h1>
          <p className="text-primary-600">Complete professional information</p>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-primary-50 p-6 flex flex-col md:flex-row items-start md:items-center">
          <div className="mr-6 mb-4 md:mb-0">
            <img
              src={
                currentDoctor?.doctor_Image?.filePath
                  ? `${API_URL}${currentDoctor.doctor_Image.filePath}`
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(currentDoctor?.doctor_Image?.filePath
                    || "D")}&background=random`
              }
              alt={currentDoctor?.user.user_Name}
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentDoctor?.user.user_Name || "D")}&background=random`;
              }}
            />
          </div>
          <div>
            <h2 className="text-xl font-bold">{currentDoctor?.user.user_Name}</h2>
            <p className="text-primary-600">{currentDoctor?.user?.user_Identifier}</p>
            <div className="mt-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${currentDoctor?.doctor_Status === 'Available'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
                }`}>
                {currentDoctor?.doctor_Status || 'Status'}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="bg-primary-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-4 flex items-center">
                  <FaUserMd className="mr-2 text-primary-600" />
                  Basic Information
                </h3>
                <div className="space-y-3 ">
                  <DetailItem icon={<FaIdCard />} label="Name" value={currentDoctor?.user.user_Name} />
                  <DetailItem icon={<FaEnvelope />} label="Email" value={currentDoctor?.user.user_Email} />
                  <DetailItem icon={<FaPhone />} label="Contact" value={currentDoctor?.user.user_Contact} />
                  <DetailItem icon={<FaMapMarkerAlt />} label="Address" value={currentDoctor?.user.user_Address} />
                </div>
              </div>

              {/* Professional Information */}
              <div className="bg-primary-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-4 flex items-center">
                  <FaStethoscope className="mr-2 text-primary-600" />
                  Professional Information
                </h3>
                <div className="space-y-3">
                  <DetailItem label="Department" value={currentDoctor?.doctor_Department} />
                  <DetailItem label="Specialization" value={currentDoctor?.doctor_Specialization} />
                  <DetailItem label="Type" value={currentDoctor?.doctor_Type} />
                  <DetailItem label="License Number" value={currentDoctor?.doctor_LicenseNumber} />
                  <DetailItem label="Consultation Fee" value={currentDoctor?.doctor_Fee
                    ? `PKR-${currentDoctor.doctor_Fee
                    }` : 'N/A'} />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Qualifications */}
              <div className="bg-primary-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-4 flex items-center">
                  <FaFileSignature className="mr-2 text-primary-600" />
                  Qualifications
                </h3>
                <div className="space-y-2">
                  {currentDoctor?.doctor_Qualifications?.length > 0 ? (
                    <ul className="flex flex-col text-white space-y-2 pl-5">
                      {currentDoctor.doctor_Qualifications.map((qual, index) => (
                        <li key={index} className="py-1 rounded-b-lg bg-primary-600 px-3 ">{qual}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-primary-500">No qualifications listed</p>
                  )}
                </div>
              </div>

              {/* Contract Details */}
              <div className="bg-primary-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-4 flex items-center">
                  <FaFileContract className="mr-2 text-primary-600" />
                  Contract Details
                </h3>
                <div className="space-y-3">
                  <DetailItem label="Doctor Percentage" value={currentDoctor?.doctor_Contract?.doctor_Percentage ? `${currentDoctor.doctor_Contract.doctor_Percentage}%` : 'N/A'} />
                  <DetailItem label="Hospital Percentage" value={currentDoctor?.doctor_Contract?.hospital_Percentage ? `${currentDoctor.doctor_Contract.hospital_Percentage}%` : 'N/A'} />
                  <DetailItem label="Contract Time" value={currentDoctor?.doctor_Contract?.contract_Time} />
                  <DetailItem label="Joining Date" value={currentDoctor?.doctor_Contract?.doctor_JoiningDate ? new Date(currentDoctor.doctor_Contract.doctor_JoiningDate).toLocaleDateString() : 'N/A'} />
                </div>
              </div>

              {/* Documents */}
              <div className="bg-primary-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-4 flex items-center">
                  <FaFileContract className="mr-2 text-primary-600" />
                  Documents
                </h3>
                <div className="space-y-3">
                  <DocumentItem
                    label="Profile Image"
                    path={
                      currentDoctor?.doctor_Image?.filePath
                        ? `${API_URL}${currentDoctor.doctor_Image.filePath}`
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(currentDoctor?.doctor_Image?.filePath
                          || "D")}&background=random`
                    }
                  />
                  <DocumentItem
                    label="Agreement"
                    path={
                      currentDoctor?.doctor_Contract?.doctor_Agreement?.filePath
                        ? `${API_URL}${currentDoctor.doctor_Contract.doctor_Agreement.filePath}`
                        : null
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DoctorPatients
        doctorId={doctorId}
        patients={patients}
      />
    </div>
  );
};

// Reusable Detail Item Component
const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start">
    {icon && <span className="mr-2 text-primary-500 mt-1">{icon}</span>}
    <div className="flex-1">
      <p className="font-medium text-primary-700">{label}</p>
      <p className="text-primary-900 underline italic underline-offset-4 ">{value || 'N/A'}</p>
    </div>
  </div>
);

// Document Item Component
const DocumentItem = ({ label, path }) => (
  <div className="flex items-center justify-between">
    <p className="font-medium text-primary-700">{label}</p>
    {path ? (
      <a
        href={path}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary-600 font-semibold hover:text-primary-800 text-sm"
      >
        View Document
      </a>
    ) : (
      <span className="text-primary-500 text-sm">Not available</span>
    )}
  </div>
);

export default DoctorDetails;