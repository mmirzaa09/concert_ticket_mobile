import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {Concert} from '../../types';
import {apiService} from '../../services/api/apiService';

// Mock data
const mockConcerts: Concert[] = [
  {
    id: '1',
    title: 'Summer Music Festival',
    artist: 'Various Artists',
    date: '2024-08-15',
    venue: 'Central Park',
    price: 500000,
    image:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    description: 'The biggest summer music festival',
    totalTickets: 10000,
    availableTickets: 2500,
    queueCount: 150,
  },
  {
    id: '2',
    title: 'Rock Night',
    artist: 'The Rockstars',
    date: '2024-09-20',
    venue: 'Stadium Arena',
    price: 750000,
    image:
      'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    description: 'An electrifying rock concert',
    totalTickets: 5000,
    availableTickets: 800,
    queueCount: 75,
  },
  {
    id: '3',
    title: 'Jazz Evening',
    artist: 'Smooth Jazz Collective',
    date: '2024-10-05',
    venue: 'Blue Note Club',
    price: 350000,
    image:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    description: 'An intimate jazz experience',
    totalTickets: 500,
    availableTickets: 120,
    queueCount: 25,
  },
];

// Async thunks
export const fetchConcerts = createAsyncThunk(
  'concerts/fetchConcerts',
  async (_, {rejectWithValue}) => {
    try {
      // Simulate API call
      // await new Promise(resolve => setTimeout(resolve, 1000));
      const response = await apiService.getConcerts();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch concerts',
      );
    }
  },
);

export const fetchConcertById = createAsyncThunk(
  'concerts/fetchConcertById',
  async (concertId: string, {rejectWithValue}) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const concert = mockConcerts.find(c => c.id === concertId);
      if (!concert) {
        throw new Error('Concert not found');
      }
      return concert;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch concert',
      );
    }
  },
);

export const searchConcerts = createAsyncThunk(
  'concerts/searchConcerts',
  async (searchTerm: string, {rejectWithValue}) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      const filteredConcerts = mockConcerts.filter(
        concert =>
          concert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          concert.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
          concert.venue.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      return filteredConcerts;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to search concerts',
      );
    }
  },
);

// Initial state
interface ConcertsState {
  concerts: Concert[];
  selectedConcert: Concert | null;
  searchResults: Concert[];
  isLoading: boolean;
  isSearching: boolean;
  error: string | null;
  searchError: string | null;
}

const initialState: ConcertsState = {
  concerts: [],
  selectedConcert: null,
  searchResults: [],
  isLoading: false,
  isSearching: false,
  error: null,
  searchError: null,
};

// Concerts slice
const concertsSlice = createSlice({
  name: 'concerts',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
      state.searchError = null;
    },
    clearSearchResults: state => {
      state.searchResults = [];
      state.searchError = null;
    },
    setSelectedConcert: (state, action) => {
      state.selectedConcert = action.payload;
    },
    clearSelectedConcert: state => {
      state.selectedConcert = null;
    },
  },
  extraReducers: builder => {
    // Fetch concerts cases
    builder
      .addCase(fetchConcerts.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchConcerts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.concerts = action.payload;
        state.error = null;
      })
      .addCase(fetchConcerts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch concert by ID cases
      .addCase(fetchConcertById.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchConcertById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedConcert = action.payload;
        state.error = null;
      })
      .addCase(fetchConcertById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Search concerts cases
      .addCase(searchConcerts.pending, state => {
        state.isSearching = true;
        state.searchError = null;
      })
      .addCase(searchConcerts.fulfilled, (state, action) => {
        state.isSearching = false;
        state.searchResults = action.payload;
        state.searchError = null;
      })
      .addCase(searchConcerts.rejected, (state, action) => {
        state.isSearching = false;
        state.searchError = action.payload as string;
      });
  },
});

export const {
  clearError,
  clearSearchResults,
  setSelectedConcert,
  clearSelectedConcert,
} = concertsSlice.actions;

export default concertsSlice.reducer;
