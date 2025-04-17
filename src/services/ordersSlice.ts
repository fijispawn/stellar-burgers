import { TOrder, TOrdersData } from '../utils/types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFeedsApi, getOrderByNumberApi } from '../utils/burger-api';

export interface OrdersState {
  isFeedLoading: boolean;
  isShownLoading: boolean;
  feedOrders: TOrder[];
  shownOrders: TOrder[];
  error: string | null;
  total: number | null;
  totalToday: number | null;
  orderStatus: string;
}

export const initialState: OrdersState = {
  isFeedLoading: false,
  isShownLoading: false,
  feedOrders: [],
  shownOrders: [],
  error: null,
  total: null,
  totalToday: null,
  orderStatus: ''
};

export const fetchOrders = createAsyncThunk<TOrdersData>(
  'orders/getFeedsApi',
  async () => {
    const result = await getFeedsApi();
    return result;
  }
);

export const getOrderByNumberThunk = createAsyncThunk(
  'orders/getOrderByNumberApi',
  async (number: number, { rejectWithValue }) => {
    const data = await getOrderByNumberApi(number);
    if (!data?.success) {
      return rejectWithValue(data);
    }
    return data.orders;
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isFeedLoading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isFeedLoading = false;
        state.feedOrders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isFeedLoading = false;
        state.error = action.error.message || 'Не удалось загрузить заказы';
      })
      .addCase(getOrderByNumberThunk.pending, (state) => {
        state.isShownLoading = true;
      })
      .addCase(getOrderByNumberThunk.fulfilled, (state, action) => {
        state.isShownLoading = false;
        state.shownOrders = action.payload;
        if (action.payload) {
          state.orderStatus = action.payload[0].status;
        }
        state.error = null;
      })
      .addCase(getOrderByNumberThunk.rejected, (state, action) => {
        state.isShownLoading = false;
        state.error = action.error.message || 'Не удалось загрузить заказ';
      });
  },
  selectors: {
    getFeedOrders: (state) => state.feedOrders,
    getShownOrders: (state) => state.shownOrders,
    getIsFeedLoading: (state) => state.isFeedLoading,
    getIsShownLoading: (state) => state.isShownLoading,
    getTotal: (state) => state.total,
    getTotalToday: (state) => state.totalToday,
    getOrderStatus: (state) => state.orderStatus
  }
});

export default ordersSlice.reducer;
export const {
  getFeedOrders,
  getShownOrders,
  getIsFeedLoading,
  getIsShownLoading,
  getTotal,
  getTotalToday,
  getOrderStatus
} = ordersSlice.selectors;
