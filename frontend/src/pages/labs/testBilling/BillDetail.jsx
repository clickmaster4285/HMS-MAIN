import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  getBillDetails,
  getRadiologyBillDetails,
  resetCurrentBill,
} from '../../../features/labBill/LabBillSlice';
import {
  FaFileInvoiceDollar,
  FaUser,
  FaFlask,
  FaMoneyBillWave,
  FaNotesMedical,
  FaPrint,
  FaArrowLeft,
} from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import ReactDOMServer from 'react-dom/server';
import PrintBillDetail from './PrintBillDetail';

const BillDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    data: bill,
    status,
    error,
  } = useSelector((state) => state.labBill.currentBill);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [billType, setBillType] = useState(null); 


  useEffect(() => {
    const fetchBill = async () => {
      try {
        const labResponse = await dispatch(getBillDetails(id)).unwrap();
        setBillType('lab');
      } catch (labError) {
        if (labError.statusCode === 404) {
          try {
            const radiologyResponse = await dispatch(
              getRadiologyBillDetails(id)
            ).unwrap();
            setBillType('radiology');
          } catch (radiologyError) {
            console.error('Failed to fetch radiology bill:', radiologyError);
          }
        } else {
          console.error('Failed to fetch lab bill:', labError);
        }
      }
    };

    fetchBill();

    return () => dispatch(resetCurrentBill());
  }, [dispatch, id]);

  const handlePrint = async () => {
    if (bill.billingSummary?.paymentStatus !== 'paid') {
      setShowConfirmModal(true);
      return;
    }
    proceedWithPrint();
  };

  const proceedWithPrint = async () => {
    try {
      if (!bill) {
        alert('No bill data available for printing.');
        return;
      }

      const printContent = ReactDOMServer.renderToStaticMarkup(
        <PrintBillDetail bill={bill} />
      );

      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Please allow popups for printing');
        return;
      }

      printWindow.document.open();
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print Bill</title>
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

              .patient-info, .billing-info, .test-table, .summary-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 15px;
              }

              .patient-info td, .billing-info td, .summary-table td {
                padding: 3px 5px;
                vertical-align: top;
                border: none;
              }

              .patient-info .label, .billing-info .label, .summary-table .label {
                font-weight: bold;
                width: 120px;
              }

              .divider {
                border-top: 1px dashed #000;
                margin: 10px 0;
              }

              .section-title {
                font-weight: bold;
                font-size: 16px;
                margin-bottom: 5px;
                color: #2b6cb0;
                text-transform: uppercase;
              }

              .test-table {
                margin-bottom: 10px;
              }

              .test-table th {
                background-color: #f0f0f0;
                border: 1px solid #ddd;
                padding: 5px;
                text-align: left;
                font-weight: bold;
                font-size: 12px;
              }

              .test-table td {
                border: 1px solid #ddd;
                padding: 5px;
                font-size: 12px;
              }

              .status-paid {
                color: #2f855a;
                font-weight: bold;
              }

              .status-pending {
                color: #b7791f;
                font-weight: bold;
              }

              .footer {
                position: absolute;
                bottom: 10mm;
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

              @media print {
                body {
                  padding: 0;
                  margin: 0;
                  width: 210mm;
                  height: 297mm;
                }
              }

              .radiology-report {
                margin-bottom: 15px;
              }

              .radiology-report h3 {
                font-size: 16px;
                margin-bottom: 5px;
              }

              .radiology-report .content {
                border: 1px solid #ddd;
                padding: 10px;
                background-color: #f9f9f9;
                max-height: 300px;
                overflow-y: auto;
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
    } catch (error) {
      console.error('Error in proceedWithPrint:', error);
      alert(`Failed to print bill: ${error.message || 'Unknown error'}`);
    }
  };

  const ConfirmModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-transform duration-300 ease-in-out scale-95 animate-scale-up">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Payment Pending
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiX size={20} />
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            The payment is pending. Are you sure you want to print the bill
            before payment?
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium transition-colors"
            >
              Confirm Print
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Loading State
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  // Error State
  if (status === 'failed') {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-center">
            <svg
              className="h-5 w-5 text-red-500 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-red-700">
              {error || 'Failed to load bill details'}
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="mt-3 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            <FaArrowLeft className="inline mr-1" /> Go Back
          </button>
        </div>
      </div>
    );
  }

  // No Data State
  if (!bill) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center">
        <p className="text-gray-500 mb-4">No bill data found</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
        >
          <FaArrowLeft className="inline mr-1" /> Back to Bills
        </button>
      </div>
    );
  }

  // Determine if it's a radiology bill (based on presence of templateName or finalContent)
  const isRadiology = !!bill.templateName || !!bill.finalContent;

  const n = (v) => Number(v) || 0;

  const discountAmount = n(bill?.billingSummary?.discountAmount);
  const totalRefunded = Array.isArray(bill?.billingSummary?.refunded)
    ? bill.billingSummary.refunded.reduce(
        (sum, r) => sum + n(r.refundAmount),
        0
      )
    : n(bill?.billingSummary?.refundableAmount); // fallback if you store cumulative here

  const discountPlusRefund = discountAmount + totalRefunded;

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white min-h-screen">
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => {
          proceedWithPrint();
          setShowConfirmModal(false);
        }}
      />
      {/* Header Section */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 text-teal-600 hover:text-teal-800 transition"
          aria-label="Go back"
        >
          <FaArrowLeft className="text-xl" />
        </button>
        <div className="bg-teal-100 p-2 rounded-full mr-3">
          <FaFileInvoiceDollar className="text-teal-600 text-xl" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {isRadiology ? 'Radiology Bill Details' : 'Bill Details'}
          </h1>
          <p className="text-teal-600 text-sm">
            Token #: {bill.billingSummary?.tokenNumber || 'N/A'}
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Patient and Billing Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          {/* Patient Info */}
          <div className="bg-teal-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg text-gray-800 mb-3 flex items-center">
              <FaUser className="mr-2 text-teal-600" /> Patient Information
            </h3>
            <div className="space-y-2">
            
              <DetailItem
                label="Name"
                value={
                  bill.patient?.patient_Name ||
                  bill.patientDetails?.patient_Name ||
                  'N/A'
                }
              />
              <DetailItem
                label="MR Number"
                value={
                  bill.patient?.patient_MRNo ||
                  bill.patientDetails?.patient_MRNo ||
                  'N/A'
                }
              />
              <DetailItem
                label="Contact"
                value={
                  bill.patient?.patient_ContactNo ||
                  bill.patientDetails?.patient_ContactNo ||
                  'N/A'
                }
              />
              <DetailItem
                label="Gender"
                value={
                  bill.patient?.patient_Gender ||
                  bill.patientDetails?.patient_Gender ||
                  'N/A'
                }
              />
            </div>
          </div>

          {/* Billing Info */}
          <div className="bg-teal-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg text-gray-800 mb-3 flex items-center">
              <FaMoneyBillWave className="mr-2 text-teal-600" /> Billing
              Information
            </h3>
            <div className="space-y-2">
              <DetailItem
                label="Total Amount"
                value={`Rs. ${
                  bill.billingSummary?.totalAmount.toLocaleString() || '0'
                }`}
              />
              <DetailItem
                label="Discount"
                value={`Rs. ${discountPlusRefund.toLocaleString()}`}
              />

              <DetailItem
                label="Advance Paid"
                value={`Rs. ${
                  bill.billingSummary?.advanceAmount.toLocaleString() || '0'
                }`}
              />
              <DetailItem
                label="Remaining"
                value={`Rs. ${
                  bill.billingSummary?.remainingAmount.toLocaleString() || '0'
                }`}
              />
              <DetailItem
                label="Payment Status"
                value={
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      bill.billingSummary?.paymentStatus === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {bill.billingSummary?.paymentStatus || 'pending'}
                  </span>
                }
              />
            </div>
          </div>
        </div>

        {/* Test Results or Radiology Report */}
        <div className="p-6 border-t border-gray-100">
          <h3 className="font-semibold text-lg text-gray-800 mb-3 flex items-center">
            <FaFlask className="mr-2 text-teal-600" />{' '}
            {isRadiology ? 'Radiology Report' : 'Test Results'}
          </h3>
          {isRadiology ? (
            <div className="radiology-report">
              <h4 className="font-medium mb-2">
                Template: {bill.templateName || 'N/A'}
              </h4>
              <div className="content overflow-auto max-h-96 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      bill.finalContent || '<p>No report content available</p>',
                  }}
                />
              </div>
              {bill.referBy && (
                <p className="mt-4 text-sm text-gray-600">
                  Referred By: {bill.referBy}
                </p>
              )}
            </div>
          ) : bill.testResults?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-teal-50">
                  <tr>
                    <th className="p-3 text-gray-700 font-medium">Test Name</th>
                    <th className="p-3 text-gray-700 font-medium">Code</th>
                    <th className="p-3 text-right text-gray-700 font-medium">
                      Price
                    </th>
                    <th className="p-3 text-gray-700 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bill.testResults.map((test, index) => (
                    <tr key={index} className="hover:bg-teal-50 transition">
                      <td className="p-3 text-gray-800">
                        {test.testDetails?.name || 'N/A'}
                      </td>
                      <td className="p-3 text-gray-800">
                        {test.testDetails?.code || 'N/A'}
                      </td>
                      <td className="p-3 text-right text-gray-800">
                        Rs. {test.testDetails?.price.toLocaleString() || '0'}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            test.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {test.status || 'pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-yellow-50 p-3 rounded-lg text-yellow-800 text-sm">
              No test results found for this bill
            </div>
          )}
        </div>

      
        {/* Summary Statistics */}
        <div className="p-6 border-t border-gray-100">
          <h3 className="font-semibold text-lg text-gray-800 mb-3 flex items-center">
            <FaFlask className="mr-2 text-teal-600" />{' '}
            {isRadiology ? 'Report Summary' : 'Test Summary'}
          </h3>

          {(() => {
            const totalItems =
              bill.summary?.totalTests ?? (isRadiology ? 1 : 0);

            const completed =
              bill.summary?.completedTests ??
              (isRadiology && bill.billingSummary?.paymentStatus === 'paid'
                ? 1
                : 0);

            const pending =
              bill.summary?.pendingTests ??
              (isRadiology && bill.billingSummary?.paymentStatus === 'pending'
                ? 1
                : 0);

            return (
              <div className="bg-teal-50 p-4 rounded-lg grid grid-cols-1 sm:grid-cols-3 gap-4">
                <DetailItem inline label="Total items" value={totalItems} />
                <DetailItem inline label="Completed" value={completed} />
                <DetailItem inline label="Pending" value={pending} />
              </div>
            );
          })()}
        </div>

        {/* Lab Notes */}
        {bill.billingSummary?.labNotes && (
          <div className="p-6 border-t border-gray-100">
            <h3 className="font-semibold text-lg text-gray-800 mb-3 flex items-center">
              <FaNotesMedical className="mr-2 text-teal-600" /> Lab Notes
            </h3>
            <div className="bg-teal-50 p-3 rounded-lg text-gray-800 text-sm">
              {bill.billingSummary.labNotes}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="p-6 border-t border-gray-100 flex justify-end space-x-3">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            <FaArrowLeft className="inline mr-1" /> Back
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
          >
            <FaPrint className="inline mr-1" /> Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
};


// Reusable Detail Item Component
const DetailItem = ({ label, value, inline = false }) => {
  // show 0 correctly; only fall back when value is null/undefined
  const safeValue = value ?? 'N/A';

  if (inline) {
    return (
      <div className="text-gray-800 text-sm">
        <span className="font-medium text-gray-700">{label}</span>: {safeValue}
      </div>
    );
  }

  return (
    <div className="flex justify-between items-start">
      <p className="font-medium text-gray-700 text-sm">{label}</p>
      <p className="text-gray-800 text-sm">{safeValue}</p>
    </div>
  );
};


export default BillDetail;
