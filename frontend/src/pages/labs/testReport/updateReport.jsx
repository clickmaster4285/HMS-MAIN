// UpdateReport.js - Enhanced Beautiful & Responsive Design
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ReactDOMServer from 'react-dom/server';
import {
  FiChevronLeft,
  FiSave,
  FiPrinter,
  FiX,
  FiSearch,
  FiCheck,
  FiAlertCircle,
} from 'react-icons/fi';

import { useReportHook } from '../../../hooks/useReportHook';
import TestResultsForm from './TestResultsForm';
import PatientInfoSection from './PatientInfoSection';
import PrintTestReport from './PrintTestReport';
import { updatePatientTestResults } from '../../../features/testResult/TestResultSlice';
import { LoadingState } from '../testManagment/components/LoadingState';
import { ErrorState } from '../testManagment/components/ErrorState';
import { TestNavigation } from './components/TestNavigation';

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
        testId: test.test,
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

      .page-container {
        width: 210mm;
        min-height: 297mm;
        position: relative;
        page-break-inside: avoid;
      }

      .letterhead-space {
        height: 74mm;
        background-color: transparent;
      }

      .content-area {
        padding: 0 10mm;
        min-height: 223mm;
      }

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

      .test-divider {
        height: 1mm;
        margin: 6mm 0;
        background-color: #e0e0e0;
        border: none;
        border-radius: 1mm;
      }

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

      .patient-info {
        margin-bottom: 8mm;
      }

      .legal-notice {
        text-align: right;
        margin-bottom: 4mm;
        font-size: 10pt;
        color: #666;
      }

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
        
        * {
          visibility: visible !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .letterhead-space {
          background-color: transparent !important;
        }
      }

      .abnormal {
        color: red !important;
        font-weight: bold !important;
      }
    </style>
  `;

  const proceedWithPrint = async (testIds) => {
    try {
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

  // Enhanced Confirmation Modal Component
  const ConfirmModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 animate-slideUp">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-amber-100 p-2 rounded-full">
                  <FiAlertCircle className="text-amber-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Payment Pending
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
              >
                <FiX size={24} />
              </button>
            </div>
            <p className="text-gray-600 mb-8 leading-relaxed">
              The payment for this report is still pending. Are you sure you want to proceed with printing before payment is confirmed?
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium transition-all duration-200 hover:shadow-md"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 px-6 py-3 bg-linear-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Confirm Print
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Enhanced Print Options Modal Component
  const PrintOptionsModal = ({ isOpen, onClose, onPrint }) => {
    if (!isOpen) return null;

    const filteredTests = selectedTests.filter((test) =>
      test.testDetails.testName
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col transform transition-all duration-300 animate-slideUp">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-900">
                Select Tests to Print
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
              >
                <FiX size={24} />
              </button>
            </div>
            
            {/* Search Bar */}
            <div className="relative">
              <FiSearch
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tests by name..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleSelectAll}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center space-x-2"
              >
                <FiCheck size={16} />
                <span>Select All</span>
              </button>
              <button
                onClick={handleDeselectAll}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-all duration-200"
              >
                Deselect All
              </button>
              <div className="ml-auto flex items-center space-x-2 text-sm text-gray-600">
                <span className="font-medium">{selectedTestIds.length}</span>
                <span>of {selectedTests.length} selected</span>
              </div>
            </div>
          </div>

          {/* Test List */}
          <div className="flex-1 overflow-y-auto p-6">
            {filteredTests.length > 0 ? (
              <div className="space-y-2">
                {filteredTests.map((test) => {
                  const isSelected = selectedTestIds.includes(test.test);
                  const testStatus = getCurrentStatus(test.statusHistory);
                  
                  return (
                    <label
                      key={test.test}
                      className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'bg-primary-50 border-primary-500 shadow-md'
                          : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleTestSelection(test.test)}
                        className="h-5 w-5 text-primary-600 focus:ring-2 focus:ring-primary-500 border-gray-300 rounded cursor-pointer"
                      />
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">
                            {test.testDetails.testName}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              testStatus === 'completed'
                                ? 'bg-green-100 text-green-700'
                                : testStatus === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {testStatus}
                          </span>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FiSearch className="text-gray-300 mb-4" size={48} />
                <p className="text-gray-500 font-medium">No tests match your search</p>
                <p className="text-gray-400 text-sm mt-1">Try a different search term</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={onPrint}
                className="flex-1 px-6 py-3 bg-linear-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center space-x-2"
                disabled={selectedTestIds.length === 0}
              >
                <FiPrinter size={20} />
                <span>Print {selectedTestIds.length} Test{selectedTestIds.length !== 1 ? 's' : ''}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Keyboard navigation and other handlers
  const currentTestId = selectedTests?.[activeTestIndex]?.test;
  const resultRows = formData?.results?.[currentTestId] || [];
  
  const valueInputRefs = useRef([]);
  const performedByRef = useRef(null);
  const statusRef = useRef(null);
  const overallReportRef = useRef(null);

  const handleResultKeyDown = (e, i) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const next = valueInputRefs.current?.[i + 1];
      if (next && typeof next.focus === 'function') {
        next.focus();
      } else if (performedByRef.current) {
        performedByRef.current.focus();
      }
    }
  };

  const handleSimpleEnterNext = (e, nextRef) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextRef?.current && typeof nextRef.current.focus === 'function') {
        nextRef.current.focus();
      }
    }
  };

  const handleTextareaEnterNext = (e, nextRef) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (nextRef?.current && typeof nextRef.current.focus === 'function') {
        nextRef.current.focus();
      }
    }
  };

  useEffect(() => {
    valueInputRefs.current = Array(resultRows.length);
    const id = setTimeout(() => {
      const first = valueInputRefs.current?.[0];
      if (first && typeof first.focus === 'function') first.focus();
    }, 0);
    return () => clearTimeout(id);
  }, [currentTestId, resultRows.length]);

  const goToIndex = (index) => {
    if (index >= 0 && index < selectedTests.length) {
      setActiveTestIndex(index);
    }
  };

  const handleSaveAndNext = async () => {
    try {
      await saveCurrentTest(currentTestId);
      goToIndex(activeTestIndex + 1);
    } catch (error) {
      console.error('Failed to save and navigate:', error);
    }
  };

  const handleSaveAndPrev = async () => {
    try {
      await saveCurrentTest(currentTestId);
      goToIndex(activeTestIndex - 1);
    } catch (error) {
      console.error('Failed to save and navigate:', error);
    }
  };

  const handleSaveCurrent = async () => {
    try {
      await saveCurrentTest(currentTestId);
    } catch (error) {
      console.error('Failed to save:', error);
    }
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
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50">
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

      {/* Main Container */}
      <div className=" p-4 ">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 px-6 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 group w-fit"
          >
            <FiChevronLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
            <span className="font-medium">Back to Reports</span>
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Token Number Card */}
            <div className="bg-linear-to-br from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl shadow-lg">
              <p className="text-xs opacity-90 font-medium uppercase tracking-wide">Token Number</p>
              <p className="text-2xl font-bold mt-1">
                #{patientData.tokenNumber}
              </p>
            </div>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 px-6 py-3 bg-linear-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <FiPrinter size={20} />
              <span className="font-medium">Save & Print</span>
            </button>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Lab Header with Enhanced Design */}
          <div className="relative bg-linear-to-r from-primary-600 via-primary-700 to-primary-800 p-8 md:p-10 text-white overflow-hidden">
            {/* Decorative Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-32 -translate-y-32"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48"></div>
            </div>

            <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  Al-Shahbaz Modern Diagnostic Center
                </h1>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium flex items-center space-x-2">
                    <FiCheck className="text-green-300" />
                    <span>ISO Certified Laboratory</span>
                  </span>
                  <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium flex items-center space-x-2">
                    <FiCheck className="text-green-300" />
                    <span>Quality Assured</span>
                  </span>
                </div>
              </div>
              
              {/* MR Number Card */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
                <p className="text-sm opacity-90 mb-2 font-medium">MR Number</p>
                <p className="text-3xl font-bold">
                  {patientData.mrNumber || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Patient Info Section */}
          <div className="p-6 md:p-8">
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
          </div>

          {/* Test Results Form */}
          {selectedTests.length > 0 && (
            <div className="px-6 md:px-8 pb-8">
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
            </div>
          )}
        </div>

        {/* Test Navigation */}
        <div className="mt-6">
          <TestNavigation
            selectedTests={selectedTests}
            activeTestIndex={activeTestIndex}
            onTestChange={setActiveTestIndex}
            onSave={handleSaveCurrent}
            onSaveAndNext={handleSaveAndNext}
            onSaveAndPrev={handleSaveAndPrev}
            statusByTest={statusByTest}
            getCurrentStatus={getCurrentStatus}
          />
        </div>

        {/* Bottom Action Bar */}
        <div className="flex justify-end mt-6">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-3 px-8 py-4 bg-linear-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            <FiPrinter size={22} />
            <span className="font-semibold text-lg">Save & Print Report</span>
          </button>
        </div>
      </div>

    </div>
  );
};

export default UpdateReport;