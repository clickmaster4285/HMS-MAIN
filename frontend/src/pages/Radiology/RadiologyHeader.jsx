import React from 'react';
import { formatDate } from './utils'; // Utility function for formatting dates

const RadiologyHeader = ({ currentReport, selectedReport }) => {
  return (
    <div className="bg-linear-to-r from-teal-600 to-teal-800 text-white p-8 relative">
      <div className="absolute top-4 right-4 flex space-x-2">
        <span className="bg-teal-800 text-xs px-2 py-1 rounded-full">
          ID: {currentReport?._id?.slice(-6) || 'N/A'}
        </span>
        <span className="bg-teal-700 text-xs px-2 py-1 rounded-full">
          {formatDate(currentReport?.createdAt)}
        </span>
      </div>
      <h1 className="text-3xl font-bold text-center">Radiology Report</h1>
      <p className="text-center text-sm mt-2 opacity-80">
        {selectedReport?.templateName?.replace('.html', '') || 'N/A'}
      </p>
    </div>
  );
};

export default RadiologyHeader;