import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

// Helper function to get auth headers
const getAuthHeaders = () => {
  const jwtLoginToken = localStorage.getItem('jwtLoginToken');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${jwtLoginToken}`,
  };
};

// Async thunks
export const createExpense = createAsyncThunk(
  'expenses/create-expense',
  async (expenseData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/expense/create-expense`,
        expenseData,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        'Failed to create expense'
      );
    }
  }
);

export const getExpenses = createAsyncThunk(
  'expenses/get-expenses',
  async (params = {}, { rejectWithValue }) => {
    try {
      const {
        page = 1,
        limit = 20,
        search,
        expenseType,
        doctor,
        startDate,
        endDate,
        minAmount,
        maxAmount,
        status,
        sortBy = 'date',
        sortOrder = 'desc',
        dateRange
      } = params;
      
      const response = await axios.get(`${API_URL}/expense/get-expenses`, {
        params: {
          page,
          limit,
          search,
          expenseType,
          doctor,
          startDate,
          endDate,
          minAmount,
          maxAmount,
          status,
          sortBy,
          sortOrder,
          dateRange
        },
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getExpenseById = createAsyncThunk(
  'expenses/getExpenseById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/expense/${id}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateExpense = createAsyncThunk(
  'expenses/updateExpense',
  async ({ id, expenseData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/expense/${id}`, 
        expenseData,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteExpense = createAsyncThunk(
  'expenses/deleteExpense',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/expense/delete/${id}`, {
        headers: getAuthHeaders()
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getDoctorSummary = createAsyncThunk(
  'expense/summary/doctors',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/expense/summary/doctors`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getHospitalTotals = createAsyncThunk(
  'expenses/getHospitalTotals',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/expense/summary/hospital`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  expenses: [],
  currentExpense: null,
  doctorSummary: [],
  hospitalTotals: null,
  summary: null,
  loading: false,
  error: null,
  success: false,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  },
  filters: {
    search: '',
    expenseType: '',
    doctor: '',
    startDate: null,
    endDate: null,
    minAmount: '',
    maxAmount: '',
    status: 'active',
    sortBy: 'date',
    sortOrder: 'desc'
  }
};

// Expense slice
const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = '';
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Reset to first page when filters change
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        expenseType: '',
        doctor: '',
        startDate: null,
        endDate: null,
        minAmount: '',
        maxAmount: '',
        status: 'active',
        sortBy: 'date',
        sortOrder: 'desc'
      };
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    setLimit: (state, action) => {
      state.pagination.limit = action.payload;
      state.pagination.page = 1; // Reset to first page when changing limit
    }
  },
  extraReducers: (builder) => {
    builder
      // ================= CREATE EXPENSE =================
      .addCase(createExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.expenses = [action.payload.data, ...state.expenses];
      })
      .addCase(createExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= GET EXPENSES =================
      .addCase(getExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        
        if (action.payload.success && action.payload.data) {
          state.expenses = action.payload.data.expenses || [];
          state.summary = action.payload.data.summary || null;
          
          // Update pagination
          if (action.payload.data.pagination) {
            state.pagination = {
              ...state.pagination,
              ...action.payload.data.pagination,
              hasNextPage: action.payload.data.pagination.page < action.payload.data.pagination.totalPages,
              hasPrevPage: action.payload.data.pagination.page > 1
            };
          }
        }
      })
      .addCase(getExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= GET EXPENSE BY ID =================
      .addCase(getExpenseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getExpenseById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentExpense = action.payload.data;
      })
      .addCase(getExpenseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= UPDATE EXPENSE =================
      .addCase(updateExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        
        // Update the expense in the list
        const index = state.expenses.findIndex(exp => exp._id === action.payload.data._id);
        if (index !== -1) {
          state.expenses[index] = action.payload.data;
        }
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= DELETE EXPENSE =================
      .addCase(deleteExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        
        // Remove the deleted expense from the list
        state.expenses = state.expenses.filter(exp => exp._id !== action.payload);
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= GET DOCTOR SUMMARY =================
      .addCase(getDoctorSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDoctorSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.doctorSummary = action.payload.data || [];
      })
      .addCase(getDoctorSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= GET HOSPITAL TOTALS =================
      .addCase(getHospitalTotals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getHospitalTotals.fulfilled, (state, action) => {
        state.loading = false;
        state.hospitalTotals = action.payload.data || null;
      })
      .addCase(getHospitalTotals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { reset, setFilters, clearFilters, setPage, setLimit } = expensesSlice.actions;
export default expensesSlice.reducer;