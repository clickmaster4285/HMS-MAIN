import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTests, deleteTest, selectAllTests, selectGetAllLoading, selectGetAllError, selectDeleteLoading, selectDeleteError, selectDeleteSuccess } from '../../../features/testManagment/testSlice';
import { setPage, setLimit } from '../../../features/testManagment/testSlice';
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AllAddedTests = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');


  const {
    tests,
    getAllLoading,
    getAllError,
    deleteLoading,
    deleteError,
    deleteSuccess,
    pagination = { page: 1, limit: 10, total: 0, totalPages: 1 }
  } = useSelector((state) => state.labtest); 



  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllTests({ page: pagination.page, limit: pagination.limit }));
  }, [dispatch, pagination.page, pagination.limit]);

  // Reset search handler
  const handleResetSearch = () => {
    setSearchTerm('');
  };

  // Only filter by name and code
  const filteredTests = tests.filter((test) => {
    if (!searchTerm) return true;
    const search = searchTerm.trim().toLowerCase();
    return (
      test.testName?.toLowerCase().includes(search) ||
      test.testCode?.toLowerCase().includes(search)
    );
  });

  // Add a delete handler stub
  const handleDelete = async (testId) => {
    if (!window.confirm('Are you sure you want to delete this test?')) return;
    const resultAction = await dispatch(deleteTest(testId));
    if (deleteTest.fulfilled.match(resultAction)) {
      toast.success('Test deleted successfully!');
    } else {
      const errorMsg = resultAction.payload || resultAction.error?.message || 'Failed to delete test.';
      toast.error(errorMsg);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      dispatch(setPage(newPage));
    }
  };

  const handleLimitChange = (e) => {
    dispatch(setLimit(parseInt(e.target.value)));
  };

  return (
    <div className="min-h-screen bg-primary-50 w-full">
      {/* Header Section */}
      <div className="bg-primary-800 border-b border-primary-100 sticky top-0 z-20 w-full shadow-sm">
        <div className="w-full px-2 sm:px-4 md:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">
            <div className="flex items-center  mb-2">
              <div className="h-10 w-1 bg-primary-600 mr-3 rounded-full"></div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Lab Tests Management</h1>
                <p className="text-white mt-1 text-base font-medium">Manage and view all laboratory tests</p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex items-center bg-white rounded-xl shadow border border-primary-100 px-2 sm:px-4 py-2 w-full md:w-auto">
                <svg className="w-5 h-5 text-primary-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search tests by name or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none outline-none text-primary-800 placeholder-primary-400 w-full min-w-0 sm:w-64 text-sm"
                />
                {searchTerm && (
                  <button
                    onClick={handleResetSearch}
                    className="ml-2 p-1 hover:bg-primary-50 rounded-full transition-colors"
                  >
                    <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-2 sm:px-4 md:px-8 py-8">
        {getAllLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
              <p className="text-primary-700 text-lg">Loading lab tests...</p>
            </div>
          </div>
        ) : getAllError ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center shadow">
            <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Tests</h3>
            <p className="text-red-600">{getAllError}</p>
          </div>
        ) : (
          <div className="space-y-8 w-full">
            {/* Stats Cards */}
            <div className="flex items-center mb-8">
              <div className="h-8 w-1 bg-primary-600 mr-3 rounded-full"></div>
              <h2 className="text-2xl font-bold text-primary-800 tracking-tight">Lab Test Stats</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 w-full">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-primary-100 hover:shadow-xl transition-all duration-300 w-full flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-primary-400 text-xs sm:text-sm font-medium">Total Tests</p>
                    <p className="text-2xl sm:text-3xl font-bold text-primary-800">{tests.length}</p>
                  </div>
                  <div className="bg-primary-100 p-3 rounded-xl">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-primary-100 hover:shadow-xl transition-all duration-300 w-full flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-primary-400 text-xs sm:text-sm font-medium">Filtered Tests</p>
                    <p className="text-2xl sm:text-3xl font-bold text-teal-700">{filteredTests.length}</p>
                  </div>
                  <div className="bg-teal-100 p-3 rounded-xl">
                    <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-primary-100 hover:shadow-xl transition-all duration-300 w-full flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-primary-400 text-xs sm:text-sm font-medium">Fasting Tests</p>
                    <p className="text-2xl sm:text-3xl font-bold text-orange-600">{tests.filter(t => t.requiresFasting).length}</p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-xl">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-primary-100 hover:shadow-xl transition-all duration-300 w-full flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-primary-400 text-xs sm:text-sm font-medium">Avg Price</p>
                    <p className="text-2xl sm:text-3xl font-bold text-green-700">
                      Rs {tests.length > 0 ? Math.round(tests.reduce((sum, t) => sum + (t.testPrice || 0), 0) / tests.length) : 0}
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-xl">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Tests Table */}
            <div className="flex items-center mb-6 mt-12">
              <div className="h-8 w-1 bg-primary-600 mr-3 rounded-full"></div>
              <h2 className="text-2xl font-bold text-primary-800 tracking-tight">All Lab Tests</h2>
                </div>
                


                <div className="flex flex-col md:flex-row justify-between items-center   ">
                  <div className="text-sm text-primary-600 mb-4 md:mb-0">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} tests
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm text-primary-700">Rows per page:</span>
                    <select
                      value={pagination.limit}
                      onChange={handleLimitChange}
                      className="border border-primary-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                </div>


                <div className="bg-white rounded-2xl shadow-2xl border border-primary-100 overflow-x-auto w-full">
                  


              <table className="min-w-[900px] w-full">
                <thead className="bg-linear-to-r from-primary-600 to-teal-600 text-white rounded-t-2xl">
                  <tr>
                    <th className="py-4 px-2 sm:px-4 text-left font-semibold text-xs sm:text-sm">Test Name</th>
                    <th className="py-4 px-2 sm:px-4 text-left font-semibold text-xs sm:text-sm">Code</th>
                    <th className="py-4 px-2 sm:px-4 text-left font-semibold text-xs sm:text-sm">Price</th>
                    <th className="py-4 px-2 sm:px-4 text-left font-semibold text-xs sm:text-sm">Fasting</th>
                    <th className="py-4 px-2 sm:px-4 text-left font-semibold text-xs sm:text-sm">Report Time</th>
                    <th className="py-4 px-2 sm:px-4 text-left font-semibold text-xs sm:text-sm">Fields</th>
                    <th className="py-4 px-2 sm:px-4 text-left font-semibold text-xs sm:text-sm">Created</th>
                    <th className="py-4 px-2 sm:px-4 text-left font-semibold text-xs sm:text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary-50">
                  {filteredTests.map((test, index) => (
                    <tr
                      key={test._id}
                      className="hover:bg-linear-to-r hover:from-primary-50 hover:to-teal-50 transition-all duration-200 cursor-pointer group"
                      onClick={() => navigate(`/lab/test/${test._id}`)}
                    >
                      <td className="py-4 px-2 sm:px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-linear-to-br from-primary-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm shadow">
                            {test.testName?.charAt(0)?.toUpperCase() || 'T'}
                          </div>
                          <div>
                            <p className="font-semibold text-primary-700 group-hover:text-primary-600 transition-colors text-xs sm:text-base">
                              {test.testName}
                            </p>
                            <p className="text-xs text-primary-400">Click to view details</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-2 sm:px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          {test.testCode}
                        </span>
                      </td>
                      <td className="py-4 px-2 sm:px-4">
                        <span className="font-semibold text-green-600">Rs {test.testPrice}</span>
                      </td>
                      <td className="py-4 px-2 sm:px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          test.requiresFasting 
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {test.requiresFasting ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="py-4 px-2 sm:px-4">
                        <span className="text-primary-700 text-xs sm:text-sm">{test.reportDeliveryTime || '-'}</span>
                      </td>
                      <td className="py-4 px-2 sm:px-4">
                        {test.fields && test.fields.length > 0 ? (
                          <div className="space-y-1">
                            {test.fields.slice(0, 2).map((f, i) => (
                              <div key={i} className="text-xs">
                                <span className="font-medium text-primary-700">{f.name}</span>
                                {f.unit && <span className="text-primary-400"> ({f.unit})</span>}
                              </div>
                            ))}
                            {test.fields.length > 2 && (
                              <span className="text-xs text-primary-600">+{test.fields.length - 2} more</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-primary-300 text-sm">-</span>
                        )}
                      </td>
                      <td className="py-4 px-2 sm:px-4">
                        <span className="text-primary-400 text-xs sm:text-sm">
                          {test.createdAt ? new Date(test.createdAt).toLocaleDateString() : '-'}
                        </span>
                      </td>
                      <td className="py-4 px-2 sm:px-4">
                        <div className="flex gap-2">
                          <button
                            className="inline-flex items-center px-3 py-1.5 rounded-md bg-primary-600 text-white hover:bg-primary-700 transition text-xs font-semibold shadow-sm"
                            onClick={e => { e.stopPropagation(); navigate(`/lab/test/edit/${test._id}`); }}
                            title="Edit"
                          >
                            <FaEdit className="mr-1" /> 
                          </button>
                          <button
                            className="inline-flex items-center px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700 transition text-xs font-semibold shadow-sm"
                            onClick={e => { e.stopPropagation(); handleDelete(test._id); }}
                            title="Delete"
                          >
                            <FaTrash className="mr-1" /> 
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredTests.length === 0 && !getAllLoading && (
                    <tr>
                      <td colSpan="7" className="py-12 text-center">
                        <div className="flex flex-col items-center space-y-4">
                          <svg className="w-16 h-16 text-primary-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <div>
                            <h3 className="text-lg font-semibold text-primary-600 mb-2">No tests found</h3>
                            <p className="text-primary-400">
                              {searchTerm ? 'No tests match your search criteria.' : 'No tests have been added yet.'}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
                </div>
                
                {pagination.totalPages > 1 && (
                  <>
                  

                    <div className="flex items-center justify-end gap-2 ">
                      <button
                        onClick={() => handlePageChange(1)}
                        disabled={pagination.page === 1}
                        className="px-4 py-2 rounded border text-primary-700 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-primary-50"
                      >
                        First
                      </button>
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="px-4 py-2 rounded border flex items-center text-primary-700 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-primary-50"
                      >
                        <ChevronLeftIcon size={16} className="mr-1" /> Previous
                      </button>

                      <span className="px-4 py-2 text-sm font-medium text-primary-800">
                        Page {pagination.page} of {pagination.totalPages}
                      </span>

                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                        className="px-4 py-2 rounded border flex items-center text-primary-700 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-primary-50"
                      >
                        Next <ChevronRightIcon size={16} className="ml-1" />
                      </button>
                      <button
                        onClick={() => handlePageChange(pagination.totalPages)}
                        disabled={pagination.page === pagination.totalPages}
                        className="px-4 py-2 rounded border text-primary-700 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-primary-50"
                      >
                        Last
                      </button>
                    </div>
                  </>
                )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllAddedTests;
