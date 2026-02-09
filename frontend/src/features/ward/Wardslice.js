import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Async Thunks
export const createWard = createAsyncThunk(
  "ward/createWard",
  async (wardData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/ward/add-ward`, wardData, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      // Handle duplicate key errors specifically
      if (error.response?.data?.message?.includes('E11000') ||
        error.response?.data?.message?.includes('already exists')) {
        return rejectWithValue({
          message: error.response.data.message,
          isDuplicate: true
        });
      }
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getAllWards = createAsyncThunk(
  "ward/getAllWards",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/ward/get-all-ward`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getWardById = createAsyncThunk(
  "ward/getWardById",
  async (wardId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/ward/get-by-id/${wardId}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateWardById = createAsyncThunk(
  "ward/updateWardById",
  async ({ id, wardData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/ward/update-ward/${id}`,
        wardData,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteWard = createAsyncThunk(
  "ward/deleteWard",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_URL}/ward/delete-ward/${id}`,
        { headers: getAuthHeaders() }
      );
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getwardsbydepartmentId = createAsyncThunk(
  "ward/getwardsbydepartmentId",
  async (departmentId, { rejectWithValue }) => {
    if (!departmentId) {
      return rejectWithValue("Department ID is missing");
    }
    try {
      const response = await axios.get(
        `${API_URL}/ward/get-all-wards-by-dept/${departmentId}`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getBedHistory = createAsyncThunk(
  "ward/getBedHistory",
  async ({ wardId, bedNumber }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/ward/bed-history/${wardId}/${bedNumber}`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getPatientByBedId = createAsyncThunk(
  "ward/getPatientByBedId",
  async (bedId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/ward/get-by-bed-id/${bedId}`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getSuggestedWardNumber = createAsyncThunk(
  "ward/getSuggestedWardNumber",
  async (departmentId, { rejectWithValue }) => {
    if (!departmentId) {
      return rejectWithValue("Department ID is required");
    }
    try {
      const response = await axios.get(
        `${API_URL}/ward/suggest-ward-number/${departmentId}`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  allWards: [],
  wardsByDepartment: [],
  currentWard: null,
  currentBed: null,
  currentBedHistory: [],
  currentBedPatient: null,
  loading: false,
  error: null,
  createStatus: 'idle',
  fetchStatus: 'idle',
  updateStatus: 'idle',
  deleteStatus: 'idle',
  departmentFetchStatus: 'idle',
  historyStatus: 'idle',
  bedPatientStatus: 'idle',
  successMessage: null
};

const wardSlice = createSlice({
  name: "ward",
  initialState,
  reducers: {
    clearWardState: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    resetCurrentWard: (state) => {
      state.currentWard = null;
    },
    resetCurrentBed: (state) => {
      state.currentBed = null;
      state.currentBedPatient = null;
    },
    resetDepartmentWards: (state) => {
      state.wardsByDepartment = [];
    },
    resetBedHistory: (state) => {
      state.currentBedHistory = [];
    }
  },
  extraReducers: (builder) => {
    builder

      // ================= CREATE WARD =================
      .addCase(createWard.pending, (state) => {
        state.createStatus = "loading";
        state.error = null;
      })
      .addCase(createWard.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        state.successMessage = action.payload?.message || "Ward created successfully";
      })
      .addCase(createWard.rejected, (state, action) => {
        state.createStatus = "failed";
        state.error =
          typeof action.payload === "object"
            ? action.payload.message
            : action.payload;
      })

      // ================= GET ALL WARDS =================
      .addCase(getAllWards.pending, (state) => {
        state.fetchStatus = "loading";
        state.error = null;
      })
      .addCase(getAllWards.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.allWards = action.payload?.wards || [];
      })
      .addCase(getAllWards.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.error = action.payload;
      })

      // ================= GET WARD BY ID =================
      .addCase(getWardById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWardById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWard = action.payload?.ward || null;
      })
      .addCase(getWardById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= UPDATE WARD =================
      .addCase(updateWardById.pending, (state) => {
        state.updateStatus = "loading";
        state.error = null;
      })
      .addCase(updateWardById.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        state.successMessage = action.payload?.message || "Ward updated successfully";
      })
      .addCase(updateWardById.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.error = action.payload;
      })

      // ================= DELETE WARD =================
      .addCase(deleteWard.pending, (state) => {
        state.deleteStatus = "loading";
        state.error = null;
      })
      .addCase(deleteWard.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        state.successMessage = action.payload?.message || "Ward deleted successfully";
      })
      .addCase(deleteWard.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.error = action.payload;
      })

      // ================= WARDS BY DEPARTMENT =================
      .addCase(getwardsbydepartmentId.pending, (state) => {
        state.departmentFetchStatus = "loading";
        state.error = null;
      })
      .addCase(getwardsbydepartmentId.fulfilled, (state, action) => {
        state.departmentFetchStatus = "succeeded";
        state.wardsByDepartment = action.payload?.wards || [];
      })
      .addCase(getwardsbydepartmentId.rejected, (state, action) => {
        state.departmentFetchStatus = "failed";
        state.error = action.payload;
      })

      // ================= BED HISTORY =================
      .addCase(getBedHistory.pending, (state) => {
        state.historyStatus = "loading";
        state.error = null;
      })
      .addCase(getBedHistory.fulfilled, (state, action) => {
        state.historyStatus = "succeeded";
        state.currentBedHistory = action.payload?.history || [];
      })
      .addCase(getBedHistory.rejected, (state, action) => {
        state.historyStatus = "failed";
        state.error = action.payload;
      })

      // ================= PATIENT BY BED =================
      .addCase(getPatientByBedId.pending, (state) => {
        state.bedPatientStatus = "loading";
        state.error = null;
      })
      .addCase(getPatientByBedId.fulfilled, (state, action) => {
        state.bedPatientStatus = "succeeded";
        state.currentBed = action.payload?.data?.bed || null;
        state.currentBedPatient = action.payload?.data?.patient || null;
      })
      .addCase(getPatientByBedId.rejected, (state, action) => {
        state.bedPatientStatus = "failed";
        state.error = action.payload;
      })

      // ================= SUGGESTED WARD NUMBER =================
      .addCase(getSuggestedWardNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSuggestedWardNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.suggestedWardNumber = action.payload.suggestedWardNumber;
      })
      .addCase(getSuggestedWardNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  clearWardState,
  resetCurrentWard,
  resetCurrentBed,
  resetDepartmentWards,
  resetBedHistory
} = wardSlice.actions;

export const selectAllWards = (state) => state.ward.allWards;
export const selectWardsByDepartment = (state) => state.ward.wardsByDepartment;
export const selectCurrentWard = (state) => state.ward.currentWard;
export const selectCurrentBed = (state) => state.ward.currentBed;
export const selectCurrentBedPatient = (state) => state.ward.currentBedPatient;
export const selectBedHistory = (state) => state.ward.currentBedHistory;
export const selectWardStatus = (state) => ({
  loading: state.ward.loading,
  error: state.ward.error,
  createStatus: state.ward.createStatus,
  fetchStatus: state.ward.fetchStatus,
  updateStatus: state.ward.updateStatus,
  deleteStatus: state.ward.deleteStatus,
  departmentFetchStatus: state.ward.departmentFetchStatus,
  historyStatus: state.ward.historyStatus,
  bedPatientStatus: state.ward.bedPatientStatus,
  successMessage: state.ward.successMessage
});

export default wardSlice.reducer;