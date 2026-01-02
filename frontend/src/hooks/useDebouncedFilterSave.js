// hooks/useDebouncedFilterSave.js
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { saveFiltersToStorage } from '../features/patient/patientSlice';

const useDebouncedFilterSave = (filters, delay = 1000) => {
   const dispatch = useDispatch();
   const timerRef = useRef(null);

   useEffect(() => {
      // Clear previous timer
      if (timerRef.current) {
         clearTimeout(timerRef.current);
      }

      // Set new timer
      timerRef.current = setTimeout(() => {
         // Don't save page to localStorage
         const filtersToSave = { ...filters };
         delete filtersToSave.page; // Remove page from saved filters

         if (Object.keys(filtersToSave).some(key =>
            filtersToSave[key] && filtersToSave[key] !== ""
         )) {
            dispatch(saveFiltersToStorage());
         }
      }, delay);

      // Cleanup
      return () => {
         if (timerRef.current) {
            clearTimeout(timerRef.current);
         }
      };
   }, [filters, delay, dispatch]);
};

export default useDebouncedFilterSave;