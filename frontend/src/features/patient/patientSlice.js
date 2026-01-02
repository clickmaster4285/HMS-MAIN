import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const getAuthHeaders = () => {
  const jwtLoginToken = localStorage.getItem("jwtLoginToken");
  if (!jwtLoginToken) {
    console.warn("JWT token not found in localStorage!");
    throw new Error('No JWT token found. Please log in.');
  }
  return {
    headers: {
      Authorization: `Bearer ${jwtLoginToken}`,
    },
  };
};

// Helper function to load initial filters from URL or localStorage
const loadInitialFilters = () => {
  // Check URL parameters first
  const urlParams = new URLSearchParams(window.location.search);
  const urlFilters = {};

  // Get all possible filter params from URL
  const possibleFilters = [
    'search', 'gender', 'bloodType', 'maritalStatus',
    'fromDate', 'toDate', 'purpose', 'page', 'limit', 'sortBy', 'sortOrder'
  ];

  possibleFilters.forEach(key => {
    const value = urlParams.get(key);
    if (value) urlFilters[key] = value;
  });

  // If URL has filters, use them
  if (Object.keys(urlFilters).length > 0) {
    return urlFilters;
  }

  // Otherwise check localStorage
  const saved = localStorage.getItem('patient_filters');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved filters:', e);
    }
  }

  // Default filters with today's date
  const today = new Date().toISOString().split('T')[0];
  return {
    search: "",
    gender: "",
    bloodType: "",
    maritalStatus: "",
    fromDate: today,
    toDate: today,
    purpose: "All",
    page: 1,
    limit: 10,
    sortBy: "lastVisit",
    sortOrder: "desc"
  };
};


// Async thunks with pagination support
export const fetchPatients = createAsyncThunk(
  "patients/fetchPatients",
  async ({ page = 1, limit = 10, search = "", filters = {} } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(filters.fromDate && { fromDate: filters.fromDate }),
        ...(filters.toDate && { toDate: filters.toDate }),
        ...(filters.gender && { gender: filters.gender }),
        ...(filters.bloodType && { bloodType: filters.bloodType }),
        ...(filters.maritalStatus && { maritalStatus: filters.maritalStatus }),
        ...(filters.purpose && { purpose: filters.purpose }),
      });

      const response = await axios.get(
        `${API_URL}/patient/get-patients?${params}`,
        getAuthHeaders()
      );

      return response.data.information || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Keep other thunks the same...
export const fetchPatientById = createAsyncThunk(
  "patients/fetchById",
  async (patientId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/patient/get-patient-by-id/${patientId}`,
        getAuthHeaders()
      );
      return response.data.information.patient;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createPatient = createAsyncThunk(
  "patients/createPatient",
  async (newPatient, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/patient/create-patient`,
        newPatient,
        getAuthHeaders()
      );
      return response.data.information.patient;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updatePatient = createAsyncThunk(
  "patients/updatePatient",
  async ({ mrNo, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/patient/update-patient/${mrNo}`,
        updatedData,
        getAuthHeaders()
      );
      return response.data.information.patient;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchPatientByMrNo = createAsyncThunk(
  'patients/fetchByMrNo',
  async (patientMRNo, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/patient/get-patient-by-mrno/${patientMRNo}`,
        getAuthHeaders(),
      );
      return response.data?.information?.patient;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error.message || "Failed to fetch patient"
      );
    }
  }
);

