import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Service, Provider } from '../../types';

interface ServiceState {
  services: Service[];
  categories: string[];
  providers: Provider[];
  selectedService: Service | null;
  selectedProvider: Provider | null;
  nearbyProviders: Provider[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  filters: {
    category: string;
    minRating: number;
    maxPrice: number;
    distance: number;
  };
}

const initialState: ServiceState = {
  services: [],
  categories: [],
  providers: [],
  selectedService: null,
  selectedProvider: null,
  nearbyProviders: [],
  loading: false,
  error: null,
  searchQuery: '',
  filters: {
    category: '',
    minRating: 0,
    maxPrice: 0,
    distance: 10,
  },
};

export const fetchServices = createAsyncThunk(
  'service/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/services');
      if (!response.ok) throw new Error('Failed to fetch services');
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchServicesByCategory = createAsyncThunk(
  'service/fetchByCategory',
  async (category: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/services/category/${category}`);
      if (!response.ok) throw new Error('Failed to fetch services');
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchServices = createAsyncThunk(
  'service/search',
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/services/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to search services');
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchNearbyProviders = createAsyncThunk(
  'service/fetchNearbyProviders',
  async ({ serviceId, latitude, longitude, radius }: { serviceId: string; latitude: number; longitude: number; radius: number }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/providers/nearby?serviceId=${serviceId}&lat=${latitude}&lng=${longitude}&radius=${radius}`);
      if (!response.ok) throw new Error('Failed to fetch nearby providers');
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProviderById = createAsyncThunk(
  'service/fetchProvider',
  async (providerId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/providers/${providerId}`);
      if (!response.ok) throw new Error('Failed to fetch provider');
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const serviceSlice = createSlice({
  name: 'service',
  initialState,
  reducers: {
    setSelectedService: (state, action: PayloadAction<Service | null>) => {
      state.selectedService = action.payload;
    },
    setSelectedProvider: (state, action: PayloadAction<Provider | null>) => {
      state.selectedProvider = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<ServiceState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearServices: (state) => {
      state.services = [];
      state.providers = [];
      state.nearbyProviders = [];
      state.selectedService = null;
      state.selectedProvider = null;
      state.searchQuery = '';
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Services
    builder
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Services by Category
    builder
      .addCase(fetchServicesByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServicesByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(fetchServicesByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Search Services
    builder
      .addCase(searchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(searchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Nearby Providers
    builder
      .addCase(fetchNearbyProviders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNearbyProviders.fulfilled, (state, action) => {
        state.loading = false;
        state.nearbyProviders = action.payload;
      })
      .addCase(fetchNearbyProviders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Provider by ID
    builder
      .addCase(fetchProviderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProviderById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProvider = action.payload;
      })
      .addCase(fetchProviderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedService,
  setSelectedProvider,
  setSearchQuery,
  setFilters,
  clearServices,
  clearError,
} = serviceSlice.actions;

export default serviceSlice.reducer;
