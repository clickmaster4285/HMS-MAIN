// UpdateReport.js
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ReactDOMServer from 'react-dom/server';
import {
  FiChevronLeft,
  FiSave,
  FiPrinter,
  FiX,
  FiSearch,
} from 'react-icons/fi';

import { useReportHook } from '../../../hooks/useReportHook';
import TestResultsForm from './TestResultsForm';
import PatientInfoSection from './PatientInfoSection';
import PrintTestReport from './PrintTestReport';
import { updatePatientTestResults } from '../../../features/testResult/TestResultSlice';
import { LoadingState } from '../testManagment/components/LoadingState';
import { ErrorState } from '../testManagment/components/ErrorState';

const UpdateReport = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPrintOptionsModal, setShowPrintOptionsModal] = useState(false);
  const [selectedTestIds, setSelectedTestIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    formData,
    statusByTest,
    setStatusByTest,
    activeTestIndex,
    setActiveTestIndex,
    localStatuses,
    selectedTests,
    testDefinitions,
    patientData,
    patientTestById,
    status,
    error,
    handleFieldChange,
    handleOptionChange,
    saveCurrentTest,
    getCurrentStatus,
  } = useReportHook();

  // Print-related functions
  const preparePrintData = (testIds) => {
  if (!patientTestById) return null;

  const patientPrintData = {
    printData: patientTestById,
  };

  const testsToPrint = testIds.length > 0
    ? selectedTests.filter((test) => testIds.includes(test.test))
    : selectedTests;

  const testResults = testsToPrint.map((test) => {
    const currentResults = formData.results[test.test] || [];
    return {
      testName: test.testDetails.testName,
      testId: test.test, // ADD THIS - the actual test ID
      fields: currentResults.map((result) => ({
        fieldName: result.fieldName,
        value: result.value,
        unit: result.unit,
        normalRange: result.normalRange,
        notes: result.notes,
      })),
      notes: formData.notes,
    };
  });

  return { patientData: patientPrintData, testResults };
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
      page-break-after: always;
    }

    .grouped-test {
      page-break-inside: avoid;
    }

    /* Visual divider between tests */
    .test-divider {
      height: 1mm;
      margin: 6mm 0;
      background-color: #e0e0e0;
      border: none;
      border-radius: 1mm;
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
      margin-bottom: 4mm;
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

 const proceedWithPrint = async (testIds) => {
  try {
    // Save all selected tests before printing
    for (const tid of testIds) {
      const def = testDefinitions.find((td) => td._id === tid);
      if (!def || !Array.isArray(def.fields)) {
        console.warn('Skipping (no fields):', tid);
        continue;
      }

      const rows = formData?.results?.[tid] || [];
      const updateData = {
        results: rows
          .filter((r) => r?.fieldName?.trim()?.length)
          .map((r) => ({
            fieldName: r.fieldName,
            value: r.value,
            notes: r.notes,
            testId: tid,
          })),
        status: statusByTest[tid] ?? 'pending',
        notes: formData.notes ?? '',
      };

      await dispatch(
        updatePatientTestResults({
          patientTestId: id,
          testId: tid,
          updateData,
        })
      ).unwrap();
    }

    // Prepare and print the report
    const printData = preparePrintData(testIds);
    if (!printData) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups for printing');
      return;
    }

    const printContent = ReactDOMServer.renderToStaticMarkup(
      <PrintTestReport
        patientTest={printData.patientData.printData.patientTest}
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
  } catch (error) {
    alert(`Failed to save and print: ${error.message || 'Unknown error'}`);
  }
};
  const handlePrint = () => {
    setSelectedTestIds(selectedTests.map((test) => test.test));
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

  const handleSelectAll = () => {
    setSelectedTestIds(selectedTests.map((test) => test.test));
  };

  const handleDeselectAll = () => {
    setSelectedTestIds([]);
  };

  const handlePrintOption = () => {
    setShowPrintOptionsModal(false);
    if (selectedTestIds.length === 0) {
      alert('Please select at least one test to print.');
      return;
    }
    if (patientData?.paymentStatus !== 'paid') {
      setShowConfirmModal(true);
      return;
    }
    proceedWithPrint(selectedTestIds);
  };

  const handleSubmitAll = async (e) => {
    e?.preventDefault?.();

    const failures = [];
    for (const t of selectedTests) {
      const tid = t.test;
      const def = testDefinitions.find((td) => td._id === tid);
      if (!def || !Array.isArray(def.fields)) {
        console.warn('Skipping (no fields):', tid);
        continue;
      }

      const rows = formData?.results?.[tid] || [];
      const updateData = {
        results: rows
          .filter((r) => r?.fieldName?.trim()?.length)
          .map((r) => ({
            fieldName: r.fieldName,
            value: r.value,
            notes: r.notes,
            testId: tid,
          })),
        status: statusByTest[tid] ?? 'pending',
        notes: formData.notes ?? '',
      };

      try {
        await dispatch(
          updatePatientTestResults({
            patientTestId: id,
            testId: tid,
            updateData,
          })
        ).unwrap();
      } catch (err) {
        console.error('PATCH failed for', tid, err);
        failures.push({ tid, msg: err?.message });
      }
    }

    if (failures.length) {
      alert(
        'Some tests failed to save:\n' +
        failures
          .map((f) => `• ${f.tid}: ${f.msg || 'Unknown error'}`)
          .join('\n')
      );
      return;
    }

    alert('All test results updated successfully!');
    navigate(-1);
  };

  // Confirmation Modal Component for Payment
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
            The payment is pending. Are you sure you want to print before payment?
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

  // Print Options Modal Component with Test Selection
  const PrintOptionsModal = ({ isOpen, onClose, onPrint }) => {
    if (!isOpen) return null;

    const filteredTests = selectedTests.filter((test) =>
      test.testDetails.testName
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
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
              onClick={handleSelectAll}
              className="px-3 py-1.5 bg-primary-100 text-primary-700 rounded-md hover:bg-primary-200 text-sm font-medium transition-colors"
            >
              Select All
            </button>
            <button
              onClick={handleDeselectAll}
              className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium transition-colors"
            >
              Deselect All
            </button>
          </div>
          <div className="mb-6 max-h-64 overflow-y-auto pr-2">
            {filteredTests.length > 0 ? (
              filteredTests.map((test) => (
                <div key={test.test} className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    id={`test-${test.test}`}
                    checked={selectedTestIds.includes(test.test)}
                    onChange={() => handleTestSelection(test.test)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer"
                  />
                  <label
                    htmlFor={`test-${test.test}`}
                    className="ml-3 text-sm text-gray-700 hover:text-gray-900 cursor-pointer"
                  >
                    {test.testDetails.testName}
                    <span className="ml-2 text-xs text-gray-400">
                      ({getCurrentStatus(test.statusHistory)})
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

  if (status === 'loading') {
    return <LoadingState message="Loading report..." />;
  }

  if (error) {
    return <ErrorState error={error} onBack={() => navigate(-1)} />;
  }

  if (!patientTestById || !patientData) {
    return (
      <ErrorState
        error="No report found"
        onBack={() => navigate(-1)}
      />
    );
  }

  return (
    <div className="bg-gradient-to-br from-primary-50 to-primary-100 min-h-screen p-4 md:p-6">
      {/* Modals */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => {
          proceedWithPrint(selectedTestIds);
          setShowConfirmModal(false);
        }}
      />

      <PrintOptionsModal
        isOpen={showPrintOptionsModal}
        onClose={() => setShowPrintOptionsModal(false)}
        onPrint={handlePrintOption}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center bg-primary-500 px-4 py-2 text-white rounded-lg transition-all duration-200"
        >
          <FiChevronLeft className="mr-2" /> Back to Reports
        </button>

        <div className="flex items-center space-x-3">
          <div className="text-right mr-4">
            <p className="text-sm text-gray-500">Token Number</p>
            <p className="text-xl font-bold text-primary-600">
              #{patientData.tokenNumber}
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-md"
          >
            <FiPrinter className="mr-2" /> Save & Print
          </button>

          <button
            onClick={handleSubmitAll}
            className="flex items-center px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-md transform hover:scale-105"
          >
            <FiSave className="mr-2" /> Save All Results
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Lab Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-600 p-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Al-Shahbaz Modern Diagnostic Center
              </h1>
              <div className="flex items-center space-x-4 text-gray-700">
                <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
                  ISO Certified Laboratory
                </span>
                <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
                  Quality Assured
                </span>
              </div>
            </div>
            <div className="mt-4 md:mt-0 text-gray-700">
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <p className="text-sm opacity-90">MR Number</p>
                <p className="text-xl font-bold">
                  {patientData.mrNumber || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Patient Info */}
        <PatientInfoSection
          patientData={patientData}
          selectedTests={selectedTests}
          testDefinitions={testDefinitions}
          activeTestIndex={activeTestIndex}
          setActiveTestIndex={setActiveTestIndex}
          localStatuses={localStatuses}
          statusByTest={statusByTest}
          getCurrentStatus={getCurrentStatus}
        />

        {/* Test Results Form */}
        {selectedTests.length > 0 && (
          <TestResultsForm
            selectedTests={selectedTests}
            testDefinitions={testDefinitions}
            activeTestIndex={activeTestIndex}
            setActiveTestIndex={setActiveTestIndex}
            formData={formData}
            handleFieldChange={handleFieldChange}
            handleOptionChange={handleOptionChange}
            patientData={patientData}
            statusByTest={statusByTest}
            setStatusByTest={setStatusByTest}
            saveCurrentTest={saveCurrentTest}
            getCurrentStatus={getCurrentStatus}
          />
        )}
      </div>

      {/* Save All Button */}
      <div className="flex justify-end mt-6">
        <div className="flex space-x-2">
        <button
          onClick={handleSubmitAll}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md transform hover:scale-105"
        >
          <FiSave className="mr-2" /> Save All Results
        </button>
          <button
            onClick={handlePrint}
            className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-md"
          >
            <FiPrinter className="mr-2" /> Save & Print
          </button>
          </div>
      </div>
    </div>
  );
};

export default UpdateReport;