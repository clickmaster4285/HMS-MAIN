import React, { useState, useEffect } from 'react';
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const CriticalResultsTable = ({
  criticalResults = [],
  error,
  onEdit,
  onDelete,
  onPrint,
  // Pagination props
  pagination = {},
  onPageChange,
  onItemsPerPageChange,
  currentPage = 1,
  itemsPerPage = 20,
  // Add filter callback props for server-side filtering
  onSearch,
  onDateFilter,
  currentSearch = '',
  currentStartDate = null,
  currentEndDate = null
}) => {
  const [search, setSearch] = useState(currentSearch || '');
  const [showFilters, setShowFilters] = useState(false);
  const [preset, setPreset] = useState('ALL');

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearch && search !== currentSearch) {
        onSearch(search);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [search, currentSearch, onSearch]);

  const handlePresetChange = (presetKey) => {
    setPreset(presetKey);
    setShowFilters(false);
    
    if (!onDateFilter) return;
    
    const now = new Date();
    let startDate = null;
    let endDate = null;
    
    switch (presetKey) {
      case 'TODAY':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        break;
      case 'YESTERDAY':
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        startDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
        endDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59, 999);
        break;
      case '7D':
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 6);
        startDate = new Date(weekAgo.getFullYear(), weekAgo.getMonth(), weekAgo.getDate());
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        break;
      case '30D':
        const monthAgo = new Date(now);
        monthAgo.setDate(now.getDate() - 29);
        startDate = new Date(monthAgo.getFullYear(), monthAgo.getMonth(), monthAgo.getDate());
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        break;
      case 'ALL':
      default:
        startDate = null;
        endDate = null;
    }
    
    onDateFilter(startDate, endDate);
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

  const handlePageChange = (newPage) => {
    if (onPageChange && newPage >= 1 && newPage <= (pagination?.totalPages || 1)) {
      onPageChange(newPage);
    }
  };

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    if (onItemsPerPageChange) {
      onItemsPerPageChange(newItemsPerPage);
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearch('');
    setPreset('ALL');
    if (onSearch) onSearch('');
    if (onDateFilter) onDateFilter(null, null);
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-4 w-full">
        <div className="flex-1 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search MR No, name, test..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-cyan-500 focus:ring-cyan-500"
          />
          {(search || preset !== 'ALL') && (
            <button
              onClick={handleClearFilters}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              title="Clear all filters"
            >
              ✕
            </button>
          )}
        </div>
        
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            className={`rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${
              preset !== 'ALL' ? 'border-cyan-500 bg-cyan-50 text-cyan-700' : 'border-gray-300'
            }`}
          >
            <Filter size={16} />
            {preset === 'ALL' ? 'Filters' : preset.replace('7D', '7 Days').replace('30D', '30 Days')}
          </button>
          {showFilters && (
            <div className="absolute right-0 mt-2 w-44 rounded-lg border border-gray-200 bg-white shadow-lg z-50">
              {[
                { k: 'ALL', label: 'All Time' },
                { k: 'TODAY', label: 'Today' },
                { k: 'YESTERDAY', label: 'Yesterday' },
                { k: '7D', label: 'Last 7 Days' },
                { k: '30D', label: 'Last 30 Days' },
              ].map((opt) => (
                <button
                  key={opt.k}
                  onClick={() => handlePresetChange(opt.k)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                    preset === opt.k ? 'bg-cyan-50 text-cyan-700' : ''
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
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

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {criticalResults.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">
            {search || preset !== 'ALL' 
              ? 'No critical results match your filters.' 
              : 'No critical results found. Create your first one!'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-5 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-5 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  MR No
                </th>
                <th className="px-6 py-5 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Patient Name
                </th>
                <th className="px-6 py-5 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Contact No
                </th>
                <th className="px-6 py-5 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Tests
                </th>
                <th className="px-6 py-5 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {criticalResults.map((result) => (
                <tr key={result._id} className="hover:bg-gray-50">
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500">
                    {new Date(result.date).toLocaleDateString('en-CA')}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-900">
                    {result.mrNo}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500">
                    {result.patientName}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500">
                    {result.contactNo}
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-500">
                    {result.tests && result.tests.length > 0 ? (
                      <ul className="list-disc pl-5">
                        {result.tests.slice(0, 2).map((test, idx) => (
                          <li key={idx}>
                            {test.testName}: {test.criticalValue}
                          </li>
                        ))}
                        {result.tests.length > 2 && (
                          <li>...and {result.tests.length - 2} more</li>
                        )}
                      </ul>
                    ) : (
                      'No tests'
                    )}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => onPrint(result)}
                      className="text-cyan-600 hover:text-cyan-900 mr-3"
                    >
                      Print
                    </button>
                    <button
                      onClick={() => onEdit(result)}
                      className="text-primary-600 hover:text-primary-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(result._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
              <ChevronLeft className="mr-1" size={16} /> Previous
            </button>
            
            {/* Page numbers */}
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
              Next <ChevronRight className="ml-1" size={16} />
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
    </div>
  );
};

export default CriticalResultsTable;