import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'agent' | 'manager' | 'staff';
  branch: string;
  avatar?: string;
  phone?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  permissions: string[];
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  permissions: [],
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data
    const mockUser: User = {
      id: '1',
      name: 'Rajesh Kumar',
      email: credentials.email,
      role: 'agent',
      branch: 'Mumbai Main',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      phone: '+91 98765 43210',
    };

    return { user: mockUser, permissions: ['read', 'write', 'delete'] };
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return null;
});

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData: Partial<User>) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return userData;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setPermissions: (state, action: PayloadAction<string[]>) => {
      state.permissions = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.permissions = action.payload.permissions;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.permissions = [];
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.user) {
          state.user = { ...state.user, ...action.payload };
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Profile update failed';
      });
  },
});

export const { clearError, setPermissions } = authSlice.actions;
export default authSlice.reducer;
