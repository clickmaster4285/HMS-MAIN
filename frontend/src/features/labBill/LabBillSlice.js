import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const getAuthHeaders = () => {
  const jwtLoginToken = localStorage.getItem("jwtLoginToken");
  if (jwtLoginToken) {
    try {
      jwtDecode(jwtLoginToken);
    } catch (error) {
      console.error("Invalid JWT token:", error.message);
    }
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwtLoginToken}`,
  };
};

// Fetch lab bill summary
export const fetchLabBillSummary = createAsyncThunk(
  "billing/fetchLabBillSummary",
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const response = await axios.get(
        `${API_URL}/labBills/bill/get-summery-radiology-bills?${params.toString()}`,
        { headers: getAuthHeaders() }
      );

      return response.data.data || [];
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch lab bill summary";
      return rejectWithValue({
        message,
        statusCode: error.response?.status || 500,
      });
    }
  }
);

// Get all test bills
export const getAllTestBills = createAsyncThunk(
  "billing/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/labBills`, {
        headers: getAuthHeaders(),
      });
      return response.data.data || { results: [], pagination: {}, summary: {} };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch lab bills";
      return rejectWithValue({
        message,
        statusCode: error.response?.status || 500,
      });
    }
  }
);

// Get bill details
export const getBillDetails = createAsyncThunk(
  "billing/getDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/labBills/bill/detailtestbill/${id}`,
        { headers: getAuthHeaders() }
      );
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch bill details";
      return rejectWithValue({
        message,
        statusCode: error.response?.status || 500,
      });
    }
  }
);

// Process lab refund
export const processRefund = createAsyncThunk(
  "billing/processRefund",
  async ({ patientId, refundData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${API_URL}/labBills/bill/refund-amount-by-lab/${patientId}`,
        refundData,
        { headers: getAuthHeaders() }
      );
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to process lab refund";
      return rejectWithValue({
        message,
        statusCode: error.response?.status || 500,
      });
    }
  }
);

// Process lab payment after report
export const processPaymentAfterReport = createAsyncThunk(
  "billing/processPaymentAfterReport",
  async ({ patientId, customAmount, refundReason }, { rejectWithValue }) => {
    try {
      const payload = customAmount ? { customAmount, refundReason } : {};
      const response = await axios.patch(
        `${API_URL}/patientTest/test/payment-after-report/${patientId}`,
        payload,
        { headers: getAuthHeaders() }
      );
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to process lab payment";
      return rejectWithValue({
        message,
        statusCode: error.response?.status || 500,
      });
    }
  }
);

// Process radiology payment
export const processRadiologyPayment = createAsyncThunk(
  "billing/processRadiologyPayment",
  async ({ patientId, customAmount, refundReason }, { rejectWithValue }) => {
    try {
      const payload = customAmount ? { customAmount, refundReason } : {};
      const response = await axios.patch(
        `${API_URL}/labBills/bill/finalize-amount-by-radiology/${patientId}`,
        payload,
        { headers: getAuthHeaders() }
      );
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to finalize radiology payment";
      return rejectWithValue({
        message,
        statusCode: error.response?.status || 500,
      });
    }
  }
);

// Process radiology refund
export const processRadiologyRefund = createAsyncThunk(
  "billing/processRadiologyRefund",
  async ({ patientId, refundData }, { rejectWithValue }) => {
   try {
      const response = await axios.patch(
        `${API_URL}/labBills/bill/refund-amount-by-radiology/${patientId}`,
        refundData,
        { headers: getAuthHeaders() }
      );
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to process radiology refund";
      return rejectWithValue({
        message,
        statusCode: error.response?.status || 500,
      });
    }
  }
);

// Fetch radiology bills
export const fetchRadiologyBills = createAsyncThunk(
  "billing/fetchRadiologyBills",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/labBills/bill/get-all-radiology-bills`,
        { headers: getAuthHeaders() }
      );
      return response.data.data || [];
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch radiology bills";
      return rejectWithValue({
        message,
        statusCode: error.response?.status || 500,
      });
    }
  }
);

// Get radiology bill details
export const getRadiologyBillDetails = createAsyncThunk(
  "billing/getRadiologyDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/labBills/bill/get-detial-radiology-bill/${id}`,
        { headers: getAuthHeaders() }
      );
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch radiology bill details";
      return rejectWithValue({
        message,
        statusCode: error.response?.status || 500,
      });
    }
  }
);

const initialState = {
  allBills: { data: [], pagination: {}, summary: {}, status: "idle", error: null },
  currentBill: { data: null, status: "idle", error: null },
  refund: { status: "idle", lastRefund: null, error: null },
  paymentAfterReport: { status: "idle", lastPayment: null, error: null },
  radiologyRefund: { status: "idle", lastRefund: null, error: null },
  radiologyPayment: { status: "idle", lastPayment: null, error: null },
  bills: [], // Radiology bills
  labBillSummary: [],
  status: "idle",
  error: null,
};

