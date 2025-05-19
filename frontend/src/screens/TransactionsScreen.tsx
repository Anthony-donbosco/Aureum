import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Income from '../components/transactions/Income';
import Expense from '../components/transactions/Expense';

const Tab = createMaterialTopTabNavigator();

const TransactionsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Tab.Navigator
        // No usamos tabBar aquí para evitar problemas con TypeScript
        screenOptions={{
          tabBarActiveTintColor: '#F9BE00',
          tabBarInactiveTintColor: '#666',
          tabBarIndicatorStyle: { backgroundColor: '#F9BE00' },
          tabBarLabelStyle: { fontWeight: 'bold' },
        }}
      >
        <Tab.Screen name="Ingresos" component={Income} />
        <Tab.Screen name="Egresos" component={Expense} />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default TransactionsScreen;