import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { RootState } from '../store';
import { orderBurgerApi, getOrderByNumberApi } from '../../utils/burger-api';
import { clearConstructor } from './constructorSlice';

interface OrderState {
  order: TOrder[];
  orderModalData: TOrder | null;
  orderRequest: boolean;
  orderModalDataRequest: boolean;
  orderModalDataFailed: boolean;
  number: number | null;
  error: string | null;
}

const initialState: OrderState = {
  order: [],
  orderModalData: null,
  orderRequest: false,
  orderModalDataRequest: false,
  orderModalDataFailed: false,
  number: null,
  error: null
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredients: string[], { dispatch }) => {
    const response = await orderBurgerApi(ingredients);
    dispatch(clearConstructor());
    return response.order;
  }
);

export const fetchOrder = createAsyncThunk(
  'order/fetchOrder',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response.orders[0];
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    closeOrderModalData: (state) => {
      state.orderModalData = null;
      state.number = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
        state.number = action.payload.number;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Произошла ошибка';
      })
      .addCase(fetchOrder.pending, (state) => {
        state.orderModalDataRequest = true;
        state.error = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.orderModalDataRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.orderModalDataRequest = false;
        state.orderModalDataFailed = true;
        state.error = action.error.message || 'Произошла ошибка';
      });
  }
});

export const { closeOrderModalData } = orderSlice.actions;

export const selectOrderRequest = (state: RootState) =>
  state.order.orderRequest;
export const selectOrderModalData = (state: RootState) =>
  state.order.orderModalData;
export const selectOrderModalDataRequest = (state: RootState) =>
  state.order.orderModalDataRequest;
export const selectOrderModalDataFailed = (state: RootState) =>
  state.order.orderModalDataFailed;
export const selectOrderNumber = (state: RootState) => state.order.number;
export const selectOrderError = (state: RootState) => state.order.error;

export const selectOrderByNumber = (number: string) => (state: RootState) => {
  if (state.order.order?.length) {
    const data = state.order.order.find(
      (order: TOrder) => order.number === Number(number)
    );
    if (data) return data;
  }

  if (state.feed.orders?.length) {
    const data = state.feed.orders.find(
      (order: TOrder) => order.number === Number(number)
    );
    if (data) return data;
  }

  if (state.order.orderModalData?.number) {
    return state.order.orderModalData;
  }

  return null;
};

export const selectOrders = (state: RootState): TOrder[] => state.order.order;

export default orderSlice.reducer;
