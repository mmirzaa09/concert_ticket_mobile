# Redux Setup - QueueLess App

This document shows how to use Redux state management in the QueueLess React Native app.

## 🏗️ Redux Architecture

### Store Structure
```
store/
├── index.ts              # Store configuration with Redux Persist
├── hooks.ts              # Typed Redux hooks
└── slices/
    ├── authSlice.ts      # Authentication state
    ├── concertsSlice.ts  # Concerts data
    └── ticketsSlice.ts   # User tickets
```

### State Shape
```typescript
{
  auth: {
    user: User | null,
    token: string | null,
    isLoading: boolean,
    isAuthenticated: boolean,
    error: string | null
  },
  concerts: {
    concerts: Concert[],
    selectedConcert: Concert | null,
    searchResults: Concert[],
    isLoading: boolean,
    isSearching: boolean,
    error: string | null,
    searchError: string | null
  },
  tickets: {
    tickets: ExtendedTicket[],
    isLoading: boolean,
    isPurchasing: boolean,
    error: string | null,
    purchaseSuccess: boolean
  }
}
```

## 🎯 Usage Examples

### 1. Authentication

#### Login
```typescript
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {loginUser, clearError} from '../../store/slices/authSlice';

const LoginScreen = () => {
  const dispatch = useAppDispatch();
  const {isLoading, error, isAuthenticated} = useAppSelector(state => state.auth);

  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await dispatch(loginUser({email, password}));
      if (loginUser.fulfilled.match(result)) {
        // Login successful
        navigation.navigate('MainTabs');
      }
    } catch (err) {
      // Handle error
    }
  };
};
```

#### Logout
```typescript
import {logoutUser} from '../../store/slices/authSlice';

const handleLogout = async () => {
  await dispatch(logoutUser());
  navigation.navigate('Login');
};
```

### 2. Concerts Management

#### Fetch Concerts
```typescript
import {fetchConcerts} from '../../store/slices/concertsSlice';

const HomeScreen = () => {
  const dispatch = useAppDispatch();
  const {concerts, isLoading, error} = useAppSelector(state => state.concerts);

  useEffect(() => {
    dispatch(fetchConcerts());
  }, [dispatch]);

  return (
    <FlatList
      data={concerts}
      refreshing={isLoading}
      onRefresh={() => dispatch(fetchConcerts())}
    />
  );
};
```

#### Search Concerts
```typescript
import {searchConcerts, clearSearchResults} from '../../store/slices/concertsSlice';

const SearchScreen = () => {
  const dispatch = useAppDispatch();
  const {searchResults, isSearching} = useAppSelector(state => state.concerts);

  const handleSearch = (searchTerm: string) => {
    if (searchTerm.trim()) {
      dispatch(searchConcerts(searchTerm));
    } else {
      dispatch(clearSearchResults());
    }
  };
};
```

### 3. Tickets Management

#### Fetch User Tickets
```typescript
import {fetchUserTickets} from '../../store/slices/ticketsSlice';

const HistoryScreen = () => {
  const dispatch = useAppDispatch();
  const {tickets, isLoading} = useAppSelector(state => state.tickets);
  const {user} = useAppSelector(state => state.auth);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserTickets(user.id));
    }
  }, [dispatch, user?.id]);
};
```

#### Purchase Ticket
```typescript
import {purchaseTicket, clearPurchaseSuccess} from '../../store/slices/ticketsSlice';

const PurchaseScreen = () => {
  const dispatch = useAppDispatch();
  const {isPurchasing, purchaseSuccess} = useAppSelector(state => state.tickets);

  const handlePurchase = async (concertId: string, quantity: number) => {
    try {
      const result = await dispatch(
        purchaseTicket({concertId, quantity, userId: user.id})
      );
      if (purchaseTicket.fulfilled.match(result)) {
        Alert.alert('Success', 'Ticket purchased successfully!');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to purchase ticket');
    }
  };

  useEffect(() => {
    if (purchaseSuccess) {
      // Clear success flag after showing success message
      dispatch(clearPurchaseSuccess());
    }
  }, [purchaseSuccess, dispatch]);
};
```

## 🔄 Async Thunks

### Auth Thunks
- `loginUser(credentials)` - Login with email/password
- `registerUser(userData)` - Register new user
- `logoutUser()` - Logout current user

### Concerts Thunks
- `fetchConcerts()` - Get all concerts
- `fetchConcertById(id)` - Get specific concert
- `searchConcerts(searchTerm)` - Search concerts

### Tickets Thunks
- `fetchUserTickets(userId)` - Get user's tickets
- `purchaseTicket(data)` - Purchase new ticket
- `cancelTicket(ticketId)` - Cancel existing ticket

## 📱 Redux Persist

The store automatically persists the auth state to AsyncStorage:

```typescript
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'], // Only persist auth state
};
```

This means:
- User login state persists across app restarts
- Concerts and tickets are fetched fresh on app launch
- Authentication tokens are automatically restored

## 🎣 Typed Hooks

Use these typed hooks instead of the default Redux hooks:

```typescript
import {useAppDispatch, useAppSelector} from '../../store/hooks';

// Instead of:
// import {useDispatch, useSelector} from 'react-redux';

const dispatch = useAppDispatch(); // Typed dispatch
const state = useAppSelector(state => state.auth); // Typed selector
```

## 🛠️ Error Handling

Each slice has error clearing actions:

```typescript
// Clear auth errors
dispatch(clearError()); // from authSlice

// Clear concert errors
dispatch(clearError()); // from concertsSlice

// Clear ticket errors
dispatch(clearError()); // from ticketsSlice
```

## 🧪 Testing with Redux

For testing components that use Redux:

```typescript
import {Provider} from 'react-redux';
import {store} from '../store';

const TestWrapper = ({children}) => (
  <Provider store={store}>
    {children}
  </Provider>
);

// Use TestWrapper in your tests
```

## 🚀 Performance Tips

1. **Selective Subscriptions**: Only subscribe to the state you need
```typescript
// Good
const {isLoading} = useAppSelector(state => state.auth);

// Avoid
const authState = useAppSelector(state => state.auth);
```

2. **Memoize Selectors**: For complex selections, use memoized selectors
```typescript
import {createSelector} from '@reduxjs/toolkit';

const selectActiveTickets = createSelector(
  state => state.tickets.tickets,
  tickets => tickets.filter(ticket => ticket.status === 'active')
);
```

3. **Debounce Search**: For search functionality
```typescript
import {debounce} from 'lodash';

const debouncedSearch = debounce((term) => {
  dispatch(searchConcerts(term));
}, 300);
```
