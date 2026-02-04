import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createCriticalResult,
  fetchCriticalResults,
  updateCriticalResult,
  deleteCriticalResult,
  setPage,
  setFilters,
  clearFilters,
  setItemsPerPage,
} from '../../../features/criticalResult/criticalSlice';
import PrintCriticalForm from './PrintCriticalForm';
import CriticalFormHeader from './CriticalFormHeader';
import CriticalResultsTable from './CriticalResultsTable';
import CriticalFormModal from './CriticalFormModal';

const CriticalForm = () => {
  const dispatch = useDispatch();
  const {
    criticalResults = [],
    error,
    success,
    pagination,
    filters,
  } = useSelector((state) => state.criticalResult);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResult, setEditingResult] = useState(null);
  const [showPrintForm, setShowPrintForm] = useState(false);
  const [printData, setPrintData] = useState(null);
  const searchTimeoutRef = useRef(null);

  // Fetch data on mount and when pagination/filters change
  useEffect(() => {
    const params = {
      page: pagination?.currentPage || 1,
      limit: pagination?.itemsPerPage || 20,
      search: filters?.search || '',
      startDate: filters?.startDate,
      endDate: filters?.endDate,
      sortBy: filters?.sortBy || 'createdAt',
      sortOrder: filters?.sortOrder || 'desc',
    };
    
    dispatch(fetchCriticalResults(params));
  }, [dispatch, pagination?.currentPage, pagination?.itemsPerPage, filters]);

  const openModal = (result = null) => {
    setEditingResult(result);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingResult(null);
  };

  const handleSubmit = (criticalResultData) => {
    if (editingResult) {
      dispatch(
        updateCriticalResult({
          id: editingResult._id,
          data: criticalResultData,
        })
      );
    } else {
      dispatch(createCriticalResult(criticalResultData));
    }
  };

  const handleDelete = (id) => {
    if (
      window.confirm('Are you sure you want to delete this critical result?')
    ) {
      dispatch(deleteCriticalResult(id));
    }
  };

  const handlePrint = (result) => {
    setPrintData(result);
    setShowPrintForm(true);
    setTimeout(() => {
      window.print();
      setShowPrintForm(false);
    }, 500);
  };

  // Pagination handlers
  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    dispatch(setItemsPerPage(newItemsPerPage));
  };

  // Filter handlers
  const handleSearch = (searchText) => {
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Update filters and reset page
    dispatch(setFilters({ search: searchText }));
    dispatch(setPage(1));
  };

  const handleDateFilter = (startDate, endDate) => {
    dispatch(setFilters({ 
      startDate: startDate ? startDate.toISOString().split('T')[0] : null,
      endDate: endDate ? endDate.toISOString().split('T')[0] : null
    }));
    dispatch(setPage(1));
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mx-auto bg-white p-6 rounded-md shadow-md">
        <CriticalFormHeader onOpenModal={() => openModal()} />
        
        {/* Directly render the table without any loading check */}
        <CriticalResultsTable
          criticalResults={criticalResults}
          error={error}
          onEdit={openModal}
          onDelete={handleDelete}
          onPrint={handlePrint}
          // Pass pagination props
          pagination={pagination}
          currentPage={pagination?.currentPage || 1}
          itemsPerPage={pagination?.itemsPerPage || 20}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          // Pass filter callbacks for server-side filtering
          onSearch={handleSearch}
          onDateFilter={handleDateFilter}
          currentSearch={filters?.search || ''}
          currentStartDate={filters?.startDate || null}
          currentEndDate={filters?.endDate || null}
        />
        
        <CriticalFormModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={handleSubmit}
          editingResult={editingResult}
        />
        {showPrintForm && printData && (
          <div className="fixed inset-0 z-50 bg-white p-8">
            <PrintCriticalForm
              form={printData}
              tests={printData.tests}
              labTechSignature={printData.labTechSignature}
              doctorSignature={printData.doctorSignature}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CriticalForm;