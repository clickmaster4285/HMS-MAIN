import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchRadiologyReportById } from '../../features/Radiology/RadiologySlice';
import RadiologyReportHeader from './RadiologyReportHeader';
import RadiologyInfo from './RadiologyInfo';
import RadiologyReportEditor from './RadiologyReportEditor';
import RadiologyFooter from './RadiologyFooter';
import PrintRadiologyReport from './PrintRadiologyReport';
import ReactDOMServer from 'react-dom/server';

export const calculateAge = (birthDate) => {
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

const RadiologyPatientDetail = () => {
  const { user } = useSelector((state) => state.auth);
  const isRadiology = user?.user_Access === 'Radiology';

  const dispatch = useDispatch();
  const { id } = useParams();
  const currentReport = useSelector((state) => state.radiology.currentReport);
  const loading = useSelector((state) => state.radiology.isLoading);
  const error = useSelector((state) => state.radiology.error);
  const [selectedReportIndex, setSelectedReportIndex] = useState(0);

  // Fetch report on mount
  useEffect(() => {
    if (id) {
      dispatch(fetchRadiologyReportById(id));
    }
  }, [dispatch, id]);

  // Get the currently selected report
  const getSelectedReport = () => {
    if (!currentReport || !Array.isArray(currentReport.studies)) return null;

    const study = currentReport.studies[selectedReportIndex] || {};
    return {
      ...currentReport,
      templateName: study.templateName || 'N/A',
      finalContent:
        study.finalContent ||
        '<h2>Findings</h2><p>No findings available</p><h3>Summary</h3><p>No summary available</p>',
      referBy: study.referBy || 'N/A',
      totalAmount: study.totalAmount ?? currentReport.totalAmount,
      discount: study.discount ?? currentReport.discount,
      totalPaid: study.totalPaid ?? currentReport.totalPaid,
      remainingAmount: study.remainingAmount ?? currentReport.remainingAmount,
      advanceAmount: study.advanceAmount ?? currentReport.advanceAmount,
      refunded: study.refunded ?? currentReport.refunded,
      paymentStatus: study.paymentStatus ?? currentReport.paymentStatus,
    };
  };

  const selectedReport = getSelectedReport();

  // Handle print functionality
  const handlePrint = (report) => {
    const printData = {
      ...report,
      age: calculateAge(report.age),
    };

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups for printing');
      return;
    }

    const printContent = ReactDOMServer.renderToStaticMarkup(
      <PrintRadiologyReport report={currentReport} isRadiology={isRadiology} />
    );

    printWindow.document.open();
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Radiology Report</title>
          <style>
            @page {
              size: A4;
              margin: 5mm 10mm;
            }
            body {
              margin: 0;
              padding: 5mm;
              color: #333;
              width: 190mm;
              height: 277mm;
              position: relative;
              font-size: 13px;
              line-height: 1.3;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              font-family: Arial, sans-serif;
            }
            .header {
              text-align: center;
              margin-bottom: 10px;
              border-bottom: 2px solid #2b6cb0;
              padding-bottom: 10px;
            }
            .hospital-name {
              font-size: 24px;
              font-weight: bold;
              color: #2b6cb0;
              margin-bottom: 5px;
              text-transform: uppercase;
            }
            .hospital-subtitle {
              font-size: 14px;
              color: #555;
              margin-bottom: 5px;
            }
            .patient-info {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 15px;
            }
            .patient-info td {
              padding: 3px 5px;
              vertical-align: top;
              border: none;
            }
            .patient-info .label {
              font-weight: bold;
              width: 120px;
            }
            .duplicate-section {
              margin-top: 20px;
              border-top: 1px dashed #000;
              padding-top: 10px;
            }
            .divider {
              border-top: 1px dashed #000;
              margin: 10px 0;
            }
            .footer {
              margin-top: 30px;
              width: 100%;
              display: flex;
              justify-content: space-between;
            }
            .signature {
              text-align: center;
              width: 150px;
              border-top: 1px solid #000;
              padding-top: 5px;
              margin-top: 30px;
              font-size: 12px;
            }
            .footer-note {
              text-align: center;
              margin-top: 20px;
              font-size: 11px;
              color: #666;
            }
            @media print {
              body * {
                visibility: hidden;
              }
              .print-container, .print-container * {
                visibility: visible;
              }
              .print-container {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
              }
              .no-print {
                display: none !important;
              }
            }
          </style>
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

  // Handle report selection change
  const handleReportChange = (index) => {
    setSelectedReportIndex(index);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-teal-50 to-gray-100">
        <div className="text-teal-600 text-2xl font-semibold animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-teal-50 to-gray-100">
        <div className="text-red-600 text-2xl font-semibold">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!currentReport) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-teal-50 to-gray-100">
        <div className="text-teal-600 text-2xl font-semibold">
          No report found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-teal-50 to-gray-100">
      <div className="mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl">
        <RadiologyReportHeader
          currentReport={currentReport}
          selectedReport={selectedReport}
        />
        {Array.isArray(currentReport.studies) &&
          currentReport.studies.length > 1 && (
            <div className="p-4 bg-teal-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-teal-700 mb-2">
                Select Report:
              </h3>
              <div className="flex justify-between">
                <div className="flex flex-wrap gap-2">
                  {currentReport.studies.map((s, index) => (
                    <button
                      key={s._id || index}
                      onClick={() => handleReportChange(index)}
                      className={`px-4 py-2 rounded-full text-sm ${
                        selectedReportIndex === index
                          ? 'bg-teal-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {s.templateName?.replace('.html', '')}
                    </button>
                  ))}
                </div>
                <div></div>
              </div>
            </div>
          )}
        <RadiologyInfo
          currentReport={currentReport}
          selectedReport={selectedReport}
          handlePrint={handlePrint}
        />
        <RadiologyReportEditor
          currentReport={currentReport}
          selectedReport={selectedReport}
          selectedReportIndex={selectedReportIndex}
          id={id}
        />
        <RadiologyFooter currentReport={currentReport} />
      </div>
    </div>
  );
};

export default RadiologyPatientDetail;
