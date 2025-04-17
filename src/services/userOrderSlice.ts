import { TOrder, TOrdersData } from '../utils/types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrdersApi } from '../utils/burger-api';

export interface userOrdersState {
  isLoading: boolean;
  orders: TOrder[];
  error: string | null;
}

export const initialState: userOrdersState = {
  isLoading: false,
  orders: [],
  error: null
};

export const fetchUserOrders = createAsyncThunk<TOrder[]>(
  'orders/getOrdersApi',
  async () => {
    const result = await getOrdersApi();
    return result;
  }
);

const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Не удалось загрузить заказы';
      });
  },
  selectors: {
    getUserOrders: (state) => state.orders,
    getIsLoading: (state) => state.isLoading
  }
});

export default userOrdersSlice.reducer;
export const { getUserOrders, getIsLoading } = userOrdersSlice.selectors;
