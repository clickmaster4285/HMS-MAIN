// refundSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

// Helper function to get auth headers
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

// Create Refund async action
export const createRefund = createAsyncThunk(
   "refund/createRefund",
   async (refundData, { rejectWithValue }) => {
      try {
         const config = getAuthHeaders();
         const response = await axios.post(`${API_URL}/refund/refunds`, refundData, config);
         return response.data;
      } catch (error) {
         return rejectWithValue(error.response?.data || error.message);
      }
   }
);

// Get Refunds by Patient MR Number async action
export const getRefundsByMRNumber = createAsyncThunk(
   "refund/getRefundsByMRNumber",
   async (mrNumber, { rejectWithValue }) => {
      try {
         const config = getAuthHeaders();
         const response = await axios.get(`${API_URL}/refund/refunds/patient/${mrNumber}`, config);
         return response.data;
      } catch (error) {
         return rejectWithValue(error.response?.data || error.message);
      }
   }
);

// Get Patient Visits for Refund Selection async action
export const getPatientVisitsForRefund = createAsyncThunk(
   "refund/getPatientVisitsForRefund",
   async (mrNumber, { rejectWithValue }) => {
      try {
         const config = getAuthHeaders();
         const response = await axios.get(`${API_URL}/refund/refunds/patient/${mrNumber}/visits`, config);
         return response.data;
      } catch (error) {
         return rejectWithValue(error.response?.data || error.message);
      }
   }
);

// Update Refund Status async action
export const updateRefundStatus = createAsyncThunk(
   "refund/updateRefundStatus",
   async ({ id, statusData }, { rejectWithValue }) => {
      try {
         const config = getAuthHeaders();
         const response = await axios.patch(
            `${API_URL}/refund/refunds/${id}/status`,
            statusData,
            config
         );
         return response.data;
      } catch (error) {
         return rejectWithValue(error.response?.data || error.message);
      }
   }
);

// Get Refund Statistics async action
export const getRefundStatistics = createAsyncThunk(
   "refund/getRefundStatistics",
   async ({ startDate, endDate } = {}, { rejectWithValue }) => {
      try {
         const config = {
            ...getAuthHeaders(),
            params: {
               ...(startDate && { startDate }),
               ...(endDate && { endDate }),
            },
         };
         const response = await axios.get(`${API_URL}/refund/refunds/statistics`, config);
         return response.data;
      } catch (error) {
         return rejectWithValue(error.response?.data || error.message);
      }
   }
);

// Get Refund by ID async action
export const getRefundById = createAsyncThunk(
   "refund/getRefundById",
   async (id, { rejectWithValue }) => {
      try {
         const config = getAuthHeaders();
         const response = await axios.get(`${API_URL}/refund/refunds/${id}`, config);
         return response.data;
      } catch (error) {
         return rejectWithValue(error.response?.data || error.message);
      }
   }
);

// Get All Refunds async action - UPDATED to use correct endpoint
export const getAllRefunds = createAsyncThunk(
   "refund/getAllRefunds",
   async (filters = {}, { rejectWithValue }) => {
      try {
         const config = {
            ...getAuthHeaders(),
            params: filters,
         };
         // Use the correct endpoint - either /refund/refunds or /refund/get-all
         const response = await axios.get(`${API_URL}/refund/refunds`, config);
         return response.data;
      } catch (error) {
         return rejectWithValue(error.response?.data || error.message);
      }
   }
);

// Alternative: If you need to support both endpoints for backward compatibility
export const getAllRefundsLegacy = createAsyncThunk(
   "refund/getAllRefundsLegacy",
   async (filters = {}, { rejectWithValue }) => {
      try {
         const config = {
            ...getAuthHeaders(),
            params: filters,
         };
         const response = await axios.get(`${API_URL}/refund/get-all`, config);
         return response.data;
      } catch (error) {
         return rejectWithValue(error.response?.data || error.message);
      }
   }
);

const refundSlice = createSlice({
  name: "refund",
  initialState: {
    refunds: [],
    refundDetails: null,
    patientVisits: [],
    statistics: null,
    loading: false,
    error: null,
    successMessage: "",
    filters: {
      status: "",
      startDate: "",
      endDate: "",
      patientMRNo: "",
    },
  },
  reducers: {
    clearSuccessMessage: (state) => {
      state.successMessage = "";
    },
    clearError: (state) => {
      state.error = null;
    },
    clearRefundDetails: (state) => {
      state.refundDetails = null;
    },
    clearPatientVisits: (state) => {
      state.patientVisits = [];
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        status: "",
        startDate: "",
        endDate: "",
        patientMRNo: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder

      // ================= CREATE REFUND =================
      .addCase(createRefund.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRefund.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage =
          action.payload?.message || "Refund created successfully!";
      })
      .addCase(createRefund.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Error creating refund";
      })

      // ================= GET REFUNDS BY MR =================
      .addCase(getRefundsByMRNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRefundsByMRNumber.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.refunds = action.payload.data;
        } else {
          state.error = action.payload?.message || "Failed to fetch refunds";
        }
      })
      .addCase(getRefundsByMRNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Error fetching refunds";
      })

      // ================= PATIENT VISITS =================
      .addCase(getPatientVisitsForRefund.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPatientVisitsForRefund.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.patientVisits = action.payload.data?.visits || [];
        } else {
          state.error =
            action.payload?.message || "Failed to fetch patient visits";
        }
      })
      .addCase(getPatientVisitsForRefund.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Error fetching patient visits";
      })

      // ================= UPDATE REFUND STATUS =================
      .addCase(updateRefundStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRefundStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage =
          action.payload?.message || "Refund status updated successfully!";
      })
      .addCase(updateRefundStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Error updating refund status";
      })

      // ================= REFUND STATS =================
      .addCase(getRefundStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRefundStatistics.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.statistics = action.payload.data;
        } else {
          state.error =
            action.payload?.message || "Failed to fetch refund statistics";
        }
      })
      .addCase(getRefundStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Error fetching refund statistics";
      })

      // ================= GET REFUND BY ID =================
      .addCase(getRefundById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRefundById.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.refundDetails = action.payload.data;
        } else {
          state.error =
            action.payload?.message || "Failed to fetch refund details";
        }
      })
      .addCase(getRefundById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Error fetching refund details";
      })

      // ================= GET ALL REFUNDS =================
      .addCase(getAllRefunds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllRefunds.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.refunds = action.payload.data;
        } else {
          state.error = action.payload?.message || "Failed to fetch refunds";
        }
      })
      .addCase(getAllRefunds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Error fetching refunds";
      })

      // ================= LEGACY REFUNDS =================
      .addCase(getAllRefundsLegacy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllRefundsLegacy.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.refunds = action.payload.data;
        } else {
          state.error = action.payload?.message || "Failed to fetch refunds";
        }
      })
      .addCase(getAllRefundsLegacy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Error fetching refunds";
      });
  },
});


// Selector exports
export const selectRefunds = (state) => state.refund.refunds;
export const selectRefundDetails = (state) => state.refund.refundDetails;
export const selectRefundLoading = (state) => state.refund.loading;
export const selectRefundError = (state) => state.refund.error;
export const selectRefundStatistics = (state) => state.refund.statistics;
export const selectPatientVisits = (state) => state.refund.patientVisits;
export const selectSuccessMessage = (state) => state.refund.successMessage;
export const selectRefundFilters = (state) => state.refund.filters;

export const {
   clearSuccessMessage,
   clearError,
   clearRefundDetails,
   clearPatientVisits,
   setFilters,
   clearFilters,
} = refundSlice.actions;

export default refundSlice.reducer;