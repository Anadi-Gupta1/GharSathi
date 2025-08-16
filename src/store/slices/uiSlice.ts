import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  theme: 'light' | 'dark';
  language: string;
  isLoading: boolean;
  loadingText: string;
  showTabBar: boolean;
  activeTab: string;
  modalVisible: boolean;
  modalType: string | null;
  modalData: any;
  toastVisible: boolean;
  toastMessage: string;
  toastType: 'success' | 'error' | 'warning' | 'info';
  networkStatus: 'online' | 'offline';
  keyboardVisible: boolean;
}

const initialState: UIState = {
  theme: 'light',
  language: 'en',
  isLoading: false,
  loadingText: '',
  showTabBar: true,
  activeTab: 'Home',
  modalVisible: false,
  modalType: null,
  modalData: null,
  toastVisible: false,
  toastMessage: '',
  toastType: 'info',
  networkStatus: 'online',
  keyboardVisible: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setLoading: (state, action: PayloadAction<{ isLoading: boolean; text?: string }>) => {
      state.isLoading = action.payload.isLoading;
      state.loadingText = action.payload.text || '';
    },
    setTabBarVisibility: (state, action: PayloadAction<boolean>) => {
      state.showTabBar = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
    showModal: (state, action: PayloadAction<{ type: string; data?: any }>) => {
      state.modalVisible = true;
      state.modalType = action.payload.type;
      state.modalData = action.payload.data || null;
    },
    hideModal: (state) => {
      state.modalVisible = false;
      state.modalType = null;
      state.modalData = null;
    },
    showToast: (state, action: PayloadAction<{ message: string; type: 'success' | 'error' | 'warning' | 'info' }>) => {
      state.toastVisible = true;
      state.toastMessage = action.payload.message;
      state.toastType = action.payload.type;
    },
    hideToast: (state) => {
      state.toastVisible = false;
      state.toastMessage = '';
    },
    setNetworkStatus: (state, action: PayloadAction<'online' | 'offline'>) => {
      state.networkStatus = action.payload;
    },
    setKeyboardVisible: (state, action: PayloadAction<boolean>) => {
      state.keyboardVisible = action.payload;
    },
    resetUI: (state) => {
      state.isLoading = false;
      state.loadingText = '';
      state.modalVisible = false;
      state.modalType = null;
      state.modalData = null;
      state.toastVisible = false;
      state.toastMessage = '';
    },
  },
});

export const {
  setTheme,
  setLanguage,
  setLoading,
  setTabBarVisibility,
  setActiveTab,
  showModal,
  hideModal,
  showToast,
  hideToast,
  setNetworkStatus,
  setKeyboardVisible,
  resetUI,
} = uiSlice.actions;

export default uiSlice.reducer;
