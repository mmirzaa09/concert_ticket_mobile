import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {PaymentMethod} from '../../types';
import {apiService} from '../../services/api/apiService';

// Define the state interface
export interface PaymentMethodState {
  paymentMethods: PaymentMethod[];
  selectedPaymentMethod: PaymentMethod | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: PaymentMethodState = {
  paymentMethods: [],
  selectedPaymentMethod: null,
  loading: false,
  error: null,
};

// Async thunk for fetching payment methods
export const fetchPaymentMethods = createAsyncThunk(
  'paymentMethod/fetchPaymentMethods',
  async (_, {rejectWithValue}) => {
    try {
      const response = await apiService.getPaymentMethods();
      console.log('check response payment method:', response);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching payment methods:', error);
      // Return default payment methods as fallback
      return rejectWithValue(
        error.message || 'Failed to fetch payment methods',
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
    clearError: state => {
      state.error = null;
    },
    resetPaymentMethodState: state => {
      state.paymentMethods = [];
      state.selectedPaymentMethod = null;
      state.loading = false;
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
        state.error = action.error.message || 'Failed to fetch payment methods';
        // Still set default payment methods on error
        state.paymentMethods = getDefaultPaymentMethods();
      });
  },
});

// Export actions
export const {
  setSelectedPaymentMethod,
  clearSelectedPaymentMethod,
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

export const selectPaymentMethodsByType =
  (type: PaymentMethod['type']) =>
  (state: {paymentMethod: PaymentMethodState}) =>
    state.paymentMethod.paymentMethods.filter(method => method.type === type);

// Export reducer
export default paymentMethodSlice.reducer;
