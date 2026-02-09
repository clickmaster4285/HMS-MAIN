import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const getAuthHeaders = () => {
    const jwtLoginToken = localStorage.getItem('jwtlogintoken');
    return {
        'Content-Type': 'application/json', // Corrected header
        'Authorization': `Bearer ${jwtLoginToken}` // Corrected header
    };
};

//updatedepartmentbyid//
export const updatedepartmentbyid = createAsyncThunk(
    'department/updatedepartmentbyid',
    async ({ id, updatedData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${API_URL}/departments/update-department/${id}`,
                updatedData,
                { headers: getAuthHeaders() }
            );
            return response.data;
            // Assuming your API returns this
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed to update department';
            return rejectWithValue({ message, statusCode: error.response?.status || 500 });
        }
    }
);


// Get all departments
export const getallDepartments = createAsyncThunk(
    'department/get-all-department',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${API_URL}/departments/get-departments`,
                { headers: getAuthHeaders() }
            );
            return response.data.departmentsList;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createDepartment = createAsyncThunk(
    'department/create-department',
    async (departmentData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_URL}/departments/create-department`,
                departmentData,
                { headers: getAuthHeaders() }
            );
            return response.data.departmentData; // Assuming response contains departmentData
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed to create department';
            return rejectWithValue({ message, statusCode: error.response?.status || 500 });
        }
    }
);

const initialState = {
    department: {
        name: null,
        description: null,
        location: null,
        status: null,
        servicesOffered: [],
    },
    departments: [], // Store the list of departments here
    error: null,
    loading: false
};

const departmentSlice = createSlice({
  name: 'department',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder

      // ================= CREATE DEPARTMENT =================
      .addCase(createDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDepartment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create department';
      })

      // ================= GET ALL DEPARTMENTS =================
      .addCase(getallDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getallDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = action.payload;
      })
      .addCase(getallDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch departments';
      })

      // ================= UPDATE DEPARTMENT =================
      .addCase(updatedepartmentbyid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatedepartmentbyid.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updatedepartmentbyid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update department';
      });
  }
});


export const { reset } = departmentSlice.actions;
export default departmentSlice.reducer;
