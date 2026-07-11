import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import { store } from '@/store';
import { AuthProvider } from '@/features/auth/context/AuthContext';
import { NavigationContainer } from '@/navigation';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <AuthProvider>
          <NavigationContainer />
        </AuthProvider>
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;
