import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  DollarSignIcon,
  UserIcon,
  StethoscopeIcon,
  BuildingIcon,
  PlusIcon,
  EyeIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  XIcon,
  LoaderIcon,
  HospitalIcon,
  SearchIcon,
  FilterIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  ClockIcon,
  FileTextIcon,
  EditIcon,
  Trash2Icon,
  DownloadIcon
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  setFilters,
  clearFilters,
  setPage,
  setLimit
} from "../../../features/expenses/expensesSlice";
import { fetchAllDoctors } from "../../../features/doctor/doctorSlice";
import EditExpenseModal from "./Editexpense";
import DeleteExpenseModal from "./Deleteexpense";
import ExpensePDF from "./Pdfexpense";

export default function Expenses() {
  const [formData, setFormData] = useState({
    expenseType: "doctor",
    doctor: "",
    doctorWelfare: "",
    otExpenses: "",
    otherExpenses: "",
    description: "",
    date: new Date().toISOString().split('T')[0]
  });

  const [showSummary, setShowSummary] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [editingExpense, setEditingExpense] = useState(null);
  const [deletingExpense, setDeletingExpense] = useState(null);
  const [pdfData, setPdfData] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    search: '',
    expenseType: '',
    doctor: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
    status: 'active'
  });

  const isLocalUpdate = useRef(false);

  const dispatch = useDispatch();




  const {
    expenses,
    loading,
    error,
    success,
    message,
    pagination,
    filters: reduxFilters,
    summary
  } = useSelector((state) => state.expenses);
  const { doctors = [] } = useSelector((state) => state.doctor);

  // Load doctors on component mount (only once)
  useEffect(() => {
    dispatch(fetchAllDoctors());
  }, [dispatch]);

  // Load expenses on mount and when pagination/filters change
  useEffect(() => {
    const params = {
      page: pagination.page,
      limit: pagination.limit,
      ...reduxFilters
    };

    dispatch(getExpenses(params));
  }, [dispatch, pagination.page, pagination.limit, reduxFilters]);

  // Sync local filters with redux filters
  useEffect(() => {
    if (isLocalUpdate.current) {
      isLocalUpdate.current = false;
      return;
    }

    if (JSON.stringify(localFilters) !== JSON.stringify(reduxFilters)) {
      setLocalFilters(reduxFilters);
    }
  }, [reduxFilters]);



  const handleFilterChange = (field, value) => {
    setLocalFilters(prev => ({ ...prev, [field]: value }));
  };

  const applyFilters = useCallback(() => {
    dispatch(setFilters(localFilters));
    setShowFilterPanel(false);
  }, [dispatch, localFilters]);

  const clearAllFilters = useCallback(() => {
    const emptyFilters = {
      search: '',
      expenseType: '',
      doctor: '',
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: '',
      status: 'active'
    };

    setLocalFilters(emptyFilters);
    setShowFilterPanel(false);
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      dispatch(setPage(newPage));
    }
  };

  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value);
    dispatch(setLimit(newLimit));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.expenseType) {
      errors.expenseType = "Please select expense type";
    }

    if (formData.expenseType === 'doctor' && !formData.doctor) {
      errors.doctor = "Please select a doctor for doctor expenses";
    }

    const welfare = parseFloat(formData.doctorWelfare);
    const ot = parseFloat(formData.otExpenses);
    const other = parseFloat(formData.otherExpenses);

    if (isNaN(welfare) || welfare < 0) {
      errors.doctorWelfare = "Please enter a valid welfare amount";
    }

    if (isNaN(ot) || ot < 0) {
      errors.otExpenses = "Please enter a valid OT expenses amount";
    }

    if (isNaN(other) || other < 0) {
      errors.otherExpenses = "Please enter a valid other expenses amount";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === 'expenseType' && value === 'hospital') {
      setFormData(prev => ({ ...prev, doctor: '' }));
    }

    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const expenseData = {
      expenseType: formData.expenseType,
      doctor: formData.expenseType === 'doctor' ? formData.doctor : null,
      doctorWelfare: parseFloat(formData.doctorWelfare) || 0,
      otExpenses: parseFloat(formData.otExpenses) || 0,
      otherExpenses: parseFloat(formData.otherExpenses) || 0,
      description: formData.description,
      date: formData.date
    };

    setIsCreating(true);
    try {
      await dispatch(createExpense(expenseData)).unwrap();

      setFormData({
        expenseType: "doctor",
        doctor: "",
        doctorWelfare: "",
        otExpenses: "",
        otherExpenses: "",
        description: "",
        date: new Date().toISOString().split('T')[0]
      });
      setShowAddForm(false);

    } catch (err) {
      console.error("Create failed:", err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
  };

  const handleDelete = (expense) => {
    setDeletingExpense(expense);
  };

  const handleGeneratePDF = (doctor, summary) => {
    setPdfData({ doctor, summary });
  };

  const toggleSummary = () => {
    setShowSummary(!showSummary);
  };

  // Calculate totals from the summary returned by API
  const getGrandTotal = () => {
    if (summary) {
      return summary.grandTotal || 0;
    }

    // Fallback to local calculation if summary not available
    return expenses.reduce((total, expense) => {
      if (!expense || typeof expense !== 'object') return total;
      return total + (expense.total || 0);
    }, 0);
  };

  // Get filtered expenses by type
  const getDoctorExpenses = () => {
    return expenses.filter(expense => {
      if (!expense || typeof expense !== 'object') return false;
      return expense.expenseType === 'doctor';
    });
  };

  const getHospitalExpenses = () => {
    return expenses.filter(expense => {
      if (!expense || typeof expense !== 'object') return false;
      return expense.expenseType === 'hospital';
    });
  };

  const doctorExpenses = getDoctorExpenses();
  const hospitalExpenses = getHospitalExpenses();

  // Calculate doctor summary from filtered data
  const calculateDoctorSummary = () => {
    const summary = {};

    doctorExpenses.forEach((expense) => {
      const key = expense.doctor || "Unassigned";
      if (!summary[key]) {
        summary[key] = {
          total: 0,
          welfare: 0,
          ot: 0,
          other: 0,
          count: 0,
          expenses: []
        };
      }

      const welfare = Number(expense.doctorWelfare) || 0;
      const ot = Number(expense.otExpenses) || 0;
      const other = Number(expense.otherExpenses) || 0;

      summary[key].welfare += welfare;
      summary[key].ot += ot;
      summary[key].other += other;
      summary[key].total += welfare + ot + other;
      summary[key].count += 1;
      summary[key].expenses.push(expense);
    });

    return summary;
  };

  const doctorSummary = calculateDoctorSummary();

  // Calculate hospital totals from filtered data
  const calculateHospitalTotals = () => {
    return hospitalExpenses.reduce((totals, expense) => {
      const welfare = Number(expense.doctorWelfare) || 0;
      const ot = Number(expense.otExpenses) || 0;
      const other = Number(expense.otherExpenses) || 0;

      return {
        welfare: totals.welfare + welfare,
        ot: totals.ot + ot,
        other: totals.other + other,
        total: totals.total + welfare + ot + other,
        count: totals.count + 1
      };
    }, { welfare: 0, ot: 0, other: 0, total: 0, count: 0 });
  };

  const hospitalTotals = calculateHospitalTotals();

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const totalPages = pagination.totalPages || 1;
    const currentPage = pagination.page || 1;
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  // Auto-apply filters whenever localFilters change + reset to page 1
  useEffect(() => {
    isLocalUpdate.current = true;
    dispatch(setFilters(localFilters));
    dispatch(setPage(1));
  }, [localFilters, dispatch]);



  return (
    <div className="w-full space-y-6">
      {/* Status Messages */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-100 text-red-700 rounded-md">
          <AlertCircleIcon className="h-5 w-5" />
          <p>{error.message || error || "An error occurred while processing your request"}</p>
        </div>
      )}

      {success && message && (
        <div className="flex items-center gap-2 p-4 bg-green-100 text-green-700 rounded-md">
          <CheckCircleIcon className="h-5 w-5" />
          <p>{message}</p>
        </div>
      )}

      {/* Main Card */}
      <div className="shadow-lg rounded-lg overflow-hidden bg-white">
        {/* Header */}
        <div className="bg-teal-600 px-6 py-8 text-white">
          <div className="flex items-start gap-4">
            <div className="w-1 bg-white h-16 rounded-full" />
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Hospital Expenses Management
              </h1>
              <p className="text-teal-100">
                Manage both doctor and hospital expenses with advanced filtering and pagination
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Section title */}
          <div className="flex items-center justify-between mb-6">
            {/* Left side */}
            <div className="flex items-center gap-3">
              <div className="w-1 bg-teal-600 h-6 rounded-full" />
              <h2 className="text-lg font-semibold text-gray-800">
                Expense Management Dashboard
              </h2>
            </div>

            {/* Right side */}
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center bg-teal-600 hover:bg-teal-700 text-white px-6 h-10 rounded-md"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Expense
            </button>
          </div>


          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={localFilters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search by doctor name, description, or expense type..."
                className="w-full pl-10 pr-10 h-10 rounded-md border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
              {localFilters.search && (
                <button
                  onClick={() => handleFilterChange('search', '')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                className={`flex items-center border px-4 h-10 rounded-md ${showFilterPanel || Object.values(localFilters).some(val => val && val !== 'active')
                    ? 'border-teal-50 bg-teal-50 text-teal-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <FilterIcon className="w-4 h-4 mr-2" />
                Filters

              </button>

              {(localFilters.search || localFilters.expenseType || localFilters.doctor ||
                localFilters.startDate || localFilters.endDate ||
                localFilters.minAmount || localFilters.maxAmount || localFilters.status !== 'active') && (
                  <button
                    onClick={clearAllFilters}
                    className="flex items-center border border-red-300 text-red-600 hover:bg-red-50 px-4 h-10 rounded-md"
                  >
                    Clear Filters
                  </button>
                )}
            </div>
          </div>

          {/* Filter Panel */}
          {showFilterPanel && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Expense Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expense Type
                  </label>
                  <select
                    value={localFilters.expenseType}
                    onChange={(e) => handleFilterChange('expenseType', e.target.value)}
                    className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  >
                    <option value="">All Types</option>
                    <option value="doctor">Doctor</option>
                    <option value="hospital">Hospital</option>
                  </select>
                </div>

                {/* Doctor Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Doctor
                  </label>
                  <select
                    value={localFilters.doctor}
                    onChange={(e) => handleFilterChange('doctor', e.target.value)}
                    className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  >
                    <option value="">All Doctors</option>
                    {doctors.map((doctor) => (
                      <option key={doctor._id} value={doctor?.user?.user_Name}>
                        {doctor?.user?.user_Name} ({doctor?.doctor_Department})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="date"
                      value={localFilters.startDate || ''}
                      onChange={(e) => handleFilterChange('startDate', e.target.value)}
                      className="w-full pl-10 h-10 rounded-md border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="date"
                      value={localFilters.endDate || ''}
                      onChange={(e) => handleFilterChange('endDate', e.target.value)}
                      className="w-full pl-10 h-10 rounded-md border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>
                </div>

                {/* Amount Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Amount
                  </label>
                  <div className="relative">
                    <DollarSignIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={localFilters.minAmount}
                      onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                      className="w-full pl-10 h-10 rounded-md border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-teal-600"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Amount
                  </label>
                  <div className="relative">
                    <DollarSignIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={localFilters.maxAmount}
                      onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                      className="w-full pl-10 h-10 rounded-md border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-teal-600"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={localFilters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  >
                    <option value="active">Active</option>
                    <option value="deleted">Deleted</option>
                    <option value="all">All</option>
                  </select>
                </div> */}
              </div>

              {/* <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setShowFilterPanel(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={applyFilters}
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                >
                  Apply Filters
                </button>
              </div> */}
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-50">
              <div className="flex items-center">
                <UserIcon className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-blue-600">Doctor Expenses</p>
                  <p className="text-2xl font-bold text-blue-800">{doctorExpenses.length}</p>
                  <p className="text-xs text-blue-500">
                    {summary?.totalDoctorWelfare ? `PKR ${summary.totalDoctorWelfare.toFixed(2)}` : 'Calculating...'}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-50">
              <div className="flex items-center">
                <HospitalIcon className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-green-600">Hospital Expenses</p>
                  <p className="text-2xl font-bold text-green-800">{hospitalExpenses.length}</p>
                  <p className="text-xs text-green-500">
                    PKR {hospitalTotals.total.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-teal-50 p-4 rounded-lg border border-teal-50">
              <div className="flex items-center">
                <DollarSignIcon className="h-8 w-8 text-teal-600 mr-3" />
                <div>
                  <p className="text-sm text-teal-600">Grand Total</p>
                  <p className="text-2xl font-bold text-teal-800">
                    PKR {getGrandTotal().toFixed(2)}
                  </p>
                  <p className="text-xs text-teal-500">
                    {summary?.count ? `${summary.count} entries` : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>


          {/* Pagination Info and Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="text-sm text-gray-600 mb-2 md:mb-0">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} expenses
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <label className="mr-2 text-sm">Rows per page:</label>
                <select
                  value={pagination.limit}
                  onChange={handleLimitChange}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <LoaderIcon className="h-8 w-8 animate-spin text-teal-600" />
              <span className="ml-2 text-gray-600">Loading expenses...</span>
            </div>
          )}

          {/* Expenses Table */}
          {!loading && expenses.length > 0 && (
            <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Doctor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amounts
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {expenses.map((expense) => (
                      <tr key={expense._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                            {formatDate(expense.date)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${expense.expenseType === 'doctor'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                            }`}>
                            {expense.expenseType === 'doctor' ? (
                              <>
                                <UserIcon className="h-3 w-3 mr-1" />
                                Doctor
                              </>
                            ) : (
                              <>
                                <HospitalIcon className="h-3 w-3 mr-1" />
                                Hospital
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {expense.doctor || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                          <div className="flex items-center">
                            <FileTextIcon className="h-4 w-4 text-gray-400 mr-2 shrink-0" />
                            <span className="truncate" title={expense.description}>
                              {expense.description || 'No description'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-blue-600">Welfare:</span>
                              <span>PKR {(expense.doctorWelfare || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-green-600">OT:</span>
                              <span>PKR {(expense.otExpenses || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-orange-600">Other:</span>
                              <span>PKR {(expense.otherExpenses || 0).toFixed(2)}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          PKR {(expense.total || 0).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(expense)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                              title="Edit"
                            >
                              <EditIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(expense)}
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                              title="Delete"
                            >
                              <Trash2Icon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* No Results */}
          {!loading && expenses.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">
                {Object.values(localFilters).some(filter => filter && filter !== 'active')
                  ? 'No expenses found matching your filters.'
                  : 'No expenses found. Add your first expense!'}
              </p>
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex flex-col md:flex-row items-center justify-between mt-6 px-4 py-3 bg-white border-t border-gray-200">
              <div className="text-sm text-gray-700 mb-4 md:mb-0">
                Page {pagination.page} of {pagination.totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={pagination.page === 1}
                  className={`px-3 py-1 rounded border ${pagination.page === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  First
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className={`px-3 py-1 rounded border flex items-center ${pagination.page === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <ChevronLeftIcon className="mr-1" size={16} /> Previous
                </button>

                {/* Page numbers */}
                <div className="flex space-x-1">
                  {pageNumbers.map((pageNum, index) => (
                    pageNum === '...' ? (
                      <span key={`ellipsis-${index}`} className="px-3 py-1">...</span>
                    ) : (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 rounded border ${pagination.page === pageNum
                            ? 'bg-teal-600 text-white border-teal-600'
                            : 'text-gray-700 hover:bg-gray-50'
                          }`}
                      >
                        {pageNum}
                      </button>
                    )
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className={`px-3 py-1 rounded border flex items-center ${pagination.page === pagination.totalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  Next <ChevronRightIcon className="ml-1" size={16} />
                </button>
                <button
                  onClick={() => handlePageChange(pagination.totalPages)}
                  disabled={pagination.page === pagination.totalPages}
                  className={`px-3 py-1 rounded border ${pagination.page === pagination.totalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  Last
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Expense Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Add New Expense</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <form
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              onSubmit={handleSubmit}
            >
              {/* Expense Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Expense Type</label>
                <div className="relative">
                  <BuildingIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-600 pointer-events-none" />
                  <select
                    value={formData.expenseType}
                    onChange={(e) => handleInputChange("expenseType", e.target.value)}
                    className="pl-10 w-full h-10 rounded-md border border-gray-300 bg-white px-3 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  >
                    <option value="doctor">Doctor Expense</option>
                    <option value="hospital">Hospital Expense</option>
                  </select>
                </div>
                {formErrors.expenseType && (
                  <p className="text-red-500 text-sm">{formErrors.expenseType}</p>
                )}
              </div>

              {/* Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Date</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-600 pointer-events-none" />
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    className="pl-10 w-full h-10 rounded-md border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>

              {/* Doctor - Only show for doctor expenses */}
              {formData.expenseType === 'doctor' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Doctor</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-600 pointer-events-none" />
                    <select
                      value={formData.doctor}
                      onChange={(e) => handleInputChange("doctor", e.target.value)}
                      className="pl-10 w-full h-10 rounded-md border border-gray-300 bg-white px-3 focus:outline-none focus:ring-2 focus:ring-teal-600"
                    >
                      <option value="">Select Doctor</option>
                      {doctors.map((d) => (
                        <option key={d._id} value={d?.user?.user_Name}>
                          {d?.user?.user_Name}-({d?.doctor_Department})
                        </option>
                      ))}
                    </select>
                  </div>
                  {formErrors.doctor && (
                    <p className="text-red-500 text-sm">{formErrors.doctor}</p>
                  )}
                </div>
              )}

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Description
                </label>
                <div className="relative">
                  <FileTextIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-600 pointer-events-none" />
                  <input
                    placeholder="Enter expense description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    className="pl-10 w-full h-10 rounded-md border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>

              {/* Doctor Welfare */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Doctor Welfare
                </label>
                <div className="relative">
                  <DollarSignIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-600 pointer-events-none" />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.doctorWelfare}
                    onChange={(e) =>
                      handleInputChange("doctorWelfare", e.target.value)
                    }
                    className={`pl-10 w-full h-10 rounded-md border px-3 focus:outline-none focus:ring-2 focus:ring-teal-600 ${formErrors.doctorWelfare ? "border-red-500" : "border-gray-300"
                      }`}
                  />
                </div>
                {formErrors.doctorWelfare && (
                  <p className="text-red-500 text-sm">{formErrors.doctorWelfare}</p>
                )}
              </div>

              {/* OT Expenses */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  OT Expenses
                </label>
                <div className="relative">
                  <StethoscopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-600 pointer-events-none" />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.otExpenses}
                    onChange={(e) =>
                      handleInputChange("otExpenses", e.target.value)
                    }
                    className={`pl-10 w-full h-10 rounded-md border px-3 focus:outline-none focus:ring-2 focus:ring-teal-600 ${formErrors.otExpenses ? "border-red-500" : "border-gray-300"
                      }`}
                  />
                </div>
                {formErrors.otExpenses && (
                  <p className="text-red-500 text-sm">{formErrors.otExpenses}</p>
                )}
              </div>

              {/* Other Expenses */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">
                  Other Expenses
                </label>
                <div className="relative">
                  <DollarSignIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-600 pointer-events-none" />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.otherExpenses}
                    onChange={(e) =>
                      handleInputChange("otherExpenses", e.target.value)
                    }
                    className={`pl-10 w-full h-10 rounded-md border px-3 focus:outline-none focus:ring-2 focus:ring-teal-600 ${formErrors.otherExpenses ? "border-red-500" : "border-gray-300"
                      }`}
                  />
                </div>
                {formErrors.otherExpenses && (
                  <p className="text-red-500 text-sm">{formErrors.otherExpenses}</p>
                )}
              </div>

              {/* Total Preview */}
              <div className="md:col-span-2 bg-teal-50 p-4 rounded-lg border border-teal-200">
                <p className="text-sm font-medium text-teal-700 mb-2">Total Preview</p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <p className="text-xs text-teal-600">Welfare</p>
                    <p className="font-semibold">
                      PKR {(parseFloat(formData.doctorWelfare) || 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-teal-600">OT</p>
                    <p className="font-semibold">
                      PKR {(parseFloat(formData.otExpenses) || 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-teal-600">Other</p>
                    <p className="font-semibold">
                      PKR {(parseFloat(formData.otherExpenses) || 0).toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-teal-300 text-center">
                  <p className="text-sm text-teal-800">Grand Total</p>
                  <p className="text-xl font-bold text-teal-900">
                    PKR {(
                      (parseFloat(formData.doctorWelfare) || 0) +
                      (parseFloat(formData.otExpenses) || 0) +
                      (parseFloat(formData.otherExpenses) || 0)
                    ).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 md:col-span-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex items-center bg-teal-600 hover:bg-teal-700 text-white px-6 h-10 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? (
                    <>
                      <LoaderIcon className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Add Expense
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Summary Sections */}
      {showSummary && (
        <div className="space-y-6">
          {/* Doctor Expenses Summary */}
          <div className="shadow-lg rounded-lg overflow-hidden bg-white">
            <div className="bg-blue-600 px-6 py-4 text-white">
              <div className="flex items-center gap-4">
                <div className="w-1 bg-white h-8 rounded-full" />
                <h2 className="text-xl font-bold">Doctor Expenses Summary</h2>
              </div>
            </div>

            <div className="p-6">
              {doctorExpenses.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No doctor expenses found.
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(doctorSummary).map(([doctor, summary]) => (
                    <div
                      key={doctor}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-800">
                            {doctor}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {summary.count} expense entries
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleGeneratePDF(doctor, summary)}
                            className="flex items-center px-3 py-1 bg-teal-500 text-white rounded hover:bg-teal-600"
                          >
                            <DownloadIcon className="w-3 h-3 mr-1" />
                            PDF
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="bg-blue-50 p-3 rounded">
                          <p className="text-blue-600 font-medium">Doctor Welfare</p>
                          <p className="text-xl font-bold text-blue-800">
                            PKR {summary.welfare.toFixed(2)}
                          </p>
                        </div>
                        <div className="bg-green-50 p-3 rounded">
                          <p className="text-green-600 font-medium">OT Expenses</p>
                          <p className="text-xl font-bold text-green-800">
                            PKR {summary.ot.toFixed(2)}
                          </p>
                        </div>
                        <div className="bg-orange-50 p-3 rounded">
                          <p className="text-orange-600 font-medium">
                            Other Expenses
                          </p>
                          <p className="text-xl font-bold text-orange-800">
                            PKR {summary.other.toFixed(2)}
                          </p>
                        </div>
                        <div className="bg-teal-50 p-3 rounded">
                          <p className="text-teal-600 font-medium">Total</p>
                          <p className="text-xl font-bold text-teal-800">
                            PKR {summary.total.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Hospital Expenses Summary */}
          <div className="shadow-lg rounded-lg overflow-hidden bg-white">
            <div className="bg-green-600 px-6 py-4 text-white">
              <div className="flex items-center gap-4">
                <div className="w-1 bg-white h-8 rounded-full" />
                <h2 className="text-xl font-bold">Hospital Expenses Summary</h2>
              </div>
            </div>

            <div className="p-6">
              {hospitalExpenses.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No hospital expenses found.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="bg-blue-50 p-3 rounded">
                        <p className="text-blue-600 font-medium">Doctor Welfare</p>
                        <p className="text-xl font-bold text-blue-800">
                          PKR {hospitalTotals.welfare.toFixed(2)}
                        </p>
                      </div>
                      <div className="bg-green-50 p-3 rounded">
                        <p className="text-green-600 font-medium">OT Expenses</p>
                        <p className="text-xl font-bold text-green-800">
                          PKR {hospitalTotals.ot.toFixed(2)}
                        </p>
                      </div>
                      <div className="bg-orange-50 p-3 rounded">
                        <p className="text-orange-600 font-medium">
                          Other Expenses
                        </p>
                        <p className="text-xl font-bold text-orange-800">
                          PKR {hospitalTotals.other.toFixed(2)}
                        </p>
                      </div>
                      <div className="bg-teal-50 p-3 rounded">
                        <p className="text-teal-600 font-medium">Total</p>
                        <p className="text-xl font-bold text-teal-800">
                          PKR {hospitalTotals.total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm mt-2">
                      {hospitalTotals.count} expense entries
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {editingExpense && (
        <EditExpenseModal
          expense={editingExpense}
          onClose={() => setEditingExpense(null)}
          doctors={doctors}
          onUpdateSuccess={() => {
            setEditingExpense(null);
          }}
        />
      )}

      {deletingExpense && (
        <DeleteExpenseModal
          expense={deletingExpense}
          onClose={() => setDeletingExpense(null)}
          onDeleteSuccess={() => {
            setDeletingExpense(null);
          }}
        />
      )}

      {pdfData && (
        <ExpensePDF
          data={pdfData}
          onClose={() => setPdfData(null)}
        />
      )}
    </div>
  );
}