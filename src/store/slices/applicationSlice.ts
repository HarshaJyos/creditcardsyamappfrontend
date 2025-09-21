import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import { IApplication } from "../../../shared/types";

export const fetchApplications = createAsyncThunk(
  "applications/fetchApplications",
  async (userId: string) => {
    const response = await api.get(`/applications/${userId}`);
    return response.data;
  }
);

export const applyForCard = createAsyncThunk(
  "applications/applyForCard",
  async ({ userId, cardId }: { userId: string; cardId: string }) => {
    const response = await api.post("/applications", { userId, cardId });
    return response.data;
  }
);

const applicationSlice = createSlice({
  name: "applications",
  initialState: {
    applications: [] as IApplication[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch applications";
      })
      .addCase(applyForCard.pending, (state) => {
        state.loading = true;
      })
      .addCase(applyForCard.fulfilled, (state, action) => {
        state.loading = false;
        state.applications.push(action.payload);
      })
      .addCase(applyForCard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to apply for card";
      });
  },
});

export default applicationSlice.reducer;
