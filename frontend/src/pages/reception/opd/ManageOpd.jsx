import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPatients,
  fetchPatientById,
  selectSelectedPatient,
  selectSelectedPatientStatus,
  clearSelectedPatient,
  selectAllPatients,
  selectPagination,
  selectFilters,
  selectPatientsStatus,
  setFilters,
  setPage,
  clearFilters
} from "../../../features/patient/patientSlice";
import { AiOutlineEdit, AiOutlineDelete, AiOutlineEye, AiOutlinePrinter } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import PatientDetailModal from "./PatientDetailModal";
import DeletePatientConfirmation from './DeletePatientConfirmation';
import { useNavigate } from 'react-router-dom';
import PrintOptionsModal from './components/PrintOptionsModal';
import Pagination from "./manageopd/Pagination";
import { getRoleRoute } from '../../../utils/getRoleRoute';
import PurposeFilterDropdown from './manageopd/PurposeFilterDropdown';
import { matchesPurposeFilter } from '../../../utils/purposeOptions';
import useDebouncedFilterSave from '../../../hooks/useDebouncedFilterSave';

const ManageOpd = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux selectors
  const pagination = useSelector(selectPagination);
  const filters = useSelector(selectFilters);
  const status = useSelector(selectPatientsStatus);
  const patients = useSelector(selectAllPatients);
  const selectedPatient = useSelector(selectSelectedPatient);
  const patientLoading = useSelector(selectSelectedPatientStatus);

  // Local state
  const [showModal, setShowModal] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [patientToPrint, setPatientToPrint] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Initialize from filters (which now come from URL/localStorage)
  const [localSearch, setLocalSearch] = useState(filters.search || "");
  const [selectedPurpose, setSelectedPurpose] = useState(filters.purpose || "All");
  const [dateRange, setDateRange] = useState({
    start: filters.fromDate || new Date().toISOString().split('T')[0],
    end: filters.toDate || new Date().toISOString().split('T')[0]
  });

  // Use the debounced filter save hook
  useDebouncedFilterSave(filters);

  // Sync local state with Redux filters on mount
  useEffect(() => {
    setLocalSearch(filters.search || "");
    setSelectedPurpose(filters.purpose || "All");
    setDateRange({
      start: filters.fromDate || new Date().toISOString().split('T')[0],
      end: filters.toDate || new Date().toISOString().split('T')[0]
    });
  }, []); // Run only on mount

  // Sync all filters to Redux when they change
  useEffect(() => {
    const timer = setTimeout(() => {
      const filterUpdates = {
        search: localSearch,
        fromDate: dateRange.start,
        toDate: dateRange.end,
        purpose: selectedPurpose
      };

      dispatch(setFilters(filterUpdates));
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearch, dateRange, selectedPurpose, dispatch]);

  // Fetch patients when filters or page changes
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchPatients({
        page: pagination.currentPage,
        limit: pagination.limit,
        search: filters.search,
        filters: {
          fromDate: filters.fromDate,
          toDate: filters.toDate,
          purpose: filters.purpose,
        },
      }));
    };

    fetchData();
  }, [dispatch, pagination.currentPage, filters]);

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
  };

  const handleView = async (patientId) => {
    await dispatch(fetchPatientById(patientId));
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    dispatch(clearSelectedPatient());
  };

  const handlePrint = (patient) => {
    setPatientToPrint(patient);
    setShowPrintModal(true);
  };

  const handleClosePrintModal = () => {
    setShowPrintModal(false);
    setPatientToPrint(null);
  };

  const handleDateRangeChange = (type, value) => {
    setDateRange(prev => {
      const next = { ...prev, [type]: value };
      if (next.start && next.end) {
        const s = new Date(next.start);
        const e = new Date(next.end);
        if (s > e) return { start: next.end, end: next.start };
      }
      return next;
    });
  };

  const handlePurposeSelect = useCallback((purpose) => {
    setSelectedPurpose(purpose);
  }, []);

  const handleClearPurpose = useCallback(() => {
    setSelectedPurpose("All");
  }, []);

  const handleResetFilters = useCallback(() => {
    // Clear local state
    setLocalSearch("");
    setSelectedPurpose("All");
    const today = new Date().toISOString().split('T')[0];
    setDateRange({ start: today, end: today });

    // Clear Redux and persistence
    dispatch(clearFilters());
  }, [dispatch]);

  // Check if filters are active
  const areFiltersActive = useMemo(() => {
    return (
      selectedPurpose !== "All" ||
      localSearch.trim() !== "" ||
      dateRange.start !== new Date().toISOString().split('T')[0] ||
      dateRange.end !== new Date().toISOString().split('T')[0]
    );
  }, [selectedPurpose, localSearch, dateRange]);

  // Helper functions remain the same...
  const toTitle = (g) => g ? (g[0].toUpperCase() + g.slice(1)) : '';

  const latestVisitOf = (p) => {
    if (!p?.visits?.length) return null;
    return [...p.visits].sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate))[0];
  };

  const doctorNameOf = (visit) => {
    return visit?.doctor?.user?.user_Name || 'N/A';
  };

  // Use the patients from Redux
  const displayedPatients = patients || [];

  // Filter by purpose on frontend
  const filteredPatients = useMemo(() => {
    if (!selectedPurpose || selectedPurpose === "All") {
      return displayedPatients;
    }

    return displayedPatients.filter(patient => {
      const latestVisit = latestVisitOf(patient);
      const patientPurpose = latestVisit?.purpose;

      if (!patientPurpose) return false;

      return matchesPurposeFilter(patientPurpose, selectedPurpose);
    });
  }, [displayedPatients, selectedPurpose]);
  return (
    <div className="">
      {/* Delete Confirmation */}
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

      {/* Print Options Modal */}
      {showPrintModal && patientToPrint && (
        <PrintOptionsModal
          patient={patientToPrint}
          onClose={handleClosePrintModal}
        />
      )}

      {/* Main Card */}
      <div className="max-w-8xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-primary-600 p-4 md:p-6 text-white">
          <div className="flex flex-col xl:flex-row justify-between items-start space-y-4 xl:space-y-1">
            <div className="flex items-center">
              <div className="h-14 w-1 bg-primary-300 mr-4 rounded-full"></div>
              <div>
                <h1 className="text-3xl font-bold">OPD Management</h1>
                <p className="text-primary-100 mt-1">View and manage outpatient department records</p>
              </div>
            </div>

            {/* Search + Filters */}
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
              {/* Purpose Filter */}
              <PurposeFilterDropdown
                selectedPurpose={selectedPurpose}
                onSelectPurpose={handlePurposeSelect}
                onClear={handleClearPurpose}
              />

              {/* Search Input */}
              <div className="relative flex-1 md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Search by name or MR#"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                />
              </div>

              {/* Date Range */}
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

                {/* Quick Actions */}
                <div className="flex items-center space-x-2">
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
                        const now = new Date();
                        const weekStart = new Date(now);
                        weekStart.setDate(now.getDate() - now.getDay());
                        setDateRange({
                          start: weekStart.toISOString().split('T')[0],
                          end: new Date().toISOString().split('T')[0],
                        });
                      }}
                      className="text-xs px-2 text-primary-900 py-0.5 bg-primary-100 rounded hover:bg-primary-200"
                    >
                      This Week
                    </button>
                    <button
                      onClick={() => {
                        const now = new Date();
                        setDateRange({
                          start: new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0],
                          end: new Date().toISOString().split('T')[0],
                        });
                      }}
                      className="col-span-2 text-xs px-2 text-primary-900 py-0.5 bg-primary-100 rounded hover:bg-primary-200"
                    >
                      This Month
                    </button>
                  </div>

                  <button
                    onClick={handleResetFilters}
                    className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Reset All
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {areFiltersActive && (
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-600">Active filters:</span>

              {selectedPurpose !== "All" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  Purpose: {selectedPurpose}
                  <button
                    onClick={handleClearPurpose}
                    className="ml-1.5 text-primary-600 hover:text-primary-800"
                  >
                    ×
                  </button>
                </span>
              )}

              {localSearch && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Search: {localSearch}
                  <button
                    onClick={() => setLocalSearch("")}
                    className="ml-1.5 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}

              {(dateRange.start !== new Date().toISOString().split('T')[0] ||
                dateRange.end !== new Date().toISOString().split('T')[0]) && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {dateRange.start} to {dateRange.end}
                    <button
                      onClick={() => {
                        const today = new Date().toISOString().split('T')[0];
                        setDateRange({ start: today, end: today });
                      }}
                      className="ml-1.5 text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                )}

              <button
                onClick={handleResetFilters}
                className="ml-auto text-xs text-gray-600 hover:text-gray-800"
              >
                Clear all
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead
              className="bg-gray-50 [&_th]:px-6 [&_th]:py-3 [&_th]:text-left [&_th]:text-xs [&_th]font-medium [&_th]:text-gray-500 [&_th]:uppercase [&_th]:tracking-wider [&_th:hover]bg-gray-100">
              <tr>
                <th>Token</th>
                <th>MR#</th>
                <th>Patient Name</th>
                <th>Age/Gender</th>
                <th>Contact</th>
                <th>Guardian</th>
                <th>CNIC</th>
                <th>Doctor</th>
                <th>Purpose</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((p) => {
                  const v = latestVisitOf(p);
                  const doctorFullName = doctorNameOf(v);
                  const genderLabel = toTitle(p.patient_Gender);
                  const genderPillClass =
                    p.patient_Gender === "male" ? "bg-primary-100 text-primary-600" :
                      p.patient_Gender === "female" ? "bg-pink-100 text-pink-600" :
                        "bg-gray-100 text-gray-600";

                  return (
                    <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
                          {v?.token ?? 'N/A'}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {p.patient_MRNo}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-base font-normal text-gray-900">{p.patient_Name}</div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{p.patient_Age ?? '—'}</div>
                        <div className={`text-sm px-4 rounded-full inline-block mt-1 ${genderPillClass}`}>
                          {genderLabel || 'Other'}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{p.patient_ContactNo || 'N/A'}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {(p.patient_Address || 'No address').substring(0, 20)}...
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {p.patient_Guardian?.guardian_Name || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {p.patient_Guardian?.guardian_Relation || ''}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {p.patient_CNIC || 'N/A'}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {doctorFullName}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded text-xs ${v?.purpose?.includes('X-Ray') ? 'bg-blue-100 text-blue-800' :
                          v?.purpose?.includes('ECG') ? 'bg-green-100 text-green-800' :
                            v?.purpose?.includes('BSR') ? 'bg-yellow-100 text-yellow-800' :
                              v?.purpose?.includes('Consultation') ? 'bg-purple-100 text-purple-800' :
                                v?.purpose?.includes('Test') ? 'bg-indigo-100 text-indigo-800' :
                                  'bg-gray-100 text-gray-800'
                          }`}>
                          {v?.purpose || 'N/A'}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleView(p._id)}
                            className="text-primary-600 border border-primary-200 hover:text-primary-900 p-1 rounded-md hover:bg-primary-50"
                            aria-label={`View ${p.patient_Name}`}
                          >
                            <AiOutlineEye className="h-5 w-5" />
                          </button>

                          <button
                            onClick={() => navigate(getRoleRoute(`/opd/edit/${p.patient_MRNo}`))}
                            className="text-yellow-600 border border-yellow-200 hover:text-yellow-900 p-1 rounded-md hover:bg-yellow-50"
                            aria-label={`Edit ${p.patient_Name}`}
                          >
                            <AiOutlineEdit className="h-5 w-5" />
                          </button>

                          <button
                            onClick={() => handlePrint(p)}
                            className="text-primary-600 border border-primary-200 hover:text-primary-900 p-1 rounded-md hover:bg-primary-50"
                            aria-label={`Print ${p.patient_Name}`}
                          >
                            <AiOutlinePrinter className="h-5 w-5" />
                          </button>

                          <button
                            onClick={() => setPatientToDelete(p)}
                            className="text-red-600 border border-red-200 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                            aria-label={`Delete ${p.patient_Name}`}
                          >
                            <AiOutlineDelete className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="10" className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center justify-center py-8">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="mt-2 font-medium text-gray-600">No patients found</p>
                      <p className="text-sm text-gray-500">Try adjusting your search, purpose filter, or date filter</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredPatients.length > 0 && pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalPatients}
            itemsPerPage={pagination.limit}
            onPageChange={handlePageChange}
          />
        )}

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:justify-between justify-center sm:items-start gap-2 px-6 py-3 bg-gray-50 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing <span className="font-medium">{filteredPatients.length}</span> patients
            {selectedPurpose !== "All" && (
              <span> with purpose: <span className="font-medium text-primary-600">{selectedPurpose}</span></span>
            )}
            {dateRange.start && dateRange.end && (
              <span> between <span className="font-medium">{new Date(dateRange.start).toLocaleDateString()}</span> and <span className="font-medium">{new Date(dateRange.end).toLocaleDateString()}</span></span>
            )}
          </div>

          {(selectedPurpose !== "All" || dateRange.start !== dateRange.end || localSearch) && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Reset All Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageOpd;