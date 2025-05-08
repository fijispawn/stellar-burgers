import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from '../slices/ingredientsSlice';
import authReducer from '../slices/authSlice';
import feedReducer from '../slices/feedSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  auth: authReducer,
  feed: feedReducer
});

export type RootState = ReturnType<typeof rootReducer>;
