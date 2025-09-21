import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import { ICreditCard } from "../../../shared/types";

export const fetchRecommendations = createAsyncThunk(
  "recommendations/fetchRecommendations",
  async (userId: string) => {
    const response = await api.get(`/recommendations/${userId}`);
    return response.data;
  }
);

const recommendationSlice = createSlice({
  name: "recommendations",
  initialState: {
    recommendations: null as { recommendedCards: ICreditCard[] } | null,
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommendations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendations = action.payload;
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch recommendations";
      });
  },
});

export default recommendationSlice.reducer;
