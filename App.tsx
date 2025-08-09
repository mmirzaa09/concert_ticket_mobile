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

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate
        loading={<LoadingSpinner text="Loading..." />}
        persistor={persistor}>
        <GlobalModalProvider>
          <NavigationContainer>
            <StatusBar
              barStyle="light-content"
              backgroundColor={COLORS.primary}
              translucent={false}
            />
            <AppNavigator />
          </NavigationContainer>
        </GlobalModalProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
