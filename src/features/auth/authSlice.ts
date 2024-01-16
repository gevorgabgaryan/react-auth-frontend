import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { register } from '../../services/authService';
import { RootState } from '../../store';

interface AuthState {
  user: any;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
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

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload.message || 'An error occurred.';
      });
  },
});

export { registerUser };

export default authSlice.reducer;

export const selectUser = (state: RootState) => state.auth.user;
export const selectLoading = (state: RootState) => state.auth.loading;
export const selectError = (state: RootState) => state.auth.error;
