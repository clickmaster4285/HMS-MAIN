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

        {/* Navigation Controls */}
     <div className="flex items-center gap-3 ml-auto">
          {/* Previous Button */}
          <button
            onClick={onSaveAndPrev}
            disabled={isFirstTest}
            className={`group flex items-center px-6 py-2.5 rounded-xl font-medium transition-all duration-300 shadow-md ${
              isFirstTest
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
            }`}
          >
            <FiChevronLeft className={`mr-2 transition-transform duration-300 ${!isFirstTest && 'group-hover:-translate-x-1'}`} />
            Previous
          </button>

          {/* Save Current */}
          <button
            onClick={onSave}
            className="group flex items-center px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-medium hover:from-emerald-700 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          >
            <FiSave className="mr-2 transition-transform duration-300 group-hover:rotate-12" />
            Save
          </button>

          {/* Next Button */}
          <button
            onClick={onSaveAndNext}
            disabled={isLastTest}
            className={`group flex items-center px-6 py-2.5 rounded-xl font-medium transition-all duration-300 shadow-md ${
              isLastTest
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
            }`}
          >
            Next
            <FiChevronRight className={`ml-2 transition-transform duration-300 ${!isLastTest && 'group-hover:translate-x-1'}`} />
          </button>
        </div>
      </div>

    </div>
  );
};