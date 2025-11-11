import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllAdmittedPatients,
  deleteAdmission,
  dischargePatient,
  resetOperationStatus,
  selectFetchStatus,
  selectUpdateStatus,
} from '../../../features/ipdPatient/IpdPatientSlice';
import { useNavigate } from 'react-router-dom';
import { getallDepartments } from '../../../features/department/DepartmentSlice';

// Components
import HeaderSection from './getall/HeaderSection';
import WardTypeTabs from './getall/WardTypeTabs';
import PatientsTable from './getall/PatientsTable';
import EmptyState from './getall/EmptyState';
import SuccessModal from './getall/modals/SuccessModal';
import DeleteModal from './getall/modals/DeleteModal';
import Pagination from "./getall/Pagination"

const AdmittedPatients = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get state from Redux
  const {
    patientsList,
    errorMessage,
    pagination
  } = useSelector(state => state.ipdPatient);

  const fetchStatus = useSelector(selectFetchStatus);
  const updateStatus = useSelector(selectUpdateStatus);

  // State management
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all-admitted');
  const [currentPage, setCurrentPage] = useState(1);
  const [modals, setModals] = useState({
    delete: { show: false, patientId: null },
    success: { show: false, message: '' }
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // Load data with pagination and status filter
  const loadPatients = useCallback((page = 1, statusFilter = null) => {
    let status = 'Admitted';

    // Determine status based on active tab
    if (activeTab === 'all-discharge') {
      status = 'Discharged';
    } else if (activeTab === 'all') {
      status = 'Admitted,Discharged'; // Get both
    }

    const params = {
      page,
      limit: 20,
      status, // Add status parameter
      ward_Type: activeTab !== 'all-admitted' && activeTab !== 'all-discharge' && activeTab !== 'all' ? activeTab : undefined
    };

    dispatch(getAllAdmittedPatients(params));
    setCurrentPage(page);
  }, [activeTab, dispatch]);

  // Effects
  useEffect(() => {
    loadPatients(1);
    dispatch(getallDepartments());
    return () => {
      dispatch(resetOperationStatus());
    };
  }, [dispatch, loadPatients]);

  useEffect(() => {
    // Reload when tab changes
    loadPatients(1);
  }, [activeTab, loadPatients]);

  // Handle success messages
  useEffect(() => {
    if (updateStatus === 'succeeded' && isUpdating) {
      setModals(prevModals => ({
        ...prevModals,
        success: {
          show: true,
          message: 'Operation completed successfully!'
        }
      }));

      setIsUpdating(false);
      loadPatients(currentPage);
    }
  }, [updateStatus, isUpdating, currentPage, loadPatients]);

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
        (patient.patient?.patient_MRNo || '').toLowerCase().includes(term) ||
        (patient.patient?.patient_CNIC || '').toLowerCase().includes(term) ||
        (patient.patient?.patient_Name || '').toLowerCase().includes(term) ||
        (patient.ward_Information?.ward_Type || '').toLowerCase().includes(term) ||
        (patient.ward_Information?.ward_No || '').toLowerCase().includes(term) ||
        (patient.ward_Information?.bed_No || '').toLowerCase().includes(term) ||
        (patient.status?.toLowerCase() || '').includes(term)
      );

      // Date filtering
      let matchesDate = true;
      if (dateRange.start && dateRange.end) {
        try {
          const admissionDate = new Date(patient.admission_Details?.admission_Date);
          const startDate = new Date(dateRange.start);
          const endDate = new Date(dateRange.end);

          if (isNaN(admissionDate.getTime())) return false;

          endDate.setHours(23, 59, 59);
          matchesDate = admissionDate >= startDate && admissionDate <= endDate;
        } catch (e) {
          console.error('Invalid date format', e);
          return false;
        }
      }

      // Tab-specific filtering is now handled by the API
      return matchesSearch && matchesDate;
    });
  }, [patientsList, searchTerm, dateRange]);

  // Handlers
  const handleEditClick = (patient) => {
    if (patient.status === 'Admitted') {
      navigate(`/receptionist/ipd/edit/${patient.patient.patient_MRNo}`);
    }
  };

  const handleDeleteConfirm = () => {
    if (modals.delete.patientId) {
      dispatch(deleteAdmission(modals.delete.patientId));
      setModals({ ...modals, delete: { show: false, patientId: null } });
    }
  };

  const handleView = (mrno) => {
    navigate(`/receptionist/patient-details/${mrno}`);
  };

  const handleDischarge = async (patient) => {
    if (!patient?._id) {
      console.error('Patient ID is missing!');
      return;
    }

    setIsUpdating(true);

    try {
      const dischargePayload = {
        id: patient._id,
        wardId: patient.ward_Information?.ward_Id,
        bedNumber: patient.ward_Information?.bed_No,
        patientMRNo: patient.patient?.patient_MRNo
      };
      await dispatch(dischargePatient(dischargePayload));
    } catch (error) {
      console.error('Discharge error:', error);
      setIsUpdating(false);
    }
  };

  const handleDateRangeChange = (type, value) => {
    setDateRange(prev => {
      const newRange = { ...prev, [type]: value };
      if (newRange.start && newRange.end) {
        const start = new Date(newRange.start);
        const end = new Date(newRange.end);
        if (start > end) {
          return { start: newRange.end, end: newRange.start };
        }
      }
      return newRange;
    });
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setDateRange({ start: '', end: '' });
    setActiveTab('all-admitted');
  };

  // Close success modal handler
  const handleCloseSuccessModal = () => {
    setModals(prev => ({
      ...prev,
      success: { show: false, message: '' }
    }));
  };

  return (
    <div className="">
      <HeaderSection
        patientsList={patientsList}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        dateRange={dateRange}
        handleDateRangeChange={handleDateRangeChange}
      />

      {/* Updated tabs to include all patients */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('all-admitted')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'all-admitted'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Admitted Patients
          </button>
          <button
            onClick={() => setActiveTab('all-discharge')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'all-discharge'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Discharged Patients
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'all'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            All Patients
          </button>
          {/* Ward type tabs */}
          {wardTypes.map(wardType => (
            <button
              key={wardType}
              onClick={() => setActiveTab(wardType)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === wardType
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              {wardType}
            </button>
          ))}
        </nav>
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
            <div className="ml-3">
              <p className="text-sm text-red-700 font-medium">
                {errorMessage || 'Failed to load patient data'}
              </p>
            </div>
          </div>
        </div>
      )}

      {dateRange.start && dateRange.end && filteredPatients?.length > 0 && (
        <div className="text-sm inline-block px-4 py-2 rounded-b-lg bg-primary-200 text-primary-700 mb-2">
          Showing patients admitted between {new Date(dateRange.start).toLocaleDateString()} and {new Date(dateRange.end).toLocaleDateString()}
        </div>
      )}

      {filteredPatients?.length > 0 ? (
        <>
          <PatientsTable
            filteredPatients={filteredPatients}
            handleView={handleView}
            handleEditClick={handleEditClick}
            handleDischarge={handleDischarge}
            setModals={setModals}
            isUpdating={isUpdating}
            activeTab={activeTab} // Pass active tab to table
          />

          {/* Add Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={pagination?.totalPages || 1}
            totalItems={pagination?.totalItems || 0}
            onPageChange={loadPatients}
          />
        </>
      ) : (
        <EmptyState
          searchTerm={searchTerm}
          dateRange={dateRange}
          handleResetFilters={handleResetFilters}
        />
      )}

      {dateRange.start || dateRange.end ? (
        <div className="my-4">
          <button
            onClick={() => setDateRange({ start: '', end: '' })}
            className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Reset Dates
          </button>
        </div>
      ) : null}

      {/* Modals */}
      <SuccessModal
        modals={modals}
        setModals={setModals}
        onClose={handleCloseSuccessModal}
      />

      <DeleteModal
        modals={modals}
        setModals={setModals}
        handleDeleteConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default AdmittedPatients;