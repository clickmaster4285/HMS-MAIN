// src/features/tests/testSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_REACT_APP_API_URL; 


const getAuthHeaders = () => {
  const jwtLoginToken = localStorage.getItem("jwtLoginToken");
  return {
    headers: {
      Authorization: `Bearer ${jwtLoginToken}`,
    },
  };
};

// Async thunk to create a test
export const createTest = createAsyncThunk(
  'testManagement/createtest',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/testManagement/createtest`, 
        payload, 
        getAuthHeaders()
      );
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        return rejectWithValue(response.data?.message || 'Server returned an error');
      }
    } catch (error) {
      // More detailed error logging
      console.error('Error creating test:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        return rejectWithValue(error.response.data?.message || error.response.statusText);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        return rejectWithValue('No response received from server');
      } else {
        // Something happened in setting up the request
        console.error('Request setup error:', error.message);
        return rejectWithValue(error.message);
      }
    }
  }
);

// Async thunk to get all tests
export const getAllTests = createAsyncThunk(
  'testManagement/getAllTests',
  async ({ page = 1, limit = 10, search = '' } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/testManagement/getAlltest`, {
        ...getAuthHeaders(),
        params: { page, limit, search }  // ADDED search parameter
      });

      const data = response.data;

      return {
        tests: data.tests || [],
        pagination: data.pagination || {
          page: parseInt(page),
          limit: parseInt(limit),
          total: data.tests?.length || 0,
          totalPages: 1
        },
        search // Include search in returned data
      };

    } catch (error) {
      console.error('Fetch tests error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tests');
    }
  }
);

// Async thunk to get a test by ID
export const getTestById = createAsyncThunk(
  'testManagement/getTestById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/testManagement/gettestbyId/${id}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Something went wrong'
      );
    }
  }
);

// Async thunk to update a test
export const updateTest = createAsyncThunk(
  'testManagement/updateTest',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/testManagement/updateTest/${id}`, payload, getAuthHeaders());
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Something went wrong'
      );
    }
  }
);

// Async thunk to delete a test
export const deleteTest = createAsyncThunk(
  'testManagement/deleteTest',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/testManagement/deleteTest/${id}`, getAuthHeaders());
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Something went wrong'
      );
    }
  }
);

// Slice
const testSlice = createSlice({
  name: 'tests',
  initialState: {
    loading: false,
    error: null,
    successMessage: '',
    createdTest: null,
    tests: [],
    selectedTest: null,
    getAllLoading: false,
    getAllError: null,
    getByIdLoading: false,
    getByIdError: null,
    updateLoading: false,
    updateError: null,
    deleteLoading: false,
    deleteError: null,
    deleteSuccess: '',
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 1
    },
    search: '' // ADDED: Search state
  },
  reducers: {
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    setLimit: (state, action) => {
      state.pagination.limit = action.payload;
      state.pagination.page = 1; // reset to page 1 when changing limit
    },
    // ADDED: Set search reducer
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    // ADDED: Clear search reducer
    clearSearch: (state) => {
      state.search = '';
    }
  },
  

  extraReducers: (builder) => {
    builder

      // ================= CREATE TEST =================
      .addCase(createTest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = '';
      })
      .addCase(createTest.fulfilled, (state, action) => {
        state.loading = false;
        state.createdTest = action.payload.test; // OK
        state.successMessage = action.payload.message;
      })
      .addCase(createTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= GET ALL TESTS =================
      .addCase(getAllTests.pending, (state) => {
        state.getAllLoading = true;
        state.getAllError = null;
      })


      .addCase(getAllTests.fulfilled, (state, action) => {
        state.getAllLoading = false;
  state.tests = action.payload.tests || [];
        state.pagination = action.payload.pagination || {
          page: state.pagination.page,
          limit: state.pagination.limit,
          total: state.tests?.length || 0,
          totalPages: 1
        };
      })
      .addCase(getAllTests.rejected, (state, action) => {
        state.getAllLoading = false;
        state.getAllError = action.payload;
      })

      // ================= GET TEST BY ID =================
      .addCase(getTestById.pending, (state) => {
        state.getByIdLoading = true;
        state.getByIdError = null;
        state.selectedTest = null;
      })
      .addCase(getTestById.fulfilled, (state, action) => {
        state.getByIdLoading = false;
        state.selectedTest = action.payload;
      })
      .addCase(getTestById.rejected, (state, action) => {
        state.getByIdLoading = false;
        state.getByIdError = action.payload;
      })

      // ================= UPDATE TEST =================
      .addCase(updateTest.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
        state.successMessage = '';
      })
      .addCase(updateTest.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(updateTest.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      })

      // ================= DELETE TEST =================
      .addCase(deleteTest.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
        state.deleteSuccess = '';
      })
      .addCase(deleteTest.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.deleteSuccess = action.payload.message;
      })
      .addCase(deleteTest.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload;
      });
  },
});

export default testSlice.reducer;
export const { setPage, setLimit, setSearch, clearSearch } = testSlice.actions;

// Selectors
export const selectAllTests = state => state.labtest.tests;
export const selectSelectedTest = state => state.labtest.selectedTest;
export const selectGetAllLoading = state => state.labtest.getAllLoading;
export const selectGetByIdLoading = state => state.labtest.getByIdLoading;
export const selectUpdateLoading = state => state.labtest.updateLoading;
export const selectDeleteLoading = state => state.labtest.deleteLoading;
export const selectGetAllError = state => state.labtest.getAllError;
export const selectGetByIdError = state => state.labtest.getByIdError;
export const selectUpdateError = state => state.labtest.updateError;
export const selectDeleteError = state => state.labtest.deleteError;
export const selectDeleteSuccess = state => state.labtest.deleteSuccess;
