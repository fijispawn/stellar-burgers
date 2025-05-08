import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from '../slices/ingredientsSlice';
import authReducer from '../slices/authSlice';
import feedReducer from '../slices/feedSlice';
import constructorReducer from '../slices/constructorSlice';
import orderReducer from '../slices/orderSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  auth: authReducer,
  feed: feedReducer,
  constructor: constructorReducer,
  order: orderReducer
});

export type RootState = ReturnType<typeof rootReducer>;
