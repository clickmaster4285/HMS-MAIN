import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import TestDetail from './TestDetail';
import { fetchPatientTestAll } from '../../../features/patientTest/patientTestSlice';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PrintTestReport from './PrintTestReport';
import ReactDOMServer from 'react-dom/server';
import {
  FiSearch,
  FiFilter,
  FiCalendar,
  FiX,
  FiChevronDown,
  FiChevronUp,
  FiMoreVertical,
} from 'react-icons/fi';
import { format } from 'date-fns';

const statusColors = {
  completed: 'bg-green-100 text-green-800',
  pending: 'bg-gray-100 text-gray-800',
  processing: 'bg-yellow-100 text-yellow-800',
  registered: 'bg-primary-100 text-primary-800',
  not_started: 'bg-gray-200 text-gray-800',
};

const paymentStatusColors = {
  paid: 'bg-green-100 text-green-800',
  pending: 'bg-red-100 text-red-800',
  partial: 'bg-yellow-100 text-yellow-800',
  refunded: 'bg-red-100 text-red-800',
};

const statusMap = {
  completed: 'Completed',
  pending: 'Pending',
  processing: 'Processing',
  registered: 'Registered',
  not_started: 'Not Started',
};

const paymentStatusMap = {
  paid: 'Paid',
  pending: 'Unpaid',
  partial: 'Partial',
  refunded: 'Refunded',
};

