import React from 'react';

const RadiologyReportHeader = ({ currentReport, selectedReport }) => {
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return 'N/A';
    return `Rs. ${amount.toLocaleString()}`;
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return 'N/A';
    const birth = new Date(birthDate);
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    const months = now.getMonth() - birth.getMonth();
    if (months < 0 || (months === 0 && now.getDate() < birth.getDate())) {
      years--;
    }
    return `${years} Years`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleDateString();
    } catch (e) {
      return 'N/A';
    }
  };
  return (
    <div className="bg-gradient-to-r from-teal-600 to-teal-800 text-white p-8 relative">
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

export default RadiologyReportHeader;