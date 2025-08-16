import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Booking, BookingStatus } from '../../types';

interface BookingState {
  bookings: Booking[];
  activeBooking: Booking | null;
  loading: boolean;
  error: string | null;
  providerLocation: {
    latitude: number;
    longitude: number;
  } | null;
}

const initialState: BookingState = {
  bookings: [],
  activeBooking: null,
  loading: false,
  error: null,
  providerLocation: null,
};

// Async thunks
export const createBooking = createAsyncThunk(
  'booking/create',
  async (bookingData: Omit<Booking, 'id' | 'status'>, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });
      if (!response.ok) throw new Error('Failed to create booking');
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchBookings = createAsyncThunk(
  'booking/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/bookings');
      if (!response.ok) throw new Error('Failed to fetch bookings');
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchBookingById = createAsyncThunk(
  'booking/fetchById',
  async (bookingId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`);
      if (!response.ok) throw new Error('Failed to fetch booking');
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const acceptBooking = createAsyncThunk(
  'booking/accept',
  async (bookingId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/accept`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to accept booking');
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const rejectBooking = createAsyncThunk(
  'booking/reject',
  async ({ bookingId, reason }: { bookingId: string; reason: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      if (!response.ok) throw new Error('Failed to reject booking');
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const startBooking = createAsyncThunk(
  'booking/start',
  async (bookingId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/start`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to start booking');
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const completeBooking = createAsyncThunk(
  'booking/complete',
  async ({ bookingId, notes }: { bookingId: string; notes?: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
      if (!response.ok) throw new Error('Failed to complete booking');
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const cancelBooking = createAsyncThunk(
  'booking/cancel',
  async ({ bookingId, reason }: { bookingId: string; reason: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      if (!response.ok) throw new Error('Failed to cancel booking');
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const rateBooking = createAsyncThunk(
  'booking/rate',
  async ({ bookingId, rating, review }: { bookingId: string; rating: number; review?: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, review }),
      });
      if (!response.ok) throw new Error('Failed to rate booking');
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setActiveBooking: (state, action: PayloadAction<Booking | null>) => {
      state.activeBooking = action.payload;
    },
    updateBookingStatus: (state, action: PayloadAction<{ bookingId: string; status: BookingStatus }>) => {
      const { bookingId, status } = action.payload;
      
      // Update in bookings array
      const bookingIndex = state.bookings.findIndex(b => b.id === bookingId);
      if (bookingIndex !== -1) {
        state.bookings[bookingIndex].status = status;
      }
      
      // Update active booking if it matches
      if (state.activeBooking && state.activeBooking.id === bookingId) {
        state.activeBooking.status = status;
      }
    },
    updateProviderLocation: (state, action: PayloadAction<{ latitude: number; longitude: number }>) => {
      state.providerLocation = action.payload;
      
      // Update active booking's provider location
      if (state.activeBooking) {
        state.activeBooking.providerLocation = action.payload;
      }
    },
    clearBookingError: (state) => {
      state.error = null;
    },
    clearBookings: (state) => {
      state.bookings = [];
      state.activeBooking = null;
      state.providerLocation = null;
    },
  },
  extraReducers: (builder) => {
    // Create Booking
    builder
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings.unshift(action.payload);
        state.activeBooking = action.payload;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Bookings
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Booking by ID
    builder
      .addCase(fetchBookingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.loading = false;
        const booking = action.payload;
        
        // Update in bookings array
        const existingIndex = state.bookings.findIndex(b => b.id === booking.id);
        if (existingIndex !== -1) {
          state.bookings[existingIndex] = booking;
        } else {
          state.bookings.unshift(booking);
        }
        
        // Set as active if it's currently active
        if (state.activeBooking?.id === booking.id) {
          state.activeBooking = booking;
        }
      })
      .addCase(fetchBookingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Accept Booking
    builder
      .addCase(acceptBooking.fulfilled, (state, action) => {
        const updatedBooking = action.payload;
        const index = state.bookings.findIndex(b => b.id === updatedBooking.id);
        if (index !== -1) {
          state.bookings[index] = updatedBooking;
        }
        if (state.activeBooking?.id === updatedBooking.id) {
          state.activeBooking = updatedBooking;
        }
      });

    // Similar patterns for reject, start, complete, cancel, rate
    builder
      .addCase(rejectBooking.fulfilled, (state, action) => {
        const updatedBooking = action.payload;
        const index = state.bookings.findIndex(b => b.id === updatedBooking.id);
        if (index !== -1) {
          state.bookings[index] = updatedBooking;
        }
        if (state.activeBooking?.id === updatedBooking.id) {
          state.activeBooking = updatedBooking;
        }
      });

    builder
      .addCase(startBooking.fulfilled, (state, action) => {
        const updatedBooking = action.payload;
        const index = state.bookings.findIndex(b => b.id === updatedBooking.id);
        if (index !== -1) {
          state.bookings[index] = updatedBooking;
        }
        if (state.activeBooking?.id === updatedBooking.id) {
          state.activeBooking = updatedBooking;
        }
      });

    builder
      .addCase(completeBooking.fulfilled, (state, action) => {
        const updatedBooking = action.payload;
        const index = state.bookings.findIndex(b => b.id === updatedBooking.id);
        if (index !== -1) {
          state.bookings[index] = updatedBooking;
        }
        if (state.activeBooking?.id === updatedBooking.id) {
          state.activeBooking = updatedBooking;
        }
      });

    builder
      .addCase(cancelBooking.fulfilled, (state, action) => {
        const updatedBooking = action.payload;
        const index = state.bookings.findIndex(b => b.id === updatedBooking.id);
        if (index !== -1) {
          state.bookings[index] = updatedBooking;
        }
        if (state.activeBooking?.id === updatedBooking.id) {
          state.activeBooking = updatedBooking;
        }
      });

    builder
      .addCase(rateBooking.fulfilled, (state, action) => {
        const updatedBooking = action.payload;
        const index = state.bookings.findIndex(b => b.id === updatedBooking.id);
        if (index !== -1) {
          state.bookings[index] = updatedBooking;
        }
        if (state.activeBooking?.id === updatedBooking.id) {
          state.activeBooking = updatedBooking;
        }
      });
  },
});

export const {
  setActiveBooking,
  updateBookingStatus,
  updateProviderLocation,
  clearBookingError,
  clearBookings,
} = bookingSlice.actions;

export default bookingSlice.reducer;
