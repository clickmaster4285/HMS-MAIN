// src/hooks/usePagination.js
import { useState, useCallback } from 'react';

const usePagination = (initialState = {}) => {
  const [pagination, setPagination] = useState({
    page: initialState.page || 1,
    limit: initialState.limit || 10,
    total: initialState.total || 0,
    totalPages: initialState.totalPages || 1,
    ...initialState
  });

  const setPage = useCallback((page) => {
    setPagination(prev => ({
      ...prev,
      page: Math.max(1, Math.min(page, prev.totalPages))
    }));
  }, []);

  const setLimit = useCallback((limit) => {
    setPagination(prev => ({
      ...prev,
      limit,
      page: 1 // Reset to first page when limit changes
    }));
  }, []);

  const setTotal = useCallback((total) => {
    setPagination(prev => ({
      ...prev,
      total,
      totalPages: Math.ceil(total / prev.limit)
    }));
  }, []);

  const resetPagination = useCallback(() => {
    setPagination({
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 1
    });
  }, []);

  const goToNextPage = useCallback(() => {
    setPagination(prev => ({
      ...prev,
      page: Math.min(prev.page + 1, prev.totalPages)
    }));
  }, []);

  const goToPrevPage = useCallback(() => {
    setPagination(prev => ({
      ...prev,
      page: Math.max(prev.page - 1, 1)
    }));
  }, []);

  const getQueryParams = useCallback(() => {
    return {
      page: pagination.page,
      limit: pagination.limit
    };
  }, [pagination.page, pagination.limit]);

  return {
    pagination,
    setPagination,
    setPage,
    setLimit,
    setTotal,
    resetPagination,
    goToNextPage,
    goToPrevPage,
    getQueryParams
  };
};


export default usePagination;