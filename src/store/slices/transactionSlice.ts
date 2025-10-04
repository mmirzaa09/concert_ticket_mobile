import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {apiService} from '../../services/api/apiService';

// Define the transaction interface
export interface Transaction {
  id_transaction?: string;
  id_order: string;
  payment_proof?: string;
  status: 'pending' | 'verified' | 'rejected';
  submitted_at?: string;
  verified_at?: string;
  rejection_reason?: string;
}

// Define the transaction state
export interface TransactionState {
  transactions: Transaction[];
  currentTransaction: Transaction | null;
  isLoading: boolean;
  isUploading: boolean;
  error: string | null;
  uploadProgress: number;
}

// Initial state
const initialState: TransactionState = {
  transactions: [],
  currentTransaction: null,
  isLoading: false,
  isUploading: false,
  error: null,
  uploadProgress: 0,
};

// Define the payload interface for payment proof upload
export interface PaymentProofUploadPayload {
  id_order: string;
  payment_proof: {
    uri: string;
    type: string;
    name: string;
  };
}

// Async thunk for uploading payment proof
export const uploadPaymentProof = createAsyncThunk(
  'transaction/uploadPaymentProof',
  async (payload: PaymentProofUploadPayload, {rejectWithValue}) => {
    try {
      const formData = new FormData();
      formData.append('id_order', payload.id_order);
      formData.append('id_user', payload.id_user);
      formData.append('payment_proof', {
        uri: payload.payment_proof.uri,
        type: payload.payment_proof.type,
        name: payload.payment_proof.name,
      } as any);
      console.log('Uploading payment proof with data:', formData);
      const response = await apiService.postTransactionPayment(formData);

      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Upload failed');
      }
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Upload failed',
      );
    }
  },
);

// Create the transaction slice
const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(uploadPaymentProof.pending, state => {
        state.isUploading = true;
        state.error = null;
        state.uploadProgress = 0;
      })
      .addCase(uploadPaymentProof.fulfilled, (state, action) => {
        state.isUploading = false;
        state.uploadProgress = 100;
        state.currentTransaction = action.payload;
        const index = state.transactions.findIndex(
          t => t.id_order === action.payload.id_order,
        );
        if (index !== -1) {
          state.transactions[index] = action.payload;
        } else {
          state.transactions.push(action.payload);
        }
      })
      .addCase(uploadPaymentProof.rejected, (state, action) => {
        state.isUploading = false;
        state.uploadProgress = 0;
        state.error = action.payload as string;
      });
  },
});

export const {setUploadProgress} = transactionSlice.actions;

export default transactionSlice.reducer;
