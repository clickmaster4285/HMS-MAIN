// src/pages/lab/PatientTestsTable.jsx
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPatientTestAll,
  deletepatientTest,
} from '../../../features/patientTest/patientTestSlice';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfDay, endOfDay } from 'date-fns';
import {
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiChevronUp,
  FiPrinter,
  FiEdit,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import PrintA4 from './PrintPatientTest';
import ReactDOMServer from 'react-dom/server';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// ------------- Normalizer -------------
const normalizeRecord = (rec) => {
  const patient = rec?.patient_Detail || rec?.patient || {};

  const getAge = (ageStr) => {
    if (!ageStr) return '';
    return ageStr;
  };

  const rawTests =
    Array.isArray(rec?.tests) && rec.tests.length
      ? rec.tests
      : Array.isArray(rec?.selectedTests)
      ? rec.selectedTests
      : [];

  const normalizedTests = rawTests.map((st) => {
    if (st?.testName || st?.price !== undefined) {
      const price = Number(st?.price ?? 0);
      const discount = Math.max(0, Number(st?.discount ?? 0));
      const paid = Math.max(0, Number(st?.paid ?? 0));
      const finalAmount = Math.max(0, price - discount);
      const remaining = Math.max(0, finalAmount - paid);
      return {
        ...st,
        _norm: {
          testName: st?.testName || 'Unknown Test',
          testCode: st?.testCode || '',
          price,
          discount,
          paid,
          finalAmount,
          remaining,
        },
        testDate: st?.testDate || st?.sampleDate || null,
      };
    }

    const d = st?.testDetails || st?.test || {};
    const testName = d?.testName || st?.testName || 'Unknown Test';
    const testCode = d?.testCode || st?.testCode || '';
    const price = Number(st?.testPrice ?? d?.testPrice ?? 0);
    const discount = Math.max(0, Number(st?.discountAmount || 0));
    const paid = Math.max(0, Number(st?.advanceAmount || 0));
    const finalAmount = Math.max(0, price - discount);
    const remaining = Math.max(0, finalAmount - paid);

    return {
      ...st,
      _norm: {
        testName,
        testCode,
        price,
        discount,
        paid,
        finalAmount,
        remaining,
      },
      testDate: st?.testDate || st?.sampleDate || null,
    };
  });

  const fin = rec?.financialSummary || {};
  const computedFinal = normalizedTests.reduce(
    (s, t) => s + t._norm.finalAmount,
    0
  );

  const totalAmount =
    Number(fin.totalAmount ?? rec?.totalAmount ?? 0) ||
    normalizedTests.reduce((s, t) => s + t._norm.price, 0);

  const totalPaid =
    Number(fin.totalPaid ?? rec?.totalPaid ?? rec?.advanceAmount ?? 0) ||
    normalizedTests.reduce((s, t) => s + t._norm.paid, 0);

  const totalDiscount =
    Number(fin.totalDiscount ?? rec?.discountAmount ?? 0) ||
    normalizedTests.reduce((s, t) => s + t._norm.discount, 0);

  const remainingAmount = Number(
    fin.totalRemaining ??
      rec?.remainingAmount ??
      Math.max(0, computedFinal - totalPaid)
  );

  const paymentStatus =
    fin.paymentStatus ||
    rec?.paymentStatus ||
    (remainingAmount === 0 ? 'paid' : totalPaid > 0 ? 'partial' : 'pending');

  return {
    ...rec,
    _norm: {
      patient: {
        MRNo: patient?.patient_MRNo || patient?.MRNo || patient?.mrNo || '',
        Name: patient?.patient_Name || patient?.Name || patient?.name || '',
        CNIC: patient?.patient_CNIC || patient?.CNIC || patient?.cnic || '',
        ContactNo:
          patient?.patient_ContactNo ||
          patient?.ContactNo ||
          patient?.contactNo ||
          '',
        Contact:
          patient?.patient_ContactNo ||
          patient?.ContactNo ||
          patient?.contactNo ||
          '',
        Gender:
          patient?.patient_Gender || patient?.Gender || patient?.gender || '',
        Age: getAge(patient?.patient_Age || patient?.Age || patient?.age || ''),
        Guardian:
          patient?.patient_Guardian ||
          patient?.Guardian ||
          patient?.guardian ||
          '',
        ReferredBy:
          patient?.referredBy || patient?.ReferredBy || rec?.referredBy || '',
      },
      selectedTests: normalizedTests,
      totalAmount,
      totalDiscount,
      totalPaid,
      remainingAmount,
      paymentStatus,
      tokenNumber: rec?.tokenNumber ?? '',
      createdAt: rec?.createdAt ?? null,
      updatedAt:
        rec?.updatedAt ??
        rec?.financialSummary?.updatedAt ??
        rec?.modifiedAt ??
        null,
      referredBy:
        rec?.referredBy ?? patient?.referredBy ?? patient?.ReferredBy ?? '',
    },
  };
};

// ------------- Component -------------
const PatientTestsTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();



  const { allPatientTests, status, error, pagination } = useSelector(
    (state) => state.patientTest
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    dateRange: '',
    customStartDate: null,
    customEndDate: null,
    gender: '',
    contact: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [localSearchTerm, setLocalSearchTerm] = useState('');

  const [isOpen, setIsOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);

  const openModal = (normalizedTest) => {
    setSelectedTest(normalizedTest);
    setIsOpen(true);
  };
  
  const closeModal = () => {
    setIsOpen(false);
    setSelectedTest(null);
  };

  // Handle custom date change
  const handleCustomDateChange = (name, date) => {
    setFilters(prev => ({
      ...prev,
      [name]: date,
    }));
    setCurrentPage(1);
  };

  // Build query parameters for backend - UPDATED
  const buildQueryParams = useCallback(() => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
    };

    // Add search term if exists
    if (localSearchTerm.trim()) {
      params.search = localSearchTerm.trim();
    }

    // Add individual filter parameters
    if (filters.status) {
      params.status = filters.status;
    }
    if (filters.gender) {
      params.gender = filters.gender;
    }
    if (filters.contact) {
      params.contact = filters.contact;
    }

    // Handle date range filters
    const now = new Date();
    
    if (filters.dateRange === 'today') {
      const today = new Date();
      params.startDate = format(today, 'yyyy-MM-dd');
      params.endDate = format(today, 'yyyy-MM-dd');
    } else if (filters.dateRange === 'week') {
      const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday start
      const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
      params.startDate = format(weekStart, 'yyyy-MM-dd');
      params.endDate = format(weekEnd, 'yyyy-MM-dd');
    } else if (filters.dateRange === 'month') {
      const monthStart = startOfMonth(now);
      const monthEnd = endOfMonth(now);
      params.startDate = format(monthStart, 'yyyy-MM-dd');
      params.endDate = format(monthEnd, 'yyyy-MM-dd');
    } else if (filters.dateRange === 'custom' && filters.customStartDate && filters.customEndDate) {
      // Use custom dates
      params.startDate = format(filters.customStartDate, 'yyyy-MM-dd');
      params.endDate = format(filters.customEndDate, 'yyyy-MM-dd');
    } else if (filters.dateRange) {
      // For other predefined ranges
      params.dateRange = filters.dateRange;
    }

    return params;
  }, [currentPage, itemsPerPage, localSearchTerm, filters]);

  // Fetch data with pagination and filters
  useEffect(() => {
    const queryParams = buildQueryParams();
    dispatch(fetchPatientTestAll(queryParams));
  }, [dispatch, buildQueryParams]);

  // Build a normalized list once per store update
  const safeTests = useMemo(
    () => (allPatientTests || []).map(normalizeRecord),
    [allPatientTests]
  );

  // Local, sorted copy for optimistic UX
  const sortByRecent = useCallback((list) => {
    return [...list].sort((a, b) => {
      const aDate = new Date(a._norm.createdAt || 0).getTime();
      const bDate = new Date(b._norm.createdAt || 0).getTime();
      return bDate - aDate;
    });
  }, []);

  const [rows, setRows] = useState([]);

  // Seed rows whenever store data changes
  useEffect(() => {
    setRows(sortByRecent(safeTests));
  }, [safeTests, sortByRecent]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setLocalSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleEdit = (id) => {
    navigate(`/lab/patient-tests/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        'Are you sure you want to delete this patient test record?'
      )
    ) {
      const prevRows = rows;
      setRows((r) => r.filter((x) => x._id !== id));
      try {
        await dispatch(deletepatientTest(id)).unwrap();
        const queryParams = buildQueryParams();
        dispatch(fetchPatientTestAll(queryParams));
        toast.success('Record deleted successfully');
      } catch (e) {
        setRows(prevRows);
        console.error('Delete failed:', e);
        toast.error(`Delete failed: ${e?.message || 'Unknown error'}`);
      }
    }
  };

  const handlePrint = (t) => {
    const printData = {
      tokenNumber: t.tokenNumber,
      patient: {
        MRNo: t.patient.MRNo,
        Name: t.patient.Name,
        CNIC: t.patient.CNIC,
        ContactNo: t.patient.ContactNo,
        Gender: t.patient.Gender,
        Age: t.patient.Age,
        ReferredBy: t.referredBy || t.patient.ReferredBy || '',
        Guardian: t.patient.Guardian,
        MaritalStatus: t.patient.MaritalStatus,
      },
      tests: t.selectedTests.map((x) => ({
        testName: x._norm.testName,
        price: x._norm.price,
        discount: x._norm.discount,
        paid: x._norm.paid,
        finalAmount: x._norm.finalAmount,
      })),
      totalAmount: t.totalAmount,
      totalDiscount: t.totalDiscount,
      totalPaid: t.totalPaid,
      remaining: t.remainingAmount,
      sampleDate: t.createdAt
        ? format(new Date(t.createdAt), 'yyyy-MM-dd')
        : '',
      reportDate: t.selectedTests[0]?.testDate
        ? format(new Date(t.selectedTests[0].testDate), 'yyyy-MM-dd')
        : '',
    };

    const w = window.open('', '_blank');
    if (!w) {
      const warn = document.createElement('div');
      warn.style = `
      position: fixed; top: 20px; right: 20px; padding: 15px; background: #ffeb3b;
      border: 1px solid #ffc107; border-radius: 4px; z-index: 9999;
    `;
      warn.innerHTML = `
      <p>Popup blocked! Please allow popups for this site.</p>
      <button onclick="this.parentNode.remove()">Dismiss</button>
    `;
      document.body.appendChild(warn);
      return;
    }
 
    const html = ReactDOMServer.renderToStaticMarkup(
      <PrintA4 formData={printData} />
    );

    w.document.open();
    w.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print Patient Test</title>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu&display=swap" rel="stylesheet">
        <style>
          body { font-family: Arial, sans-serif; padding: 10mm; color: #333; font-size: 14px; }
          .header { display: flex; align-items: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 10px; }
          .logo { height: 60px; margin-right: 20px; }
        </style>
      </head>
      <body>${html}</body>
      <script>
        setTimeout(() => {
          window.print();
          window.onafterprint = function() { window.close(); };
        }, 500);
      </script>
    </html>
  `);
    w.document.close();
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (pagination?.totalPages || 1)) {
      setCurrentPage(newPage);
    }
  };

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'dateRange' && value !== 'custom') {
      // Reset custom dates when switching to non-custom range
      setFilters(prev => ({
        ...prev,
        [name]: value,
        customStartDate: null,
        customEndDate: null,
      }));
    } else {
      setFilters(prev => ({ ...prev, [name]: value }));
    }
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({ 
      status: '', 
      dateRange: '', 
      customStartDate: null, 
      customEndDate: null, 
      gender: '', 
      contact: '' 
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  const generatePageNumbers = () => {
    const totalPages = pagination?.totalPages || 1;
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

  if (status.fetchAll === 'loading') {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500" />
      </div>
    );
  }

  if (status.fetchAll === 'failed') {
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
            Patient Test Records
          </h1>
        </div>

        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
            <div className="relative grow mb-4 md:mb-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by MR No, Name, Token # or Contact No"
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
              {showFilters ? (
                <FiChevronUp className="ml-2" />
              ) : (
                <FiChevronDown className="ml-2" />
              )}
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="partial">Partial</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={filters.gender}
                    onChange={handleFilterChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">All Genders</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

    <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Date Range
  </label>
  
  <div className="space-y-3">
    <div className="flex gap-3">
      <select
        name="dateRange"
        value={filters.dateRange}
        onChange={handleFilterChange}
        className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
      >
        <option value="">All Dates</option>
        <option value="today">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
        <option value="custom">Custom...</option>
      </select>
    </div>

    {/* Custom Date Range - Side by Side */}
    {filters.dateRange === 'custom' && (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="relative">
              <DatePicker
                selected={filters.customStartDate}
                onChange={(date) => handleCustomDateChange('customStartDate', date)}
                selectsStart
                startDate={filters.customStartDate}
                endDate={filters.customEndDate}
                maxDate={new Date()}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholderText="From"
                dateFormat="dd/MM/yy"
                isClearable
              />
              <FiCalendar className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>
          
          <div>
            <div className="relative">
              <DatePicker
                selected={filters.customEndDate}
                onChange={(date) => handleCustomDateChange('customEndDate', date)}
                selectsEnd
                startDate={filters.customStartDate}
                endDate={filters.customEndDate}
                minDate={filters.customStartDate}
                maxDate={new Date()}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholderText="To"
                dateFormat="dd/MM/yy"
                isClearable
              />
              <FiCalendar className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>
        </div>

        {filters.customStartDate && filters.customEndDate && (
          <div className="px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-blue-700">
                {format(filters.customStartDate, 'dd MMM')} - {format(filters.customEndDate, 'dd MMM yyyy')}
              </span>
              <button
                type="button"
                onClick={() => {
                  setFilters(prev => ({
                    ...prev,
                    customStartDate: null,
                    customEndDate: null
                  }));
                }}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                × Clear
              </button>
            </div>
          </div>
        )}
      </div>
    )}
  </div>
</div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact No
                  </label>
                  <input
                    type="text"
                    name="contact"
                    value={filters.contact}
                    onChange={handleFilterChange}
                    placeholder="e.g. 0300-1234567"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="flex items-end space-x-2">
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  >
                    Reset Filters
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 text-sm text-gray-600">
          <div>
            Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, pagination?.totalItems || 0)} of{' '}
            {pagination?.totalItems || 0} records
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

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-20 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Token
                </th>
                <th className="w-28 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  MR No
                </th>
                <th className="w-40 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="truncate">Patient Name</div>
                </th>
                <th className="w-36 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact No
                </th>
                <th className="w-20 px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age
                </th>
                <th className="w-64 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tests
                </th>
                <th className="w-36 px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="w-40 px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Remaining Amount
                </th>
                <th className="w-32 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="w-28 px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="w-32 px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {rows.length > 0 ? (
                rows.map((test) => {
                  const t = test._norm;
                  return (
                    <tr
                      key={test._id || `${t.tokenNumber}-${t.createdAt}`}
                      className="hover:bg-gray-50"
                    >
                      <td className="w-20 px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                        {t.tokenNumber}
                      </td>
                      <td className="w-28 px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="truncate">{t.patient.MRNo}</div>
                      </td>
                      <td className="w-40 px-3 py-4 text-sm text-gray-500">
                        <div className="font-medium truncate">{t.patient.Name}</div>
                      </td>
                      <td className="w-36 px-3 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        <div className="truncate">{t.patient.Contact || t.patient.ContactNo}</div>
                      </td>
                      <td className="w-20 px-3 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        {t.patient.Age}
                      </td>
                      <td className="w-64 px-3 py-4 text-sm text-gray-500">
                        <div className="space-y-1">
                          {t.selectedTests.slice(0, 2).map((x, i) => (
                            <div key={i} className="truncate">
                              <span className="font-medium">
                                {x._norm.testName}
                              </span>
                              {x._norm.testCode && (
                                <span className="text-gray-400 ml-1">
                                  ({x._norm.testCode})
                                </span>
                              )}
                            </div>
                          ))}
                          {t.selectedTests.length > 2 && (
                            <button
                              onClick={() => openModal(t)}
                              className="text-primary-500 hover:underline text-sm mt-1"
                            >
                              See More (+{t.selectedTests.length - 2})
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="w-36 px-3 py-4 text-sm text-right">
                        <div className="font-medium">
                          Rs. {t.totalAmount.toLocaleString()}
                        </div>
                        {t.totalDiscount > 0 && (
                          <div className="text-xs text-gray-400 truncate">
                            Discount: Rs. {t.totalDiscount.toLocaleString()}
                          </div>
                        )}
                      </td>
                      <td className="w-40 px-3 py-4 text-sm text-right">
                        <div className="font-medium">
                          Rs. {t.remainingAmount.toLocaleString()}
                        </div>
                        {t.totalPaid > 0 && (
                          <div className="text-xs text-gray-400 truncate">
                            Paid: Rs. {t.totalPaid.toLocaleString()}
                          </div>
                        )}
                      </td>
                      <td className="w-32 px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {t.createdAt
                          ? format(new Date(t.createdAt), 'dd-MMM-yyyy')
                          : ''}
                      </td>
                      <td className="w-28 px-3 py-4 whitespace-nowrap text-center">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full 
                          ${
                            t.paymentStatus === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : t.paymentStatus === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : t.paymentStatus === 'partial'
                              ? 'bg-primary-100 text-primary-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {t.paymentStatus}
                        </span>
                      </td>
                      <td className="w-32 px-3 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => handlePrint(t)}
                            className="text-green-600 hover:text-green-800"
                            title="Print"
                          >
                            <FiPrinter className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(test._id)}
                            className="text-primary-600 hover:text-primary-800"
                            title="Edit"
                          >
                            <FiEdit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(test._id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="11"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No records found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {(pagination?.totalPages || 0) > 1 && (
          <div className="flex flex-col md:flex-row items-center justify-between mt-6 px-4 py-3 bg-white border-t border-gray-200">
            <div className="text-sm text-gray-700 mb-4 md:mb-0">
              Page {currentPage} of {pagination?.totalPages || 1}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded border ${
                  currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                First
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded border flex items-center ${
                  currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FiChevronLeft className="mr-1" /> Previous
              </button>
              
              <div className="flex space-x-1">
                {generatePageNumbers().map((pageNum, index) => (
                  pageNum === '...' ? (
                    <span key={`ellipsis-${index}`} className="px-3 py-1">...</span>
                  ) : (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 rounded border ${
                        currentPage === pageNum
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === (pagination?.totalPages || 1)}
                className={`px-3 py-1 rounded border flex items-center ${
                  currentPage === (pagination?.totalPages || 1)
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Next <FiChevronRight className="ml-1" />
              </button>
              <button
                onClick={() => handlePageChange(pagination?.totalPages || 1)}
                disabled={currentPage === (pagination?.totalPages || 1)}
                className={`px-3 py-1 rounded border ${
                  currentPage === (pagination?.totalPages || 1)
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Last
              </button>
            </div>
          </div>
        )}

        {isOpen && selectedTest && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full h-[80vh] overflow-y-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                All Tests
              </h3>
              <div className="mt-2 space-y-3">
                {selectedTest.selectedTests.map((x, i) => (
                  <div key={i} className="border-b pb-2 last:border-0">
                    <div className="font-medium text-gray-900">{x._norm.testName}</div>
                    {x._norm.testCode && (
                      <div className="text-sm text-gray-500">Code: {x._norm.testCode}</div>
                    )}
                    <div className="text-sm text-gray-600">
                      Price: Rs. {x._norm.price.toLocaleString()} | 
                      Discount: Rs. {x._norm.discount.toLocaleString()} | 
                      Paid: Rs. {x._norm.paid.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Total Tests: {selectedTest.selectedTests.length}
                </div>
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientTestsTable;