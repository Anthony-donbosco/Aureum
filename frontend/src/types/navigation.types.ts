/**
 * Tipos para la navegación
 */
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { TransactionType } from './transaction.types';

/**
 * Tipo para los parámetros de la ruta de transacciones
 */
export type TransactionRouteParams = {
  type: TransactionType;
};

/**
 * Tipo para los parámetros de todas las rutas
 */
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Profile: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  Transactions: undefined;
  AddTransaction: TransactionRouteParams;
  TransactionDetail: { id: string };
  Calendar: undefined;
  Settings: undefined;
  AboutApp: undefined;
  Terms: undefined;
};

/**
 * Tipo para las propiedades de navegación
 */
export type NavigationProps = NavigationProp<RootStackParamList>;

/**
 * Tipo para las propiedades de ruta de transacciones
 */
export type TransactionScreenRouteProp = RouteProp<RootStackParamList, 'AddTransaction'>;