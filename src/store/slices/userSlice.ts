import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import { ICustomer, ISurvey } from "../../../shared/types";

// Removed unused fetchUser

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ userId, data }: { userId: string; data: Partial<ICustomer> }) => {
    const response = await api.put(`/users/${userId}`, data);
    return response.data;
  }
);

export const submitSurvey = createAsyncThunk(
  "user/submitSurvey",
  async ({ userId, survey }: { userId: string; survey: ISurvey }) => {
    const response = await api.put(`/users/${userId}`, { survey });
    return response.data;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null as ICustomer | null,
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update user";
      })
      .addCase(submitSurvey.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitSurvey.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(submitSurvey.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to submit survey";
      });
  },
});

export default userSlice.reducer;
