// TestResultsForm.js
import React, { useEffect, useRef } from 'react';
import { FiClipboard } from 'react-icons/fi';
import { FieldInputRenderer } from './components/FieldInputRenderer';
import { TestNavigation } from './components/TestNavigation';

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
  const currentTestId = selectedTests?.[activeTestIndex]?.test;
  const resultRows = formData?.results?.[currentTestId] || [];
  
  const valueInputRefs = useRef([]);
  const performedByRef = useRef(null);
  const statusRef = useRef(null);
  const overallReportRef = useRef(null);

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

  // Navigation handlers
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

  return (
    <div className="p-6">
      {/* Test Navigation */}
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