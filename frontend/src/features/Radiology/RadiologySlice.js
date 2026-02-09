import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const getAuthHeaders = () => {
  const jwtLoginToken = localStorage.getItem('jwtLoginToken');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${jwtLoginToken}`,
  };
};

// ─── Thunks ────────────────────────────────────────────────────────────────

export const createRadiologyReport = createAsyncThunk(
  'radiology/createReport',
  async (reportData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/radiology/create-report`,
        reportData,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to create radiology report';
      return rejectWithValue({
        message,
        statusCode: error.response?.status || 500,
      });
    }
  }
);

export const fetchAllRadiologyReports = createAsyncThunk(
  'radiology/fetchAllReports',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/radiology/get-reports`, {
        headers: getAuthHeaders(),
      });
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch radiology reports';
      return rejectWithValue({ message });
    }
  }
);

export const fetchRadiologyReportById = createAsyncThunk(
  'radiology/fetchReportById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/radiology/get-reports-byid/${id}`,
        { headers: getAuthHeaders() }
      );
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch radiology report';
      return rejectWithValue({ message });
    }
  }
);

export const updateRadiologyReport = createAsyncThunk(
  'radiology/updateReport',
  async ({ id, reportData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/radiology/update-reports/${id}`,
        reportData,
        { headers: getAuthHeaders() }
      );

      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to update radiology report';
      return rejectWithValue({ message });
    }
  }
);

export const fetchAvailableTemplates = createAsyncThunk(
  'radiology/fetchTemplates',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/radiology/get-all-templates`,
        {
          headers: getAuthHeaders(),
        }
      );
      return response.data.templates;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch templates';
      return rejectWithValue({ message });
    }
  }
);

export const fetchRadiologyReportsByDate = createAsyncThunk(
  'radiology/fetchReportsByDate',
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/radiology/get-radiology-reports-summery-byid`,
        {
          params: { startDate, endDate },
          headers: getAuthHeaders(),
        }
      );
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch radiology reports by date';
      return rejectWithValue({ message });
    }
  }
);

export const fetchReportByMrno = createAsyncThunk(
  'radiology/fetchReportByMrno',
  async (mrno, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${API_URL}/radiology/reports-by-mrno/${mrno}`,
        { headers: getAuthHeaders() }
      );

      return res.data.data; // single report object
    } catch (e) {
      return rejectWithValue(e.message || 'Network error');
    }
  }
);

