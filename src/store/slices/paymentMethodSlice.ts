import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {PaymentMethod} from '../../types';
import {apiService} from '../../services/api/apiService';

// Define the state interface
export interface PaymentMethodState {
  paymentMethods: PaymentMethod[];
  selectedPaymentMethod: PaymentMethod | null;
  currentPaymentMethod: PaymentMethod | null; // For individual fetched payment method
  loading: boolean;
  loadingById: boolean; // Separate loading state for individual fetch
  error: string | null;
}

// Initial state
const initialState: PaymentMethodState = {
  paymentMethods: [],
  selectedPaymentMethod: null,
  currentPaymentMethod: null,
  loading: false,
  loadingById: false,
  error: null,
};

// Async thunk for fetching payment methods
export const fetchPaymentMethods = createAsyncThunk(
  'paymentMethod/fetchPaymentMethods',
  async (_, {rejectWithValue}) => {
    try {
      const response = await apiService.getPaymentMethods();

      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(
          response.message || 'Failed to fetch payment methods',
        );
      }
    } catch (error: any) {
      console.error('Error fetching payment methods:', error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Failed to fetch payment methods',
      );
    }
  },
);

// Async thunk for fetching payment method by ID
export const fetchPaymentMethodsById = createAsyncThunk(
  'paymentMethod/fetchPaymentMethodsById',
  async (id: number, {rejectWithValue}) => {
    try {
      const response = await apiService.getPaymentMethodById(id);

      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(
          response.message || 'Failed to fetch payment method',
        );
      }
    } catch (error: any) {
      console.error('Error fetching payment method by ID:', error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Failed to fetch payment method',
      );
    }
  },
);

// Create the slice
const paymentMethodSlice = createSlice({
  name: 'paymentMethod',
  initialState,
  reducers: {
    setSelectedPaymentMethod: (state, action: PayloadAction<PaymentMethod>) => {
      state.selectedPaymentMethod = action.payload;
    },
    clearSelectedPaymentMethod: state => {
      state.selectedPaymentMethod = null;
    },
    clearCurrentPaymentMethod: state => {
      state.currentPaymentMethod = null;
    },
    clearError: state => {
      state.error = null;
    },
    resetPaymentMethodState: state => {
      state.paymentMethods = [];
      state.selectedPaymentMethod = null;
      state.currentPaymentMethod = null;
      state.loading = false;
      state.loadingById = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // Fetch payment methods
      .addCase(fetchPaymentMethods.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentMethods.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentMethods = action.payload;
        state.error = null;
      })
      .addCase(fetchPaymentMethods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // Don't set static data, let the app handle the error gracefully
      })
      // Fetch payment method by ID
      .addCase(fetchPaymentMethodsById.pending, state => {
        state.loadingById = true;
        state.error = null;
      })
      .addCase(fetchPaymentMethodsById.fulfilled, (state, action) => {
        state.loadingById = false;
        state.currentPaymentMethod = action.payload;
        state.error = null;
      })
      .addCase(fetchPaymentMethodsById.rejected, (state, action) => {
        state.loadingById = false;
        state.error = action.payload as string;
        state.currentPaymentMethod = null;
      });
  },
});

// Export actions
export const {
  setSelectedPaymentMethod,
  clearSelectedPaymentMethod,
  clearCurrentPaymentMethod,
  clearError,
  resetPaymentMethodState,
} = paymentMethodSlice.actions;

// Selectors
export const selectPaymentMethods = (state: {
  paymentMethod: PaymentMethodState;
}) => state.paymentMethod.paymentMethods;

export const selectSelectedPaymentMethod = (state: {
  paymentMethod: PaymentMethodState;
}) => state.paymentMethod.selectedPaymentMethod;

export const selectPaymentMethodLoading = (state: {
  paymentMethod: PaymentMethodState;
}) => state.paymentMethod.loading;

export const selectPaymentMethodError = (state: {
  paymentMethod: PaymentMethodState;
}) => state.paymentMethod.error;

export const selectCurrentPaymentMethod = (state: {
  paymentMethod: PaymentMethodState;
}) => state.paymentMethod.currentPaymentMethod;

export const selectPaymentMethodLoadingById = (state: {
  paymentMethod: PaymentMethodState;
}) => state.paymentMethod.loadingById;

export const selectPaymentMethodsByType =
  (type: PaymentMethod['type']) =>
  (state: {paymentMethod: PaymentMethodState}) =>
    state.paymentMethod.paymentMethods.filter(method => method.type === type);

// Helper selector to get payment method by icon
export const selectPaymentMethodByIcon =
  (icon: string) => (state: {paymentMethod: PaymentMethodState}) =>
    state.paymentMethod.paymentMethods.find(method => method.icon === icon);

// Helper selector to get payment method by ID from current list
export const selectPaymentMethodById =
  (id: number) => (state: {paymentMethod: PaymentMethodState}) =>
    state.paymentMethod.paymentMethods.find(method => method.id_method === id);

// Export reducer
export default paymentMethodSlice.reducer;
