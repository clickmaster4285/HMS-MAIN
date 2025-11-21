import React, { useState } from 'react';
import {
  FaSearch,
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaPrint,
  FaFileInvoiceDollar,
  FaExchangeAlt,
  FaFileDownload,
  FaHospitalUser,
  FaProcedures,
  FaFileExport,
  FaMoneyBillWave,
  FaCalendarAlt,
} from 'react-icons/fa';
import { Receipt, RotateCcw, Eye, Edit, CreditCard } from 'lucide-react'; // or your icon library

const PrescriptionManagement = () => {
  const [activeTab, setActiveTab] = useState('outpatient');
  const [showNewSaleModal, setShowNewSaleModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data
  const [outpatientSales, setoutPatientSales] = useState([
    {
      id: 'OPD001',
      patient: 'John Doe',
      amount: 450.0,
      date: '2024-06-02',
      status: 'Paid',
      items: 3,
    },
    {
      id: 'OPD002',
      patient: 'Jane Smith',
      amount: 320.5,
      date: '2024-06-02',
      status: 'Pending',
      items: 2,
    },
    {
      id: 'OPD003',
      patient: 'Mike Johnson',
      amount: 780.25,
      date: '2024-06-01',
      status: 'Paid',
      items: 5,
    },
  ]);

  const inpatientBills = [
    {
      id: 'IPD001',
      patient: 'Sarah Williams',
      room: 'A-101',
      amount: 2450.0,
      date: '2024-06-02',
      status: 'Active',
      days: 3,
    },
    {
      id: 'IPD002',
      patient: 'Robert Brown',
      room: 'B-205',
      amount: 1680.75,
      date: '2024-06-01',
      status: 'Discharged',
      days: 2,
    },
  ];

  const invoices = [
    {
      id: 'INV001',
      patient: 'John Doe',
      amount: 450.0,
      date: '2024-06-02',
      status: 'Sent',
      type: 'OPD',
    },
    {
      id: 'INV002',
      patient: 'Sarah Williams',
      amount: 2450.0,
      date: '2024-06-02',
      status: 'Paid',
      type: 'IPD',
    },
  ];
  const returns = [
    {
      id: 'RET001',
      originalInvoice: 'INV001',
      amount: 50.0,
      date: '2024-06-02',
      reason: 'Item return',
      status: 'Processed',
    },
    {
      id: 'RET002',
      originalInvoice: 'INV003',
      amount: 120.0,
      date: '2024-06-01',
      reason: 'Billing error',
      status: 'Pending',
    },
  ];

  const StatusBadge = ({ status }) => {
    const getStatusColor = () => {
      switch (status.toLowerCase()) {
        case 'paid':
          return 'bg-green-100 text-green-800';
        case 'pending':
          return 'bg-yellow-100 text-yellow-800';
        case 'active':
          return 'bg-primary-100 text-primary-800';
        case 'discharged':
          return 'bg-gray-100 text-gray-800';
        case 'sent':
          return 'bg-purple-100 text-purple-800';
        case 'processed':
          return 'bg-green-100 text-green-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}
      >
        {status}
      </span>
    );
  };

  const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
        isActive
          ? 'bg-primary-600 text-white shadow-lg'
          : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
      }`}
    >
      <Icon size={16} />
      <span>{label}</span>
    </button>
  );

  const NewSaleForm = ({ setShowNewSaleModal }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        New Outpatient Sale
      </h2>
      <form className="space-y-4">
        {/* Patient Name and ID */}
        <div className="grid grid-cols-2 gap-4">
          {/* Patient Name */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Patient Name
            </label>
            <div className="relative">
              <FaHospitalUser className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Enter patient name"
                className="pl-10 border border-gray-300 px-4 py-2 rounded w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Patient ID */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Patient ID
            </label>
            <div className="relative">
              <FaHospitalUser className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Enter patient ID"
                className="pl-10 border border-gray-300 px-4 py-2 rounded w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Items */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Items
          </label>
          <div className="space-y-2">
            {/* Item Name */}
            <div className="flex gap-2">
              <input
                placeholder="Item name"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Quantity & Price */}
            <div className="flex gap-4 items-end mt-2">
              {/* Quantity Input */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  placeholder="Qty"
                  className="w-full h-[42px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Price Input */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  placeholder="Price"
                  className="w-full h-[42px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Square Add Button */}
              <div className="w-[42px]">
                <label className="block text-sm font-medium text-gray-700 mb-1 invisible">
                  Add
                </label>
                <button
                  type="button"
                  className="w-[42px] h-[42px] bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center justify-center"
                >
                  <FaPlus size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => setShowNewSaleModal(false)}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center space-x-2"
          >
            <FaMoneyBillWave size={14} />
            <span>Save Sale</span>
          </button>
        </div>
      </form>
    </div>
  );

  const OutpatientSalesTab = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
            <FaMoneyBillWave className="text-green-600" />
            <span>Outpatient Sales</span>
          </h2>
          <p className="text-gray-600">Manage walk-in and OPD sales</p>
        </div>
        <button
          onClick={() => setShowNewSaleModal(true)}
          className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <FaPlus className="-ml-1 mr-2 h-4 w-4" />
          New Sale
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search patients, IDs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sale ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {outpatientSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaHospitalUser
                        className="text-gray-400 mr-2"
                        size={14}
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {sale.patient}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sale.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${sale.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sale.items}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sale.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={sale.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-primary-600 hover:text-primary-900 mr-4">
                      <FaEye className="inline mr-1" /> View
                    </button>
                    <button className="text-primary-600 hover:text-primary-900 mr-4">
                      <FaEdit className="inline mr-1" /> Edit
                    </button>
                    <button className="text-purple-600 hover:text-purple-900 mr-4">
                      <FaFileInvoiceDollar className="inline mr-1" /> Invoice
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      <FaPrint className="inline mr-1" /> Print
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const InpatientBillingTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
            <FaProcedures className="text-primary-600" />
            <span>Inpatient Billing</span>
          </h2>
          <p className="text-gray-600">Integrated IPD billing management</p>
        </div>
        <button className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
          <FaExchangeAlt className="-ml-1 mr-2 h-4 w-4" />
          Sync IPD Data
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IPD ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Days
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inpatientBills.map((bill) => (
                <tr key={bill.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaHospitalUser
                        className="text-gray-400 mr-2"
                        size={14}
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {bill.patient}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {bill.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {bill.room}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${bill.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {bill.days}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={bill.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-primary-600 hover:text-primary-900 mr-4">
                      <FaEye className="inline mr-1" /> View
                    </button>
                    <button className="text-green-600 hover:text-green-900 mr-4">
                      <FaMoneyBillWave className="inline mr-1" /> Pay
                    </button>
                    <button className="text-purple-600 hover:text-purple-900">
                      <FaFileInvoiceDollar className="inline mr-1" /> Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const InvoiveManagementTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
            <FaProcedures className="text-primary-600" />
            <span>Invoive Management</span>
          </h2>
          <p className="text-gray-600">Generate, print, and sync invoices</p>
        </div>
        <button className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
          <FaExchangeAlt className="-ml-1 mr-2 h-4 w-4" />
          New Invoice
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {invoice.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {invoice.patient}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {invoice.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${invoice.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {invoice.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={invoice.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-primary-600 hover:text-primary-900 mr-4">
                      <FaEye className="inline mr-1" /> View
                    </button>
                    <button className="text-green-600 hover:text-green-900 mr-4">
                      <FaMoneyBillWave className="inline mr-1" /> Pay
                    </button>
                    <button className="text-purple-600 hover:text-purple-900">
                      <FaFileInvoiceDollar className="inline mr-1" /> Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const SalesReturnTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
            <RotateCcw className="text-primary-600" />
            <span>Sales Return</span>
          </h2>
          <p className="text-gray-600">
            Manage returns, refunds, and credit notes
          </p>
        </div>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center space-x-2">
          <RotateCcw size={20} />
          <span>Process Return</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Return ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Original Invoice
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {returns.map((returnItem) => (
                <tr key={returnItem.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {returnItem.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Receipt className="text-gray-400 mr-2" size={16} />
                      <span className="text-sm text-gray-900">
                        {returnItem.originalInvoice}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${returnItem.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {returnItem.reason}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {returnItem.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={returnItem.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-primary-600 hover:text-primary-900 mr-4">
                      <FaEye className="inline mr-1" /> View
                    </button>
                    <button className="text-green-600 hover:text-green-900 mr-4">
                      <FaMoneyBillWave className="inline mr-1" /> Pay
                    </button>
                    <button className="text-purple-600 hover:text-purple-900">
                      <FaFileInvoiceDollar className="inline mr-1" /> Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const ExportReportsTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
          <FaFileExport className="text-primary-600" />
          <span>Export Sales Reports</span>
        </h2>
        <p className="text-gray-600">
          Generate and export comprehensive sales reports
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Quick Reports
          </h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FaFileExport className="text-primary-600" size={16} />
                <span className="font-medium">Daily Sales Summary</span>
              </div>
              <FaFileDownload size={14} className="text-gray-400" />
            </button>
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FaFileInvoiceDollar className="text-green-600" size={16} />
                <span className="font-medium">Weekly Revenue Report</span>
              </div>
              <FaFileDownload size={14} className="text-gray-400" />
            </button>
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FaMoneyBillWave className="text-purple-600" size={16} />
                <span className="font-medium">Monthly Financial Summary</span>
              </div>
              <FaFileDownload size={14} className="text-gray-400" />
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Custom Report Generator
          </h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Type
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option>Sales Summary</option>
                <option>Patient Billing</option>
                <option>Revenue Analysis</option>
                <option>Return Analysis</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Date
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="date"
                    className="pl-10 border border-gray-300 px-4 py-2 rounded w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                  />
                </div>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Date
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="date"
                    className="pl-10 border border-gray-300 px-4 py-2 rounded w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Export Format
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="format"
                    value="pdf"
                    className="mr-2"
                  />
                  PDF
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="format"
                    value="excel"
                    className="mr-2"
                  />
                  Excel
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="format"
                    value="csv"
                    className="mr-2"
                  />
                  CSV
                </label>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 flex items-center justify-center space-x-2"
            >
              <FaFileDownload size={16} />
              <span>Generate & Export Report</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'outpatient':
        return <OutpatientSalesTab />;
      case 'inpatient':
        return <InpatientBillingTab />;
      case 'reports':
        return <ExportReportsTab />;
      case 'invoice':
        return <InvoiveManagementTab />;
      case 'sales':
        return <SalesReturnTab />;
      default:
        return <OutpatientSalesTab />;
    }
  };

  return (
    <div className="">
      {/* Header */}
      <div className="bg-primary-600 text-white rounded-md px-6 py-8 shadow-md">
        <div className="max-w-9xl mx-auto">
          <div className="flex items-center">
            <div className="h-12 w-1 bg-primary-300 mr-4 rounded-full"></div>
            <div>
              <h1 className="text-3xl font-bold">Sales & Billing Management</h1>
              <p className="text-primary-100 mt-1">
                Comprehensive healthcare billing and sales system
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap gap-2 mb-8">
          <TabButton
            id="outpatient"
            label="Outpatient Sales"
            icon={FaMoneyBillWave}
            isActive={activeTab === 'outpatient'}
            onClick={setActiveTab}
          />
          <TabButton
            id="inpatient"
            label="Inpatient Billing"
            icon={FaProcedures}
            isActive={activeTab === 'inpatient'}
            onClick={setActiveTab}
          />
          <TabButton
            id="invoice"
            label="Invoice Management"
            icon={FaProcedures}
            isActive={activeTab === 'invoice'}
            onClick={setActiveTab}
          />
          <TabButton
            id="sales"
            label="Sales Return"
            icon={FaProcedures}
            isActive={activeTab === 'sales'}
            onClick={setActiveTab}
          />
          <TabButton
            id="reports"
            label="Export Reports"
            icon={FaFileExport}
            isActive={activeTab === 'reports'}
            onClick={setActiveTab}
          />
        </div>

        {/* Tab Content */}
        {renderActiveTab()}
      </div>

      {/* Modals */}
      {showNewSaleModal && (
        <div className="fixed inset-0 bg-white/15 backdrop-blur-lg flex justify-center items-center">
          <div className="max-w-2xl w-full">
            <NewSaleForm />
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionManagement;
