import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import { ICreditCard } from "../../../shared/types";

export const fetchCards = createAsyncThunk("cards/fetchCards", async () => {
  const response = await api.get("/cards");
  return response.data;
});

export const fetchCard = createAsyncThunk(
  "cards/fetchCard",
  async (cardId: string) => {
    const response = await api.get(`/cards/${cardId}`);
    return response.data;
  }
);

export const compareCards = createAsyncThunk(
  "cards/compareCards",
  async ({ card1, card2 }: { card1: string; card2: string }) => {
    const response = await api.get(
      `/cards/compare?card1=${card1}&card2=${card2}`
    );
    return response.data;
  }
);

const cardSlice = createSlice({
  name: "cards",
  initialState: {
    cards: [] as ICreditCard[],
    card: null as ICreditCard | null,
    comparison: null as any,
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCards.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCards.fulfilled, (state, action) => {
        state.loading = false;
        state.cards = action.payload;
      })
      .addCase(fetchCards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch cards";
      })
      .addCase(fetchCard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCard.fulfilled, (state, action) => {
        state.loading = false;
        state.card = action.payload;
      })
      .addCase(fetchCard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch card";
      })
      .addCase(compareCards.pending, (state) => {
        state.loading = true;
      })
      .addCase(compareCards.fulfilled, (state, action) => {
        state.loading = false;
        state.comparison = action.payload;
      })
      .addCase(compareCards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to compare cards";
      });
  },
});

export default cardSlice.reducer;
