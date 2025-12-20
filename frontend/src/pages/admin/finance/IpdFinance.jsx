import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllAdmittedPatients,
  deleteAdmission,
  updatePatientAdmission,
  resetOperationStatus,
  selectFetchStatus,
  selectUpdateStatus
} from '../../../features/ipdPatient/IpdPatientSlice';
import {
  FiSearch, FiTrash2, FiEdit, FiUser, FiHome,
} from 'react-icons/fi';
import { AiOutlineEye } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import {
  AiOutlineCheckCircle, AiOutlineWarning
} from 'react-icons/ai';
import { BiBed } from 'react-icons/bi';
import { GiHospital } from 'react-icons/gi';
import IPDBillingStats from './IPDBillingStats';
import { getRoleRoute } from '../../../utils/getRoleRoute';

const IPDPatientsBill = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { patientsList, errorMessage } = useSelector(state => state.ipdPatient);
  const fetchStatus = useSelector(selectFetchStatus);
  const updateStatus = useSelector(selectUpdateStatus);
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all-admitted');
  const [modals, setModals] = useState({
    delete: { show: false, patientId: null },
    edit: { show: false, patient: null },
    success: { show: false, message: '' }
  });
  const [editForm, setEditForm] = useState({
    ward_Type: '',
    ward_No: '',
    bed_No: '',
    status: 'Admitted'
  });

  // Memoized derived data
  const wardTypes = useMemo(() => {
    if (!Array.isArray(patientsList)) return [];
    const types = patientsList
      .map(p => p.ward_Information?.ward_Type)
      .filter(type => type && typeof type === 'string');
    return [...new Set(types)];
  }, [patientsList]);

  const filteredPatients = useMemo(() => {
    if (!Array.isArray(patientsList)) return [];

    const term = searchTerm.toLowerCase();

    return patientsList.filter(patient => {
      // Search filter applies to all tabs
      const matchesSearch = (
        (patient.patient_MRNo || '').toLowerCase().includes(term) ||
        (patient.patient_CNIC || '').toLowerCase().includes(term) ||
        (patient.patient_Name || '').toLowerCase().includes(term) ||
        (patient.ward_Information?.ward_Type || '').toLowerCase().includes(term) ||
        (patient.ward_Information?.ward_No || '').toLowerCase().includes(term) ||
        (patient.ward_Information?.bed_No || '').toLowerCase().includes(term) ||
        (patient.status?.toLowerCase() || '').includes(term)
      );
      /// Improved date filtering
      let matchesDate = true;
      if (dateRange.start && dateRange.end) {
        try {
          const admissionDate = new Date(patient.admission_Details?.admission_Date);
          const startDate = new Date(dateRange.start);
          const endDate = new Date(dateRange.end);

          // Validate dates
          if (isNaN(admissionDate.getTime())) return false;

          endDate.setHours(23, 59, 59); // Include entire end date
          matchesDate = admissionDate >= startDate && admissionDate <= endDate;
        } catch (e) {
          console.error('Invalid date format', e);
          return false;
        }
      }

      // Tab-specific filtering (keep your existing logic)
      if (activeTab === 'all-admitted') {
        return matchesSearch && matchesDate && patient.status?.toLowerCase() === 'admitted';
      } else if (activeTab === 'all-discharge') {
        return matchesSearch && matchesDate && patient.status?.toLowerCase() === 'discharged';
      } else {
        return matchesSearch && matchesDate &&
          patient.status?.toLowerCase() === 'admitted' &&
          (patient.ward_Information?.ward_Type || '').toLowerCase() === activeTab;
      }
    });
  }, [patientsList, searchTerm, activeTab, dateRange]);

  useEffect(() => {
  }, [patientsList]);


  // Effects
  useEffect(() => {
    dispatch(getAllAdmittedPatients());
    return () => {
      dispatch(resetOperationStatus());
    };
  }, [dispatch]);

  useEffect(() => {
    if (updateStatus === 'succeeded') {
      setModals({
        ...modals,
        edit: { show: false, patient: null },
        success: {
          show: true,
          message: editForm.status === 'Discharged'
            ? 'Patient discharged successfully!'
            : 'Patient updated successfully!'
        }
      });

      // Fetch updated patient data after successful update
      dispatch(getAllAdmittedPatients());  // This ensures the table is updated with the latest data
    }
  }, [updateStatus, dispatch, modals, editForm.status]);


  // Handlers
  const handleEditClick = (patient) => {
    setEditForm({
      ward_Type: patient.ward_Information?.ward_Type || '',
      ward_No: patient.ward_Information?.ward_No || '',
      bed_No: patient.ward_Information?.bed_No || '',
      status: patient.status
    });
    setModals({ ...modals, edit: { show: true, patient } });
  };

  // Corrected handleSaveEdit function
  const handleSaveEdit = () => {
    const { status, ward_Type, ward_No, bed_No } = editForm;
    const patientId = modals.edit.patient?._id;

    if (!patientId) {
      console.error('Patient ID is missing!');
      return;
    }

    // Validate form data
    if (status === 'Admitted' && (!ward_Type || !ward_No || !bed_No)) {
      alert('Ward information is required for admitted patients');
      return;
    }

    const payload = {
      patientId,
      wardData: {
        status,
        // Only include ward info if patient is being admitted
        ...(status === 'Admitted' ? {
          ward_Type: ward_Type.trim(),
          ward_No: ward_No.trim(),
          bed_No: bed_No.trim()
        } : {
          // Clear ward info when discharged
          ward_Type: '',
          ward_No: '',
          bed_No: ''
        })
      }
    };

    dispatch(updatePatientAdmission(payload));
  };

  const handleDischargeToggle = (e) => {
    const isDischarged = e.target.checked;
    setEditForm(prev => ({
      ...prev,
      status: isDischarged ? 'Discharged' : 'Admitted',
      // Clear ward info when discharging
      ...(isDischarged ? {
        ward_Type: '',
        ward_No: '',
        bed_No: ''
      } : {})
    }));
  };

  const handleDeleteConfirm = () => {
    if (modals.delete.patientId) {
      dispatch(deleteAdmission(modals.delete.patientId));
      setModals({ ...modals, delete: { show: false, patientId: null } });
    }
  };

  const handleView = (mrno) => {
    navigate(getRoleRoute(`/receptionist/patient-details/${mrno}`));
  };

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

  if (dateRange.start && dateRange.end) {
    try {
      // If start date is after end date (shouldn't happen due to your handler, but good to check)
      if (new Date(dateRange.start) > new Date(dateRange.end)) {
        return false;
      }
      // Rest of your date filtering logic...
    } catch (e) {
      console.error('Invalid date format', e);
      return false;
    }
  }

  return (
    <div className="">
      {/* Header Section */}
      <div className="mb-8">
        <div className="bg-primary-600 rounded-lg shadow-md p-6 text-white">
          <div className="flex flex-col 2xl:flex-row justify-between items-start spaace-y-2">
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <GiHospital className="mr-2" /> Admitted Patients Management
              </h1>
              <p className="text-primary-100 mt-1 flex flex-wrap gap-2">
                <span className="bg-green-500/20 text-green-100 px-2 py-1 rounded-full text-xs flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1"></span>
                  {patientsList?.filter(p => p.status === 'Admitted').length || 0} Admitted
                </span>
                <span className="bg-red-500/20 text-red-100 px-2 py-1 rounded-full text-xs flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 mr-1"></span>
                  {patientsList?.filter(p => p.status === 'Discharged').length || 0} Discharged
                </span>
                <span className="bg-primary-500/20 text-primary-100 px-2 py-1 rounded-full text-xs flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-300 mr-1"></span>
                  {patientsList?.length || 0} Total
                </span>
              </p>
            </div>

            <div className="mt-4  flex flex-col lg:flex-row gap-4 w-full md:w-auto">
              <div className="relative flex-grow max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-primary-700" />
                </div>
                <input
                  type="text"
                  placeholder="Search patients..."
                  className="block text-primary-700 w-full pl-10 pr-3 py-2 border border-primary-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-white focus:border-white bg-white/90"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex text-gray-600 gap-2 items-center">
                <div className="flex gap-2">
                  <input
                    type="date"
                    className="block w-full pl-3 pr-3 py-2 border border-primary-300 rounded-lg bg-white text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={dateRange.start}
                    onChange={(e) => handleDateRangeChange('start', e.target.value)}
                    placeholder="Start date"
                    max={dateRange.end} // Prevent selecting start date after end date
                  />
                  <input
                    type="date"
                    className="block w-full pl-3 pr-3 py-2 border border-primary-300 rounded-lg bg-white text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={dateRange.end}
                    onChange={(e) => handleDateRangeChange('end', e.target.value)}
                    placeholder="End date"
                    min={dateRange.start} // Prevent selecting end date before start date
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
        <div className="px-4 md:px-6 pt-4">
          <IPDBillingStats patients={filteredPatients} />
        </div>
      </div>

      {/* Ward Type Tabs */}
      <div className="flex justify-between items-center">
        <div className="mb-6 flex overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('all-admitted')}
            className={`px-4 py-2 mr-2 rounded-lg font-medium whitespace-nowrap flex items-center ${activeTab === 'all-admitted'
              ? 'bg-primary-100 text-primary-700 border border-primary-300'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
          >
            <FiHome className="mr-2" /> All Admitted
          </button>
          {wardTypes.map(ward => (
            <button
              key={ward}
              onClick={() => setActiveTab(ward.toLowerCase())}
              className={`px-4 py-2 mr-2 rounded-lg font-medium whitespace-nowrap flex items-center ${activeTab === ward.toLowerCase()
                ? 'bg-primary-100 text-primary-700 border border-primary-300'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
            >
              <BiBed className="mr-2" /> {ward}
            </button>
          ))}
        </div>
        <button
          onClick={() => setActiveTab('all-discharge')}
          className={`px-4 py-2 mr-2 rounded-lg font-medium whitespace-nowrap flex items-center ${activeTab === 'all-discharge'
            ? 'bg-red-100 text-red-700 border border-red-300'
            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
        >
          <FiHome className="mr-2" /> All Discharged
        </button>
      </div>

      {/* Status Indicators */}
      {fetchStatus === 'pending' && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading patient data...</p>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
          <div className="flex items-center">
            <AiOutlineWarning className="h-5 w-5 text-red-500" />
            <div className="ml-3">
              <p className="text-sm text-red-700 font-medium">
                {errorMessage || 'Failed to load patient data'}
              </p>
            </div>
          </div>
        </div>
      )}
      {filteredPatients && dateRange.start && dateRange.end && (
        <div className="text-sm inline-block px-4 py-2 rounded-b-lg bg-primary-200 text-primary-700 mb-2 underline-offset-1 ">
          Showing patients admitted between {new Date(dateRange.start).toLocaleDateString()} and {new Date(dateRange.end).toLocaleDateString()}
        </div>
      )}

      {dateRange.start && dateRange.end && filteredPatients?.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          No patients found in selected date range
        </div>
      )}

      {/* Patients Table */}
      {fetchStatus !== 'pending' && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient Info
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    MR Number
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admission Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admission Fee
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Discount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Charges
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPatients?.map((patient) => (
                  <tr key={patient._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <FiUser className="h-5 w-5 text-primary-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{patient.patient_Name}</div>
                          <div className="text-sm text-gray-500">
                            {patient.patient_Age}yrs, {patient.patient_Gender}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-mono">{patient.patient_MRNo}</div>
                      <div className="text-sm text-gray-500">{patient.patient_CNIC || 'CNIC'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {patient.ward_Information?.pdCharges || 'Not specified'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {patient.financials?.admission_Fee || 'Not specified'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {patient.financials?.discount || 'Not specified'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {patient.financials?.total_Charges || 'Not specified'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleView(patient.patient_MRNo)} // Passing MR number instead of _id
                          className="text-primary-600 border border-primary-200 hover:text-primary-900 p-1 rounded-md hover:bg-primary-50"
                          aria-label={`View ${patient.patient_Name}`}
                        >
                          <AiOutlineEye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleEditClick(patient)}
                          className="text-indigo-600 border border-purple-300 hover:text-indigo-900 p-1 rounded-md hover:bg-indigo-50"
                          title="Edit"
                        >
                          <FiEdit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setModals({ ...modals, delete: { show: true, patientId: patient._id } })}
                          className="text-red-600 border border-red-300 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                          title="Delete"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {fetchStatus !== 'pending' && filteredPatients?.length === 0 && (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No patients found</h3>
          <p className="mt-2 text-gray-500">
            {searchTerm ? 'No patients match your search criteria.' : 'No patients are currently admitted.'}
          </p>
          <div className="mt-6">
            <button
              onClick={() => {
                setSearchTerm('');
                setActiveTab('all-admitted'); // Changed from 'all' to 'all-admitted'
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Reset filters
            </button>
          </div>
        </div>
      )}
      <div className="my-4">
        {(dateRange.start || dateRange.end) && (
          <button
            onClick={() => setDateRange({ start: '', end: '' })}
            className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Reset Dates
          </button>
        )}
      </div>
      {/* Success Modal */}
      {modals.success.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 backdrop-blur-lg bg-white/20"></div>
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full z-10 transform transition-all">
            <div className="text-center">
              <AiOutlineCheckCircle className="mx-auto h-16 w-16 text-green-500" />
              <h3 className="text-lg font-medium text-gray-900 mt-4">
                {modals.success.message}
              </h3>
              <div className="mt-6">
                <button
                  onClick={() => setModals({ ...modals, success: { show: false, message: '' } })}
                  className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {modals.delete.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg bg-white/20">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full z-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Confirm Deletion</h2>
            <p className="text-gray-600 mb-4">Are you sure you want to delete this patient record?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModals({ ...modals, delete: { show: false, patientId: null } })}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Patient Modal */}
      {modals.edit.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/15">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Update Patient Status</h2>

            <div className="space-y-4">
              {/* Ward Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Ward Type</label>
                <select
                  name="ward_Type"
                  value={editForm.ward_Type}
                  onChange={(e) => setEditForm({ ...editForm, ward_Type: e.target.value })}
                  className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  disabled={editForm.status === 'Discharged'}
                >
                  <option value="">Select Ward Type</option>
                  {wardTypes.map(ward => (
                    <option key={ward} value={ward}>{ward}</option>
                  ))}
                </select>
              </div>

              {/* Ward No */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Ward No</label>
                <input
                  type="text"
                  name="ward_No"
                  value={editForm.ward_No}
                  onChange={(e) => setEditForm({ ...editForm, ward_No: e.target.value })}
                  className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  disabled={editForm.status === 'Discharged'}
                />
              </div>

              {/* Bed No */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Bed No</label>
                <input
                  type="text"
                  name="bed_No"
                  value={editForm.bed_No}
                  onChange={(e) => setEditForm({ ...editForm, bed_No: e.target.value })}
                  className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  disabled={editForm.status === 'Discharged'}
                />
              </div>

              {/* Discharge Checkbox */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="dischargeCheckbox"
                  checked={editForm.status === 'Discharged'}
                  onChange={handleDischargeToggle}
                  className="h-5 w-5 text-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="dischargeCheckbox" className="text-sm font-medium text-gray-700">
                  Discharge Patient
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setModals({ ...modals, edit: { show: false, patient: null } })}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={updateStatus === 'pending'}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                {updateStatus === 'pending' ? 'Saving...' : 'Update Status'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IPDPatientsBill;