export const softDeleteStudy = createAsyncThunk(
  'radiology/softDeleteStudy',
  async (studyId, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${API_URL}/radiology/delete-template/${studyId}`,
        {}, // body not required
        { headers: getAuthHeaders() }
      );
      // Server usually returns { success, message, ... }
      return { studyId, server: res.data };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to soft delete study';
      return rejectWithValue({
        message,
        statusCode: error.response?.status || 500,
      });
    }
  }
);

export const updatefinalContent = createAsyncThunk(
  'radiology/updateFinalContent',
  async ({ id, reportData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch(
        `${API_URL}/radiology/update-final-content/${id}`,
        reportData, // e.g. { studyId, finalContent } or { studies: [...] }
        { headers: getAuthHeaders() } // must include Bearer token
      );
      // Your controller responds with { success, message, data: report }
      return data.data; // the updated report object
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to update final content';
      return rejectWithValue({ message });
    }
  }
);

// ─── Initial State ─────────────────────────────────────────────────────────

const initialState = {
  reports: [],
  totalPatients: [],
  filteredReports: [],
  currentReport: null,
  templates: [],
  status: {
    create: 'idle',
    fetchAll: 'idle',
    fetchById: 'idle',
    update: 'idle',
    fetchTemplates: 'idle',
    fetchByDate: 'idle',
    deleteStudy: 'idle',
  },
  isLoading: false,
  isError: false,
  error: null,
};

// ─── Slice ─────────────────────────────────────────────────────────────────

const radiologySlice = createSlice({
  name: "radiology",
  initialState,
  reducers: {
    resetRadiologyStatus: () => ({
      ...initialState,
      status: { ...initialState.status },
    }),

    clearCurrentReport: (state) => {
      state.currentReport = null;
    },

    clearFilteredReports: (state) => {
      state.filteredReports = [];
    },
  },

  extraReducers: (builder) => {
    builder

      /* ================= CREATE REPORT ================= */
      .addCase(createRadiologyReport.pending, (state) => {
        state.status.create = "pending";
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(createRadiologyReport.fulfilled, (state) => {
        state.status.create = "succeeded";
        state.isLoading = false;
      })
      .addCase(createRadiologyReport.rejected, (state, action) => {
        state.status.create = "failed";
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload?.message || "Failed to create report";
      })

      /* ================= FETCH ALL REPORTS ================= */
      .addCase(fetchAllRadiologyReports.pending, (state) => {
        state.status.fetchAll = "pending";
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(fetchAllRadiologyReports.fulfilled, (state, action) => {
        state.status.fetchAll = "succeeded";
        state.isLoading = false;
        state.reports = action.payload;
      })
      .addCase(fetchAllRadiologyReports.rejected, (state, action) => {
        state.status.fetchAll = "failed";
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload?.message || "Failed to fetch reports";
      })

      /* ================= FETCH BY ID ================= */
      .addCase(fetchRadiologyReportById.pending, (state) => {
        state.status.fetchById = "pending";
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(fetchRadiologyReportById.fulfilled, (state, action) => {
        state.status.fetchById = "succeeded";
        state.isLoading = false;
        state.currentReport = action.payload;
      })
      .addCase(fetchRadiologyReportById.rejected, (state, action) => {
        state.status.fetchById = "failed";
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload?.message || "Failed to fetch report";
      })

      /* ================= UPDATE REPORT ================= */
      .addCase(updateRadiologyReport.pending, (state) => {
        state.status.update = "pending";
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(updateRadiologyReport.fulfilled, (state) => {
        state.status.update = "succeeded";
        state.isLoading = false;
      })
      .addCase(updateRadiologyReport.rejected, (state, action) => {
        state.status.update = "failed";
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload?.message || "Failed to update report";
      })

      /* ================= UPDATE FINAL CONTENT ================= */
      .addCase(updatefinalContent.pending, (state) => {
        state.status.update = "pending";
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(updatefinalContent.fulfilled, (state) => {
        state.status.update = "succeeded";
        state.isLoading = false;
      })
      .addCase(updatefinalContent.rejected, (state, action) => {
        state.status.update = "failed";
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload?.message || "Failed to update report";
      })

      /* ================= FETCH TEMPLATES ================= */
      .addCase(fetchAvailableTemplates.pending, (state) => {
        state.status.fetchTemplates = "pending";
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(fetchAvailableTemplates.fulfilled, (state, action) => {
        state.status.fetchTemplates = "succeeded";
        state.isLoading = false;
        state.templates = action.payload;
      })
      .addCase(fetchAvailableTemplates.rejected, (state, action) => {
        state.status.fetchTemplates = "failed";
        state.isLoading = false;
        state.isError = true;
        state.error =
          action.payload?.message || "Failed to fetch templates";
      })

      /* ================= FETCH BY DATE ================= */
      .addCase(fetchRadiologyReportsByDate.pending, (state) => {
        state.status.fetchByDate = "pending";
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(fetchRadiologyReportsByDate.fulfilled, (state, action) => {
        state.status.fetchByDate = "succeeded";
        state.isLoading = false;
        state.filteredReports = action.payload;
      })
      .addCase(fetchRadiologyReportsByDate.rejected, (state, action) => {
        state.status.fetchByDate = "failed";
        state.isLoading = false;
        state.isError = true;
        state.error =
          action.payload?.message || "Failed to fetch reports by date";
      })

      /* ================= FETCH BY MRNO ================= */
      .addCase(fetchReportByMrno.pending, (state) => {
        state.status.fetchByMrno = "pending";
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(fetchReportByMrno.fulfilled, (state, action) => {
        state.status.fetchByMrno = "succeeded";
        state.isLoading = false;
        state.currentReport = action.payload;
      })
      .addCase(fetchReportByMrno.rejected, (state, action) => {
        state.status.fetchByMrno = "failed";
        state.isLoading = false;
        state.isError = true;
        state.error =
          action.payload?.message || "Failed to fetch report by MRNO";
      })

      /* ================= SOFT DELETE STUDY ================= */
      .addCase(softDeleteStudy.pending, (state) => {
        state.status.deleteStudy = "pending";
        state.isError = false;
        state.error = null;
      })
      .addCase(softDeleteStudy.fulfilled, (state) => {
        state.status.deleteStudy = "succeeded";
      })
      .addCase(softDeleteStudy.rejected, (state, action) => {
        state.status.deleteStudy = "failed";
        state.isError = true;
        state.error =
          action.payload?.message || "Failed to soft delete study";
      });
  },
});

/* ================= EXPORTS ================= */

export const {
  resetRadiologyStatus,
  clearCurrentReport,
  clearFilteredReports,
} = radiologySlice.actions;

export default radiologySlice.reducer;
