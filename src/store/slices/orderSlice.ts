import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {apiService} from '../../services/api/apiService';

// Define the user interface for nested user data
export interface OrderUser {
  id_user: number;
  name: string;
  email: string;
  phone_number: string;
}

// Define the concert interface for nested concert data
export interface Concert {
  id_concert: number;
  title: string;
  artist: string;
  venue: string;
  date: string;
  price: number;
  available_tickets: number;
  description: string;
  image_url: string;
}

// Define the order interface based on the backend model
export interface Order {
  id_order?: number;
  id_method?: number;
  id_user?: string | number;
  id_concert?: string | number;
  quantity: number;
  total_price: number | string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'expired' | 'paid';
  reservation_expired: string;
  created_at?: string;
  updated_at?: string;
  user?: OrderUser;
  concert?: Concert;
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
      console.log('Error fetching orders by user ID:', error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Failed to fetch orders',
      );
    }
  },
);

// Async thunk for getting order by ID
export const getOrderById = createAsyncThunk(
  'order/getOrderById',
  async (id_order: string, {rejectWithValue}) => {
    try {
      const response = await apiService.getOrderById(id_order);

      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to fetch order');
      }
    } catch (error: any) {
      console.error('Error fetching order by ID:', error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Failed to fetch order',
      );
    }
  },
);

// Async thunk for getting paid order by ID
export const getPaidOrder = createAsyncThunk(
  'order/getPaidOrder',
  async (id_order: string, {rejectWithValue}) => {
    try {
      const response = await apiService.getPaidOrder(id_order);

      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(
          response.message || 'Failed to fetch paid order',
        );
      }
    } catch (error: any) {
      console.error('Error fetching paid order:', error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Failed to fetch paid order',
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
      })
      // Get order by ID
      .addCase(getOrderById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.error = null;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.currentOrder = null;
      })
      // Get paid order
      .addCase(getPaidOrder.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPaidOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.error = null;
      })
      .addCase(getPaidOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.currentOrder = null;
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
