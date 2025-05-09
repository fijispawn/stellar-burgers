import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';

interface FeedState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
}

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null
};

export const feedThunk = createAsyncThunk('feed/getFeeds', async () => {
  try {
    const response = await getFeedsApi();
    return response;
  } catch (error) {
    console.error('Error fetching feeds:', error);
    throw error;
  }
});

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(feedThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(feedThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(feedThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Произошла ошибка';
      });
  }
});

export const selectOrders = (state: { feed: FeedState }) => state.feed.orders;
export const selectTotal = (state: { feed: FeedState }) => state.feed.total;
export const selectTotalToday = (state: { feed: FeedState }) =>
  state.feed.totalToday;
export const selectLoading = (state: { feed: FeedState }) => state.feed.loading;
export const selectError = (state: { feed: FeedState }) => state.feed.error;

export default feedSlice.reducer;
