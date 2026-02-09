import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSummaryByDate } from '../../../features/testResult/TestResultSlice';
import {
  FiChevronDown,
  FiChevronUp,
  FiExternalLink,
  FiClock,
  FiDollarSign,
  FiUser,
  FiHash,
  FiBarChart2,
} from 'react-icons/fi';
import ReactDOMServer from 'react-dom/server';
import PrintReportSummary from './PrintReportSummary';
import MiniReportSummary from './MiniReportSummary';

const ReportSummary = () => {
  const { date } = useParams();
  const { summaryByDate } = useSelector((state) => state.testResult);
  const dispatch = useDispatch();
  const [expandedRow, setExpandedRow] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: 'tokenNumber',
    direction: 'asc',
  });

  let startDate = null;
  let endDate = null;

  if (date) {
    const parts = date.split('_');
    if (parts.length === 2) {
      startDate = parts[0];
      endDate = parts[1];
    } else if (parts.length === 1) {
      startDate = parts[0];
    }
  }

  useEffect(() => {
    const dateRange = { startDate, endDate };
    dispatch(getSummaryByDate(dateRange));
  }, [dispatch, startDate, endDate]);

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const formatTimeOnly = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateOnly = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedReports = [...(summaryByDate || [])].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const toggleRow = (id) => {
    if (expandedRow === id) {
      setExpandedRow(null);
    } else {
      setExpandedRow(id);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'registered':
        return 'bg-primary-100 text-primary-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const preparePrintData = (reports, dateRange) => {
    return {
      reports: reports || [],
      dateRange: {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      },
    };
  };

  const handlePrint = () => {
    const printData = preparePrintData(summaryByDate, { startDate, endDate });
    if (!printData || printData.reports.length === 0) {
      alert('No data to print');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups for printing');
      return;
    }
    const now = new Date();

    // Format date parts
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear()).slice(-2);

    // Format time parts
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    // Combine all parts
    const formattedDateTime = `${day}-${month}-${year} ${hours}:${minutes}`;

    const printContent = ReactDOMServer.renderToStaticMarkup(
      <PrintReportSummary
        reports={printData.reports}
        dateRange={printData.dateRange}
      />
    );

    printWindow.document.open();
    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Report_Summary_${formattedDateTime}</title>
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
  };

