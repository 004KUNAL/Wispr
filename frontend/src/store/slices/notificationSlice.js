import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchNotifications = createAsyncThunk('notifications/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/notifications');
    return data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const markAllRead = createAsyncThunk('notifications/markAllRead', async (_, { rejectWithValue }) => {
  try {
    await api.put('/notifications/read-all');
    return true;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: { notifications: [], unreadCount: 0, loading: false },
  reducers: {
    addLiveNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload.notifications;
        state.unreadCount = action.payload.unreadCount;
        state.loading = false;
      })
      .addCase(fetchNotifications.pending, (state) => { state.loading = true; })
      .addCase(markAllRead.fulfilled, (state) => {
        state.notifications = state.notifications.map(n => ({ ...n, isRead: true }));
        state.unreadCount = 0;
      });
  },
});

export const { addLiveNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
