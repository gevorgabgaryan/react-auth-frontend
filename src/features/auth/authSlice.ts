import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login, register } from '../../services/authService';
import { RootState } from '../../store';
import { AuthState, ILoginInput } from '../../types';

const initialState: AuthState = {
  isLogin: false,
  loading: false,
  error: null,
  validatingToken: true,
};

const registerUser = createAsyncThunk('auth/registerUser', async (data: FormData, { rejectWithValue }) => {
  try {
    const userData = await register(data);
    return userData;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.details) {
      return rejectWithValue(error.response.data.details);
    }
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue(error.message);
  }
});

const loginUser = createAsyncThunk('auth/loginUser', async (data: ILoginInput, { rejectWithValue }) => {
  try {
    const loginData = await login(data);
    const { token } = loginData;
    localStorage.setItem('token', token);
    return loginData;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.details) {
      return rejectWithValue(error.response.data.details);
    }
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue(error.message);
  }
});

const validateToken = createAsyncThunk('auth/validateToken', async (_, { dispatch }) => {
  const token = localStorage.getItem('token');
  if (token) {
    return { isLogin: true };
  } else {
    dispatch(logout());
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.isLogin = false;
      state.error = null;
      state.loading = false;
    },
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload.message || 'An error occurred.';
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.loading = false;
        state.isLogin = true;
      })
      .addCase(loginUser.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload.message || 'An error occurred.';
      })
      .addCase(validateToken.fulfilled, (state, action: any) => {
        state.isLogin = action.payload?.isLogin;
        state.validatingToken = false;
      })
      .addCase(validateToken.rejected, (state) => {
        state.isLogin = false;
        state.validatingToken = false;
      });
  },
});

export { registerUser, loginUser, validateToken };
export const { logout } = authSlice.actions;

export default authSlice.reducer;

export const selectLoading = (state: RootState) => state.auth.loading;
export const selectError = (state: RootState) => state.auth.error;
export const { resetError } = authSlice.actions;
