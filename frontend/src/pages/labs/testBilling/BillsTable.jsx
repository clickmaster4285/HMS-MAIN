import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  FaFileInvoiceDollar,
  FaUser,
  FaFlask,
  FaMoneyBillWave,
  FaEllipsisV,
  FaChartBar,
  FaSearch,
  FaCalendarAlt,
} from 'react-icons/fa';
import RefundForm from './RefundForm';
import PaymentFinalizationForm from './PaymentFinalizationForm';
import {
  processPaymentAfterReport,
  processRadiologyPayment,
  getAllTestBills,
  fetchRadiologyBills,
} from '../../../features/labBill/LabBillSlice';
import { Dialog, DialogActions, DialogContent, Button } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { format } from 'date-fns';

const BillsTable = ({
  labBills,
  radiologyBills,
  getAllTestBills,
  fetchRadiologyBills,
}) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showRefundForm, setShowRefundForm] = useState(false);
  const [currentBill, setCurrentBill] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [billType, setBillType] = useState('All Bills');
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const [isModalOpen, setIsModalOpen] = useState(false); // New state for modal
  const [selectedBillTests, setSelectedBillTests] = useState(null); // New state for selected bill tests

  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.user_Access === 'Admin';

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Combine bills based on billType
  const displayedBills =
    billType === 'All Bills'
      ? [...(labBills || []), ...(radiologyBills || [])]
      : billType === 'Radiology'
      ? radiologyBills
      : labBills;

  // Helper function to determine bill type
  const getBillType = (bill) => {
    if (!bill) return 'Unknown';
    if (bill.templateName || bill.patientMRNO) return 'Radiology';
    if (bill.billingInfo || bill.patientDetails) return 'Lab';
    return 'Unknown';
  };

  const handleFinalizePayment = async ({
    billId,
    isRadiology,
    customAmount,
    refundReason,
  }) => {
    setPaymentProcessing(true);
    setErrorMessage(null);

    try {
      if (isRadiology) {
        await dispatch(
          processRadiologyPayment({
            patientId: billId,
            customAmount,
            refundReason,
          })
        ).unwrap();
        await dispatch(fetchRadiologyBills()).unwrap();
      } else {
        await dispatch(
          processPaymentAfterReport({
            patientId: billId,
            customAmount,
            refundReason,
          })
        ).unwrap();
        await dispatch(getAllTestBills()).unwrap();
      }
      setShowPaymentForm(false);
      setCurrentBill(null);
      setActiveDropdown(null);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to process payment');
    } finally {
      setPaymentProcessing(false);
    }
  };

  // Helper function to get patient name
  const getPatientName = (bill) => {
    if (!bill) return 'Unknown';
    const type = getBillType(bill);
    return type === 'Radiology'
      ? bill.patientName || 'Unknown'
      : bill.patientDetails?.patient_Name || bill.patientId?.name || 'Unknown';
  };

  // Helper function to get patient MR number
  const getPatientMRNo = (bill) => {
    if (!bill) return 'N/A';
    const type = getBillType(bill);
    return type === 'Radiology'
      ? bill.patientMRNO || 'N/A'
      : bill.patientDetails?.patient_MRNo || bill.patientId?.mrNo || 'N/A';
  };

  // Helper function to get patient contact info
  const getPatientContact = (bill) => {
     
    if (!bill) return 'N/A';
    const type = getBillType(bill);
    return type === 'Radiology'
      ? bill.patient_ContactNo || bill.patientId?.contactNo || 'N/A'
      : 'N/A';
  };

  // Helper function to get patient gender
  const getPatientGender = (bill) => {
    if (!bill) return 'N/A';
    const type = getBillType(bill);
    return type === 'Radiology'
      ? bill.sex || 'N/A'
      : bill.patientDetails?.patient_Gender || bill.patientId?.gender || 'N/A';
  };

  // Helper function to get total amount
  const getTotalAmount = (bill) => {
    if (!bill) return 0;
    const type = getBillType(bill);
    return type === 'Radiology'
      ? bill.totalAmount || 0
      : bill.billingInfo?.totalAmount || 0;
  };

  // Helper function to get total paid amount
  const getTotalPaid = (bill) => {
    if (!bill) return 0;
    const type = getBillType(bill);
    return type === 'Radiology'
      ? bill.totalPaid || 0
      : bill.billingInfo?.totalPaid || 0;
  };

  // Helper function to get remaining amount
  const getRemainingAmount = (bill) => {
    if (!bill) return 0;
    const type = getBillType(bill);
    return type === 'Radiology'
      ? bill.remainingAmount || 0
      : bill.billingInfo?.remainingAmount || 0;
  };

  // Helper function to get payment status
  const getPaymentStatus = (bill) => {
    if (!bill) return 'N/A';
    const type = getBillType(bill);
    return type === 'Radiology'
      ? bill.paymentStatus || 'N/A'
      : bill.billingInfo?.paymentStatus || 'N/A';
  };

  // Helper function to get tests/procedures
  const getTestsOrProcedures = (bill) => {
    if (!bill) return [];
    const type = getBillType(bill);

    if (type === 'Radiology') {
      // Handle both string and array formats for templateName
      let templateNames = [];

      if (Array.isArray(bill.templateName)) {
        // If templateName is an array, use all items
        templateNames = bill.templateName;
      } else if (typeof bill.templateName === 'string') {
        // If templateName is a string, use it as a single item
        templateNames = [bill.templateName];
      }

      // If we have template names, create an array of procedures
      if (templateNames.length > 0) {
        return templateNames.map((templateName, index) => ({
          testId: `${bill._id}-${index}`,
          name: templateName?.replace('.html', '') || 'Radiology Procedure',
          price: bill.totalAmount || 0,
          advanceAmount: bill.advanceAmount || 0,
          discountAmount: bill.discount || 0,
          status: bill.paymentStatus || 'pending',
        }));
      }

      // Fallback if no template names are available
      return [
        {
          testId: bill._id,
          name: 'Radiology Procedure',
          price: bill.totalAmount || 0,
          advanceAmount: bill.advanceAmount || 0,
          discountAmount: bill.discount || 0,
          status: bill.paymentStatus || 'pending',
        },
      ];
    }

    // For Lab bills, return the tests array
    return bill.tests || [];
  };

  // Filter bills based on search term
  const filteredBills = (displayedBills || []).filter(
    (bill) =>
      bill &&
      (getPatientName(bill).toLowerCase().includes(searchTerm.toLowerCase()) ||
        getPatientMRNo(bill).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Sort bills by createdAt in descending order (latest first)
  const sortedBills = filteredBills.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Calculate statistics
  const totalBills = sortedBills.length;
  const totalAmount = sortedBills.reduce(
    (sum, bill) => sum + getTotalAmount(bill),
    0
  );
  const totalPaid = sortedBills.reduce(
    (sum, bill) => sum + getTotalPaid(bill),
    0
  );
  const pendingBills = sortedBills.filter(
    (bill) => getPaymentStatus(bill) === 'pending'
  ).length;
  const paidBills = sortedBills.filter(
    (bill) => getPaymentStatus(bill) === 'paid'
  ).length;

  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const openRefundForm = (bill) => {
    const isRadiology = getBillType(bill) === 'Radiology';
    setCurrentBill({ ...bill, isRadiology });
    setShowRefundForm(true);
    setActiveDropdown(null);
  };

  const closeRefundForm = () => {
    setShowRefundForm(false);
    setCurrentBill(null);
    setActiveDropdown(null);
  };

  // New function to open the tests modal
  const openTestsModal = (bill) => {
    setSelectedBillTests(getTestsOrProcedures(bill));
    setIsModalOpen(true);
  };

  // New function to close the tests modal
  const closeTestsModal = () => {
    setIsModalOpen(false);
    setSelectedBillTests(null);
  };

  const handleDateSubmit = () => {
    if (!dateRange[0]) return;
    const startDate = format(dateRange[0], 'yyyy-MM-dd');
    const endDate = dateRange[1]
      ? format(dateRange[1], 'yyyy-MM-dd')
      : startDate;
    navigate(`/lab/bill-summery?startDate=${startDate}&endDate=${endDate}`);
    setShowCalendarModal(false);
  };

  // Total refunded across the bill (supports bill.refunded or billingInfo.refunded)
  const getTotalRefunded = (bill) => {
    const list =
      (Array.isArray(bill?.refunded) && bill.refunded) ||
      (Array.isArray(bill?.billingInfo?.refunded) &&
        bill.billingInfo.refunded) ||
      [];
    return list.reduce((sum, r) => sum + (Number(r?.refundAmount) || 0), 0);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {errorMessage && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg mb-4">
          <p>{errorMessage}</p>
          <button
            onClick={() => setErrorMessage(null)}
            className="mt-2 text-sm underline hover:text-red-900"
          >
            Dismiss
          </button>
        </div>
      )}
      {/* Header */}
      <div className="bg-teal-600 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center">
          <FaFileInvoiceDollar className="text-white text-3xl mr-3" />
          <h2 className="text-2xl font-bold text-white">Billing Records</h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or MR#"
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <select
              value={billType}
              onChange={(e) => setBillType(e.target.value)}
              className="px-3 py-2 bg-white text-teal-600 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500"
            >
              <option value="All Bills">All Bills</option>
              <option value="Lab">Lab Bills</option>
              <option value="Radiology">Radiology Bills</option>
            </select>
            <button
              onClick={() => setShowCalendarModal(true)}
              className="px-3 py-2 bg-white text-teal-600 rounded-lg border border-gray-300 hover:bg-teal-50 flex items-center gap-2"
            >
              <FaCalendarAlt />
              Date Range
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 bg-gray-50">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-teal-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Total Bills</p>
              <p className="text-2xl font-bold text-teal-900">{totalBills}</p>
            </div>
            <div className="bg-teal-100 p-3 rounded-full">
              <FaFileInvoiceDollar className="text-teal-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-teal-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-teal-900">
                Rs. {totalAmount.toLocaleString()}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FaMoneyBillWave className="text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-teal-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Pending/Paid</p>
              <p className="text-2xl font-bold text-teal-900">
                {pendingBills}/{paidBills}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <FaChartBar className="text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-teal-50">
            <tr>
              <th className="p-4 text-left text-teal-700 font-medium">
                MR Number
              </th>
              <th className="p-4 text-left text-teal-700 font-medium">
                Patient
              </th>
              <th className="p-4 text-left text-teal-700 font-medium">
                Date/Time
              </th>
              <th className="p-4 text-left text-teal-700 font-medium">
                Tests/Procedures
              </th>
              <th className="p-4 text-left text-teal-700 font-medium">
                Amount
              </th>
              <th className="p-4 text-left text-teal-700 font-medium">
                Status
              </th>
              <th className="p-4 text-left text-teal-700 font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedBills.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-4 text-center">
                  <div className="p-4 bg-teal-50 border-l-4 border-teal-500 text-teal-700 rounded-lg">
                    <p>No bills found. Would you like to create one?</p>
                    <Link
                      to="/lab/bills/create"
                      className="mt-2 inline-block px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                    >
                      Create New Bill
                    </Link>
                  </div>
                </td>
              </tr>
            ) : (
              sortedBills.map((bill) => {
                const billType = getBillType(bill);
                const testsOrProcedures = getTestsOrProcedures(bill);
                return (
                  <tr
                    key={bill._id}
                    className="hover:bg-teal-50 transition-colors"
                  >
                    {/* MR Number */}
                    <td className="p-4 font-medium text-teal-900">
                      <span className="inline-block px-3 py-1 bg-teal-100 rounded-lg text-sm">
                        {getPatientMRNo(bill)}
                      </span>
                    </td>

                    {/* Patient Info */}
                    <td className="p-4">
                      <div>
                        <p className="font-medium flex items-center gap-2">
                          <FaUser className="text-teal-500" />
                          {getPatientName(bill)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {getPatientContact(bill)}
                        </p>
                        <p className="text-xs text-gray-400">
                          {getPatientGender(bill)}
                        </p>
                      </div>
                    </td>

                    {/* Date/Time */}
                    <td className="p-4 align-top">
                      {(() => {
                        const created = new Date(bill.createdAt);
                        const updated = new Date(bill.updatedAt);
                        const ts =
                          created.getTime() === updated.getTime()
                            ? created
                            : updated;

                        const dateStr = ts.toLocaleDateString('en-PK', {
                          year: 'numeric',
                          month: 'short',
                          day: '2-digit',
                        });
                        const timeStr = ts.toLocaleTimeString('en-PK', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true, // set to false if you want 24-hour
                        });

                        return (
                          <td className="p-4">
                            <div className="flex items-center justify-center h-full leading-tight text-center">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {dateStr}
                                </div>
                                <div className="text-[11px] text-gray-500 mt-0.5">
                                  {timeStr}
                                </div>
                              </div>
                            </div>
                          </td>
                        );
                      })()}
                    </td>

                    {/* Tests or Procedures */}
                    <td className="p-4">
                      {testsOrProcedures.slice(0, 2).map((item, index) => (
                        <div
                          key={item.testId || index}
                          className="mb-1 last:mb-0"
                        >
                          <span className="font-medium flex items-center gap-2">
                            <FaFlask className="text-teal-500 text-sm" />
                            {item.name
                              ? item.name.charAt(0).toUpperCase() +
                                item.name.slice(1)
                              : 'Unknown'}
                          </span>

                          <div className="grid grid-cols-2 gap-1 text-xs text-gray-500"></div>
                        </div>
                      ))}
                      {testsOrProcedures.length > 2 && (
                        <button
                          onClick={() => openTestsModal(bill)}
                          className="text-teal-500 hover:underline text-sm mt-1"
                        >
                          See More
                        </button>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="p-4">
                      <div className="space-y-1">
                        <p className="font-medium">
                          Rs. {getTotalAmount(bill).toLocaleString()}
                        </p>
                        <div className="text-xs text-gray-500 space-y-1">
                          <div className="flex justify-between"></div>
                          <div className="flex justify-between"></div>
                          {/* Refund line (after Remaining) */}
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          getPaymentStatus(bill) === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : getPaymentStatus(bill) === 'partial'
                            ? 'bg-primary-100 text-primary-800'
                            : getPaymentStatus(bill) === 'refunded'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {getPaymentStatus(bill)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex justify-center">
                        <div className="relative">
                          <button
                            onClick={() => toggleDropdown(bill._id)}
                            className="p-2 text-gray-500 hover:text-teal-700 hover:bg-teal-50 rounded-full transition-colors"
                          >
                            <FaEllipsisV />
                          </button>

                          {activeDropdown === bill._id && (
                            <div className="absolute top-0 right-8 z-10 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                              <div className="py-1">
                                <Link
                                  to={
                                    isAdmin
                                      ? `/admin/bills/${bill._id}`
                                      : `/lab/bills/${bill._id}`
                                  }
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-900 transition-colors"
                                  onClick={() => setActiveDropdown(null)}
                                >
                                  View Details
                                </Link>
                                {((bill?.totalPaid ?? 0) > 0 ||
                                  (bill?.billingInfo?.totalPaid ?? 0) > 0) && (
                                  <button
                                    onClick={() => openRefundForm(bill)}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-900 transition-colors"
                                  >
                                    Process Refund
                                  </button>
                                )}
                                {getRemainingAmount(bill) > 0 && (
                                  <button
                                    onClick={() => {
                                      const isRadiology =
                                        billType === 'Radiology';
                                      setCurrentBill({ ...bill, isRadiology });
                                      setShowPaymentForm(true);
                                      setActiveDropdown(null);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-900 transition-colors"
                                  >
                                    Finalize Payment
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Tests Modal */}
      {isModalOpen && selectedBillTests && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              All Tests/Procedures
            </h3>
            <div className="mt-2 space-y-2">
              {selectedBillTests.map((item, index) => (
                <div key={item.testId || index} className="mb-1 last:mb-0">
                  <span className="font-medium flex items-center gap-2 break-words">
                    <FaFlask className="text-teal-500 text-sm" />
                    {item.name || 'Unknown'}
                  </span>
                  <div className="grid grid-cols-2 gap-1 text-xs text-gray-500">
                    <span>Price: Rs. {(item.price || 0).toLocaleString()}</span>
                    {(item.advanceAmount || 0) > 0 && (
                      <span>
                        Advance: Rs. {item.advanceAmount.toLocaleString()}
                      </span>
                    )}
                    {(item.discountAmount || 0) > 0 && (
                      <span>
                        Discount: Rs. {item.discountAmount.toLocaleString()}
                      </span>
                    )}
                    <span className="col-span-2">
                      Status:{' '}
                      <span
                        className={`font-medium ${
                          item.status === 'completed'
                            ? 'text-green-600'
                            : item.status === 'cancelled' ||
                              item.status === 'refunded'
                            ? 'text-red-600'
                            : 'text-yellow-600'
                        }`}
                      >
                        {item.status || 'N/A'}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={closeTestsModal}
              className="mt-4 bg-teal-100 text-teal-900 px-4 py-2 rounded-md hover:bg-teal-200"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Calendar Dialog */}
      <Dialog
        open={showCalendarModal}
        onClose={() => setShowCalendarModal(false)}
      >
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateRangePicker
              calendars={1}
              value={dateRange}
              onChange={(newValue) => setDateRange(newValue)}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCalendarModal(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleDateSubmit}
            variant="contained"
            color="primary"
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>

      {/* Refund Form */}
      {showRefundForm && (
        <RefundForm
          bill={currentBill}
          onClose={closeRefundForm}
          onSubmit={() => {
            setShowRefundForm(false);
            setCurrentBill(null);
            setActiveDropdown(null);
          }}
        />
      )}

      {/* Payment Finalization Form */}
      {showPaymentForm && (
        <PaymentFinalizationForm
          bill={currentBill}
          onClose={() => setShowPaymentForm(false)}
          onConfirm={handleFinalizePayment}
          isProcessing={paymentProcessing}
        />
      )}
    </div>
  );
};

export default BillsTable;
