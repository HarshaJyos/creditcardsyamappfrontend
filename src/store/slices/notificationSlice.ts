import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import { INotification } from "../../../shared/types";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (userId: string) => {
    const response = await api.get(`/notifications/${userId}`);
    return response.data;
  }
);

export const markRead = createAsyncThunk(
  "notifications/markRead",
  async (notificationId: string) => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [] as INotification[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch notifications";
      })
      .addCase(markRead.pending, (state) => {
        state.loading = true;
      })
      .addCase(markRead.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.notifications.findIndex(
          (n) => n._id === action.payload._id
        );
        if (index !== -1) state.notifications[index] = action.payload;
      })
      .addCase(markRead.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to mark notification as read";
      });
  },
});

export default notificationSlice.reducer;
