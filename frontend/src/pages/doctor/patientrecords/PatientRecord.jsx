import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FaCalendarAlt, FaProcedures,
  FaSearch, FaFilter, FaUserInjured, FaNotesMedical
} from 'react-icons/fa';
import { fetchDoctorById } from '../../../features/doctor/doctorSlice';
import { AiOutlineEdit, AiOutlineEye } from 'react-icons/ai';
import { getRoleRoute } from "../../../utils/getRoleRoute"
import { useNavigate } from 'react-router-dom';
import DateRangePicker from '../../../components/common/DateRangePicker';
const API_URL = import.meta.env.VITE_API_URL;


const PatientRecord = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState({
    start: new Date(), // Today by default
    end: new Date()    // Today by default
  });
  const { currentDoctor, patients, status, error } = useSelector(state => state.doctor);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  // Get user ID from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user.doctorProfile._id;
  // console.log("currentDoctor", currentDoctor);

  useEffect(() => {
    if (userId) {
      dispatch(fetchDoctorById(userId));
    }
  }, [userId, dispatch]);

  // Filter patients based on search term
  const filteredPatients = patients?.filter(patient => {
    try {
      // Parse and normalize dates
      const patientDate = new Date(patient.createdAt);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);

      // Normalize to date-only (ignore time)
      const patientDay = new Date(patientDate.toDateString());
      const startDay = new Date(startDate.toDateString());
      const endDay = new Date(endDate.toDateString());

      // Debug logs
      // console.log('Comparing dates:', {
      //   patient: patientDay,
      //   start: startDay,
      //   end: endDay,
      //   inRange: patientDay >= startDay && patientDay <= endDay
      // });

      
      const dateInRange = patientDay >= startDay && patientDay <= endDay;

      const matchesSearch = patient.patient_Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.patient_MRNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.patient_ContactNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.patient_CNIC?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter = filter === 'all' ||
        (filter === 'recent' && new Date(patient.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));

      return dateInRange && matchesSearch && matchesFilter;
    } catch (error) {
      console.error("Error filtering patient:", error);
      return false;
    }
  }) || [];

