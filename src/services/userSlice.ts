import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  forgotPasswordApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  resetPasswordApi,
  TLoginData,
  TRegisterData,
  TResetPasswordData,
  updateUserApi
} from '@api';
import { deleteCookie, setCookie } from '../utils/cookie';
import { TUser } from '../utils/types';

export const loginUserThunk = createAsyncThunk(
  'user/loginUserApi',
  async ({ email, password }: TLoginData, { rejectWithValue }) => {
    const data = await loginUserApi({ email, password });
    if (!data?.success) {
      return rejectWithValue(data);
    }
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  }
);

export const getUserThunk = createAsyncThunk('user/getUserApi', () =>
  getUserApi()
);

export const registerUserThunk = createAsyncThunk(
  'user/registerUserApi',
  async ({ name, email, password }: TRegisterData, { rejectWithValue }) => {
    const data = await registerUserApi({ name, email, password });
    if (!data?.success) {
      return rejectWithValue(data);
    }
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  }
);

export const logoutUserThunk = createAsyncThunk(
  'user/logoutApi',
  async (_, { rejectWithValue }) => {
    const data = await logoutApi();
    if (!data?.success) {
      return rejectWithValue(data);
    }
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
    return data;
  }
);

export const forgotPasswordThunk = createAsyncThunk(
  'user/forgotPasswordApi',
  async ({ email }: TLoginData, { rejectWithValue }) => {
    const data = await forgotPasswordApi({ email });
    if (!data?.success) {
      return rejectWithValue(data);
    }
    return data;
  }
);

export const resetPasswordThunk = createAsyncThunk(
  'user/resetPasswordApi',
  async ({ password, token }: TResetPasswordData, { rejectWithValue }) => {
    const data = await resetPasswordApi({ password, token });
    if (!data?.success) {
      return rejectWithValue(data);
    }
    return data;
  }
);

export const updateUserThunk = createAsyncThunk(
  'user/updateUserApi',
  async (user: TRegisterData, { rejectWithValue }) => {
    const data = await updateUserApi(user);
    if (!data?.success) {
      return rejectWithValue(data);
    }
    return data.user;
  }
);

export interface UserState {
  isInit: boolean;
  isLoading: boolean;
  user: TUser | null;
  loginError: string | undefined;
  registrationError: string | undefined;
}

export const initialState: UserState = {
  isInit: false,
  isLoading: false,
  user: null,
  loginError: undefined,
  registrationError: undefined
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    init: (state) => {
      state.isInit = true;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loginUserThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(loginUserThunk.rejected, (state, { error }) => {
      state.isLoading = false;
      if (error.message) {
        state.loginError = error.message;
      }
    });
    builder.addCase(loginUserThunk.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.user = payload;
      state.loginError = undefined;
    });

    builder.addCase(getUserThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getUserThunk.rejected, (state, { error }) => {
      state.isInit = true;
      state.isLoading = false;
      if (error.message) {
        state.loginError = error.message;
      }
    });
    builder.addCase(getUserThunk.fulfilled, (state, { payload }) => {
      state.isInit = true;
      state.isLoading = false;
      state.user = payload.user;
      state.loginError = undefined;
    });

    builder.addCase(registerUserThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(registerUserThunk.rejected, (state, { error }) => {
      state.isLoading = false;
      if (error.message) {
        state.registrationError = error.message;
      }
    });
    builder.addCase(registerUserThunk.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.user = payload;
      state.registrationError = undefined;
    });
    builder.addCase(logoutUserThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(logoutUserThunk.rejected, (state, { error }) => {
      state.isLoading = false;
      if (error.message) {
        state.loginError = error.message;
      }
    });
    builder.addCase(logoutUserThunk.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.user = null;
      state.loginError = undefined;
    });
    builder.addCase(forgotPasswordThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(forgotPasswordThunk.rejected, (state, { error }) => {
      state.isLoading = false;
      if (error.message) {
        state.loginError = error.message;
      }
    });
    builder.addCase(forgotPasswordThunk.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.loginError = undefined;
    });
    builder.addCase(resetPasswordThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(resetPasswordThunk.rejected, (state, { error }) => {
      state.isLoading = false;
      if (error.message) {
        state.loginError = error.message;
      }
    });
    builder.addCase(resetPasswordThunk.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.loginError = undefined;
    });
    builder.addCase(updateUserThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateUserThunk.rejected, (state, { error }) => {
      state.isInit = true;
      state.isLoading = false;
      if (error.message) {
        state.loginError = error.message;
      }
    });
    builder.addCase(updateUserThunk.fulfilled, (state, { payload }) => {
      state.isInit = true;
      state.isLoading = false;
      state.user = payload;
      state.loginError = undefined;
    });
  },
  selectors: {
    selectUserState: (state) => state
  }
});

export const { init } = userSlice.actions;

export const { selectUserState } = userSlice.selectors;

export default userSlice.reducer;
