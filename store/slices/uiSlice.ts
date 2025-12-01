import { createSlice, PayloadAction, Draft } from '@reduxjs/toolkit';

interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  loading: boolean;
  currentPage: string;
  breadcrumbs: Array<{
    label: string;
    href?: string;
  }>;
}

const initialState: UIState = {
  theme: 'light',
  sidebarOpen: false,
  loading: false,
  currentPage: 'dashboard',
  breadcrumbs: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state: Draft<UIState>, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setSidebarOpen: (state: Draft<UIState>, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setLoading: (state: Draft<UIState>, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setCurrentPage: (state: Draft<UIState>, action: PayloadAction<string>) => {
      state.currentPage = action.payload;
    },
    setBreadcrumbs: (state: Draft<UIState>, action: PayloadAction<Array<{ label: string; href?: string }>>) => {
      state.breadcrumbs = action.payload;
    },
  },
});

export const { setTheme, setSidebarOpen, setLoading, setCurrentPage, setBreadcrumbs } = uiSlice.actions;
export default uiSlice.reducer;