// useEffect(() => {
//   console.log("Date range updated - filtering patients", dateRange);
//   console.log("Current patients data:", patients);
// }, [dateRange, patients]);

  // console.log("filteredPatients", filteredPatients);

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
          <div className="flex-shrink-0">
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


  return (
    <div className="p-2">
      {/* Doctor Profile Card */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-primary-500 to-primary-700 p-4 text-white">
          <div className="flex items-center">
            <div className="mr-4">
              <img
                src={
                  currentDoctor?.doctor_Image?.filePath
                    ? `${API_URL}${currentDoctor.doctor_Image.filePath}`
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(currentDoctor?.user?.user_Name || "D")}&background=random`
                }
                alt={currentDoctor?.user?.user_Name}
                className="w-16 h-16 rounded-full object-cover border-4 border-white shadow"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentDoctor?.user?.user_Name || "D")}&background=random`;
                }}
              />
            </div>
            <div>
              <h2 className="text-xl font-bold">{currentDoctor?.user?.user_Name}</h2>
              <p className="text-primary-100">{currentDoctor?.doctor_Department} • {currentDoctor?.doctor_Specialization}</p>
              <div className="flex items-center mt-1">
                <span className="bg-white text-primary-600 text-xs px-2 py-1 rounded-full font-semibold">
                  {currentDoctor?.doctor_Type}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={<FaUserInjured className="text-primary-500" />}
            label="Total Patients"
            value={patients?.length || 0}
          />
          <StatCard
            icon={<FaNotesMedical className="text-primary-500" />}
            label="Consultation Fee"
            value={`Rs. ${currentDoctor?.doctor_Fee || 'N/A'}`}
          />
          <StatCard
            icon={<FaCalendarAlt className="text-green-500" />}
            label="Joined On"
            value={new Date(currentDoctor?.doctor_Contract?.doctor_JoiningDate).toLocaleDateString() || 'N/A'}
          />
          <StatCard
            icon={<FaProcedures className="text-purple-500" />}
            label="License No."
            value={currentDoctor?.doctor_LicenseNumber || 'N/A'}
          />
        </div>
      </div>

      {/* Patient Management Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Header with Tabs */}
        <div className="border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex flex-col gap-4">
              {/* Title */}
              <h2 className="text-lg font-semibold text-gray-800">Patient Records</h2>

              {/* Filter Controls - Stack on mobile, row on desktop */}
              <div className="flex flex-col md:flex-row gap-3 w-full">
                {/* Search Input */}
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search patients..."
                    className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Filter Dropdown */}
                <div className="relative flex-1 md:flex-none md:w-48">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaFilter className="text-gray-400" />
                  </div>
                  <select
                    className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="all">All Patients</option>
                    <option value="recent">Recent (Last 7 days)</option>
                  </select>
                </div>

                {/* Date Range Picker - Full width on mobile, auto on desktop */}
                <div className="flex-1 md:flex-none md:w-auto">
                  <DateRangePicker
                    startDate={dateRange.start}
                    endDate={dateRange.end}
                    onChange={(newRange) => {
                      // console.log("Date range changed:", newRange); // Debug log
                      setDateRange(newRange);
                    }}
                    className="w-full"
                    showQuickOptions={false} // Hide quick options in this compact view
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Patients List */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MR No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age/DOB</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guardian</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Checkup Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <PatientRow key={patient._id} patient={patient} navigate={navigate} />
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No patients found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Patient Row Component
const PatientRow = ({ patient, navigate }) => (
  <tr className="hover:bg-gray-50 transition-colors">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="flex-shrink-0 h-10 w-10">
          <img
            src={`https://api.dicebear.com/6.x/avataaars/svg?seed=${encodeURIComponent(patient.patient_MRNo || patient.patient_Name || "User")}`}
            alt={patient.patient_Name}
            className="h-10 w-10 rounded-full object-cover"
          />

        </div>
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-900">{patient.patient_Name}</div>
          <div className="text-xs text-gray-500">
            {patient.patient_HospitalInformation?.doctor_Name}
          </div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm font-medium text-primary-600">{patient.patient_MRNo}</div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900">{patient.patient_Age}</div>
      <div className="text-xs text-gray-500">
        {new Date(patient.patient_DateOfBirth).toLocaleDateString()}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900">{patient.patient_Guardian?.guardian_Name}</div>
      <div className="text-xs text-gray-500">
        {patient.patient_Guardian?.guardian_Relation}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {patient.patient_ContactNo || 'N/A'}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {patient.createdAt ? (
        <>
          {new Date(patient.createdAt).toLocaleDateString('en-CA')} {/* YYYY-MM-DD */}
          <br />
          {new Date(patient.createdAt).toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone: 'Asia/Karachi' // Optional: local time zone
          })}
        </>
      ) : 'N/A'}
    </td>

    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-1">
      <button
        type='button'
        onClick={() => navigate(getRoleRoute(`patient-records/${patient._id}`))}
        className="text-primary-600 p-1 rounded-md border border-primary-300 hover:bg-primary-50 hover:text-primary-700 transition-colors duration-200"
        title="View patient"
        aria-label="View patient"
      >
        <AiOutlineEye className="h-4 w-4" />
      </button>
      <button
        className="text-edit-600 p-1 rounded-md border border-edit-300 hover:bg-edit-50 hover:text-edit-700 transition-colors duration-200"
        title="Edit doctor"
        aria-label="Edit doctor"
      >
        <AiOutlineEdit className="h-4 w-4" />
      </button>
    </td>
  </tr>
);

// Stat Card Component
const StatCard = ({ icon, label, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <div className="flex items-center">
      <div className="p-3 rounded-full bg-white shadow-sm mr-3">
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className="text-lg font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

export default PatientRecord;