export const deletePatient = createAsyncThunk(
  "patients/deletePatient",
  async (patientId, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${API_URL}/patient/delete-patient/${patientId}`,
        getAuthHeaders()
      );
      return patientId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Search patients async thunk
export const searchPatients = createAsyncThunk(
  "patients/searchPatients",
  async (searchTerm, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/patient/search-patients?searchTerm=${encodeURIComponent(searchTerm)}`,
        getAuthHeaders()
      );
      return response.data.information.patients;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Get patient with full refund history
export const getPatientWithRefundHistory = createAsyncThunk(
  "patient/getPatientWithRefundHistory",
  async (patientMRNo, { rejectWithValue }) => {
    try {
      const config = getAuthHeaders();
      const response = await axios.get(
        `${API_URL}/patient/with-refund-history/${patientMRNo}`,
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state with persistent filters
const initialState = {
  patients: [],
  selectedPatient: null,
  searchResults: [],
  status: "idle",
  selectedPatientStatus: "idle",
  searchStatus: "idle",
  patientData: null,
  visits: [],
  refunds: [],
  refundSummary: null,
  loading: false,
  error: null,

  // Pagination state
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalPatients: 0,
    limit: 10,
  },

  // Filters state - Load from persistent storage
  filters: loadInitialFilters(),

  // Track if filters are saved
  filtersSaved: false,
};


// Patient slice
const patientSlice = createSlice({
  name: "patients",
  initialState,
  reducers: {
    clearSelectedPatient: (state) => {
      state.selectedPatient = null;
      state.selectedPatientStatus = "idle";
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchStatus = "idle";
    },
    clearError: (state) => {
      state.error = null;
    },
    setSelectedPatient: (state, action) => {
      state.selectedPatient = action.payload;
    },
    clearPatientData: (state) => {
      state.patientData = null;
      state.visits = [];
      state.refunds = [];
      state.refundSummary = null;
    },
    // Enhanced setFilters with persistence
    setFilters: (state, action) => {
      const newFilters = { ...state.filters, ...action.payload };
      state.filters = newFilters;
      state.pagination.currentPage = 1; // Reset to first page when filters change
      state.filtersSaved = true;

      // Update URL with filters
      const urlParams = new URLSearchParams();
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value && value !== "" && value !== "All" && key !== 'page') {
          urlParams.set(key, value);
        }
      });

      const newUrl = urlParams.toString()
        ? `${window.location.pathname}?${urlParams.toString()}`
        : window.location.pathname;

      window.history.replaceState({}, '', newUrl);

      // Save to localStorage (debounced in component)
    },
    // Save filters to localStorage
    saveFiltersToStorage: (state) => {
      try {
        const filtersToSave = {
          ...state.filters,
          // Don't save page to storage
          page: 1
        };
        localStorage.setItem('patient_filters', JSON.stringify(filtersToSave));
      } catch (e) {
        console.error('Failed to save filters:', e);
      }
    },
    // Load filters from storage
    loadFiltersFromStorage: (state) => {
      const saved = localStorage.getItem('patient_filters');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          state.filters = { ...state.filters, ...parsed };
          state.filtersSaved = true;
        } catch (e) {
          console.error('Failed to load filters:', e);
        }
      }
    },
    // Clear all filters with persistence
    clearFilters: (state) => {
      const today = new Date().toISOString().split('T')[0];
      state.filters = {
        search: "",
        gender: "",
        bloodType: "",
        maritalStatus: "",
        fromDate: today,
        toDate: today,
        purpose: "All",
        page: 1,
        limit: 10,
        sortBy: "lastVisit",
        sortOrder: "desc"
      };
      state.pagination.currentPage = 1;
      state.filtersSaved = false;

      // Clear URL
      window.history.replaceState({}, '', window.location.pathname);

      // Clear localStorage
      localStorage.removeItem('patient_filters');
    },
    // Pagination actions
    setPage: (state, action) => {
      state.pagination.currentPage = action.payload;
      state.filters.page = action.payload;

      // Update URL with page
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set('page', action.payload);
      window.history.replaceState({}, '', `?${urlParams.toString()}`);
    },
    setLimit: (state, action) => {
      state.pagination.limit = action.payload;
      state.pagination.currentPage = 1;
      state.filters.limit = action.payload;
      state.filters.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // === FETCH ALL PATIENTS =======
      .addCase(fetchPatients.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.patients = action.payload.patients || action.payload;

        if (action.payload.pagination) {
          state.pagination = {
            ...state.pagination,
            ...action.payload.pagination,
          };
        }

        // Save filters after successful fetch
        state.filtersSaved = true;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch patient by ID
      .addCase(fetchPatientById.pending, (state) => {
        state.selectedPatientStatus = "loading";
      })
      .addCase(fetchPatientById.fulfilled, (state, action) => {
        state.selectedPatientStatus = "succeeded";
        state.selectedPatient = action.payload;
      })
      .addCase(fetchPatientById.rejected, (state, action) => {
        state.selectedPatientStatus = "failed";
        state.error = action.payload;
      })

      // ======= CREATE PATIENT =======
      .addCase(createPatient.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createPatient.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(createPatient.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // ======= UPDATE PATIENT =======
      .addCase(updatePatient.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updatePatient.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(updatePatient.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })


      // Fetch patient by MR No
      .addCase(fetchPatientByMrNo.pending, (state) => {
        state.selectedPatientStatus = "loading";
      })
      .addCase(fetchPatientByMrNo.fulfilled, (state, action) => {
        state.selectedPatientStatus = "succeeded";
        state.selectedPatient = action.payload;
      })
      .addCase(fetchPatientByMrNo.rejected, (state, action) => {
        state.selectedPatientStatus = "failed";
        state.error = action.payload;
      })


      // ======= DELETE PATIENT =======
      .addCase(deletePatient.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deletePatient.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(deletePatient.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Search patients
      .addCase(searchPatients.pending, (state) => {
        state.searchStatus = "loading";
      })
      .addCase(searchPatients.fulfilled, (state, action) => {
        state.searchStatus = "succeeded";
        state.searchResults = action.payload;
      })
      .addCase(searchPatients.rejected, (state, action) => {
        state.searchStatus = "failed";
        state.error = action.payload;
      })

      // Get Patient with Refund History
      .addCase(getPatientWithRefundHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPatientWithRefundHistory.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.success) {
          state.patientData = action.payload.data.patient;
          state.visits = action.payload.data.visits;
          state.refunds = action.payload.data.refunds;
          state.refundSummary = action.payload.data.refundSummary;
        } else {
          state.error = "Failed to fetch patient data";
        }
      })
      .addCase(getPatientWithRefundHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Error fetching patient data";
      });
  },
});

// Export actions and selectors
export const {
  clearSelectedPatient,
  clearSearchResults,
  clearPatientData,
  clearError,
  setPage,
  setLimit,
  setFilters,
  clearFilters,
  saveFiltersToStorage,
  
} = patientSlice.actions;

// Selectors
export const selectAllPatients = (state) => state.patients.patients;
export const selectPatients = (state) => state.patients.patients;
export const selectPatientStatus = (state) => state.patients.status;
export const selectSelectedPatient = (state) => state.patients.selectedPatient;
export const selectSelectedPatientStatus = (state) => state.patients.selectedPatientStatus;
export const selectSearchResults = (state) => state.patients.searchResults;
export const selectSearchStatus = (state) => state.patients.searchStatus;
export const selectPatientError = (state) => state.patients.error;
export const { setSelectedPatient } = patientSlice.actions;
// New selectors for pagination and filters
export const selectPagination = (state) => state.patients.pagination;
export const selectFilters = (state) => state.patients.filters;
export const selectPatientsStatus = (state) => state.patients.status;

export default patientSlice.reducer;