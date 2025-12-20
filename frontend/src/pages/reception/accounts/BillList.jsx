import React, { useState } from 'react';
import { Search, Filter, PlusCircle, RotateCw, Download, Edit, Trash } from 'lucide-react';
import { FiCalendar } from "react-icons/fi";

const BillManagement = () => {
  // Sample initial data
  const initialBills = [
    {
      id: 1,
      patientName: 'Sarah Smith',
      patientInitial: 'SS',
      admissionId: 'HGYU89',
      doctorName: 'DR. Megha Trivedi',
      status: 'Unpaid',
      admissionDate: '02/12/2018',
      tax: '8%',
      discount: '5%',
      totalAmount: 'PKR 142',
    },
    {
      id: 2,
      patientName: "Vishal Kumar",
      patientInitial: "VK",
      admissionId: "HGYU99",
      doctorName: "DR. John Deo",
      status: "Paid",
      admissionDate: "03/22/2018",
      tax: "10%",
      discount: "5%",
      totalAmount: "PKR 126",
    },
    {
      id: 3,
      patientName: "Rahul Malhotra",
      patientInitial: "RM",
      admissionId: "HGYU29",
      doctorName: "DR. Sarah Smith",
      status: "Paid",
      admissionDate: "02/02/2018",
      tax: "9%",
      discount: "5%",
      totalAmount: "PKR 115",
    },
    {
      id: 4,
      patientName: "Priya Jain",
      patientInitial: "PJ",
      admissionId: "HGYU36",
      doctorName: "DR. Stive",
      status: "Unpaid",
      admissionDate: "03/19/2018",
      tax: "9%",
      discount: "5%",
      totalAmount: "PKR 142",
    },
    {
      id: 5,
      patientName: "Radhika Patel",
      patientInitial: "RP",
      admissionId: "HGYU27",
      doctorName: "DR. Megha Trivedi",
      status: "Unpaid",
      admissionDate: "05/22/2018",
      tax: "10%",
      discount: "5%",
      totalAmount: "PKR 126",
    },
    {
      id: 6,
      patientName: "Sarah Smith",
      patientInitial: "SS",
      admissionId: "HGYU12",
      doctorName: "DR. Megha Trivedi",
      status: "Unpaid",
      admissionDate: "05/07/2018",
      tax: "8%",
      discount: "5%",
      totalAmount: "PKR 115",
    },
    {
      id: 7,
      patientName: "Vishal Kumar",
      patientInitial: "VK",
      admissionId: "HGYU14",
      doctorName: "DR. John Deo",
      status: "Paid",
      admissionDate: "02/20/2018",
      tax: "10%",
      discount: "5%",
      totalAmount: "PKR 126",
    },
    {
      id: 8,
      patientName: "Rahul Malhotra",
      patientInitial: "RM",
      admissionId: "HGYU09",
      doctorName: "DR. Sarah Smith",
      status: "Paid",
      admissionDate: "03/21/2018",
      tax: "9%",
      discount: "5%",
      totalAmount: "PKR 142",
    },
    {
      id: 9,
      patientName: "Priya Jain",
      patientInitial: "PJ",
      admissionId: "HGYU80",
      doctorName: "DR. Stive",
      status: "Unpaid",
      admissionDate: "02/11/2018",
      tax: "9%",
      discount: "5%",
      totalAmount: "PKR 142",
    },
    {
      id: 10,
      patientName: "Radhika Patel",
      patientInitial: "RP",
      admissionId: "HGYU38",
      doctorName: "DR. Megha Trivedi",
      status: "Unpaid",
      admissionDate: "03/18/2018",
      tax: "10%",
      discount: "5%",
      totalAmount: "PKR 126",
    }
  ];

  // State management
  const [bills, setBills] = useState(initialBills);
  const [formData, setFormData] = useState({
    patientName: '',
    admissionId: '',
    doctorName: '',
    status: 'Unpaid',
    admissionDate: '',
    tax: '',
    discount: '',
    totalAmount: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  // Filter bills
  const filteredBills = bills.filter(bill =>
    bill.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.admissionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBills = filteredBills.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBills.length / itemsPerPage);

  // Handle form operations
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      setBills(bills.map(bill =>
        bill.id === currentId ? { ...formData, id: currentId } : bill
      ));
    } else {
      const newId = bills.length > 0 ? Math.max(...bills.map(b => b.id)) + 1 : 1;
      setBills([...bills, { ...formData, id: newId }]);
    }
    resetForm();
  };

  const handleEdit = (bill) => {
    setFormData({
      patientName: bill.patientName,
      admissionId: bill.admissionId,
      doctorName: bill.doctorName,
      status: bill.status,
      admissionDate: bill.admissionDate,
      tax: bill.tax,
      discount: bill.discount,
      totalAmount: bill.totalAmount
    });
    setEditMode(true);
    setCurrentId(bill.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      setBills(bills.filter(bill => bill.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      patientName: '',
      admissionId: '',
      doctorName: '',
      status: 'Unpaid',
      admissionDate: '',
      tax: '',
      discount: '',
      totalAmount: ''
    });
    setEditMode(false);
    setCurrentId(null);
    setShowForm(false);
  };

  const getAvatarColor = (name) => {
    const colors = [
      'bg-primary-500', 'bg-red-500', 'bg-green-500',
      'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="">
      {/* Header Section */}
      <div className="bg-primary-600 rounded-md text-white px-6 py-8 shadow-md">
        <div className="max-w-9xl mx-auto">
          <div className="flex items-center">
            <div className="h-12 w-1 bg-primary-300 mr-4 rounded-full"></div>
            <div>
              <h1 className="text-3xl font-bold">Billing Management</h1>
              <p className="text-primary-100 mt-1">Manage all patient bills and payments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-9xl mx-auto px-6 py-8">
        {/* Search and Add Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search bills by patient, admission ID, or doctor..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex space-x-2">
              <div className="relative flex-1 md:w-48">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCalendar className="text-gray-400" />
                </div>
                <input
                  type="date"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                <PlusCircle className="-ml-1 mr-2 h-5 w-5" />
                {showForm ? 'Cancel' : 'Add Bill'}
              </button>
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {editMode ? 'Edit Bill' : 'Add New Bill'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name*</label>
                  <input
                    type="text"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Admission ID*</label>
                  <input
                    type="text"
                    name="admissionId"
                    value={formData.admissionId}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name*</label>
                  <input
                    type="text"
                    name="doctorName"
                    value={formData.doctorName}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status*</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                  >
                    <option value="Unpaid">Unpaid</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Admission Date*</label>
                  <input
                    type="date"
                    name="admissionDate"
                    value={formData.admissionDate}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tax (%)*</label>
                  <input
                    type="text"
                    name="tax"
                    value={formData.tax}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)*</label>
                  <input
                    type="text"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount*</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">PKR</span>
                    </div>
                    <input
                      type="text"
                      name="totalAmount"
                      value={formData.totalAmount}
                      onChange={handleInputChange}
                      className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  {editMode ? 'Update Bill' : 'Save Bill'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Bills Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admission ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admission Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tax
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Discount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentBills.length > 0 ? (
                  currentBills.map((bill) => (
                    <tr key={bill.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-white ${getAvatarColor(bill.patientName)}`}>
                            {bill.patientInitial}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{bill.patientName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {bill.admissionId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {bill.doctorName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bill.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                          }`}>
                          {bill.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {bill.admissionDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {bill.tax}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {bill.discount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {bill.totalAmount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(bill)}
                          className="text-primary-600 hover:text-primary-900 mr-4"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(bill.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="px-6 py-4 text-center text-sm text-gray-500">
                      {searchTerm ? 'No bills match your search.' : 'No bills found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(indexOfLastItem, filteredBills.length)}
            </span>{' '}
            of <span className="font-medium">{filteredBills.length}</span> results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-md ${currentPage === page ? 'bg-primary-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillManagement;