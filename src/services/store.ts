import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import ingredientsSliceReducer from './ingredientsSlice';
import burgerConstructorSliceReducer from './burgerConstructorSlice';
import ordersSliceReducer from './ordersSlice';
import userOrderSliceReducer from './userOrderSlice';
import userSliceReducer from './userSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsSliceReducer,
  burgerConstructor: burgerConstructorSliceReducer,
  orders: ordersSliceReducer,
  userOrders: userOrderSliceReducer,
  user: userSliceReducer
});
const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
