import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from '../slices/ingredientsSlice';
import authReducer from '../slices/authSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  auth: authReducer
});

export type RootState = ReturnType<typeof rootReducer>;
