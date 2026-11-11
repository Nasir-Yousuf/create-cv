import { createSlice } from '@reduxjs/toolkit';

const storedUser = localStorage.getItem('novacv_user');
let parsedUser = null;
try {
  parsedUser = storedUser ? JSON.parse(storedUser) : null;
} catch (e) {
  parsedUser = null;
}

const initialState = {
  user: parsedUser,
  token: localStorage.getItem('novacv_token') || null,
  isAuthenticated: !!localStorage.getItem('novacv_token'),
  isLoading: false,
  error: null,
  authModalOpen: false,
  authModalMode: 'login', // 'login' | 'register' | 'forgot'
  authPromptMessage: '',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    authSuccess: (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      if (action.payload.token) {
        state.token = action.payload.token;
        localStorage.setItem('novacv_token', action.payload.token);
      }
      state.isAuthenticated = true;
      state.error = null;
      if (action.payload.user) {
        localStorage.setItem('novacv_user', JSON.stringify(action.payload.user));
      }
    },
    syncUserProfile: (state, action) => {
      state.user = action.payload;
      if (action.payload) {
        localStorage.setItem('novacv_user', JSON.stringify(action.payload));
      }
    },
    authFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('novacv_user');
      localStorage.removeItem('novacv_token');
    },
    clearError: (state) => {
      state.error = null;
    },
    openAuthModal: (state, action) => {
      state.authModalOpen = true;
      state.authModalMode = action.payload?.mode || 'login';
      state.authPromptMessage = action.payload?.promptMessage || '';
      state.error = null;
    },
    closeAuthModal: (state) => {
      state.authModalOpen = false;
      state.authPromptMessage = '';
    },
  },
});

export const {
  authStart,
  authSuccess,
  syncUserProfile,
  authFailure,
  logout,
  clearError,
  openAuthModal,
  closeAuthModal,
} = authSlice.actions;

export default authSlice.reducer;
