import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import AppNavigator from './src/navigation/AppNavigator';
import {store, persistor} from './src/store';
import {COLORS} from './src/constants';
import {LoadingSpinner} from './src/components';
import {GlobalModalProvider} from './src/context/GlobalModalContext';
import {AuthProvider} from './src/context/AuthContext';
import {navigationRef} from './src/services/NavigationService';
import {useSessionManager} from './src/hooks/useSessionManager';
import {SessionTimeoutModal} from './src/components/common/SessionTimeoutModal';

// Session Manager Component
const SessionManagerWrapper: React.FC = () => {
  const {showSessionExpired, handleSessionExpiredConfirm} = useSessionManager();
  
  return (
    <SessionTimeoutModal
      visible={showSessionExpired}
      onConfirm={handleSessionExpiredConfirm}
      remainingTime={10}
    />
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate
        loading={<LoadingSpinner text="Loading..." />}
        persistor={persistor}>
        <AuthProvider>
          <GlobalModalProvider>
            <NavigationContainer ref={navigationRef}>
              <StatusBar
                barStyle="light-content"
                backgroundColor={COLORS.primary}
                translucent={false}
              />
              <SessionManagerWrapper />
              <AppNavigator />
            </NavigationContainer>
          </GlobalModalProvider>
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
