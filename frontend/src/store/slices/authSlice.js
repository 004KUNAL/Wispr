import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', credentials);
    localStorage.setItem('wispr_token', data.token);
    return data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Login failed'); }
});

export const registerUser = createAsyncThunk('auth/register', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/register', credentials);
    localStorage.setItem('wispr_token', data.token);
    return data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Registration failed'); }
});

export const guestLogin = createAsyncThunk('auth/guest', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/guest');
    localStorage.setItem('wispr_token', data.token);
    return data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Guest login failed'); }
});

export const fetchMe = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/auth/me');
    return data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const createIdentity = createAsyncThunk('auth/createIdentity', async (identityData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/identity', identityData);
    return data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const switchIdentity = createAsyncThunk('auth/switchIdentity', async (identityId, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/auth/identity/${identityId}/switch`);
    return data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { 
    user: null, 
    token: localStorage.getItem('wispr_token'), 
    isAuthenticated: !!localStorage.getItem('wispr_token'),
    loading: false, 
    error: null, 
    initialized: false 
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.initialized = true;
      localStorage.removeItem('wispr_token');
    },
    clearError: (state) => { state.error = null; },
    updateSettings: (state, action) => {
      if (state.user) state.user.settings = { ...state.user.settings, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => { state.loading = true; state.error = null; };
    const handleFulfilled = (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token || state.token;
      state.isAuthenticated = true;
      state.initialized = true;
    };
    const handleRejected = (state, action) => { state.loading = false; state.error = action.payload; state.isAuthenticated = false; state.initialized = true; };

    builder
      .addCase(loginUser.pending, handlePending).addCase(loginUser.fulfilled, handleFulfilled).addCase(loginUser.rejected, handleRejected)
      .addCase(registerUser.pending, handlePending).addCase(registerUser.fulfilled, handleFulfilled).addCase(registerUser.rejected, handleRejected)
      .addCase(guestLogin.pending, handlePending).addCase(guestLogin.fulfilled, handleFulfilled).addCase(guestLogin.rejected, handleRejected)
      .addCase(fetchMe.pending, handlePending)
      .addCase(fetchMe.fulfilled, (state, action) => { state.loading = false; state.user = action.payload.user; state.isAuthenticated = true; state.initialized = true; })
      .addCase(fetchMe.rejected, (state) => { state.loading = false; state.isAuthenticated = false; state.token = null; state.initialized = true; })
      .addCase(createIdentity.fulfilled, (state, action) => {
        if (state.user) state.user.identities.push(action.payload.identity);
      })
      .addCase(switchIdentity.fulfilled, (state, action) => {
        if (state.user) state.user.activeIdentity = action.payload.identity;
      });
  },
});

export const { logout, clearError, updateSettings } = authSlice.actions;
export default authSlice.reducer;
