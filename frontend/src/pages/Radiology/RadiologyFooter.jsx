import React from 'react';

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString();
  } catch (e) {
    return 'N/A';
  }
};

const RadiologyFooter = ({ currentReport }) => {
  return (
    <div className="bg-teal-50 p-8 text-right border-t border-gray-200">
      <div className="flex justify-between items-center">
        <div className="text-left">
          <p className="text-gray-600 text-sm">
            Report Status:{' '}
            <span className="font-medium text-teal-700">
              {currentReport?.deleted ? 'Deleted' : 'Finalized'}
            </span>
          </p>
          <p className="text-gray-600 text-sm">
            Last Updated: {formatDate(currentReport?.updatedAt)}
          </p>
        </div>
        <div>
          <p className="text-teal-700 font-semibold text-lg">
            {currentReport?.performedBy?.name || 'Dr. Mansoor Ghani'}
          </p>
          <p className="text-gray-600 text-sm">
            {currentReport?.performedBy?.name
              ? 'Radiology Technician'
              : 'Consultant Radiologist'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RadiologyFooter;
