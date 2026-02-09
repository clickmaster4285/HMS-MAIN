import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const getAuthHeaders = () => {
    const jwtLoginToken = localStorage.getItem('jwtLoginToken');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtLoginToken}`
    };
};

// Create Operation
export const createOperation = createAsyncThunk(
    'ot/createOperation',
    async (operationData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/ot/create`, operationData, {
                headers: getAuthHeaders()
            });
            return response.data.information; // Fixed: Access the operation data correctly
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Fetch All Operations
export const fetchAllOperations = createAsyncThunk(
    'ot/fetchAllOperations',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/ot/get-all`, {
                headers: getAuthHeaders()
            });

            return response.data.operationsList || []; // Fixed: Handle array response
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Fetch Operation by MRNo
export const fetchOperationByMRNo = createAsyncThunk(
    'ot/fetchOperationByMRNo',
    async (mrNo, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/ot/get-mrno/${mrNo}`, {
                headers: getAuthHeaders()
            });
            return response.data.operation; // Fixed: Match backend response structure
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Update Operation by MRNo
export const updateOperation = createAsyncThunk(
    'ot/updateOperation',
    async ({ mrno, operationData }, { rejectWithValue }) => { // Changed id to mrno
        try {
            const response = await axios.put(`${API_URL}/ot/update/${mrno}`, operationData, {
                headers: getAuthHeaders()
            });
            return response.data.operation; // Fixed: Match backend response
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Delete Operation by MRNo
export const deleteOperation = createAsyncThunk(
    'ot/deleteOperation',
    async (mrno, { rejectWithValue }) => { // Changed id to mrno
        try {
            await axios.delete(`${API_URL}/ot/delete/${mrno}`, {
                headers: getAuthHeaders()
            });
            return mrno; // Return MRNo for filtering
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const initialState = {
    operations: [],
    currentOperation: null,
    isLoading: false,
    isError: false,
    error: null,
    success: false
};

const otSlice = createSlice({
    name: "ot",
    initialState,
    reducers: {
        resetOperation: (state) => {
            state.currentOperation = null;
            state.success = false;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
            state.isError = false;
        },
        setOperation: (state, action) => {
            state.currentOperation = action.payload;
        },
        reorderOperations: (state, action) => {
            state.operations = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Create Operation
            .addCase(createOperation.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.error = null;
                state.success = false;
            })
            .addCase(createOperation.fulfilled, (state, action) => {
                state.isLoading = false;
                state.success = true;
                state.operations.push(action.payload);
                state.currentOperation = action.payload;
            })
            .addCase(createOperation.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.error = action.payload;
                state.success = false;
            })

            // Fetch All Operations
            .addCase(fetchAllOperations.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(fetchAllOperations.fulfilled, (state, action) => {
                state.isLoading = false;
                state.operations = action.payload;
            })
            .addCase(fetchAllOperations.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.error = action.payload;
            })

            // Fetch Operation by MRNo
            .addCase(fetchOperationByMRNo.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(fetchOperationByMRNo.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentOperation = action.payload;
            })
            .addCase(fetchOperationByMRNo.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.error = action.payload;
            })

            // Update Operation
            .addCase(updateOperation.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(updateOperation.fulfilled, (state, action) => {
                state.isLoading = false;
                state.success = true;
                state.currentOperation = action.payload;
                state.operations = state.operations.map(op =>
                    op.patient_MRNo === action.payload.patient_MRNo ? action.payload : op
                );
            })
            .addCase(updateOperation.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.error = `Failed to update operation (MRN: ${action.meta.arg.mrno}): ${action.payload}`;
            })

            // Delete Operation
            .addCase(deleteOperation.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(deleteOperation.fulfilled, (state, action) => {
                state.isLoading = false;
                state.success = true;
                state.operations = state.operations.filter(op => op.patient_MRNo !== action.payload);
                if (state.currentOperation?.patient_MRNo === action.payload) {
                    state.currentOperation = null;
                }
            })
            .addCase(deleteOperation.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.error = action.payload;
            });
    }
});

export const { resetOperation, clearError, setOperation } = otSlice.actions;

// Selectors
export const selectCurrentOperation = (state) => state.ot.currentOperation;
export const selectAllOperations = (state) => state.ot.operations;
export const selectOTLoading = (state) => state.ot.isLoading;
export const selectOTError = (state) => state.ot.error;
export const selectOTSuccess = (state) => state.ot.success;

export default otSlice.reducer;