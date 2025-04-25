import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

// Importar todas las pantallas
import AuthScreen from '../screens/AuthScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import CalendarScreen from '../screens/CalendarScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

// También importar las pantallas de transacciones 
// (suponiendo que existen basado en el código anterior)
import TransactionForm from '../components/transactions/TransactionForm';

// Definición de tipos para las rutas
type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  ChangePassword: undefined;
  EditProfile: undefined;
  AddTransaction: { type: 'income' | 'expense' };
};

type TabParamList = {
  Dashboard: undefined;
  Transactions: undefined;
  Calendar: undefined;
  Profile: undefined;
};

// Crear navegadores tipados
const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Definir correctamente el tipo para el nombre del icono
type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: IoniconsName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Transactions') {
            iconName = focused ? 'swap-vertical' : 'swap-vertical-outline';
          } else if (route.name === 'Calendar') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            // Valor predeterminado en caso de un nombre de ruta no reconocido
            iconName = 'help-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#F9BE00',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Transactions" component={TransactionsScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator: React.FC = () => {
  const { user } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen name="Auth" component={AuthScreen} />
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="AddTransaction" component={TransactionForm} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;