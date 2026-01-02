// hooks/useSummary.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSummary, selectSummary, selectSummaryLoading, selectSummaryError, selectSummaryFilters, setFilters } from '../features/summary/summarySlice';

export const useSummary = () => {
   const dispatch = useDispatch();
   const data = useSelector(selectSummary);
   const loading = useSelector(selectSummaryLoading);
   const error = useSelector(selectSummaryError);
   const filters = useSelector(selectSummaryFilters);

   const loadSummary = (customFilters = {}) => {
      const combinedFilters = { ...filters, ...customFilters };
      dispatch(fetchSummary(combinedFilters));
   };

   const updateFilters = (newFilters) => {
      dispatch(setFilters(newFilters));
   };

   useEffect(() => {
      if (!data) {
         loadSummary();
      }
   }, []);

   return {
      data,
      loading,
      error,
      filters,
      loadSummary,
      updateFilters,
      refresh: () => loadSummary()
   };
};