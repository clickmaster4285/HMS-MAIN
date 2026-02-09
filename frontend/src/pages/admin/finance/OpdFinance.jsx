import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPatients,
  selectPatients,
  fetchPatientById,
  selectSelectedPatient,
  selectSelectedPatientStatus,
  clearSelectedPatient,
} from "../../../features/patient/patientSlice";
import { AiOutlineEdit, AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { FiSearch, FiCalendar } from "react-icons/fi";
import PatientDetailModal from "../../reception/opd/PatientDetailModal";
import DeletePatientConfirmation from '../../reception/opd/DeletePatientConfirmation';
import { useNavigate, useParams } from 'react-router-dom';
import BillingStats from './BillingStats';
import { getRoleRoute } from "../../../utils/getRoleRoute";


const BillingOpd = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const patients = useSelector(selectPatients);
  const [searchQuery, setSearchQuery] = useState("");
  const selectedPatient = useSelector(selectSelectedPatient);
  const patientLoading = useSelector(selectSelectedPatientStatus);
  const [showModal, setShowModal] = useState(false);
  const [editPatient, setEditPatient] = useState(null);
  const [dateRange, setDateRange] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    return {
      start: today,
      end: today
    };
  });
  // In your BillingOpd component
  useEffect(() => {
    dispatch(fetchPatients()).unwrap()
      .catch((err) => {
        console.error("Error fetching all patients:", err);
      });
  }, [dispatch]);

  const [patientToDelete, setPatientToDelete] = useState(null);
  const handleEdit = async (patientId) => {
    await dispatch(fetchPatientById(patientId));
    setEditPatient(patientId);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    dispatch(clearSelectedPatient());
  };

  const handleView = async (patientId) => {
    await dispatch(fetchPatientById(patientId));
    setShowModal(true);
  };

  const confirmDelete = () => {
    setPatientToDelete(null);
  };

  useEffect(() => {
    dispatch(fetchPatients());
  }, [dispatch]);

  const filteredPatients = useMemo(() => {
    return (patients || []).slice().reverse().filter((patient) => {
      if (!patient) return false;

      // Search filter
      const matchesSearch = (
        (patient.patient_Name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (patient.patient_MRNo || '').includes(searchQuery)
      );

      // Date range filter (only if dates are provided)
      let matchesDate = true;
      if (dateRange.start || dateRange.end) {
        try {
          const visitDate = new Date(patient.createdAt);
          if (isNaN(visitDate.getTime())) return false;

          // If only one date is set, compare against that single date
          if (dateRange.start && !dateRange.end) {
            const startDate = new Date(dateRange.start);
            matchesDate = visitDate >= startDate;
          }
          else if (!dateRange.start && dateRange.end) {
            const endDate = new Date(dateRange.end);
            endDate.setHours(23, 59, 59);
            matchesDate = visitDate <= endDate;
          }
          else if (dateRange.start && dateRange.end) {
            const startDate = new Date(dateRange.start);
            const endDate = new Date(dateRange.end);
            endDate.setHours(23, 59, 59);
            matchesDate = visitDate >= startDate && visitDate <= endDate;
          }
        } catch (e) {
          console.error('Invalid date format', e);
          return false;
        }
      }
      return matchesSearch && matchesDate;
    }) || [];
  }, [patients, searchQuery, dateRange]);

  const handleDateRangeChange = (type, value) => {
    setDateRange(prev => {
      const newRange = { ...prev, [type]: value };

      // Validate that end date isn't before start date
      if (newRange.start && newRange.end) {
        const start = new Date(newRange.start);
        const end = new Date(newRange.end);
        if (start > end) {
          // Swap them if invalid
          return { start: newRange.end, end: newRange.start };
        }
      }
      return newRange;
    });
  };

  return (
    <div className="">
      {/* Delete Confirmation Modal */}
      {patientToDelete && (
        <DeletePatientConfirmation
          patient={patientToDelete}
          onClose={() => setPatientToDelete(null)}
        />
      )}

      {/* Patient Detail Modal */}
      {showModal && (
        <PatientDetailModal
          patient={selectedPatient}
          loading={patientLoading === "loading"}
          onClose={handleCloseModal}
        />
      )}

      {/* Main Content */}
      <div className="max-w-8xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header Section */}
        <div className="bg-primary-600 p-4 md:p-6 text-white">
          <div className="flex flex-col xl:flex-row  justify-between items-start space-y-4 xl:space-y-1">
            <div className="flex items-center">
              <div className="h-14 w-1 bg-primary-300 mr-4 rounded-full"></div>
              <div>
                <h1 className="text-3xl font-bold">OPD Billing</h1>
                <p className="text-primary-100 mt-1">View and manage outpatient department records billing details</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Search by name or MR#"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-row gap-2 items-center">
                <div className="flex gap-2">
                  <input
                    type="date"
                    className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={dateRange.start}
                    onChange={(e) => handleDateRangeChange('start', e.target.value)}
                    placeholder="Start date"
                    max={dateRange.end}
                  />
                  <input
                    type="date"
                    className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={dateRange.end}
                    onChange={(e) => handleDateRangeChange('end', e.target.value)}
                    placeholder="End date"
                    min={dateRange.start}
                  />
                </div>
                <div className="grid items-center grid-cols-2 gap-1">
                  <button
                    onClick={() => {
                      const today = new Date().toISOString().split('T')[0];
                      setDateRange({ start: today, end: today });
                    }}
                    className="text-xs text-primary-900 px-2 py-0.5 bg-primary-100 rounded hover:bg-primary-200"
                  >
                    Today
                  </button>
                  <button
                    onClick={() => {
                      const today = new Date();
                      const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
                      setDateRange({
                        start: weekStart.toISOString().split('T')[0],
                        end: new Date().toISOString().split('T')[0]
                      });
                    }}
                    className="text-xs px-2 text-primary-900 py-0.5 bg-primary-100 rounded hover:bg-primary-200"
                  >
                    This Week
                  </button>
                  <button
                    onClick={() => {
                      const today = new Date();
                      setDateRange({
                        start: new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0],
                        end: new Date().toISOString().split('T')[0]
                      });
                    }}
                    className="col-span-2 text-xs px-2 text-primary-900 py-0.5 bg-primary-100 rounded hover:bg-primary-200"
                  >
                    This Month
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add the BillingStats component here */}
        <div className="px-4 md:px-6 pt-4">
          <BillingStats patients={filteredPatients} />
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MR#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor Fee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr key={patient._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
                        {patient.patient_HospitalInformation?.token || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {patient.patient_MRNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-base font-normal text-gray-900">{patient.patient_Name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patient.patient_HospitalInformation?.doctor_Name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patient.patient_HospitalInformation?.doctor_Department || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patient.patient_HospitalInformation?.doctor_Fee ? `Rs. ${patient.patient_HospitalInformation.doctor_Fee}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patient.patient_HospitalInformation?.discount ? `Rs. ${patient.patient_HospitalInformation.discount}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patient.patient_HospitalInformation?.total_Fee ? `Rs. ${patient.patient_HospitalInformation.total_Fee}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleView(patient._id)}
                          className="text-primary-600 border border-primary-200 hover:text-primary-900 p-1 rounded-md hover:bg-primary-50"
                          aria-label={`View ${patient.patient_Name}`}
                        >
                          <AiOutlineEye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => navigate(getRoleRoute(`opd/edit/${patient.patient_MRNo}`))}
                          className="text-yellow-600 border border-yellow-200 hover:text-yellow-900 p-1 rounded-md hover:bg-yellow-50"
                          aria-label={`Edit ${patient.patient_Name}`}
                        >
                          <AiOutlineEdit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setPatientToDelete(patient)}
                          className="text-red-600 border border-red-200 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                          aria-label={`Delete ${patient.patient_Name}`}
                        >
                          <AiOutlineDelete className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center justify-center py-8">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="mt-2 font-medium text-gray-600">No patients found</p>
                      <p className="text-sm text-gray-500">Try adjusting your search or date filter</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredPatients.length > 0 && (
          <div className="bg-gray-50  border rounded-xs border-t-gray-300 px-6 py-3 flex items-center justify-center  border-primary-400">
            <div className="text-sm text-gray-500 ">
              Showing <span className="font-medium">{filteredPatients.length}</span> of{' '}
              <span className="font-medium">{filteredPatients.length}</span> results
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:justify-between justify-center sm:items-start sitems-center gap-2 px-6 py-3 bg-gray-50 border-t border-gray-200">
          {dateRange.start && dateRange.end && (
            <div className="text-sm px-3 py-1.5 rounded-md bg-primary-600 text-white">
              Showing patients between <span className="font-medium">{new Date(dateRange.start).toLocaleDateString()}</span> and <span className="font-medium">{new Date(dateRange.end).toLocaleDateString()}</span>
            </div>
          )}

          {(dateRange.start || dateRange.end) && (
            <button
              onClick={() => setDateRange({ start: '', end: '' })}
              className="inline-flex  items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Reset All Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillingOpd;