const billingSlice = createSlice({
  name: "billing",
  initialState,
  reducers: {
    resetCurrentBill: (state) => {
      state.currentBill = initialState.currentBill;
    },
    resetRefundStatus: (state) => {
      state.refund = initialState.refund;
    },
    resetPaymentStatus: (state) => {
      state.paymentAfterReport = initialState.paymentAfterReport;
    },
    resetRadiologyRefundStatus: (state) => {
      state.radiologyRefund = initialState.radiologyRefund;
    },
    resetRadiologyPaymentStatus: (state) => {
      state.radiologyPayment = initialState.radiologyPayment;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch lab bill summary
      .addCase(fetchLabBillSummary.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchLabBillSummary.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.labBillSummary = action.payload || [];
      })
      .addCase(fetchLabBillSummary.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to fetch lab bill summary";
      })
      // Get all test bills
      .addCase(getAllTestBills.pending, (state) => {
        state.allBills.status = "loading";
        state.allBills.error = null;
      })
      .addCase(getAllTestBills.fulfilled, (state, action) => {
        state.allBills.status = "succeeded";
        state.allBills.data = action.payload.results || [];
        state.allBills.pagination = action.payload.pagination || {};
        state.allBills.summary = action.payload.summary || {};
      })
      .addCase(getAllTestBills.rejected, (state, action) => {
        state.allBills.status = "failed";
        state.allBills.error = action.payload?.message || "Failed to fetch lab bills";
      })
      // Get bill details
      .addCase(getBillDetails.pending, (state) => {
        state.currentBill.status = "loading";
        state.currentBill.error = null;
      })
      .addCase(getBillDetails.fulfilled, (state, action) => {
        state.currentBill.status = "succeeded";
        state.currentBill.data = action.payload;
      })
      .addCase(getBillDetails.rejected, (state, action) => {
        state.currentBill.status = "failed";
        state.currentBill.error = action.payload?.message || "Failed to fetch bill details";
      })
      // Process lab refund
      .addCase(processRefund.pending, (state) => {
        state.refund.status = "loading";
        state.refund.error = null;
      })
      .addCase(processRefund.fulfilled, (state, action) => {
        state.refund.status = "succeeded";
        state.refund.lastRefund = action.payload;
        if (
          state.currentBill.data &&
          state.currentBill.data._id === action.meta.arg.patientId
        ) {
          state.currentBill.data.refunded = state.currentBill.data.refunded || [];
          state.currentBill.data.refunded.push(action.payload.refundRecord);
        }
        state.allBills.data = state.allBills.data.map((bill) =>
          bill._id === action.meta.arg.patientId ? action.payload : bill
        );
      })
      .addCase(processRefund.rejected, (state, action) => {
        state.refund.status = "failed";
        state.refund.error = action.payload?.message || "Failed to process lab refund";
      })
      // Process lab payment after report
      .addCase(processPaymentAfterReport.pending, (state) => {
        state.paymentAfterReport.status = "loading";
        state.paymentAfterReport.error = null;
      })
      .addCase(processPaymentAfterReport.fulfilled, (state, action) => {
        state.paymentAfterReport.status = "succeeded";
        state.paymentAfterReport.lastPayment = action.payload;
        state.allBills.data = state.allBills.data.map((bill) =>
          bill._id === action.payload._id ? action.payload : bill
        );
        if (
          state.currentBill.data &&
          state.currentBill.data._id === action.payload._id
        ) {
          state.currentBill.data = action.payload;
        }
      })
      .addCase(processPaymentAfterReport.rejected, (state, action) => {
        state.paymentAfterReport.status = "failed";
        state.paymentAfterReport.error = action.payload?.message || "Failed to process lab payment";
      })
      // Process radiology payment
      .addCase(processRadiologyPayment.pending, (state) => {
        state.radiologyPayment.status = "loading";
        state.radiologyPayment.error = null;
      })
      .addCase(processRadiologyPayment.fulfilled, (state, action) => {
        state.radiologyPayment.status = "succeeded";
        state.radiologyPayment.lastPayment = action.payload;
        state.bills = state.bills.map((bill) =>
          bill._id === action.payload._id ? action.payload : bill
        );
        if (
          state.currentBill.data &&
          state.currentBill.data._id === action.payload._id
        ) {
          state.currentBill.data = action.payload;
        }
      })
      .addCase(processRadiologyPayment.rejected, (state, action) => {
        state.radiologyPayment.status = "failed";
        state.radiologyPayment.error = action.payload?.message || "Failed to finalize radiology payment";
      })
      // Process radiology refund
      .addCase(processRadiologyRefund.pending, (state) => {
        state.radiologyRefund.status = "loading";
        state.radiologyRefund.error = null;
      })
      .addCase(processRadiologyRefund.fulfilled, (state, action) => {
        state.radiologyRefund.status = "succeeded";
        state.radiologyRefund.lastRefund = action.payload;
        state.bills = state.bills.map((bill) =>
          bill._id === action.meta.arg.patientId ? action.payload : bill
        );
        if (
          state.currentBill.data &&
          state.currentBill.data._id === action.meta.arg.patientId
        ) {
          state.currentBill.data.refunded = state.currentBill.data.refunded || [];
          state.currentBill.data.refunded.push(action.payload.refundRecord);
        }
      })
      .addCase(processRadiologyRefund.rejected, (state, action) => {
        state.radiologyRefund.status = "failed";
        state.radiologyRefund.error = action.payload?.message || "Failed to process radiology refund";
      })
      // Fetch radiology bills
      .addCase(fetchRadiologyBills.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchRadiologyBills.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.bills = action.payload || [];
      })
      .addCase(fetchRadiologyBills.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to fetch radiology bills";
      })
      // Get radiology bill details
      .addCase(getRadiologyBillDetails.pending, (state) => {
        state.currentBill.status = "loading";
        state.currentBill.error = null;
      })
      .addCase(getRadiologyBillDetails.fulfilled, (state, action) => {
        state.currentBill.status = "succeeded";
        state.currentBill.data = action.payload;
      })
      .addCase(getRadiologyBillDetails.rejected, (state, action) => {
        state.currentBill.status = "failed";
        state.currentBill.error = action.payload?.message || "Failed to fetch radiology bill details";
      });
  },
});

export const {
  resetCurrentBill,
  resetRefundStatus,
  resetPaymentStatus,
  resetRadiologyRefundStatus,
  resetRadiologyPaymentStatus,
} = billingSlice.actions;

export default billingSlice.reducer;