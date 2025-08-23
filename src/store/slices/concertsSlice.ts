import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {Concert} from '../../types';
import {apiService} from '../../services/api/apiService';

// Async thunks
export const fetchConcerts = createAsyncThunk(
  'concerts/fetchConcerts',
  async (_, {rejectWithValue: _rejectWithValue}) => {
    try {
      const response = await apiService.getConcerts();

      return response.data;
    } catch (error: any) {
      console.warn('API failed, using mock data:', error);
      return;
    }
  },
);

export const fetchConcertById = createAsyncThunk(
  'concerts/fetchConcertById',
  async (concertId: string, {rejectWithValue}) => {
    try {
      const response = await apiService.getConcertById(concertId);

      return response.data;
    } catch (error: any) {
      console.warn('API failed for single concert, using mock data:', error);
      if (!concert) {
        return rejectWithValue('Concert not found');
      }
      return;
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
