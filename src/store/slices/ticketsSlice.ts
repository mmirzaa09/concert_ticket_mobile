import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {Ticket} from '../../types';

// Mock ticket data
const mockTickets: (Ticket & {
  concertTitle: string;
  concertImage: string;
  venue: string;
})[] = [
  {
    id: '1',
    concertId: '1',
    userId: '1',
    purchaseDate: '2024-07-15',
    price: 500000,
    status: 'used',
    concertTitle: 'Summer Music Festival',
    concertImage:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    venue: 'Central Park',
  },
  {
    id: '2',
    concertId: '2',
    userId: '1',
    purchaseDate: '2024-08-01',
    price: 750000,
    status: 'active',
    concertTitle: 'Rock Night',
    concertImage:
      'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    venue: 'Stadium Arena',
  },
];

// Async thunks
export const fetchUserTickets = createAsyncThunk(
  'tickets/fetchUserTickets',
  async (userId: string, {rejectWithValue}) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockTickets.filter(ticket => ticket.userId === userId);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch tickets',
      );
    }
  },
);

export const purchaseTicket = createAsyncThunk(
  'tickets/purchaseTicket',
  async (
    data: {concertId: string; quantity: number; userId: string},
    {rejectWithValue},
  ) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newTicket: Ticket & {
        concertTitle: string;
        concertImage: string;
        venue: string;
      } = {
        id: Date.now().toString(),
        concertId: data.concertId,
        userId: data.userId,
        purchaseDate: new Date().toISOString(),
        price: 500000, // Mock price
        status: 'active',
        concertTitle: 'New Concert',
        concertImage:
          'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        venue: 'Mock Venue',
      };

      return newTicket;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to purchase ticket',
      );
    }
  },
);

export const cancelTicket = createAsyncThunk(
  'tickets/cancelTicket',
  async (ticketId: string, {rejectWithValue}) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return ticketId;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to cancel ticket',
      );
    }
  },
);

// Initial state
interface TicketsState {
  tickets: (Ticket & {
    concertTitle: string;
    concertImage: string;
    venue: string;
  })[];
  isLoading: boolean;
  isPurchasing: boolean;
  error: string | null;
  purchaseSuccess: boolean;
}

const initialState: TicketsState = {
  tickets: [],
  isLoading: false,
  isPurchasing: false,
  error: null,
  purchaseSuccess: false,
};

// Tickets slice
const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    clearPurchaseSuccess: state => {
      state.purchaseSuccess = false;
    },
  },
  extraReducers: builder => {
    // Fetch user tickets cases
    builder
      .addCase(fetchUserTickets.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserTickets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tickets = action.payload;
        state.error = null;
      })
      .addCase(fetchUserTickets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Purchase ticket cases
      .addCase(purchaseTicket.pending, state => {
        state.isPurchasing = true;
        state.error = null;
        state.purchaseSuccess = false;
      })
      .addCase(purchaseTicket.fulfilled, (state, action) => {
        state.isPurchasing = false;
        state.tickets.push(action.payload);
        state.error = null;
        state.purchaseSuccess = true;
      })
      .addCase(purchaseTicket.rejected, (state, action) => {
        state.isPurchasing = false;
        state.error = action.payload as string;
        state.purchaseSuccess = false;
      })
      // Cancel ticket cases
      .addCase(cancelTicket.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        const ticketIndex = state.tickets.findIndex(
          ticket => ticket.id === action.payload,
        );
        if (ticketIndex !== -1) {
          state.tickets[ticketIndex].status = 'cancelled';
        }
        state.error = null;
      })
      .addCase(cancelTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {clearError, clearPurchaseSuccess} = ticketsSlice.actions;
export default ticketsSlice.reducer;
