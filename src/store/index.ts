import {configureStore} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {combineReducers} from '@reduxjs/toolkit';

// Import slices
import authReducer from './slices/authSlice';
import concertsReducer from './slices/concertsSlice';
import ticketsReducer from './slices/ticketsSlice';
import paymentMethodReducer from './slices/paymentMethodSlice';
import orderReducer from './slices/orderSlice';
import transactionReducer from './slices/transactionSlice';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['concerts', 'tickets'], // Remove 'auth' from whitelist since we're using AuthContext
};

// Root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  concerts: concertsReducer,
  tickets: ticketsReducer,
  paymentMethod: paymentMethodReducer,
  order: orderReducer,
  transaction: transactionReducer,
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/FLUSH',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PERSIST',
          'persist/PURGE',
          'persist/REGISTER',
        ],
      },
    }),
  devTools: __DEV__,
});

// Persistor
export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export {useDispatch, useSelector} from 'react-redux';
