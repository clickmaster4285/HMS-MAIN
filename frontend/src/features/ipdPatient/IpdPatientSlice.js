import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const getAuthHeaders = () => {
  const jwtLoginToken = localStorage.getItem("jwtLoginToken");
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${jwtLoginToken}`
  };
};

// Thunks with enhanced error handling
export const admitPatient = createAsyncThunk(
  'ipdPatient/admitPatient',
  async (patientData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/admittedPatient/create-admitted-patient`,
        patientData,
        { headers: getAuthHeaders() }
      );
      return response.data.data;
    } catch (error) {
      let message = 'Failed to admit patient';

      if (error.response) {
        // The server responded with a status code outside 2xx
        const status = error.response.status;

        if (status === 400) {
          message = error.response.data.message || 'Invalid request data';
        } else if (status === 404) {
          message = error.response.data.message || 'Patient or ward not found';
        } else if (status === 409) {
          message = error.response.data.message || 'Patient already admitted';
        }
      } else if (error.request) {
        // The request was made but no response received
        message = 'No response from server. Please check your connection.';
      }

      return rejectWithValue({
        message,
        statusCode: error.response?.status,
        validationErrors: error.response?.data?.errors
      });
    }
  }
);

export const getAllAdmittedPatients = createAsyncThunk(
  'ipdPatient/getAllAdmittedPatients',
  async (params = {}, { rejectWithValue }) => {
    try {
      const {
        page = 1,
        limit = 20,
        ward_Type,
        search,
        ward_id,
        admission_Type,
        status // ADD THIS PARAMETER
      } = params;

      const response = await axios.get(
        `${API_URL}/admittedPatient/get-admitted-patients`,
        {
          params: {
            page,
            limit,
            ward_Type,
            search,
            ward_id,
            admission_Type,
            status // ADD THIS PARAMETER
          },
          headers: getAuthHeaders()
        }
      );
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch admitted patients';
      return rejectWithValue({ message });
    }
  }
);

export const getIpdPatientByMrno = createAsyncThunk(
  'ipdPatient/getIpdPatientByMrno',
  async (mrno, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/admittedPatient/get-admitted-patient-by-mrno/${mrno}`,
        { headers: getAuthHeaders() }
      );
      return response.data.information.patient;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to fetch patient by MRNO',
        status: error.response?.status
      });
    }
  }
);

export const updatePatientAdmission = createAsyncThunk(
  'ipdPatient/updatePatientAdmission',
  async ({ mrNo, admissionData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/admittedPatient/update-admission/${mrNo}`,
        admissionData,
        { headers: getAuthHeaders() }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to update admission",
        validationErrors: error.response?.data?.errors
      });
    }
  }
);

export const dischargePatient = createAsyncThunk(
  'ipdPatient/dischargePatient',
  async (dischargeData, { rejectWithValue }) => {
    try {
      const { id, ...rest } = dischargeData;
      // Use the correct endpoint
      const url = id
        ? `${API_URL}/admittedPatient/discharge-patient/${id}`
        : `${API_URL}/admittedPatient/discharge-patient`;

      const response = await axios.post(
        url,
        rest,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to discharge patient",
        status: error.response?.status
      });
    }
  }
);

