// features/auth/authSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, identifier, password }, { rejectWithValue }) => {
    try {
      // Use either email or identifier based on what was provided
      const loginData = {
        user_Password: password,
      };

      // Add either email or identifier to the request
      if (email && email.includes('@')) {
        loginData.user_Email = email;
      } else {
        loginData.user_Identifier = identifier || email;
      }

      const response = await axios.post(`${API_URL}/user/log-in`, loginData);

      const { jwtLoginToken, user } = response.data.information;
      const decodedToken = jwtDecode(jwtLoginToken);

      return {
        token: jwtLoginToken,
        user,
        exp: decodedToken.exp,
      };
    } catch (error) {
      // Return the complete error response to preserve status codes
      return rejectWithValue({
        message: error.response?.data?.message || 'Login failed',
        status: error.response?.status,
        errorType: error.response?.data?.errorType,
        // Include the full response if needed
        ...error.response?.data
      });
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // You might want to call a logout API here if needed
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('jwtLoginToken') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    status: 'idle',
    error: null,
  },
  reducers: {
    initializeAuth(state) {
      state.token = localStorage.getItem('jwtLoginToken') || null;
      state.user = JSON.parse(localStorage.getItem('user')) || null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;

        // Store in localStorage
        localStorage.setItem('jwtLoginToken', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload; // Now this contains the full error object
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        state.status = 'idle';
        state.error = null;

        // Clear localStorage
        localStorage.removeItem('jwtLoginToken');
        localStorage.removeItem('user');
      });
  },
});

export const { initializeAuth, clearError } = authSlice.actions;
export const selectCurrentToken = (state) => state.auth.token;
export const selectCurrentUser = (state) => state.auth.user;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;