import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { AuthProvider } from './context/AuthContext';
import { TransactionProvider } from './context/TransactionContext';
import AppNavigator from './navigation/AppNavigator';
import Loader from './components/common/Loader';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate app initialization delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <AuthProvider>
        <TransactionProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </TransactionProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;