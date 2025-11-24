// components/TestNavigation.js
import React from 'react';
import { FiChevronLeft, FiChevronRight, FiSave } from 'react-icons/fi';

export const TestNavigation = ({
  selectedTests,
  activeTestIndex,
  onTestChange,
  onSave,
  onSaveAndNext,
  onSaveAndPrev,
  statusByTest,
  getCurrentStatus,
}) => {
  const totalTests = selectedTests.length;
  const currentTest = selectedTests[activeTestIndex];
  const isFirstTest = activeTestIndex === 0;
  const isLastTest = activeTestIndex === totalTests - 1;

  const getStatusColor = (status) => {
    switch ((status || 'pending').toLowerCase()) {
      case 'completed':
      case 'verified':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'processing':
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'registered':
      case 'pending':
        return 'bg-primary-100 text-primary-800 border-primary-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Test Info */}
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

        {/* Navigation Controls */}
        <div className="flex items-center gap-3">
          {/* Previous Button */}
          <button
            onClick={onSaveAndPrev}
            disabled={isFirstTest}
            className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
              isFirstTest
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-700 transform hover:scale-105'
            }`}
          >
            <FiChevronLeft className="mr-2" />
            Previous
          </button>

          {/* Save Current */}
          <button
            onClick={onSave}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-105"
          >
            <FiSave className="mr-2" />
            Save
          </button>

          {/* Next Button */}
          <button
            onClick={onSaveAndNext}
            disabled={isLastTest}
            className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
              isLastTest
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-700 transform hover:scale-105'
            }`}
          >
            Next
            <FiChevronRight className="ml-2" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
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
    </div>
  );
};