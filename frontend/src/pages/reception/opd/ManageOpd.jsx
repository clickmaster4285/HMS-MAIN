import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPatients,
  fetchPatientById,
  selectSelectedPatient,
  selectSelectedPatientStatus,
  clearSelectedPatient,
  selectAllPatients,
} from "../../../features/patient/patientSlice";
import { AiOutlineEdit, AiOutlineDelete, AiOutlineEye, AiOutlinePrinter } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import PatientDetailModal from "./PatientDetailModal";
import DeletePatientConfirmation from './DeletePatientConfirmation';
import { useNavigate } from 'react-router-dom';
import PrintOptionsModal from './components/PrintOptionsModal'; // New component for print options

const ManageOpd = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const patients = useSelector(selectAllPatients);
  const selectedPatient = useSelector(selectSelectedPatient);
  const patientLoading = useSelector(selectSelectedPatientStatus);

  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [patientToPrint, setPatientToPrint] = useState(null); // Patient selected for printing
  const [showPrintModal, setShowPrintModal] = useState(false); // Controls print modal visibility

  // Default date range = today
  const [dateRange, setDateRange] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    return { start: today, end: today };
  });

  useEffect(() => {
    dispatch(fetchPatients()).unwrap().catch((err) => {
      console.error("Error fetching all patients:", err);
    });
  }, [dispatch]);

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

  // helpers
  const toTitle = (g) => g ? (g[0].toUpperCase() + g.slice(1)) : '';
  const latestVisitOf = (p) => p?.visits?.[0] || null;
  const doctorNameOf = (visit) => {
    const u = visit?.doctor?.user;
    if (u?.firstName || u?.lastName) return [u?.firstName, u?.lastName].filter(Boolean).join(' ');
    return null;
  };

  const filteredPatients = useMemo(() => {
    const q = (searchQuery || '').toLowerCase();

    return (patients || []).filter((p) => {
      if (!p) return false;

      // Search by name or MR#
      const matchesSearch =
        (p.patient_Name || '').toLowerCase().includes(q) ||
        (p.patient_MRNo || '').toString().includes(searchQuery);

      // Date filter by lastVisit (fallback createdAt)
      let matchesDate = true;
      const baseDate = new Date(p.lastVisit || p.createdAt);
      if (isNaN(baseDate.getTime())) return matchesSearch;

      if (dateRange.start || dateRange.end) {
        if (dateRange.start && !dateRange.end) {
          matchesDate = baseDate >= new Date(dateRange.start);
        } else if (!dateRange.start && dateRange.end) {
          const end = new Date(dateRange.end);
          end.setHours(23, 59, 59, 999);
          matchesDate = baseDate <= end;
        } else if (dateRange.start && dateRange.end) {
          const start = new Date(dateRange.start);
          const end = new Date(dateRange.end);
          end.setHours(23, 59, 59, 999);
          matchesDate = baseDate >= start && baseDate <= end;
        }
      }

      return matchesSearch && matchesDate;
    });
  }, [patients, searchQuery, dateRange]);

  console.log("Filtered Patients:", filteredPatients);

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

            {/* Search + Date Range */}
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
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MR#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age/Gender</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guardian</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CNIC</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                        {v?.doctor?.user?.user_Name || 'N/A'}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {v?.doctor?.doctor_Department || 'N/A'}
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
                            onClick={() => navigate(`/receptionist/opd/edit/${p.patient_MRNo}`)}
                            className="text-yellow-600 border border-yellow-200 hover:text-yellow-900 p-1 rounded-md hover:bg-yellow-50"
                            aria-label={`Edit ${p.patient_Name}`}
                          >
                            <AiOutlineEdit className="h-5 w-5" />
                          </button>

                          <button
                            onClick={() => handlePrint(p)}
                            className="text-blue-600 border border-blue-200 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50"
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
                      <p className="text-sm text-gray-500">Try adjusting your search or date filter</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Showing */}
        {filteredPatients.length > 0 && (
          <div className="bg-gray-50 border rounded-xs border-t-gray-300 px-6 py-3 flex items-center justify-center border-primary-400">
            <div className="text-sm text-gray-500 ">
              Showing <span className="font-medium">{filteredPatients.length}</span> of{' '}
              <span className="font-medium">{filteredPatients.length}</span> results
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:justify-between justify-center sm:items-start gap-2 px-6 py-3 bg-gray-50 border-t border-gray-200">
          {dateRange.start && dateRange.end && (
            <div className="text-sm px-3 py-1.5 rounded-md bg-primary-600 text-white">
              Showing patients between <span className="font-medium">{new Date(dateRange.start).toLocaleDateString()}</span> and <span className="font-medium">{new Date(dateRange.end).toLocaleDateString()}</span>
            </div>
          )}

          {(dateRange.start || dateRange.end) && (
            <button
              onClick={() => setDateRange({ start: '', end: '' })}
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