// New function for quick report
const handleQuickReport = () => {
  const printData = preparePrintData(summaryByDate, { startDate, endDate });
  if (!printData || printData.reports.length === 0) {
    alert('No data to generate quick report');
    return;
  }

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups for printing');
    return;
  }

  const printContent = ReactDOMServer.renderToStaticMarkup(
    <MiniReportSummary
      reports={printData.reports}
      dateRange={printData.dateRange}
    />
  );

  printWindow.document.open();
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Quick_Report_Summary</title>
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
};

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className=" mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Test Report Summary
            </h1>
            <p className="text-gray-500 mt-1">
              {startDate && formatDateOnly(startDate)}
              {endDate && ` - ${formatDateOnly(endDate)}`}
            </p>
          </div>

         <div className="flex gap-3">
            <button
              onClick={handleQuickReport}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors flex items-center gap-2"
            >
              <FiBarChart2 className="h-5 w-5" />
              Quick Report
            </button>
            
            <button
              onClick={handlePrint}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z"
                  clipRule="evenodd"
                />
              </svg>
              Print Summary
            </button>
          </div>

        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('tokenNumber')}
                  >
                    <div className="flex items-center gap-1">
                      <FiHash className="text-gray-400" />
                      <span>Token</span>
                      {sortConfig.key === 'tokenNumber' && (
                        <span>
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4">MR No.</th>
                  <th
                    className="px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('patient_Detail.patient_Name')}
                  >
                    <div className="flex items-center gap-1">
                      <FiUser className="text-gray-400" />
                      <span>Patient</span>
                      {sortConfig.key === 'patient_Detail.patient_Name' && (
                        <span>
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4">Tests</th>
                  <th className="px-6 py-4">Status</th>
                  <th
                    className="px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center gap-1">
                      <FiClock className="text-gray-400" />
                      <span>Date/Time</span>
                      {sortConfig.key === 'createdAt' && (
                        <span>
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('totalAmount')}
                  >
                    <div className="flex items-center gap-1">
                      <FiDollarSign className="text-gray-400" />
                      <span>Amount</span>
                      {sortConfig.key === 'totalAmount' && (
                        <span>
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedReports.map((report) => (
                  <React.Fragment key={report._id}>
                    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        #{report.tokenNumber}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {report.patient_Detail.patient_MRNo}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">
                            {report.patient_Detail.patient_Name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {report.patient_Detail.patient_Gender},{' '}
                            {report.patient_Detail.patient_Age}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                            {report.selectedTests.length} test
                            {report.selectedTests.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            report.paymentStatus
                          )}`}
                        >
                          {report.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span>{formatDateOnly(report.createdAt)}</span>
                          <span className="text-xs text-gray-500">
                            {formatTimeOnly(report.createdAt)} -{' '}
                            {formatTimeOnly(report.updatedAt)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            PKR {report.totalAmount}
                          </span>
                          <span className="text-xs text-gray-500">
                            Paid: PKR {report.advancePayment}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            className="p-1 text-primary-600 hover:text-primary-800 transition-colors"
                            onClick={() => toggleRow(report._id)}
                          >
                            {expandedRow === report._id ? (
                              <FiChevronUp />
                            ) : (
                              <FiChevronDown />
                            )}
                          </button>
                          {/* <button className="p-1 text-gray-500 hover:text-gray-700 transition-colors">
                            <FiExternalLink />
                          </button> */}
                        </div>
                      </td>
                    </tr>
                    {expandedRow === report._id && (
                      <tr className="bg-gray-50">
                        <td colSpan="8" className="px-6 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-4 rounded-lg shadow-xs border border-gray-200">
                              <h3 className="font-medium text-gray-800 mb-3">
                                Patient Details
                              </h3>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-500">
                                    Contact:
                                  </span>
                                  <span>
                                    {report.patient_Detail.patient_ContactNo ||
                                      '-'}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">CNIC:</span>
                                  <span>
                                    {report.patient_Detail.patient_CNIC || '-'}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">
                                    Referred By:
                                  </span>
                                  <span>{report.referredBy || '-'}</span>
                                </div>
                              </div>
                            </div>

                            <div className="bg-white p-4 rounded-lg shadow-xs border border-gray-200">
                              <h3 className="font-medium text-gray-800 mb-3">
                                Tests Performed
                              </h3>
                              <div className="space-y-3">
                                {report.selectedTests.map((test, index) => (
                                  <div
                                    key={index}
                                    className="flex justify-between items-start"
                                  >
                                    <div>
                                      <p className="font-medium">
                                        {test.testDetails.testName}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {test.testDetails.testCode}
                                      </p>
                                    </div>
                                    <span className="text-sm font-medium">
                                      PKR {test.testDetails.testPrice}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="bg-white p-4 rounded-lg shadow-xs border border-gray-200">
                              <h3 className="font-medium text-gray-800 mb-3">
                                Payment Summary
                              </h3>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-500">
                                    Subtotal:
                                  </span>
                                  <span>
                                    PKR{' '}
                                    {report.totalAmount + report.discountAmount}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">
                                    Discount:
                                  </span>
                                  <span className="text-red-500">
                                    - PKR {report.discount}
                                  </span>
                                </div>
                                <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                                  <span className="text-gray-500 font-medium">
                                    Total:
                                  </span>
                                  <span className="font-medium">
                                    PKR {report.totalAmount}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Paid:</span>
                                  <span className="text-green-600">
                                    PKR {report.advancePayment}
                                  </span>
                                </div>
                                <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                                  <span className="text-gray-500 font-medium">
                                    Balance:
                                  </span>
                                  <span className="font-medium">
                                    PKR{' '}
                                    {report.totalAmount - report.advanceAmount}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {sortedReports.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              No reports found
            </h3>
            <p className="text-gray-500">
              Try adjusting your date range or search criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportSummary;
