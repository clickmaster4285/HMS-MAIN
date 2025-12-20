import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const getAuthHeaders = () => {
  const jwtLoginToken = localStorage.getItem("jwtLoginToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwtLoginToken}`,
  };
};

export const updatePatientTestResults = createAsyncThunk(
  "patientTest/updatePatientTestResults",
  async ({ patientTestId, testId, updateData }, { rejectWithValue }) => {
    try {
      const formattedTestId = Array.isArray(testId) ? testId.join(",") : testId;
      // testId = formattedTestId
      const response = await axios.patch(
        `${API_URL}/testResult/${patientTestId}/tests/${formattedTestId}/results`,
        updateData,
        { headers: getAuthHeaders() }
      );

      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update test results";
      return rejectWithValue({
        message,
        statusCode: error.response?.status || 500,
      });
    }
  }
);

export const getSummaryByDate = createAsyncThunk(
  "patientTest/getSummaryByDate",
  async (dateRange, { rejectWithValue }) => {
    try {
      const startDate = dateRange.startDate || dateRange.date?.startDate;
      let endDate = dateRange.endDate || dateRange.date?.endDate;

      if (!startDate) {
        throw new Error("Start date is required");
      }

      // If only startDate, use it as endDate too
      if (!endDate) {
        endDate = startDate;
      }

      const response = await axios.get(
        `${API_URL}/testResult/get-patient-summery-by-date?startDate=${startDate}&endDate=${endDate}`,
        { headers: getAuthHeaders() }
      );

      return response.data.data;
    } catch (error) {
      // error handling
    }
  }
);



// 🔧 Initial State
const initialState = {
  patient: null,
  allPatientTests: [],
  summaryByDate: [],

  status: {
    submit: "idle",
    fetch: "idle",
    fetchAll: "idle",
    fetchById: "idle",
    update: "idle",
    summary: "idle",
  },
  patientTestById: null,
  isLoading: false,
  isError: false,
  error: null,
};

// 🧠 Slice
const testResultSlice = createSlice({
  name: "patientTest",
  initialState,
  reducers: {
    resetPatientTestStatus: (state) => {
      state.status.submit = "idle";
      state.status.fetch = "idle";
      state.isError = false;
      state.error = null;
      state.patient = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updatePatientTestResults.pending, (state) => {
        state.status.update = "pending";
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(updatePatientTestResults.fulfilled, (state, action) => {
        state.status.update = "succeeded";
        state.isLoading = false;

        // Update the specific test in allPatientTests
        state.allPatientTests = state.allPatientTests.map((patientTest) => {
          if (patientTest._id === action.payload.testResultId) {
            return {
              ...patientTest,
              selectedTests: patientTest.selectedTests.map((test) => {
                if (test._id === action.payload.testId) {
                  return {
                    ...test,
                    testDetails: {
                      ...test.testDetails,
                      reportStatus: action.payload.status,
                      results: action.payload.results,
                    },
                    performedBy: action.payload.performedBy,
                  };
                }
                return test;
              }),
            };
          }
          return patientTest;
        });
      })
      .addCase(updatePatientTestResults.rejected, (state, action) => {
        state.status.update = "failed";
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload.message || "Failed to update test results";
      })
      .addCase(getSummaryByDate.pending, (state) => {
        state.status.summary = "pending";
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(getSummaryByDate.fulfilled, (state, action) => {
        state.status.summary = "succeeded";
        state.isLoading = false;
        state.summaryByDate = action.payload; // all filtered tests
      })
      .addCase(getSummaryByDate.rejected, (state, action) => {
        state.status.summary = "failed";
        state.isLoading = false;
        state.isError = true;
        state.error =
          action.payload.message || "Failed to fetch summary by date";
      })
  },
});

export const { resetPatientTestStatus } = testResultSlice.actions;
export default testResultSlice.reducer;
