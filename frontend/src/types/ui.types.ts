/**
 * Tipos para componentes UI
 */
import { StyleProp, TextStyle, ViewStyle } from 'react-native';

/**
 * Tema de la aplicación
 */
export interface AppTheme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    income: string;
    expense: string;
  };
  spacing: {
    xs: number;
    s: number;
    m: number;
    l: number;
    xl: number;
    xxl: number;
  };
  typography: {
    fontSizes: {
      small: number;
      medium: number;
      large: number;
      xlarge: number;
      xxlarge: number;
    };
    fontWeights: {
      light: string;
      regular: string;
      medium: string;
      bold: string;
    };
  };
  borderRadius: {
    small: number;
    medium: number;
    large: number;
    pill: number;
  };
}

/**
 * Props comunes para componentes
 */
export interface BaseComponentProps {
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/**
 * Props para componentes de texto
 */
export interface TextComponentProps extends BaseComponentProps {
  textStyle?: StyleProp<TextStyle>;
}

/**
 * Tema de modo oscuro / claro
 */
export type ThemeMode = 'light' | 'dark';

/**
 * Estado del contexto de tema
 */
export interface ThemeContextState {
  theme: AppTheme;
  mode: ThemeMode;
  toggleTheme: () => void;
}

/**
 * Tipos de notificación
 */
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

/**
 * Datos de notificación
 */
export interface NotificationData {
  type: NotificationType;
  message: string;
  duration?: number;
}

/**
 * Estado del contexto de notificaciones
 */
export interface NotificationContextState {
  showNotification: (notification: NotificationData) => void;
  hideNotification: () => void;
  visible: boolean;
  currentNotification: NotificationData | null;
}
