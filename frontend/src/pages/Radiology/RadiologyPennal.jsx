// src/pages/radiology/RadiologyPanel.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchAllRadiologyReports,
  fetchAvailableTemplates,
  setPage,
  setLimit,
  clearFilters, // we still use clearFilters for reset
} from "../../features/Radiology/RadiologySlice";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Collapse,
} from "@mui/material";
import {
  FiEye,
  FiFilter,
  FiX,
  FiSearch,
  FiPlus,
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
  FiPrinter,
  FiEdit,
  FiTrash2,
  FiChevronDown,
} from "react-icons/fi";
import { FlaskConical, Pencil } from "lucide-react";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";

const RadiologyPanel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { reports, templates, isLoading, isError, error, pagination } =
    useSelector((state) => state.radiology);

  const { user } = useSelector((state) => state.auth);
  const isRadiology = user?.user_Access === "Radiology";
  const isAdmin = user?.user_Access === "Admin";
  const basePath = isRadiology ? "/radiology" : isAdmin ? "/admin" : "/lab";

  // Local state
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // All filters are now fully local – we don't need redux filters anymore for fetching
  const [localFilters, setLocalFilters] = useState({
    status: "",
    dateRange: "",
    customStartDate: null,
    customEndDate: null,
    gender: "",
    doctor: "",
    testName: "",
    minAmount: "",
    maxAmount: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Debounced search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [debouncedDoctor, setDebouncedDoctor] = useState("");
  const [debouncedTestName, setDebouncedTestName] = useState("");


  // Summary date picker state (unchanged)
  const [showSummaryDatePicker, setShowSummaryDatePicker] = useState(false);
  const [summaryDates, setSummaryDates] = useState({
    startDate: new Date(),
    endDate: null,
  });

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
      setCurrentPage(1); // reset page when searching
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Build query params – now uses localFilters directly
  const buildQueryParams = useCallback(() => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
    };

    if (debouncedSearchTerm) {
      params.search = debouncedSearchTerm;
    }

    if (localFilters.status) {
      params.paymentStatus = localFilters.status;
    }
    if (localFilters.gender) {
      params.gender = localFilters.gender;
    }

    // USE DEBOUNCED VALUES HERE
    if (debouncedDoctor) {
      params.doctor = debouncedDoctor;
    }
    if (debouncedTestName) {
      params.testName = debouncedTestName;
    }

    if (localFilters.minAmount) {
      params.minAmount = localFilters.minAmount;
    }
    if (localFilters.maxAmount) {
      params.maxAmount = localFilters.maxAmount;
    }

    // Date range handling (unchanged)
    const now = new Date();
    if (localFilters.dateRange === "today") {
      const today = format(now, "yyyy-MM-dd");
      params.startDate = today;
      params.endDate = today;
    } else if (localFilters.dateRange === "week") {
      const weekStart = startOfWeek(now, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
      params.startDate = format(weekStart, "yyyy-MM-dd");
      params.endDate = format(weekEnd, "yyyy-MM-dd");
    } else if (localFilters.dateRange === "month") {
      const monthStart = startOfMonth(now);
      const monthEnd = endOfMonth(now);
      params.startDate = format(monthStart, "yyyy-MM-dd");
      params.endDate = format(monthEnd, "yyyy-MM-dd");
    } else if (
      localFilters.dateRange === "custom" &&
      localFilters.customStartDate &&
      localFilters.customEndDate
    ) {
      params.startDate = format(localFilters.customStartDate, "yyyy-MM-dd");
      params.endDate = format(localFilters.customEndDate, "yyyy-MM-dd");
    }

    return params;
  }, [
    currentPage,
    itemsPerPage,
    debouncedSearchTerm,
    localFilters.status,
    localFilters.gender,
    debouncedDoctor,
    debouncedTestName,
    localFilters.minAmount,
    localFilters.maxAmount,
    localFilters.dateRange,
    localFilters.customStartDate,
    localFilters.customEndDate,
  ]);


  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ADD THESE TWO EFFECTS:
  // Debounce doctor filter
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedDoctor(localFilters.doctor.trim());
      setCurrentPage(1);
    }, 600);
    return () => clearTimeout(timer);
  }, [localFilters.doctor]);

  // Debounce testName filter
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTestName(localFilters.testName.trim());
      setCurrentPage(1);
    }, 600);
    return () => clearTimeout(timer);
  }, [localFilters.testName]);




  // Fetch whenever any filter, search, page or limit changes
  useEffect(() => {
    const queryParams = buildQueryParams();
    dispatch(fetchAllRadiologyReports(queryParams));
    dispatch(fetchAvailableTemplates());
  }, [dispatch, buildQueryParams]);

  // Handlers
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({
      ...prev,
      [name]: value,
      // when switching away from custom, clear custom dates
      ...(name === "dateRange" && value !== "custom"
        ? { customStartDate: null, customEndDate: null }
        : {}),
    }));
    setCurrentPage(1); // important: reset to page 1 on filter change
  };

  const handleCustomDateChange = (name, date) => {
    setLocalFilters((prev) => ({ ...prev, [name]: date }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setLocalFilters({
      status: "",
      dateRange: "",
      customStartDate: null,
      customEndDate: null,
      gender: "",
      doctor: "",
      testName: "",
      minAmount: "",
      maxAmount: "",
    });
    setSearchTerm("");
    setDebouncedSearchTerm("");
    dispatch(clearFilters()); // if you still want redux to know filters are cleared
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (pagination?.totalPages || 1)) {
      dispatch(setPage(newPage));
      setCurrentPage(newPage);
    }
  };

  const handleItemsPerPageChange = (e) => {
    const newLimit = parseInt(e.target.value);
    dispatch(setLimit(newLimit));
    setItemsPerPage(newLimit);
    setCurrentPage(1);
  };

  // Rest of your helper functions remain exactly the same
  const capFirst = (str) => {
    const s = String(str || "")
      .replace(/\.html$/i, "")
      .replace(/-/g, " ")
      .trim();
    return s ? s[0].toUpperCase() + s.slice(1) : "";
  };

  const formatDateCell = (dateString) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTemplateName = (name) =>
    Array.isArray(name)
      ? name
        .map((n) => String(n).replace(".html", "").replace(/-/g, " "))
        .join(", ")
      : typeof name === "string"
        ? name.replace(".html", "").replace(/-/g, " ")
        : "N/A";

  const generatePageNumbers = () => {
    const totalPages = pagination?.totalPages || 1;
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
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

  const pageNumbers = generatePageNumbers();

  // Loading / Error UI unchanged
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
        role="alert"
      >
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="bg-white rounded-lg shadow-md p-4">
        {/* Header – unchanged */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
            Radiology Reports
          </h1>
          {/* Summary & New Report buttons – unchanged */}
          <div className="flex flex-col md:flex-row gap-2">
            {/* Summary Button */}
            <motion.div className="relative">
              <Button
                variant="contained"
                onClick={() => setShowSummaryDatePicker(!showSummaryDatePicker)}
                sx={{
                  borderRadius: "8px",
                  backgroundColor: "gray",
                  color: "white",
                  textTransform: "none",
                  px: 3,
                  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                  "&:hover": {
                    backgroundColor: "#004B44",
                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                  },
                }}
              >
                Summary
              </Button>

              {/* Summary date picker popover */}
              {showSummaryDatePicker && (
                <Box
                  sx={{
                    position: "absolute",
                    zIndex: 1300,
                    right: 0,
                    mt: 1,
                    backgroundColor: "white",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
                    p: 2,
                    minWidth: "300px",
                  }}
                >
                  <div className="space-y-3">
                    <DatePicker
                      selected={summaryDates.startDate}
                      onChange={(date) =>
                        setSummaryDates((prev) => ({
                          ...prev,
                          startDate: date,
                        }))
                      }
                      selectsStart
                      startDate={summaryDates.startDate}
                      endDate={summaryDates.endDate}
                      maxDate={new Date()}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholderText="From"
                      dateFormat="dd/MM/yy"
                      isClearable
                    />

                    <DatePicker
                      selected={summaryDates.endDate}
                      onChange={(date) =>
                        setSummaryDates((prev) => ({ ...prev, endDate: date }))
                      }
                      selectsEnd
                      startDate={summaryDates.startDate}
                      endDate={summaryDates.endDate}
                      minDate={summaryDates.startDate}
                      maxDate={new Date()}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholderText="To"
                      dateFormat="dd/MM/yy"
                      isClearable
                    />
                  </div>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 1,
                      mt: 2,
                    }}
                  >
                    <Button
                      onClick={() => setShowSummaryDatePicker(false)}
                      variant="outlined"
                      size="small"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        const { startDate, endDate } = summaryDates;
                        const fmt = (d) => format(d, "yyyy-MM-dd");
                        if (startDate && endDate) {
                          navigate(
                            `${basePath}/radiology-summer/${fmt(
                              startDate
                            )}_${fmt(endDate)}`
                          );
                        } else if (startDate) {
                          navigate(
                            `${basePath}/radiology-summer/${fmt(startDate)}`
                          );
                        } else {
                          alert("Please select at least one date.");
                        }
                        setShowSummaryDatePicker(false);
                      }}
                      variant="contained"
                      size="small"
                      sx={{ backgroundColor: "#009689" }}
                    >
                      Download
                    </Button>
                  </Box>
                </Box>
              )}
            </motion.div>

            {/* New Report Button */}
            {!isRadiology && (
              <Button
                variant="contained"
                onClick={() => navigate(`${basePath}/RadiologyForm`)}
                startIcon={<FiPlus />}
                sx={{
                  borderRadius: "8px",
                  backgroundColor: "#009689",
                  color: "white",
                  textTransform: "none",
                  px: 3,
                  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                  "&:hover": {
                    backgroundColor: "#004B44",
                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                  },
                }}
              >
                New Report
              </Button>
            )}
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
            <div className="relative grow mb-4 md:mb-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by MR No, Patient Name, or Referred By"
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              <FiFilter className="mr-2" />
              Filters
              {showFilters ? <FiX className="ml-2" /> : <FiChevronDown className="ml-2" />}
            </button>
          </div>

          {/* Filters Panel – now updates instantly */}
          <div
            className={`mt-4 p-4 bg-gray-50 rounded-md border border-gray-200 transition-all duration-300 ease-in-out overflow-hidden ${showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 p-0 border-transparent'
              }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* ←←← ALL YOUR FILTER INPUTS GO HERE UNCHANGED ←←← */}

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Status
                </label>
                <select
                  name="status"
                  value={localFilters.status}
                  onChange={handleFilterChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="partial">Partial</option>
                  <option value="paid">Paid</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={localFilters.gender}
                  onChange={handleFilterChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">All Genders</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <div className="space-y-3">
                  <select
                    name="dateRange"
                    value={localFilters.dateRange}
                    onChange={handleFilterChange}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5"
                  >
                    <option value="">All Dates</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="custom">Custom...</option>
                  </select>

                  {localFilters.dateRange === "custom" && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                          <DatePicker
                            selected={localFilters.customStartDate}
                            onChange={(date) => handleCustomDateChange("customStartDate", date)}
                            selectsStart
                            startDate={localFilters.customStartDate}
                            endDate={localFilters.customEndDate}
                            maxDate={new Date()}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholderText="From"
                            dateFormat="dd/MM/yy"
                            isClearable
                          />
                          <FiCalendar className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                        </div>
                        <div className="relative">
                          <DatePicker
                            selected={localFilters.customEndDate}
                            onChange={(date) => handleCustomDateChange("customEndDate", date)}
                            selectsEnd
                            startDate={localFilters.customStartDate}
                            endDate={localFilters.customEndDate}
                            minDate={localFilters.customStartDate}
                            maxDate={new Date()}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholderText="To"
                            dateFormat="dd/MM/yy"
                            isClearable
                          />
                          <FiCalendar className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Referred By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Referred By
                </label>
                <input
                  type="text"
                  name="doctor"
                  value={localFilters.doctor}
                  onChange={handleFilterChange}
                  placeholder="Doctor name..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Test Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Test Name
                </label>
                <input
                  type="text"
                  name="testName"
                  value={localFilters.testName}
                  onChange={handleFilterChange}
                  placeholder="Test name..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Min Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Amount
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  name="minAmount"
                  value={localFilters.minAmount}
                  onChange={handleFilterChange}
                  placeholder="0"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Max Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Amount
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  name="maxAmount"
                  value={localFilters.maxAmount}
                  onChange={handleFilterChange}
                  placeholder="100000"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Reset Button */}
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 w-full"
                >
                  Reset All
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Pagination Info */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 text-sm text-gray-600">
          <div>
            Showing{" "}
            {((pagination?.page || 1) - 1) * (pagination?.limit || 20) + 1} to{" "}
            {Math.min(
              (pagination?.page || 1) * (pagination?.limit || 20),
              pagination?.total || 0
            )}{" "}
            of {pagination?.total || 0} reports
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

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  MRN
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Procedure
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Referred By
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.length > 0 ? (
                reports.map((report) => (
                  <tr key={report._id} className="hover:bg-gray-50">
                    {/* Patient Info */}
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <Avatar
                            sx={{ backgroundColor: "#009689", color: "white" }}
                          >
                            {(report.patientName || "")
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </Avatar>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {report.patientName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {report.patient_ContactNo || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* MRN */}
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Chip
                        label={report.patientMRNO}
                        size="small"
                        sx={{
                          backgroundColor: "#009689",
                          color: "white",
                          fontWeight: 500,
                        }}
                      />
                    </td>

                    {/* Details */}
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{report.sex || "N/A"}</div>
                      <div className="text-gray-400">
                        Age:{" "}
                        {report.age
                          ? new Date(report.age).getFullYear()
                          : "N/A"}
                      </div>
                    </td>

                    {/* Procedure */}
                    <td className="px-3 py-4 text-sm text-gray-500">
                      {report.studies?.length > 0 ? (
                        <div className="space-y-1">
                          {report.studies.slice(0, 2).map((s, idx) => (
                            <div
                              key={s._id || idx}
                              className="flex items-center gap-2"
                            >
                              <FlaskConical
                                size={14}
                                className="text-primary-600"
                              />
                              <span className="truncate">
                                {capFirst(formatTemplateName(s.templateName))}
                              </span>
                            </div>
                          ))}
                          {report.studies.length > 2 && (
                            <div className="text-xs text-gray-400 mt-1">
                              +{report.studies.length - 2} more
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>

                    {/* Referred By */}
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.referBy || "N/A"}
                    </td>

                    {/* Date */}
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateCell(report.date)}
                    </td>

                    {/* Status */}
                    <td className="px-3 py-4 whitespace-nowrap text-sm">
                      <Chip
                        label={
                          report.aggPaymentStatus ||
                          report.paymentStatus ||
                          "pending"
                        }
                        size="small"
                        sx={{
                          backgroundColor:
                            (report.aggPaymentStatus ||
                              report.paymentStatus) === "paid"
                              ? "#10b981"
                              : (report.aggPaymentStatus ||
                                report.paymentStatus) === "partial"
                                ? "#f59e0b"
                                : (report.aggPaymentStatus ||
                                  report.paymentStatus) === "refunded"
                                  ? "#ef4444"
                                  : "#6b7280",
                          color: "white",
                        }}
                      />
                    </td>

                    {/* Total Amount */}
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      PKR{" "}
                      {(
                        report.aggTotalAmount ||
                        report.totalAmount ||
                        0
                      ).toFixed(2)}
                    </td>

                    {/* Actions */}
                    <td className="px-3 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (isRadiology)
                              navigate(
                                `/radiology/RediologyPatientDetail/${report._id}`
                              );
                            else if (isAdmin)
                              navigate(
                                `/admin/RediologyPatientDetail/${report._id}`
                              );
                            else
                              navigate(
                                `/lab/RediologyPatientDetail/${report._id}`
                              );
                          }}
                          className="text-primary-600 hover:text-primary-800"
                          title="View"
                        >
                          <FiEye className="h-4 w-4" />
                        </button>

                        {!isRadiology && (
                          <>
                            <button
                              onClick={() =>
                                navigate(
                                  `${basePath}/RadiologyForm?mode=edit&id=${report._id}`
                                )
                              }
                              className="text-green-600 hover:text-green-800"
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-800"
                              title="Print"
                            >
                              <FiPrinter className="h-4 w-4" />
                            </button>
                          </>
                        )}
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
                    No reports found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {(pagination?.totalPages || 0) > 1 && (
          <div className="flex flex-col md:flex-row items-center justify-between mt-6 px-4 py-3 bg-white border-t border-gray-200">
            <div className="text-sm text-gray-700 mb-4 md:mb-0">
              Page {currentPage} of {pagination?.totalPages || 1}
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

              <div className="flex space-x-1">
                {pageNumbers.map((pageNum, index) =>
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
                disabled={currentPage === (pagination?.totalPages || 1)}
                className={`px-3 py-1 rounded border flex items-center ${currentPage === (pagination?.totalPages || 1)
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                Next <FiChevronRight className="ml-1" />
              </button>
              <button
                onClick={() => handlePageChange(pagination?.totalPages || 1)}
                disabled={currentPage === (pagination?.totalPages || 1)}
                className={`px-3 py-1 rounded border ${currentPage === (pagination?.totalPages || 1)
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                Last
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RadiologyPanel;
