import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const getAuthHeaders = () => {
  const jwtLoginToken = localStorage.getItem('jwtLoginToken');
  if (jwtLoginToken) {
    try {
      jwtDecode(jwtLoginToken);
    } catch (error) {
      console.error('Invalid JWT token:', error.message);
    }
  }
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${jwtLoginToken}`,
  };
};

export const createCriticalResult = createAsyncThunk(
  'criticalResult/createCriticalResult',
  async (criticalResultData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/criticalResult/create-Critical-result`,
        criticalResultData,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create critical result'
      );
    }
  }
);

// Updated fetchCriticalResults with pagination and filters
export const fetchCriticalResults = createAsyncThunk(
  'criticalResult/fetchCriticalResults',
  async (params = {}, { rejectWithValue }) => {
    try {
      const {
        page = 1,
        limit = 20,
        search = '',
        startDate,
        endDate,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = params;
      
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder
      });
      
      if (search) queryParams.append('search', search);
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);
      
      const response = await axios.get(
        `${API_URL}/criticalResult/getAll-Critical-result?${queryParams.toString()}`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch critical results'
      );
    }
  }
);

export const fetchCriticalResultById = createAsyncThunk(
  'criticalResult/fetchCriticalResultById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/criticalResult/get-Critical-result/${id}`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch critical result'
      );
    }
  }
);

export const updateCriticalResult = createAsyncThunk(
  'criticalResult/updateCriticalResult',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/criticalResult/update-Critical-result/${id}`,
        data,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update critical result'
      );
    }
  }
);

export const deleteCriticalResult = createAsyncThunk(
  'criticalResult/deleteCriticalResult',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${API_URL}/criticalResult/delete-Critical-result/${id}`,
        { headers: getAuthHeaders() }
      );
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete critical result'
      );
    }
  }
);

export const getSummaryByDate = createAsyncThunk(
  'criticalResult/getSummaryByDate',
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      if (!startDate) throw new Error('Start date is required');
      if (!endDate) endDate = startDate;

      const qs = new URLSearchParams({
        startDate,
        endDate,
      }).toString();

      const response = await axios.get(
        `${API_URL}/criticalResult/get-critical-summery-by-date?${qs}`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (err) {
      const message =
        err.response?.response?.message ||
        err.message ||
        'Failed to fetch summary by date';
      return rejectWithValue({ message });
    }
  }
);

const criticalResultSlice = createSlice({
  name: 'criticalResult',
  initialState: {
    criticalResults: [],
    currentCriticalResult: null,
    loading: false,
    error: null,
    success: false,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 20
    },
    filters: {
      search: '',
      startDate: null,
      endDate: null,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    },
    status: { summary: 'idle' },
    summaryState: { summary: [], loading: false, error: null },
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    setCurrentCriticalResult: (state, action) => {
      state.currentCriticalResult = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        startDate: null,
        endDate: null,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };
      // Reset to first page when clearing filters
      state.pagination.currentPage = 1;
    },
    setPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    // ADD THIS REDUCER
    setItemsPerPage: (state, action) => {
      state.pagination.itemsPerPage = action.payload;
      state.pagination.currentPage = 1; // Reset to first page when changing items per page
    },
  },
  extraReducers: (builder) => {
    builder
      // ================= CREATE =================
      .addCase(createCriticalResult.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createCriticalResult.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createCriticalResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= FETCH ALL (UPDATED) =================
      .addCase(fetchCriticalResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCriticalResults.fulfilled, (state, action) => {
        state.loading = false;
        state.criticalResults = action.payload.data;
        // Update pagination from response
        if (action.payload.pagination) {
          state.pagination = {
            ...state.pagination,
            ...action.payload.pagination
          };
        }
      })
      .addCase(fetchCriticalResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= FETCH BY ID =================
      .addCase(fetchCriticalResultById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCriticalResultById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCriticalResult = action.payload.data;
      })
      .addCase(fetchCriticalResultById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= UPDATE =================
      .addCase(updateCriticalResult.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateCriticalResult.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updateCriticalResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= DELETE =================
      .addCase(deleteCriticalResult.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCriticalResult.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(deleteCriticalResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= SUMMARY =================
      .addCase(getSummaryByDate.pending, (state) => {
        state.status.summary = 'pending';
        state.summaryState.loading = true;
        state.summaryState.error = null;
      })
      .addCase(getSummaryByDate.fulfilled, (state, action) => {
        state.status.summary = 'succeeded';
        state.summaryState.loading = false;
        state.summaryState.summary = action.payload;
      })
      .addCase(getSummaryByDate.rejected, (state, action) => {
        state.status.summary = 'failed';
        state.summaryState.loading = false;
        state.summaryState.error =
          action.payload?.message || 'Failed to fetch summary by date';
      });
  },
});

export const { 
  clearError, 
  clearSuccess, 
  setCurrentCriticalResult,
  setFilters,
  clearFilters,
  setPage,
  setItemsPerPage // ADD THIS TO EXPORTS
} = criticalResultSlice.actions;

export default criticalResultSlice.reducer;