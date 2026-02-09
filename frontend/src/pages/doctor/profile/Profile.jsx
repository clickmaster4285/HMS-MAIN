import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaUserMd, FaIdCard, FaEnvelope, FaPhone, FaMapMarkerAlt, FaStethoscope, FaFileSignature, FaMoneyBillWave, FaFileContract } from 'react-icons/fa';
import { fetchDoctorById } from '../../../features/doctor/doctorSlice';
const  API_URL = import.meta.env.VITE_API_URL; ;

const PatientRecord = () => {
  const dispatch = useDispatch();
  const { currentDoctor, status, error } = useSelector(state => state.doctor);
  
  // Get user ID from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user.id;

  useEffect(() => {
    if (userId) {
      dispatch(fetchDoctorById(userId));
    }
  }, [userId, dispatch]);

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
    return <div className="text-center py-8 text-primary-500">No patient data found</div>;
  }

  return (
    <div className="container mx-auto p-4 border border-primary-600 rounded-lg">
      {/* Header Section */}
      <div className="flex items-center mb-8">
        <div className="bg-primary-100 p-3 rounded-full mr-4">
          <FaUserMd className="text-primary-600 text-2xl" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Patient Medical Record</h1>
          <p className="text-primary-600">Complete medical information</p>
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
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(currentDoctor?.user.user_Name || "P")}&background=random`
              }
              alt={currentDoctor?.user.user_Name}
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentDoctor?.user.user_Name || "P")}&background=random`;
              }}
            />
          </div>
          <div>
            <h2 className="text-xl font-bold">{currentDoctor?.user.user_Name}</h2>
            <p className="text-primary-600">{currentDoctor?.user?.user_Identifier}</p>
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
                  Personal Information
                </h3>
                <div className="space-y-3">
                  <DetailItem icon={<FaIdCard />} label="Name" value={currentDoctor?.user.user_Name} />
                  <DetailItem icon={<FaEnvelope />} label="Email" value={currentDoctor?.user.user_Email} />
                  <DetailItem icon={<FaPhone />} label="Contact" value={currentDoctor?.user.user_Contact} />
                  <DetailItem icon={<FaMapMarkerAlt />} label="Address" value={currentDoctor?.user.user_Address} />
                </div>
              </div>

              {/* Medical History */}
              <div className="bg-primary-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-4 flex items-center">
                  <FaStethoscope className="mr-2 text-primary-600" />
                  Medical History
                </h3>
                <div className="space-y-3">
                  <DetailItem label="Blood Type" value={currentDoctor?.patient_BloodType || 'N/A'} />
                  <DetailItem label="Allergies" value={currentDoctor?.patient_Allergies || 'None reported'} />
                  <DetailItem label="Chronic Conditions" value={currentDoctor?.patient_ChronicConditions || 'None reported'} />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Current Medications */}
              <div className="bg-primary-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-4 flex items-center">
                  <FaFileSignature className="mr-2 text-primary-600" />
                  Current Medications
                </h3>
                <div className="space-y-2">
                  {currentDoctor?.patient_Medications?.length > 0 ? (
                    <ul className="space-y-2">
                      {currentDoctor.patient_Medications.map((med, index) => (
                        <li key={index} className="py-1 px-3 bg-primary-100 rounded">
                          {med.name} - {med.dosage} ({med.frequency})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-primary-500">No current medications</p>
                  )}
                </div>
              </div>

              {/* Insurance Information */}
              <div className="bg-primary-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-4 flex items-center">
                  <FaMoneyBillWave className="mr-2 text-primary-600" />
                  Insurance Information
                </h3>
                <div className="space-y-3">
                  <DetailItem label="Provider" value={currentDoctor?.patient_Insurance?.provider || 'N/A'} />
                  <DetailItem label="Policy Number" value={currentDoctor?.patient_Insurance?.policyNumber || 'N/A'} />
                  <DetailItem label="Coverage Details" value={currentDoctor?.patient_Insurance?.coverageDetails || 'N/A'} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Detail Item Component (same as before)
const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start">
    {icon && <span className="mr-2 text-primary-500 mt-1">{icon}</span>}
    <div className="flex-1">
      <p className="font-medium text-primary-700">{label}</p>
      <p className="text-primary-900 underline italic underline-offset-4">{value || 'N/A'}</p>
    </div>
  </div>
);

export default PatientRecord;