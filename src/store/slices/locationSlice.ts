import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LocationState {
  userLocation: {
    latitude: number;
    longitude: number;
    address?: string;
  } | null;
  currentLocation: {
    latitude: number;
    longitude: number;
    address?: string;
  } | null;
  permissionGranted: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: LocationState = {
  userLocation: null,
  currentLocation: null,
  permissionGranted: false,
  loading: false,
  error: null,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setUserLocation: (state, action: PayloadAction<{ latitude: number; longitude: number; address?: string }>) => {
      state.userLocation = action.payload;
      state.currentLocation = action.payload; // Keep both in sync
      state.loading = false;
      state.error = null;
    },
    setPermissionGranted: (state, action: PayloadAction<boolean>) => {
      state.permissionGranted = action.payload;
    },
    setLocationLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setLocationError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearLocationData: (state) => {
      state.userLocation = null;
      state.permissionGranted = false;
      state.error = null;
    },
  },
});

export const {
  setUserLocation,
  setPermissionGranted,
  setLocationLoading,
  setLocationError,
  clearLocationData,
} = locationSlice.actions;

export default locationSlice.reducer;
