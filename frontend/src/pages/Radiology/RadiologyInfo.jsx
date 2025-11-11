import React from 'react';

import PrintRadiologyReport from './PrintRadiologyReport';
import ReactDOMServer from 'react-dom/server';


const RadiologyInfo = ({ currentReport, selectedReport, handlePrint }) => {
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
    <div className="flex justify-between">
      <div className="p-8 border-b border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-teal-700 flex items-center">
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Patient Information
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="text-gray-700">
              <span className="font-medium text-teal-600">MRN:</span>{' '}
              {currentReport?.patientMRNO || 'N/A'}
            </p>
            <p className="text-gray-700">
              <span className="font-medium text-teal-600">Name:</span>{' '}
              {currentReport?.patientName || 'N/A'}
            </p>
            <p className="text-gray-700">
              <span className="font-medium text-teal-600">Contact:</span>{' '}
              {currentReport?.patient_ContactNo || 'N/A'}
            </p>
            <p className="text-gray-700">
              <span className="font-medium text-teal-600">Test Name:</span>{' '}
              {selectedReport?.templateName?.replace('.html', '') || 'N/A'}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-gray-700">
              <span className="font-medium text-teal-600">Age:</span>{' '}
              {calculateAge(currentReport?.age)}
            </p>
            <p className="text-gray-700">
              <span className="font-medium text-teal-600">Sex:</span>{' '}
              {currentReport?.sex || 'N/A'}
            </p>
            <p className="text-gray-700">
              <span className="font-medium text-teal-600">Performed By:</span>{' '}
              {currentReport?.performedBy?.name || 'N/A'}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-gray-700">
              <span className="font-medium text-teal-600">Date:</span>{' '}
              {formatDate(currentReport?.date)}
            </p>
            <p className="text-gray-700">
              <span className="font-medium text-teal-600">Referred By:</span>{' '}
              {selectedReport?.referBy || 'N/A'}
            </p>
            <p className="text-gray-700">
              <span className="font-medium text-teal-600">Status:</span>{' '}
              {currentReport?.deleted
                ? 'Deleted'
                : selectedReport?.paymentStatus || 'Active'}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-gray-700">
              <span className="font-medium text-teal-600">Total Amount:</span>{' '}
              {formatCurrency(selectedReport?.totalAmount)}
            </p>
            <p className="text-gray-700">
              <span className="font-medium text-teal-600">Paid Amount:</span>{' '}
              {formatCurrency(selectedReport?.totalPaid)}
            </p>
            <p className="text-gray-700">
              <span className="font-medium text-teal-600">
                Advance Payment:
              </span>{' '}
              {formatCurrency(selectedReport?.advanceAmount)}
            </p>
            <p className="text-gray-700">
              <span className="font-medium text-teal-600">Discount:</span>{' '}
              {formatCurrency(selectedReport?.discount)}
            </p>
            <p className="text-gray-700">
              <span className="font-medium text-teal-600">Refund Amount:</span>{' '}
              {selectedReport?.refunded?.length > 0
                ? selectedReport.refunded.map((refund) => (
                    <div key={refund._id} className="flex items-center gap-2">
                      <span>{formatCurrency(refund.refundAmount)}</span>
                      <span className="text-gray-500 text-sm">
                        ({new Date(refund.refundedAt).toLocaleDateString()})
                      </span>
                    </div>
                  ))
                : '0.00'}
            </p>
            <p className="text-gray-700">
              <span className="font-medium text-teal-600">Final Amount:</span>{' '}
              {formatCurrency(selectedReport?.remainingAmount)}
            </p>
          </div>
        </div>
      </div>
      <div className="m-8">
        <button
          onClick={() => handlePrint(selectedReport)}
          className="flex items-center bg-teal-700 text-white px-5 py-2 rounded-full hover:bg-teal-600 cursor-pointer"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          Print
        </button>
      </div>
    </div>
  );
};

export default RadiologyInfo;