export const deleteAdmission = createAsyncThunk(
  'ipdPatient/deleteAdmission',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_URL}/admittedPatient/delete-admission/${id}`,
        { headers: getAuthHeaders() }
      );
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to delete admission",
        status: error.response?.status
      });
    }
  }
);

const initialState = {
  admissionData: null,
  // currentAdmission: null,
  patientsList: [],
  currentPatient: null,
  dischargedPatients: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 20
  },
  isSuccess: false,
  isLoading: false,
  isError: false,
  error: null,
  status: {
    admit: 'idle',
    fetch: 'idle',
    search: 'idle',
    delete: 'idle',
    discharge: 'idle',
    update: 'idle',
    // getAdmission: 'idle',
  },
  filters: {
    ward_Type: '',
    search: '',
    ward_id: '',
    admission_Type: ''
  }
};

const ipdPatientSlice = createSlice({
  name: 'ipdPatient',
  initialState,
  reducers: {
    resetAdmissionState: (state) => {
      state.admissionData = null;
      state.isError = false;
      state.error = null;
      state.status.admit = 'idle';
    },
    resetPatientState: (state) => {
      state.currentPatient = null;
      state.isError = false;
      state.error = null;
    },
    resetOperationStatus: (state, action) => {
      const operation = action.payload;
      if (state.status[operation]) {
        state.status[operation] = 'idle';
      }
      state.isError = false;
      state.error = null;
    },
    clearCurrentPatient: (state) => {
      state.currentPatient = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    }
  },
  extraReducers: (builder) => {
    builder
      // Admit Patient
      .addCase(admitPatient.pending, (state) => {
        state.status.admit = 'pending';
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(admitPatient.fulfilled, (state, action) => {
        state.status.admit = 'succeeded';
        state.isSuccess = true;
        state.isLoading = false;
        state.admissionData = action.payload;
        state.patientsList.unshift(action.payload);
      })
      // In extraReducers, add proper state cleaning for each rejection
      .addCase(admitPatient.rejected, (state, action) => {
        state.status.admit = 'failed';
        state.isSuccess = false;
        state.isLoading = false;
        state.isError = true;
        state.error = {
          message: action.payload?.message || 'Admission failed',
          statusCode: action.payload?.statusCode,
          validationErrors: action.payload?.validationErrors
        };
        // Clear previous admission data on failure
        state.admissionData = null;
      })

      // Get All Admitted Patients
      .addCase(getAllAdmittedPatients.pending, (state) => {
        state.status.fetch = 'pending';
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(getAllAdmittedPatients.fulfilled, (state, action) => {
        state.status.fetch = 'succeeded';
        state.isLoading = false;
        state.patientsList = action.payload.data || [];
        state.pagination = {
          currentPage: action.payload.page || 1,
          totalPages: action.payload.pages || 1,
          totalItems: action.payload.total || 0,
          limit: action.payload.limit || 20
        };
      })
      .addCase(getAllAdmittedPatients.rejected, (state, action) => {
        state.status.fetch = 'failed';
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload?.message || 'Failed to fetch patients';
      })

      // Get Patient by MRNO
      .addCase(getIpdPatientByMrno.pending, (state) => {
        state.status.search = 'pending';
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(getIpdPatientByMrno.fulfilled, (state, action) => {
        state.status.search = 'succeeded';
        state.isLoading = false;
        state.currentPatient = action.payload;
      })
      .addCase(getIpdPatientByMrno.rejected, (state, action) => {
        state.status.search = 'failed';
        state.isLoading = false;
        state.isError = true;
        state.error = {
          message: action.payload?.message || 'Patient not found',
          status: action.payload?.status
        };
      })

      // Update Admission
      .addCase(updatePatientAdmission.pending, (state) => {
        state.status.update = 'pending';
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(updatePatientAdmission.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.status.update = 'succeeded';
        state.isLoading = false;
        state.patientsList = state.patientsList.map(patient =>
          patient._id === action.payload._id ? action.payload : patient
        );
        if (state.currentPatient?._id === action.payload._id) {
          state.currentPatient = action.payload;
        }
      })
      .addCase(updatePatientAdmission.rejected, (state, action) => {
        state.status.update = 'failed';
        state.isSuccess = false;
        state.isLoading = false;
        state.isError = true;
        state.error = {
          message: action.payload?.message || 'Update failed',
          validationErrors: action.payload?.validationErrors
        };
      })

      // Discharge Patient
      .addCase(dischargePatient.pending, (state) => {
        state.status.discharge = 'pending';
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(dischargePatient.fulfilled, (state, action) => {
        state.status.discharge = 'succeeded';
        state.isLoading = false;
        // Remove from admitted patients list
        state.patientsList = state.patientsList.filter(
          patient => patient._id !== action.payload.data?._id
        );
        // Add to discharged patients list if we have the full record
        if (action.payload.data) {
          state.dischargedPatients.push(action.payload.data);
        }
        // Clear current patient if it's the discharged one
        if (state.currentPatient?._id === action.payload.data?._id) {
          state.currentPatient = null;
        }
      })
      .addCase(dischargePatient.rejected, (state, action) => {
        state.status.discharge = 'failed';
        state.isLoading = false;
        state.isError = true;
        state.error = {
          message: action.payload?.message || 'Discharge failed',
          status: action.payload?.status
        };
      })

      // Delete Admission
      .addCase(deleteAdmission.pending, (state) => {
        state.status.delete = 'pending';
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(deleteAdmission.fulfilled, (state, action) => {
        state.status.delete = 'succeeded';
        state.isLoading = false;
        state.patientsList = state.patientsList.filter(
          patient => patient._id !== action.payload.id
        );
      })
      .addCase(deleteAdmission.rejected, (state, action) => {
        state.status.delete = 'failed';
        state.isLoading = false;
        state.isError = true;
        state.error = {
          message: action.payload?.message || 'Deletion failed',
          status: action.payload?.status
        };
      });
  }
});

// Selectors
export const selectAllAdmittedPatients = (state) => state.ipdPatient.patientsList;
export const selectCurrentIpdPatient = (state) => state.ipdPatient.currentPatient;
export const selectCurrentAdmission = (state) => state.ipdPatient.currentPatient;
export const selectGetAdmissionStatus = (state) => state.ipdPatient.status.search;
export const selectAdmissionStatus = (state) => state.ipdPatient.status.admit;
export const selectFetchStatus = (state) => state.ipdPatient.status.fetch;
export const selectDischargeStatus = (state) => state.ipdPatient.status.discharge;
export const selectUpdateStatus = (state) => state.ipdPatient.status.update;
export const selectDeleteStatus = (state) => state.ipdPatient.status.delete;
export const selectIpdPagination = (state) => state.ipdPatient.pagination;
export const selectIpdFilters = (state) => state.ipdPatient.filters;
export const selectIpdError = (state) => state.ipdPatient.error;

// Actions
export const {
  resetAdmissionState,
  resetPatientState,
  resetOperationStatus,
  clearCurrentPatient,
  setFilters,
  resetFilters
} = ipdPatientSlice.actions;

export default ipdPatientSlice.reducer;