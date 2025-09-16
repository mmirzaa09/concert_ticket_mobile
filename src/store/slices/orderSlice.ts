import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {apiService} from '../../services/api/apiService';

// Define the order interface based on the backend model
export interface Order {
  id_order?: string;
  id_user: string;
  id_concert: string;
  quantity: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'expired';
  reservation_expired: string;
  created_at?: string;
  updated_at?: string;
}

// Define the state interface
export interface OrderState {
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

// Initial state
const initialState: OrderState = {
  currentOrder: null,
  loading: false,
  error: null,
  success: false,
};

// Define the payload interface for creating order inquiry
export interface CreateOrderInquiryPayload {
  id_user: string;
  id_concert: string;
  quantity: number;
  total_price: number;
}

// Async thunk for creating order inquiry
export const createOrderInquiry = createAsyncThunk(
  'order/createOrderInquiry',
  async (payload: CreateOrderInquiryPayload, {rejectWithValue}) => {
    try {
      const response = await apiService.postInquiryOrder(payload);

      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(
          response.message || 'Failed to create order inquiry',
        );
      }
    } catch (error: any) {
      console.error('Error creating order inquiry:', error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Failed to create order inquiry',
      );
    }
  },
);

// Create the slice
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: state => {
      state.currentOrder = null;
      state.error = null;
      state.success = false;
    },
    clearError: state => {
      state.error = null;
    },
    clearSuccess: state => {
      state.success = false;
    },
    resetOrderState: state => {
      state.currentOrder = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: builder => {
    builder
      // Create order inquiry
      .addCase(createOrderInquiry.pending, state => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createOrderInquiry.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.error = null;
        state.success = true;
      })
      .addCase(createOrderInquiry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
        state.currentOrder = null;
      });
  },
});

// Export actions
export const {clearOrder, clearError, clearSuccess, resetOrderState} =
  orderSlice.actions;

// Selectors
export const selectCurrentOrder = (state: {order: OrderState}) =>
  state.order.currentOrder;

export const selectOrderLoading = (state: {order: OrderState}) =>
  state.order.loading;

export const selectOrderError = (state: {order: OrderState}) =>
  state.order.error;

export const selectOrderSuccess = (state: {order: OrderState}) =>
  state.order.success;

// Helper selectors
export const selectIsOrderExpired = (state: {order: OrderState}) => {
  const order = state.order.currentOrder;
  if (!order?.reservation_expired) {
    return false;
  }

  return new Date() > new Date(order.reservation_expired);
};

export const selectOrderTimeRemaining = (state: {order: OrderState}) => {
  const order = state.order.currentOrder;
  if (!order?.reservation_expired) {
    return 0;
  }

  const now = new Date().getTime();
  const expiration = new Date(order.reservation_expired).getTime();
  const remaining = expiration - now;

  return remaining > 0 ? remaining : 0;
};

// Export reducer
export default orderSlice.reducer;
