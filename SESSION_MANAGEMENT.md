# Session Management Flow Documentation

## Overview
This document explains the comprehensive session management implementation that handles JWT token expiration and automatic user logout.

## Components

### 1. API Service (`apiService.ts`)
- **Session Detection**: Automatically detects 401 Unauthorized responses
- **Token Cleanup**: Removes expired tokens from AsyncStorage
- **Callback System**: Triggers session expiration callbacks when 401 is detected
- **Global Callback**: `setSessionExpiredCallback()` allows components to register handlers

### 2. Session Manager Hook (`useSessionManager.ts`)
- **Callback Registration**: Registers session expiration handler with API service
- **State Management**: Manages session timeout modal visibility
- **Logout Flow**: Handles user logout and navigation to login screen
- **Auto-cleanup**: Removes callbacks on component unmount

### 3. Session Timeout Modal (`SessionTimeoutModal.tsx`)
- **User Notification**: Displays clear session expiration message
- **Countdown Timer**: Shows auto-redirect countdown (10 seconds)
- **Manual Action**: Allows user to proceed immediately
- **Visual Design**: Styled with warning colors and clear messaging

### 4. Navigation Service (`NavigationService.ts`)
- **Global Navigation**: Enables navigation from non-component contexts
- **Navigation Ref**: Provides reference to NavigationContainer
- **Reset Navigation**: Forces navigation to login screen, clearing stack

### 5. Auth Context (`AuthContext.tsx`)
- **State Management**: Manages authentication state
- **Async Logout**: Properly cleans up tokens and user data
- **Storage Cleanup**: Removes both token and user data from AsyncStorage

## Flow Sequence

### Normal API Call Flow
1. User makes API call through `apiService`
2. JWT token is automatically attached to request headers
3. Server validates token and responds with data
4. App continues normally

### Session Expiration Flow
1. **Detection**: API call receives 401 Unauthorized response
2. **Token Cleanup**: `apiService` removes expired token from AsyncStorage
3. **Callback Trigger**: Session expired callback is executed
4. **Modal Display**: SessionTimeoutModal is shown to user
5. **Countdown**: 10-second countdown begins for auto-redirect
6. **Logout Process**: User data is cleared from storage
7. **Navigation**: User is redirected to login screen
8. **State Reset**: Auth context is updated to unauthenticated state

## Usage

### Setup (Already done in App.tsx)
```tsx
// App.tsx includes:
- AuthProvider wrapper
- SessionManagerWrapper component
- NavigationContainer with ref
- SessionTimeoutModal
```

### Testing Session Expiration
```tsx
// Use SessionTestComponent or call directly:
apiService.simulateSessionExpiration();
```

### Custom Session Handling
```tsx
// Register custom session expiration handler
setSessionExpiredCallback(() => {
  // Custom logic here
  console.log('Session expired!');
});
```

## Key Features

### Automatic Detection
- No manual token validation needed
- Works with any API endpoint
- Handles both JSON and non-JSON error responses

### User-Friendly Experience
- Clear visual feedback with countdown
- Option to proceed immediately
- Graceful fallback if logout fails

### Robust Error Handling
- Continues even if logout API call fails
- Clears local storage regardless of network issues
- Forces navigation to login as fallback

### Memory Management
- Properly cleans up callbacks
- Prevents memory leaks
- Uses React hooks best practices

## Configuration

### Timeout Settings
```tsx
// In SessionTimeoutModal
remainingTime={10} // 10 seconds countdown
```

### Storage Keys
```tsx
// In constants/index.ts
STORAGE_KEYS = {
  USER_TOKEN: '@queueless:userToken',
  USER_DATA: '@queueless:userData',
}
```

### API Endpoints
```tsx
// API service automatically handles all endpoints
// with requireAuth: true parameter
```

## Security Considerations

### Token Security
- Tokens are cleared immediately on expiration
- No sensitive data persists after logout
- AsyncStorage is properly cleaned

### Navigation Security
- Stack is reset to prevent back navigation
- User cannot return to authenticated screens
- Login is required for re-access

### Error Handling
- No sensitive error information exposed
- Generic session expired messages
- Logs errors for debugging without exposing tokens

## Testing

### Manual Testing
1. Use SessionTestComponent in development
2. Call `apiService.simulateSessionExpiration()`
3. Verify modal appears and countdown works
4. Check navigation to login screen
5. Verify AsyncStorage is cleared

### Integration Testing
- Test with real expired JWT tokens
- Verify with network interceptors
- Check all protected endpoints trigger flow
- Validate cleanup on app restart

## Troubleshooting

### Modal Not Showing
- Ensure SessionManagerWrapper is mounted
- Check if AuthProvider wraps the app
- Verify GlobalModalProvider is present

### Navigation Not Working
- Check navigationRef is attached to NavigationContainer
- Verify NavigationService is properly imported
- Ensure login screen exists in navigator

### Storage Not Cleared
- Check AsyncStorage permissions
- Verify STORAGE_KEYS match actual keys used
- Test storage cleanup manually