const TestReport = () => {
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    paymentStatus: 'all',
    testStatus: 'all',
    startDate: null,
    endDate: null,
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPrintOptionsModal, setShowPrintOptionsModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedTestIds, setSelectedTestIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const allPatientTests = useSelector(
    (state) => state.patientTest.allPatientTests
  );
  const { summaryByDate } = useSelector((state) => state.testResult);
  const filterRef = useRef(null);
  const [showSummaryDatePicker, setShowSummaryDatePicker] = useState(false);
  const [summaryDates, setSummaryDates] = useState({
    startDate: new Date(),
    endDate: null,
  });

  useEffect(() => {
    dispatch(fetchPatientTestAll());

    const handleFilterClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterPopup(false);
      }
    };

    const handleDropdownClickOutside = (event) => {
      const dropdowns = document.querySelectorAll('[id^="dropdown-"]');
      dropdowns.forEach((dropdown) => {
        if (!dropdown.contains(event.target)) {
          dropdown.classList.add('hidden');
        }
      });
    };

    document.addEventListener('mousedown', handleFilterClickOutside);
    document.addEventListener('click', handleDropdownClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleFilterClickOutside);
      document.removeEventListener('click', handleDropdownClickOutside);
    };
  }, [dispatch]);

  const getCurrentStatus = (statusHistory) => {
    if (!statusHistory || statusHistory.length === 0) return 'registered';
    const sortedHistory = [...statusHistory].sort(
      (a, b) => new Date(b.changedAt) - new Date(a.changedAt)
    );
    return sortedHistory[0].status;
  };

  const formatPatientTests = (tests) => {
    if (!tests || !tests.selectedTests) return null;

    const currentStatuses = tests.selectedTests.map((test) =>
      getCurrentStatus(test.statusHistory)
    );

    const overallStatus = currentStatuses.includes('pending')
      ? 'pending'
      : currentStatuses.includes('processing')
      ? 'processing'
      : currentStatuses.every((s) => s === 'completed')
      ? 'completed'
      : 'registered';

    return {
      id: tests._id,
      token: tests.tokenNumber,
      patientName: tests.patient_Detail?.patient_Name || 'N/A',
      patientMRNo: tests.patient_Detail?.patient_MRNo || 'N/A',
      patientCNIC: tests.patient_Detail?.patient_CNIC || 'N/A',
      patientContact: tests.patient_Detail?.patient_ContactNo || 'N/A',
      patientAge: tests.patient_Detail?.patient_Age || 'N/A',
      patientGender: tests.patient_Detail?.patient_Gender || 'N/A',
      testCount: tests.selectedTests.length,
      tests: tests.selectedTests.map((test) => ({
        testName: test.testDetails?.testName || 'N/A',
        testCode: test.testDetails?.testCode || 'N/A',
        status: getCurrentStatus(test.statusHistory),
        amount: test.testDetails?.testPrice || 0,
        testId: test.test, // Added for test selection
      })),
      date: tests.createdAt,
      status: overallStatus,
      paymentStatus: tests.paymentStatus || 'pending',
      totalAmount: tests.totalAmount || 0,
      discount: tests.discountAmount || 0,
      finalAmount: tests.finalAmount || 0,
      advancePayment: tests.advanceAmount || 0,
      remainingAmount: tests.remainingAmount || 0,
      referredBy: tests.referredBy || 'N/A',
      labNotes: tests.labNotes || 'N/A',
      fullData: tests,
    };
  };

  const filteredReports = () => {
    if (!allPatientTests || allPatientTests.length === 0) return [];
    const allPatientReports = allPatientTests
      .map((patientTest) => formatPatientTests(patientTest))
      .filter(Boolean);

    return allPatientReports.filter((report) => {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        filters.search === '' ||
        report.patientName.toLowerCase().includes(searchLower) ||
        report.patientMRNo.toLowerCase().includes(searchLower) ||
        report.patientCNIC.toLowerCase().includes(searchLower) ||
        report.patientContact.toLowerCase().includes(searchLower);

      const matchesPaymentStatus =
        filters.paymentStatus === 'all' ||
        report.paymentStatus === filters.paymentStatus;

      const matchesTestStatus =
        filters.testStatus === 'all' || report.status === filters.testStatus;

      const reportDate = new Date(report.date);
      let matchesDateRange = true;
      if (filters.startDate || filters.endDate) {
        if (filters.startDate) {
          matchesDateRange =
            reportDate >= new Date(filters.startDate.setHours(0, 0, 0, 0));
        }
        if (matchesDateRange && filters.endDate) {
          matchesDateRange =
            reportDate <= new Date(filters.endDate.setHours(23, 59, 59, 999));
        }
      }

      return (
        matchesSearch &&
        matchesPaymentStatus &&
        matchesTestStatus &&
        matchesDateRange
      );
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setFilters((prev) => ({
      ...prev,
      startDate: start,
      endDate: end,
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      paymentStatus: 'all',
      testStatus: 'all',
      startDate: null,
      endDate: null,
    });
  };

  const applyFilters = () => {
    setShowFilterPopup(false);
  };

const preparePrintData = (report, testIds) => {
  if (!report || !report.fullData) return null;

  const patientTest = report.fullData;
  const testDefinitions = report.fullData.testDefinitions;

  const selectedTests =
    testIds.length > 0
      ? patientTest.selectedTests.filter((test) =>
          testIds.includes(test.test)
        )
      : patientTest.selectedTests;

  const testResults = selectedTests.map((test) => {
    const definition = testDefinitions.find(
      (def) => def.testCode === test.testDetails?.testCode
    );

    return {
      testName: test.testDetails?.testName || 'Unknown Test',
      testId: test.test, // ADD THIS - the actual test ID
      fields: (definition?.fields || []).map((field) => ({
        fieldName: field.name || 'Unknown Field',
        value: field.value || '',
        unit: field.unit || '',
        normalRange: field.normalRange || null,
        notes: field.notes || '',
      })),
      notes: test.notes || '',
    };
  });
  
  return {
    patientTest,
    testResults,
  };
};

  const handlePrint = (report) => {
    setSelectedReport(report);
    setSelectedTestIds(
      report.tests.filter((t) => t.status === 'completed').map((t) => t.testId)
    );
    setSearchQuery('');
    setShowPrintOptionsModal(true);
  };

  const handleTestSelection = (testId) => {
    setSelectedTestIds((prev) =>
      prev.includes(testId)
        ? prev.filter((id) => id !== testId)
        : [...prev, testId]
    );
  };
  const handleCompletedAll = () => {
    const completedTestIds = selectedReport.tests
      .filter((test) => test.status === 'completed')
      .map((test) => test.testId);
    setSelectedTestIds(completedTestIds);
  };

  const handleSelectAll = () => {
    setSelectedTestIds(selectedReport.tests.map((test) => test.testId));
  };

  const handleDeselectAll = () => {
    setSelectedTestIds([]);
  };

  const handleSelectRegistered = () => {
    const registeredTestIds = selectedReport.tests
      .filter((test) => test.status === 'registered')
      .map((test) => test.testId);
    setSelectedTestIds(registeredTestIds);
  };

  const handlePrintOption = () => {
    setShowPrintOptionsModal(false);
    if (selectedTestIds.length === 0) {
      alert('Please select at least one test to print.');
      return;
    }
    if (selectedReport?.paymentStatus !== 'paid') {
      setShowConfirmModal(true);
      return;
    }
    proceedWithPrint(selectedReport, selectedTestIds);
  };

const enhancedPrintCSS = `
  <style>
    @page {
      size: A4;
      margin: 0;
    }
    
    body {
      margin: 0;
      padding: 0;
      color: #333;
      font-family: Arial, sans-serif;
      font-size: 12pt;
      line-height: 1.3;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      background: white;
    }

    /* Page container for each page */
    .page-container {
      width: 210mm;
      min-height: 297mm;
      position: relative;
      page-break-inside: avoid;
    }

    /* Letterhead space - 25% of page */
    .letterhead-space {
      height: 74mm;
      background-color: transparent;
    }

    /* Content area - starts after letterhead */
    .content-area {
      padding: 0 10mm;
      min-height: 223mm;
    }

    /* ENHANCED PAGE BREAK SUPPORT */
    .separate-page-test {
      page-break-after: always !important;
      page-break-before: always !important;
    }

    .grouped-tests-page {
      page-break-inside: avoid;
    }

    .grouped-test {
      page-break-inside: avoid;
    }

    /* Ensure tables are visible and properly formatted */
    table {
      border-collapse: collapse;
      width: 100%;
    }

    th, td {
      border: 1px solid #ddd;
      padding: 4px 6px;
      text-align: left;
    }

    th {
      background-color: #f0f0f0;
      font-weight: bold;
    }

    /* Patient info styling */
    .patient-info {
      margin-bottom: 8mm;
    }

    .legal-notice {
      text-align: right;
      margin-bottom: 4mm;
      font-size: 10pt;
      color: #666;
    }

    /* Test section styling */
    .test-section {
      margin-bottom: 8mm;
    }

    .test-title {
      font-weight: bold;
      font-size: 13pt;
      margin-bottom: 3mm;
      color: #2b6cb0;
      border-bottom: 2px solid #2b6cb0;
      padding-bottom: 2px;
    }

    @media print {
      body {
        margin: 0;
        padding: 0;
        width: 210mm;
      }
      
      .separate-page-test {
        page-break-after: always !important;
        page-break-before: always !important;
      }
      
      .grouped-tests-page {
        page-break-after: always;
      }
      
      /* Ensure everything is visible when printing */
      * {
        visibility: visible !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      /* Hide letterhead space in print if needed */
      .letterhead-space {
        background-color: transparent !important;
      }
    }

    /* Abnormal result styling */
    .abnormal {
      color: red !important;
      font-weight: bold !important;
    }
  </style>
`;

  const proceedWithPrint = (report, testIds) => {
    const printData = preparePrintData(report, testIds);
    if (!printData) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups for printing');
      return;
    }

    const printContent = ReactDOMServer.renderToStaticMarkup(
      <PrintTestReport
        patientTest={printData.patientTest}
        testDefinitions={printData.testResults}
      />
    );

    printWindow.document.open();
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Test Report</title>
            ${enhancedPrintCSS}
        </head>
        <body>${printContent}</body>
        <script>
          window.onload = function() {
            setTimeout(() => {
              window.print();
              window.close();
            }, 500);
          };
        </script>
      </html>
    `);
    printWindow.document.close();
  };

  const ConfirmModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-transform duration-300 ease-in-out scale-95 animate-scale-up">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Payment Pending
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiX size={20} />
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            The payment is pending. Are you sure you want to print before
            payment?
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium transition-colors"
            >
              Confirm Print
            </button>
          </div>
        </div>
      </div>
    );
  };

  const PrintOptionsModal = ({ isOpen, onClose, onPrint }) => {
    if (!isOpen || !selectedReport) return null;

    const filteredTests = selectedReport.tests.filter((test) =>
      test.testName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out">
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg transform transition-transform duration-300 ease-in-out scale-95 animate-scale-up">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Select Tests to Print
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>
          <div className="relative mb-4">
            <FiSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tests..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-colors"
            />
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={handleCompletedAll}
              className="px-3 py-1.5 bg-primary-100 text-primary-700 rounded-md hover:bg-primary-200 text-sm font-medium transition-colors"
            >
              Completed
            </button>
            <button
              onClick={handleSelectAll}
              className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-md hover:bg-amber-200 text-sm font-medium transition-colors"
            >
              Select All
            </button>
            <button
              onClick={handleDeselectAll}
              className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium transition-colors"
            >
              Deselect All
            </button>
            <button
              onClick={handleSelectRegistered}
              className="px-3 py-1.5 bg-green-100 text-green-700 rounded-md hover:bg-green-200 text-sm font-medium transition-colors"
            >
              Registered Tests
            </button>
          </div>
          <div className="mb-6 max-h-64 overflow-y-auto pr-2">
            {filteredTests.length > 0 ? (
              filteredTests.map((test) => (
                <div key={test.testId} className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    id={`test-${test.testId}`}
                    checked={selectedTestIds.includes(test.testId)}
                    onChange={() => handleTestSelection(test.testId)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer"
                  />
                  <label
                    htmlFor={`test-${test.testId}`}
                    className="ml-3 text-sm text-gray-700 hover:text-gray-900 cursor-pointer"
                  >
                    {test.testName}
                    <span className="ml-2 text-xs text-gray-400">
                      ({statusMap[test.status] || test.status})
                    </span>
                  </label>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center">
                No tests match your search.
              </p>
            )}
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onPrint}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm font-medium transition-colors disabled:bg-primary-300 disabled:cursor-not-allowed"
              disabled={selectedTestIds.length === 0}
            >
              Print Selected Tests
            </button>
          </div>
        </div>
      </div>
    );
  };

  const reports = filteredReports();

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 relative">
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => {
          proceedWithPrint(selectedReport, selectedTestIds);
          setShowConfirmModal(false);
        }}
      />
      <PrintOptionsModal
        isOpen={showPrintOptionsModal}
        onClose={() => setShowPrintOptionsModal(false)}
        onPrint={handlePrintOption}
      />
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Patient Reports</h2>
          <p className="text-sm text-gray-500">
            Manage and track all patient reports
          </p>
        </div>
        <div className="flex items-center space-x-2 relative">
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search patients, MRNo..."
              className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setShowFilterPopup(!showFilterPopup)}
              className="flex items-center px-4 py-2 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium hover:bg-primary-100 transition-colors"
            >
              <FiFilter className="mr-2" />
              More Filters
              {showFilterPopup ? (
                <FiChevronUp className="ml-2" />
              ) : (
                <FiChevronDown className="ml-2" />
              )}
            </button>
            {showFilterPopup && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    More Filters
                  </h3>
                  <button
                    onClick={() => setShowFilterPopup(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <FiX size={20} />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date Range
                    </label>
                    <div className="relative">
                      <DatePicker
                        selectsRange
                        startDate={filters.startDate}
                        endDate={filters.endDate}
                        onChange={handleDateChange}
                        isClearable
                        placeholderText="Select date range"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                      <FiCalendar className="absolute right-3 top-3 text-gray-400" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Status
                      </label>
                      <select
                        name="paymentStatus"
                        value={filters.paymentStatus}
                        onChange={handleFilterChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="all">All Payment Status</option>
                        <option value="paid">Paid</option>
                        <option value="pending">Unpaid</option>
                        <option value="partial">Partial</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Test Status
                      </label>
                      <select
                        name="testStatus"
                        value={filters.testStatus}
                        onChange={handleFilterChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="all">All Test Status</option>
                        <option value="completed">Completed</option>
                        <option value="processing">Processing</option>
                        <option value="registered">Registered</option>
                        <option value="not_started">Not Started</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between mt-6">
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium transition-colors"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={applyFilters}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm font-medium transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowSummaryDatePicker(true)}
            className="text-white font-medium py-2 px-4 rounded hover:opacity-90 transition bg-[#009689]"
          >
            View/Download Summary
          </button>
          {showSummaryDatePicker && (
            <div className="absolute top-full mt-2 z-50 bg-white border border-gray-300 rounded-lg p-4 shadow-lg right-0">
              <DatePicker
                selectsRange
                startDate={summaryDates.startDate}
                endDate={summaryDates.endDate}
                onChange={(dates) => {
                  const [start, end] = dates;
                  setSummaryDates({
                    startDate: start,
                    endDate: end,
                  });
                }}
                isClearable
                inline
              />
              <div className="flex justify-end mt-2 space-x-2">
                <button
                  onClick={() => setShowSummaryDatePicker(false)}
                  className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const { startDate, endDate } = summaryDates;
                    const formatDate = (date) => format(date, 'yyyy-MM-dd');

                    if (startDate && endDate) {
                      navigate(
                        `/lab/test-report-Summery/${formatDate(
                          startDate
                        )}_${formatDate(endDate)}`
                      );
                    } else if (startDate) {
                      navigate(
                        `/lab/test-report-Summery/${formatDate(startDate)}`
                      );
                    } else {
                      alert('Please select at least one date.');
                    }

                    setShowSummaryDatePicker(false);
                  }}
                  className="px-4 py-2 text-sm text-white bg-[#009689] rounded hover:bg-opacity-90"
                >
                  Download
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-primary-50 p-4 rounded-lg border border-primary-100">
          <p className="text-sm text-primary-600 font-medium">Total Patients</p>
          <p className="text-2xl font-bold text-primary-800">{reports.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <p className="text-sm text-green-600 font-medium">Completed</p>
          <p className="text-2xl font-bold text-green-800">
            {reports.filter((r) => r.status === 'completed').length}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
          <p className="text-sm text-yellow-600 font-medium">Processing</p>
          <p className="text-2xl font-bold text-yellow-800">
            {reports.filter((r) => r.status === 'processing').length}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
          <p className="text-sm text-red-600 font-medium">Pending Payment</p>
          <p className="text-2xl font-bold text-red-800">
            {reports.filter((r) => r.paymentStatus === 'pending').length}
          </p>
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Token #
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Patient
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tests
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Paid
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Remaining
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Payment Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Total Amount
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.length > 0 ? (
              reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {report.token}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {report.patientName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {report.patientMRNo}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {report.testCount}{' '}
                      {report.testCount === 1 ? 'test' : 'tests'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {report.tests.slice(0, 2).map((test) => (
                        <div key={test.testCode}>{test.testName}</div>
                      ))}
                      {report.testCount > 2 && (
                        <div className="text-xs text-gray-500">
                          +{report.testCount - 2} more
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(report.date), 'MMM dd, yyyy HH:mm')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(() => {
                      const total = report.tests.length || 0;
                      const completed = report.tests.filter(
                        (t) => t.status === 'completed'
                      ).length;

                      // pick a color: green when all done, amber when partial, gray when none
                      const chipColor =
                        completed === total
                          ? 'bg-green-100 text-green-800'
                          : completed > 0
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800';

                      return (
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${chipColor}`}
                        >
                          {completed}/{total} Completed
                        </span>
                      );
                    })()}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.advancePayment.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.remainingAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        paymentStatusColors[report.paymentStatus]
                      }`}
                    >
                      {paymentStatusMap[report.paymentStatus]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    PKR {report.totalAmount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                    <div className="inline-block text-left">
                      <div>
                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded-full w-8 h-8 bg-gray-100 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          id={`options-menu-${report.id}`}
                          aria-expanded="false"
                          aria-haspopup="true"
                          onClick={(e) => {
                            e.stopPropagation();
                            document
                              .getElementById(`dropdown-${report.id}`)
                              .classList.toggle('hidden');
                          }}
                        >
                          <span className="sr-only">Open options</span>
                          <FiMoreVertical className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="min-h-[90px] absolute top-0 right-16">
                        <div
                          id={`dropdown-${report.id}`}
                          className="hidden bg-white z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none transition duration-150 ease-in-out"
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby={`options-menu-${report.id}`}
                        >
                          <div className="py-1" role="none">
                            <button
                              onClick={() =>
                                navigate(`/lab/update-report/${report.id}`)
                              }
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                              role="menuitem"
                            >
                              Update Report
                            </button>
                            <button
                              onClick={() => handlePrint(report)}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                              role="menuitem"
                            >
                              Print
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="10"
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No patients found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TestReport;
