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
  userOrders: Order[];
  loading: boolean;
  error: string | null;
  success: boolean;
}

// Initial state
const initialState: OrderState = {
  currentOrder: null,
  userOrders: [],
  loading: false,
  error: null,
  success: false,
};

// Define the payload interface for creating order inquiry
export interface CreateOrderInquiryPayload {
  id_user: string;
  id_method: string;
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

// Async thunk for getting orders by user ID
export const getOrdersByUserId = createAsyncThunk(
  'order/getOrdersByUserId',
  async (id_user: string, {rejectWithValue}) => {
    try {
      const response = await apiService.getOrdersByUserId(id_user);

      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to fetch orders');
      }
    } catch (error: any) {
      console.error('Error fetching orders by user ID:', error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Failed to fetch orders',
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
    clearUserOrders: state => {
      state.userOrders = [];
    },
    clearError: state => {
      state.error = null;
    },
    clearSuccess: state => {
      state.success = false;
    },
    resetOrderState: state => {
      state.currentOrder = null;
      state.userOrders = [];
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
      })
      // Get orders by user ID
      .addCase(getOrdersByUserId.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrdersByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
        state.error = null;
      })
      .addCase(getOrdersByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.userOrders = [];
      });
  },
});

// Export actions
export const {
  clearOrder,
  clearUserOrders,
  clearError,
  clearSuccess,
  resetOrderState,
} = orderSlice.actions;

// Selectors
export const selectCurrentOrder = (state: {order: OrderState}) =>
  state.order.currentOrder;

export const selectOrderLoading = (state: {order: OrderState}) =>
  state.order.loading;

export const selectOrderError = (state: {order: OrderState}) =>
  state.order.error;

export const selectOrderSuccess = (state: {order: OrderState}) =>
  state.order.success;

export const selectUserOrders = (state: {order: OrderState}) =>
  state.order.userOrders;

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
