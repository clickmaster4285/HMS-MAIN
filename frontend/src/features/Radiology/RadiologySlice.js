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
      // console.log("The response", response.data);
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
  name: 'radiology',
  initialState,
  reducers: {
    // FULL reset — brings the slice back to its initial shape
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
      // ── Create Report ─────────────────────
      .addCase(createRadiologyReport.pending, (state) => {
        state.status.create = 'pending';
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(createRadiologyReport.fulfilled, (state, action) => {
        state.status.create = 'succeeded';
        state.isLoading = false;
        // state.patient = action.payload?.patient || action.payload;
        state.radiology = action.payload; // ← Fix: assuming reports is array
      })
      .addCase(createRadiologyReport.rejected, (state, action) => {
        state.status.create = 'failed';
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload.message || 'Failed to create report';
      })

      // Fetch All Reports
      .addCase(fetchAllRadiologyReports.pending, (state) => {
        state.status.fetchAll = 'pending';
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(fetchAllRadiologyReports.fulfilled, (state, action) => {
        state.status.fetchAll = 'succeeded';
        state.isLoading = false;
        state.reports = action.payload;
      })
      .addCase(fetchAllRadiologyReports.rejected, (state, action) => {
        state.status.fetchAll = 'failed';
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload.message || 'Failed to fetch reports';
      })

      // ── Fetch by ID ───────────────────────
      .addCase(fetchRadiologyReportById.pending, (state) => {
        state.status.fetchById = 'pending';
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(fetchRadiologyReportById.fulfilled, (state, action) => {
        state.status.fetchById = 'succeeded';
        state.isLoading = false;
        state.currentReport = action.payload;
      })
      .addCase(fetchRadiologyReportById.rejected, (state, action) => {
        state.status.fetchById = 'failed';
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload.message || 'Failed to fetch report';
      })

      // ── Update Report ─────────────────────
      .addCase(updateRadiologyReport.pending, (state) => {
        state.status.update = 'pending';
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(updateRadiologyReport.fulfilled, (state, action) => {
        state.status.update = 'succeeded';
        state.isLoading = false;
        state.currentReport = action.payload;
      })
      .addCase(updateRadiologyReport.rejected, (state, action) => {
        state.status.update = 'failed';
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload.message || 'Failed to update report';
      })

      //--------------------------------------update final report

      .addCase(updatefinalContent.pending, (state) => {
        state.status.update = 'pending';
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(updatefinalContent.fulfilled, (state, action) => {
        state.status.update = 'succeeded';
        state.isLoading = false;
        state.currentReport = action.payload;
      })
      .addCase(updatefinalContent.rejected, (state, action) => {
        state.status.update = 'failed';
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload.message || 'Failed to update report';
      })

      // ── Fetch Templates ───────────────────
      .addCase(fetchAvailableTemplates.pending, (state) => {
        state.status.fetchTemplates = 'pending';
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(fetchAvailableTemplates.fulfilled, (state, action) => {
        state.status.fetchTemplates = 'succeeded';
        state.isLoading = false;
        state.templates = action.payload;
      })
      .addCase(fetchAvailableTemplates.rejected, (state, action) => {
        state.status.fetchTemplates = 'failed';
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload.message || 'Failed to fetch templates';
      })
      .addCase(fetchRadiologyReportsByDate.pending, (state) => {
        state.status.fetchByDate = 'pending';
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(fetchRadiologyReportsByDate.fulfilled, (state, action) => {
        state.status.fetchByDate = 'succeeded';
        state.isLoading = false;
        state.filteredReports = action.payload;
      })
      .addCase(fetchRadiologyReportsByDate.rejected, (state, action) => {
        state.status.fetchByDate = 'failed';
        state.isLoading = false;
        state.isError = true;
        state.error =
          action.payload.message || 'Failed to fetch reports by date';
      })
      // ── Fetch by MRNO ───────────────────────
      .addCase(fetchReportByMrno.pending, (state) => {
        state.status.fetchByMrno = 'pending';
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(fetchReportByMrno.fulfilled, (state, action) => {
        state.status.fetchByMrno = 'succeeded';
        state.isLoading = false;
        state.currentReport = action.payload; // single report object
      })
      .addCase(fetchReportByMrno.rejected, (state, action) => {
        state.status.fetchByMrno = 'failed';
        state.isLoading = false;
        state.isError = true;
        state.error =
          action.payload?.message || 'Failed to fetch report by MRNO';
      })
      // ── Soft Delete Study (by studyId) ─────────────────────
      .addCase(softDeleteStudy.pending, (state) => {
        state.status.deleteStudy = 'pending';
        state.isError = false;
        state.error = null;
      })
      .addCase(softDeleteStudy.fulfilled, (state, action) => {
        state.status.deleteStudy = 'succeeded';
        const studyId = action.payload.studyId;

        // 1) Update currentReport (if the open report contains this study)
        if (state.currentReport?.studies?.length) {
          const idx = state.currentReport.studies.findIndex(
            (s) => String(s._id) === String(studyId)
          );
          if (idx !== -1) {
            // either mark as deleted to hide in UI, or remove from array
            // since your GET already hides deleted ones, marking is enough:
            state.currentReport.studies[idx]._delete = true;
            // optional: also remove from array
            // state.currentReport.studies.splice(idx, 1);
          }
        }

        // 2) Update the reports list (if you keep full docs there)
        if (Array.isArray(state.reports)) {
          state.reports = state.reports.map((r) => {
            if (!r?.studies?.length) return r;
            const has = r.studies.some(
              (s) => String(s._id) === String(studyId)
            );
            if (!has) return r;

            const studies = r.studies.map((s) =>
              String(s._id) === String(studyId) ? { ...s, _delete: true } : s
            );
            return { ...r, studies };
          });
        }
      })
      .addCase(softDeleteStudy.rejected, (state, action) => {
        state.status.deleteStudy = 'failed';
        state.isError = true;
        state.error = action.payload?.message || 'Failed to soft delete study';
      });
  },
});

export const {
  resetRadiologyStatus,
  clearCurrentReport,
  clearFilteredReports,
} = radiologySlice.actions;

export default radiologySlice.reducer;
