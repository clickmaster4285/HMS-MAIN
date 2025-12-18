// TestResultsForm.js
import React, { useEffect, useRef } from 'react';
import { FiClipboard } from 'react-icons/fi';
import { FieldInputRenderer } from './components/FieldInputRenderer';

const TestResultsForm = ({
  selectedTests,
  testDefinitions,
  activeTestIndex,
  setActiveTestIndex,
  formData,
  handleFieldChange,
  handleOptionChange,
  handleFormDataChange,
  patientData,
  statusByTest,
  setStatusByTest,
  saveCurrentTest,
  getCurrentStatus,
}) => {
  const currentTest = selectedTests?.[activeTestIndex];
  const currentTestId = currentTest?.test;
  const resultRows = formData?.results?.[currentTestId] || [];
  const totalTests = selectedTests.length;
  
  const valueInputRefs = useRef([]);
  const performedByRef = useRef(null);
  const statusRef = useRef(null);
  const overallReportRef = useRef(null);

  // Status color helper function
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'verified':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'registered':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'draft':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Keyboard navigation handlers
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

  // Auto-focus first field on test change
  useEffect(() => {
    valueInputRefs.current = Array(resultRows.length);
    const id = setTimeout(() => {
      const first = valueInputRefs.current?.[0];
      if (first && typeof first.focus === 'function') first.focus();
    }, 0);
    return () => clearTimeout(id);
  }, [currentTestId, resultRows.length]);

  if (!currentTest) {
    return (
      <div className="p-6 text-center text-gray-500">
        No test selected
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Test Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {currentTest?.testDetails?.testName || 'Test Results'}
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
              statusByTest[currentTest?.test] || getCurrentStatus(currentTest?.statusHistory)
            )}`}>
              {statusByTest[currentTest?.test] || getCurrentStatus(currentTest?.statusHistory)}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Test {activeTestIndex + 1} of {totalTests}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{Math.round(((activeTestIndex + 1) / totalTests) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((activeTestIndex + 1) / totalTests) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Results Fields */}
      <div className="space-y-4 mb-8">
        {resultRows.map((result, index) => (
          <FieldInputRenderer
            key={index}
            field={result}
            fieldIndex={index}
            testId={currentTestId}
            value={result.value}
            onChange={handleFieldChange}
            onOptionChange={handleOptionChange}
            patientData={patientData}
            inputRef={(el) => (valueInputRefs.current[index] = el)}
            onKeyDown={(e) => handleResultKeyDown(e, index)}
          />
        ))}
      </div>

      {/* Status and Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
        {/* Performed By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Performed By
          </label>
          <input
            type="text"
            value={formData.performedBy || ''}
            onChange={(e) => handleFormDataChange('performedBy', e.target.value)}
            ref={performedByRef}
            onKeyDown={(e) => handleSimpleEnterNext(e, statusRef)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter technician name"
          />
        </div>

        {/* Report Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Report Status
          </label>
          <select
            value={statusByTest?.[currentTestId] || 'registered'}
            onChange={(e) => setStatusByTest(prev => ({
              ...prev,
              [currentTestId]: e.target.value
            }))}
            ref={statusRef}
            onKeyDown={(e) => handleSimpleEnterNext(e, overallReportRef)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          >
            <option value="registered">Registered</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="verified">Verified</option>
            <option value="cancelled">Cancelled</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {/* Overall Report */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Overall Test Report
          </label>
          <textarea
            rows={3}
            value={formData.notes || ''}
            onChange={(e) => handleFormDataChange('notes', e.target.value)}
            ref={overallReportRef}
            onKeyDown={(e) => handleTextareaEnterNext(e, null)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            placeholder="Overall interpretation / impression (Shift+Enter for newline)"
          />
        </div>
      </div>
    </div>
  );
};

export default TestResultsForm;