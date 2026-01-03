import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  getAllTestBills,
  fetchRadiologyBills,
} from "../../../features/labBill/LabBillSlice";
import { toast } from "react-toastify";
import {
  FiSearch,
  FiFilter,
  FiCalendar,
  FiX,
  FiChevronDown,
  FiChevronUp,
  FiChevronLeft,
  FiChevronRight,
  FiDollarSign,
  FiFileText,
} from "react-icons/fi";
import { format } from "date-fns";
import { FaEllipsisV } from "react-icons/fa";
import { Link } from "react-router-dom"; // Fixed import

import RefundForm from "./RefundForm";
import PaymentFinalizationForm from "./PaymentFinalizationForm";

const paymentStatusColors = {
  paid: "bg-green-100 text-green-800 border border-green-200",
  pending: "bg-red-100 text-red-800 border border-red-200",
  partial: "bg-yellow-100 text-yellow-800 border border-yellow-200",
  refunded: "bg-gray-100 text-gray-800 border border-gray-200",
  completed: "bg-blue-100 text-blue-800 border border-blue-200",
};

const paymentStatusMap = {
  paid: "Paid",
  pending: "Unpaid",
  partial: "Partial",
  refunded: "Refunded",
  completed: "Completed",
};

const AllBills = () => {
  const dispatch = useDispatch();

  // State from Redux
  const {
    allBills: {
      data: labBills = [],
      pagination: labPagination = {},
      summary: labSummary = {},
      status: labStatus,
      error: labError,
    },
    bills: radiologyBills = [],
    status: radiologyStatus,
    error: radiologyError,
  } = useSelector((state) => state.labBill);

  // Get user info for admin check
  const { user } = useSelector((state) => state.auth || {});
  const isAdmin = user?.role === "admin";

  // Local state for filters
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    paymentStatus: "all",
    patientName: "",
    patientMRNo: "",
    patientContact: "",
    startDate: null,
    endDate: null,
    testName: "",
    minAmount: "",
    maxAmount: "",
    gender: "",
    dateRange: "",
    status: "",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [localSearchTerm, setLocalSearchTerm] = useState("");

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showRefundForm, setShowRefundForm] = useState(false);
  const [currentBill, setCurrentBill] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);

  const filterRef = useRef(null);

  // Build query parameters for backend
  const buildQueryParams = useCallback(() => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
    };

    // Add text search
    if (filters.search && filters.search.trim()) {
      params.search = filters.search.trim();
    }

    // Add individual field filters
    if (filters.patientName && filters.patientName.trim()) {
      params.patientName = filters.patientName.trim();
    }

    if (filters.patientMRNo && filters.patientMRNo.trim()) {
      params.patientMRNo = filters.patientMRNo.trim();
    }

    if (filters.patientContact && filters.patientContact.trim()) {
      params.patientContact = filters.patientContact.trim();
    }

    if (filters.testName && filters.testName.trim()) {
      params.testName = filters.testName.trim();
    }

    if (filters.gender && filters.gender.trim()) {
      params.gender = filters.gender.trim();
    }

    if (filters.status && filters.status.trim()) {
      params.status = filters.status.trim();
    }

    // Add payment status filter
    if (filters.paymentStatus && filters.paymentStatus !== "all") {
      params.paymentStatus = filters.paymentStatus;
    }

    // Add amount filters
    if (filters.minAmount && !isNaN(filters.minAmount)) {
      params.minAmount = parseFloat(filters.minAmount);
    }

    if (filters.maxAmount && !isNaN(filters.maxAmount)) {
      params.maxAmount = parseFloat(filters.maxAmount);
    }

    // Add date range filter
    if (filters.startDate && filters.endDate) {
      params.startDate = format(filters.startDate, "yyyy-MM-dd");
      params.endDate = format(filters.endDate, "yyyy-MM-dd");
    } else if (filters.startDate) {
      params.startDate = format(filters.startDate, "yyyy-MM-dd");
      params.endDate = format(filters.startDate, "yyyy-MM-dd");
    }

    // Add predefined date range
    if (filters.dateRange && filters.dateRange.trim()) {
      params.dateRange = filters.dateRange.trim();
    }

    return params;
  }, [currentPage, itemsPerPage, filters]);

  // Fetch data with pagination and filters
  useEffect(() => {
    const queryParams = buildQueryParams();

    // Fetch lab bills
    dispatch(getAllTestBills(queryParams));

    // Fetch radiology bills
    dispatch(fetchRadiologyBills());
  }, [dispatch, buildQueryParams]);

  // Close filter popup when clicking outside
  useEffect(() => {
    const handleFilterClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterPopup(false);
      }
    };

    document.addEventListener("mousedown", handleFilterClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleFilterClickOutside);
    };
  }, []);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setLocalSearchTerm(filters.search);
      setCurrentPage(1);
    }, 900);

    return () => clearTimeout(timer);
  }, [filters.search]);

  // Format bills data
  const formatBills = (bills) => {
    if (!bills || !Array.isArray(bills)) return [];

    return bills.map((bill) => ({
      id: bill._id,
      patientName: bill.patientDetails?.patient_Name || "N/A",
      patientMRNo: bill.patientDetails?.patient_MRNo || "N/A",
      patientContact: bill.patientDetails?.patient_ContactNo || "N/A",
      patientGender: bill.patientDetails?.patient_Gender || "N/A",
      patientCNIC: bill.patientDetails?.patient_CNIC || "N/A",
      testCount: bill.tests?.length || 0,
      tests:
        bill.tests?.map((test) => ({
          name: test.name || "N/A",
          code: test.code || "N/A",
          status: test.status || "pending",
          price: test.price || 0,
          testId: test.testId,
        })) || [],
      date: bill.createdAt,
      paymentStatus: bill.billingInfo?.paymentStatus || "pending",
      totalAmount: bill.billingInfo?.totalAmount || 0,
      discountAmount: bill.billingInfo?.discountAmount || 0,
      advanceAmount: bill.billingInfo?.advanceAmount || 0,
      remainingAmount: bill.billingInfo?.remainingAmount || 0,
      paidAfterReport: bill.billingInfo?.paidAfterReport || 0,
      totalPaid: bill.billingInfo?.totalPaid || 0,
      tokenNumber: bill.billingInfo?.tokenNumber || "N/A",
      labNotes: bill.billingInfo?.labNotes || "",
      refunded: bill.billingInfo?.refunded || [],
      billType: bill.billType || "lab",
      fullData: bill,
    }));
  };

  // Combine lab and radiology bills
  const allBills = [...formatBills(labBills), ...formatBills(radiologyBills)];

  // Filter bills based on filters
  const filteredBills = allBills.filter((bill) => {
    // Search filter
    if (filters.search && filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase();
      const matches =
        bill.patientName.toLowerCase().includes(searchTerm) ||
        bill.patientMRNo.toLowerCase().includes(searchTerm) ||
        bill.patientContact.toLowerCase().includes(searchTerm) ||
        bill.tokenNumber.toLowerCase().includes(searchTerm) ||
        bill.tests.some((test) => test.name.toLowerCase().includes(searchTerm));

      if (!matches) return false;
    }

    // Payment status filter
    if (filters.paymentStatus && filters.paymentStatus !== "all") {
      if (bill.paymentStatus !== filters.paymentStatus) return false;
    }

    // Patient name filter
    if (filters.patientName && filters.patientName.trim()) {
      if (
        !bill.patientName
          .toLowerCase()
          .includes(filters.patientName.toLowerCase())
      ) {
        return false;
      }
    }

    // Patient MRNo filter
    if (filters.patientMRNo && filters.patientMRNo.trim()) {
      if (
        !bill.patientMRNo
          .toLowerCase()
          .includes(filters.patientMRNo.toLowerCase())
      ) {
        return false;
      }
    }

    // Patient contact filter
    if (filters.patientContact && filters.patientContact.trim()) {
      if (!bill.patientContact.includes(filters.patientContact)) {
        return false;
      }
    }

    // Test name filter
    if (filters.testName && filters.testName.trim()) {
      const hasTest = bill.tests.some((test) =>
        test.name.toLowerCase().includes(filters.testName.toLowerCase())
      );
      if (!hasTest) return false;
    }

    // Gender filter
    if (filters.gender && filters.gender.trim()) {
      if (bill.patientGender !== filters.gender) return false;
    }

    // Status filter
    if (filters.status && filters.status.trim()) {
      const hasStatus = bill.tests.some(
        (test) => test.status === filters.status
      );
      if (!hasStatus) return false;
    }

    // Amount filters
    if (filters.minAmount && !isNaN(filters.minAmount)) {
      if (bill.totalAmount < parseFloat(filters.minAmount)) return false;
    }

    if (filters.maxAmount && !isNaN(filters.maxAmount)) {
      if (bill.totalAmount > parseFloat(filters.maxAmount)) return false;
    }

    // Date filter
    if (filters.startDate) {
      const billDate = new Date(bill.date);
      if (filters.endDate) {
        if (billDate < filters.startDate || billDate > filters.endDate)
          return false;
      } else {
        const sameDay =
          billDate.getDate() === filters.startDate.getDate() &&
          billDate.getMonth() === filters.startDate.getMonth() &&
          billDate.getFullYear() === filters.startDate.getFullYear();
        if (!sameDay) return false;
      }
    }

    return true;
  });

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1);
  };

  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const openRefundForm = (bill) => {
    setCurrentBill(bill);
    setShowRefundForm(true);
    setActiveDropdown(null);
  };

  const closeRefundForm = () => {
    setShowRefundForm(false);
    setCurrentBill(null);
  };

  const getRemainingAmount = (bill) => {
    return bill?.remainingAmount || bill?.billingInfo?.remainingAmount || 0;
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setFilters((prev) => ({
      ...prev,
      startDate: start,
      endDate: end,
    }));
    setCurrentPage(1);
  };

  const handleDateSubmit = () => {
    setFilters((prev) => ({
      ...prev,
      startDate: dateRange[0],
      endDate: dateRange[1],
    }));
    setCurrentPage(1);
    setShowCalendarModal(false);
  };

  const handleFinalizePayment = async (paymentData) => {
    setPaymentProcessing(true);
    try {
      // Implement your payment finalization logic here
      console.log("Finalizing payment:", paymentData);
      // Call your API to finalize payment

      toast.success("Payment finalized successfully!");
      setShowPaymentForm(false);
      setCurrentBill(null);

      // Refresh bills data
      const queryParams = buildQueryParams();
      dispatch(getAllTestBills(queryParams));
      dispatch(fetchRadiologyBills());
    } catch (error) {
      toast.error(`Payment failed: ${error.message}`);
    } finally {
      setPaymentProcessing(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      paymentStatus: "all",
      patientName: "",
      patientMRNo: "",
      patientContact: "",
      startDate: null,
      endDate: null,
      testName: "",
      minAmount: "",
      maxAmount: "",
      gender: "",
      dateRange: "",
      status: "",
    });
    setCurrentPage(1);
    setShowFilterPopup(false);
  };

  const applyFilters = () => {
    setCurrentPage(1);
    setShowFilterPopup(false);
  };

  // Pagination logic
  const totalItems = filteredBills.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentBills = filteredBills.slice(startIndex, endIndex);

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages;
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Calculate summary stats
  const calculateSummary = () => {
    const totalAmount = filteredBills.reduce(
      (sum, bill) => sum + bill.totalAmount,
      0
    );
    const totalPaid = filteredBills.reduce(
      (sum, bill) => sum + bill.totalPaid,
      0
    );
    const totalRemaining = filteredBills.reduce(
      (sum, bill) => sum + bill.remainingAmount,
      0
    );
    const totalDiscount = filteredBills.reduce(
      (sum, bill) => sum + bill.discountAmount,
      0
    );
    const totalAdvance = filteredBills.reduce(
      (sum, bill) => sum + bill.advanceAmount,
      0
    );

    const paidBills = filteredBills.filter(
      (bill) => bill.paymentStatus === "paid"
    ).length;
    const pendingBills = filteredBills.filter(
      (bill) => bill.paymentStatus === "pending"
    ).length;
    const partialBills = filteredBills.filter(
      (bill) => bill.paymentStatus === "partial"
    ).length;

    return {
      totalAmount,
      totalPaid,
      totalRemaining,
      totalDiscount,
      totalAdvance,
      paidBills,
      pendingBills,
      partialBills,
      totalBills: filteredBills.length,
      totalTests: filteredBills.reduce((sum, bill) => sum + bill.testCount, 0),
    };
  };

  const summary = calculateSummary();

  // Handle errors
  useEffect(() => {
    if (labStatus === "failed" && labError) {
      toast.error(
        `Failed to load lab bills: ${labError.message || "Unknown error"}`
      );
    }

    if (radiologyStatus === "failed" && radiologyError) {
      toast.error(
        `Failed to load radiology bills: ${radiologyError.message || "Unknown error"
        }`
      );
    }
  }, [labStatus, labError, radiologyStatus, radiologyError]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header and Search */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">All Bills</h2>
          <p className="text-sm text-gray-500">
            Manage and track all lab and radiology bills
          </p>
        </div>
        <div className="flex items-center space-x-2 relative">
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search patients, MRNo, Token, Tests..."
              className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setShowFilterPopup(!showFilterPopup)}
              className="flex items-center px-4 py-2 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium hover:bg-primary-100 transition-colors"
            >
              <FiFilter className="mr-2" />
              More Filters
              {showFilterPopup ? (
                <FiChevronUp className="ml-2" />
              ) : (
                <FiChevronDown className="ml-2" />
              )}
            </button>
            {showFilterPopup && (
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    More Filters
                  </h3>
                  <button
                    onClick={() => setShowFilterPopup(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <FiX size={20} />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date Range
                    </label>
                    <div className="relative">
                      <DatePicker
                        selectsRange
                        startDate={filters.startDate}
                        endDate={filters.endDate}
                        onChange={handleDateChange}
                        isClearable
                        placeholderText="Select date range"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                      <FiCalendar className="absolute right-3 top-3 text-gray-400" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Status
                      </label>
                      <select
                        name="paymentStatus"
                        value={filters.paymentStatus}
                        onChange={handleFilterChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="all">All Payment Status</option>
                        <option value="paid">Paid</option>
                        <option value="pending">Unpaid</option>
                        <option value="partial">Partial</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Test Name
                      </label>
                      <div className="relative">
                        <FiFileText
                          className="absolute left-3 top-3 text-gray-400"
                          size={16}
                        />
                        <input
                          type="text"
                          name="testName"
                          value={filters.testName}
                          onChange={handleFilterChange}
                          placeholder="Test name"
                          className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={filters.gender}
                        onChange={handleFilterChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">All Genders</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Min Amount
                      </label>
                      <div className="relative">
                        <FiDollarSign
                          className="absolute left-3 top-3 text-gray-400"
                          size={16}
                        />
                        <input
                          type="number"
                          name="minAmount"
                          value={filters.minAmount}
                          onChange={handleFilterChange}
                          placeholder="Minimum amount"
                          className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Amount
                      </label>
                      <div className="relative">
                        <FiDollarSign
                          className="absolute left-3 top-3 text-gray-400"
                          size={16}
                        />
                        <input
                          type="number"
                          name="maxAmount"
                          value={filters.maxAmount}
                          onChange={handleFilterChange}
                          placeholder="Maximum amount"
                          className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between mt-6">
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium transition-colors"
                  >
                    Clear All Filters
                  </button>
                  <button
                    onClick={applyFilters}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm font-medium transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {(labStatus === "loading" || radiologyStatus === "loading") && (
        <div className="space-y-2 mb-6">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-12 bg-gray-200 rounded-md animate-pulse"
            ></div>
          ))}
        </div>
      )}

      {/* Error State */}
      {(labStatus === "failed" || radiologyStatus === "failed") && (
        <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md mb-6">
          <div className="flex items-center">
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
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="font-bold">Error Loading Bills</h3>
          </div>
          <p className="mt-2">
            {labError?.message ||
              radiologyError?.message ||
              "An unknown error occurred while fetching bills."}
          </p>
          <button
            onClick={() => {
              dispatch(getAllTestBills(buildQueryParams()));
              dispatch(fetchRadiologyBills());
            }}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-primary-50 p-4 rounded-lg border border-primary-100">
          <p className="text-sm text-primary-600 font-medium">Total Bills</p>
          <p className="text-2xl font-bold text-primary-800">
            {summary.totalBills}
          </p>
          <p className="text-xs text-primary-500 mt-1">
            {summary.totalTests} tests
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <p className="text-sm text-green-600 font-medium">Total Revenue</p>
          <p className="text-2xl font-bold text-green-800">
            PKR {summary.totalAmount.toFixed(2)}
          </p>
          <p className="text-xs text-green-500 mt-1">
            PKR {summary.totalPaid.toFixed(2)} paid
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
          <p className="text-sm text-yellow-600 font-medium">Pending Amount</p>
          <p className="text-2xl font-bold text-yellow-800">
            PKR {summary.totalRemaining.toFixed(2)}
          </p>
          <p className="text-xs text-yellow-500 mt-1">
            {summary.pendingBills} pending bills
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-600 font-medium">Payment Status</p>
          <div className="flex justify-between mt-2">
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              {summary.paidBills} Paid
            </span>
            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
              {summary.pendingBills} Pending
            </span>
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
              {summary.partialBills} Partial
            </span>
          </div>
        </div>
      </div>

      {/* Pagination Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 text-sm text-gray-600">
        <div>
          Showing {startIndex + 1} to {endIndex} of {totalItems} bills
        </div>
        <div className="flex items-center space-x-4 mt-2 md:mt-0">
          <div className="flex items-center">
            <label className="mr-2 text-sm">Rows per page:</label>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
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

      {/* Bills Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Token #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tests
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bill Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Paid/Remaining
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentBills.length > 0 ? (
              currentBills.map((bill) => (
                <tr key={bill.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {bill.tokenNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {bill.patientName}
                    </div>
                    <div className="text-sm text-gray-500">
                      MR: {bill.patientMRNo}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {bill.patientContact} • {bill.patientGender}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {bill.tests.slice(0, 2).map((test) => (
                        <div key={test.testId} className="flex items-center">
                          <span className="mr-2">•</span>
                          {test.name}
                        </div>
                      ))}
                      {bill.testCount > 2 && (
                        <div className="text-xs text-gray-500">
                          +{bill.testCount - 2} more tests
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(bill.date), "MMM dd, yyyy")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${bill.billType === "lab"
                          ? "bg-blue-100 text-blue-800 border border-blue-200"
                          : "bg-purple-100 text-purple-800 border border-purple-200"
                        }`}
                    >
                      {bill.billType === "lab" ? "Lab Bill" : "Radiology Bill"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${paymentStatusColors[bill.paymentStatus]
                        }`}
                    >
                      {paymentStatusMap[bill.paymentStatus]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                    PKR {bill.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-green-600">
                      Paid: PKR {bill.totalPaid.toFixed(2)}
                    </div>
                    <div className="text-sm text-red-600">
                      Remaining: PKR {bill.remainingAmount.toFixed(2)}
                    </div>
                    {bill.discountAmount > 0 && (
                      <div className="text-xs text-yellow-600">
                        Discount: PKR {bill.discountAmount.toFixed(2)}
                      </div>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="p-4">
                    <div className="flex justify-center">
                      <div className="relative">
                        <button
                          onClick={() => toggleDropdown(bill.id)}
                          className="p-2 text-gray-500 hover:text-teal-700 hover:bg-teal-50 rounded-full transition-colors"
                        >
                          <FaEllipsisV />
                        </button>

                        {activeDropdown === bill.id && (
                          <div className="absolute top-0 right-8 z-10 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                            <div className="py-1">
                              <Link
                                to={
                                  isAdmin
                                    ? `/admin/bills/${bill.id}`
                                    : `/lab/bills/${bill.id}`
                                }
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-900 transition-colors"
                                onClick={() => setActiveDropdown(null)}
                              >
                                View Details
                              </Link>
                              {((bill?.totalPaid ?? 0) > 0 ||
                                (bill?.fullData?.billingInfo?.totalPaid ?? 0) >
                                0) && (
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
                                      bill.billType === "radiology";
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
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No bills found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col md:flex-row items-center justify-between mt-6 px-4 py-3 bg-white border-t border-gray-200">
          <div className="text-sm text-gray-700 mb-4 md:mb-0">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded border ${currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-50"
                }`}
            >
              First
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded border flex items-center ${currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-50"
                }`}
            >
              <FiChevronLeft className="mr-1" /> Previous
            </button>

            {/* Page numbers */}
            <div className="flex space-x-1">
              {generatePageNumbers().map((pageNum, index) =>
                pageNum === "..." ? (
                  <span key={`ellipsis-${index}`} className="px-3 py-1">
                    ...
                  </span>
                ) : (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 rounded border ${currentPage === pageNum
                        ? "bg-primary-600 text-white border-primary-600"
                        : "text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    {pageNum}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded border flex items-center ${currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-50"
                }`}
            >
              Next <FiChevronRight className="ml-1" />
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded border ${currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-50"
                }`}
            >
              Last
            </button>
          </div>
        </div>
      )}

      {/* Calendar Dialog - Simplified Version (optional - remove if not needed) */}
      {showCalendarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Select Date Range</h3>
              <button
                onClick={() => setShowCalendarModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="mb-6">
              <DatePicker
                selectsRange
                startDate={dateRange[0]}
                endDate={dateRange[1]}
                onChange={(dates) => setDateRange(dates)}
                isClearable
                inline
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowCalendarModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDateSubmit}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

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

export default AllBills;
