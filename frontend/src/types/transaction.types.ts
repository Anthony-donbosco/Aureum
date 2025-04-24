/**
 * Tipos para transacciones financieras
 */

/**
 * Tipo de transacción
 */
export type TransactionType = 'income' | 'expense';

/**
 * Categorías de transacciones
 */
export type TransactionCategory = 
  // Categorías de ingreso
  | 'Salario'
  | 'Venta'
  | 'Intereses'
  | 'Inversiones'
  | 'Bonificación'
  | 'Otros'
  // Categorías de egreso
  | 'Supermercado'
  | 'Restaurantes'
  | 'Transporte'
  | 'Entretenimiento'
  | 'Gastos Medicos'
  | 'Servicio de Luz'
  | 'Servicio de agua'
  | 'Gasolina'
  | 'Educación'
  | 'Vivienda'
  | 'Ropa'
  | 'Ahorro'
  | 'Otros';

/**
 * Interfaz para transacciones
 */
export interface Transaction {
  id: string;
  type: TransactionType;
  category: TransactionCategory | string;
  subcategory?: string;
  amount: number;
  date: string;
  dateObj: Date;
  detail: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
}

/**
 * Datos para crear una transacción
 */
export interface TransactionInput {
  type: TransactionType;
  category: TransactionCategory | string;
  subcategory?: string;
  amount: number;
  date: string;
  detail: string;
}

/**
 * Respuesta al obtener transacciones del servidor
 */
export interface TransactionsResponse {
  transactions: Transaction[];
}

/**
 * Respuesta al obtener el balance del servidor
 */
export interface BalanceResponse {
  balance: number;
}

/**
 * Estado del contexto de transacciones
 */
export interface TransactionContextState {
  balance: number;
  transactions: Transaction[];
  incomeTransactions: Transaction[];
  expenseTransactions: Transaction[];
  recentTransactions: Transaction[];
  loading: boolean;
  error: string | null;
  fetchBalance: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  fetchIncomeTransactions: () => Promise<void>;
  fetchExpenseTransactions: () => Promise<void>;
  fetchRecentTransactions: () => Promise<void>;
  fetchTransactionsByMonth: (month: number, year: number) => Promise<void>;
  addTransaction: (transaction: TransactionInput) => Promise<void>;
  clearError: () => void;
}

/**
 * Filtros para búsqueda de transacciones
 */
export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  type?: TransactionType;
  category?: TransactionCategory | string;
  minAmount?: number;
  maxAmount?: number;
}

/**
 * Resumen de transacciones por categoría
 */
export interface CategorySummary {
  category: TransactionCategory | string;
  amount: number;
  percentage: number;
  count: number;
}

/**
 * Análisis financiero mensual
 */
export interface MonthlyAnalysis {
  month: number;
  year: number;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  topExpenseCategories: CategorySummary[];
  topIncomeCategories: CategorySummary[];
}
