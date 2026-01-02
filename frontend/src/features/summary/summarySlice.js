// features/summary/summarySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

// Async thunk for fetching summary
export const fetchSummary = createAsyncThunk(
   'summary/fetchSummary',
   async (params, { rejectWithValue }) => {
      try {
         const { startDate, endDate } = params || {};
         let url = `${API_URL}/summary/summary`;

         if (startDate || endDate) {
            const queryParams = new URLSearchParams();
            if (startDate) queryParams.append('startDate', startDate);
            if (endDate) queryParams.append('endDate', endDate);
            url += `?${queryParams.toString()}`;
         }

         const response = await axios.get(url);
         return response.data.data;
      } catch (error) {
         return rejectWithValue(error.response?.data?.message || 'Failed to fetch summary');
      }
   }
);

const summarySlice = createSlice({
   name: 'summary',
   initialState: {
      data: null,
      loading: false,
      error: null,
      filters: {
         startDate: new Date().toISOString().split('T')[0],
         endDate: new Date().toISOString().split('T')[0]
      }
   },
   reducers: {
      setFilters: (state, action) => {
         state.filters = { ...state.filters, ...action.payload };
      },
      clearSummary: (state) => {
         state.data = null;
         state.error = null;
      }
   },
   extraReducers: (builder) => {
      builder
         .addCase(fetchSummary.pending, (state) => {
            state.loading = true;
            state.error = null;
         })
         .addCase(fetchSummary.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
            state.error = null;
         })
         .addCase(fetchSummary.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Failed to fetch summary';
         });
   }
});

export const { setFilters, clearSummary } = summarySlice.actions;
export const selectSummary = (state) => state.summary.data;
export const selectSummaryLoading = (state) => state.summary.loading;
export const selectSummaryError = (state) => state.summary.error;
export const selectSummaryFilters = (state) => state.summary.filters;

export default summarySlice.reducer;