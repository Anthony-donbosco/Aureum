import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { transactionService, Transaction, NewTransaction } from '../services/transactionService';

// Definir la interfaz para el contexto de transacciones
interface TransactionContextType {
  balance: number;
  loading: boolean;
  recentTransactions: Transaction[];
  incomeTransactions: Transaction[];
  expenseTransactions: Transaction[];
  addTransaction: (transaction: NewTransaction) => Promise<boolean>;
  refreshData: () => Promise<void>;
  getTransactionsByMonth: (month: number, year: number) => Promise<Transaction[]>;
}

// Definir el tipo para las props del proveedor
interface TransactionProviderProps {
  children: ReactNode;
}

// Crear el contexto con valores por defecto
const TransactionContext = createContext<TransactionContextType>({
  balance: 0,
  loading: false,
  recentTransactions: [],
  incomeTransactions: [],
  expenseTransactions: [],
  addTransaction: async () => false,
  refreshData: async () => {},
  getTransactionsByMonth: async () => [],
});

// Hook personalizado para usar el contexto
export const useTransactions = () => useContext(TransactionContext);

// Componente proveedor que envuelve la aplicación
export const TransactionProvider: React.FC<TransactionProviderProps> = ({ children }) => {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [incomeTransactions, setIncomeTransactions] = useState<Transaction[]>([]);
  const [expenseTransactions, setExpenseTransactions] = useState<Transaction[]>([]);

  // Cargar datos iniciales al montar el componente
  useEffect(() => {
    refreshData();
  }, []);

  // Función para refrescar todos los datos
  const refreshData = async (): Promise<void> => {
    setLoading(true);
    try {
      // Cargar balance
      const balanceResponse = await transactionService.getBalance();
      setBalance(balanceResponse.balance);
      
      // Cargar transacciones recientes
      const recentResponse = await transactionService.getRecentTransactions();
      setRecentTransactions(recentResponse.transactions);
      
      // Cargar transacciones de ingresos
      const incomeResponse = await transactionService.getIncomeTransactions();
      setIncomeTransactions(incomeResponse.transactions);
      
      // Cargar transacciones de gastos
      const expenseResponse = await transactionService.getExpenseTransactions();
      setExpenseTransactions(expenseResponse.transactions);
    } catch (error) {
      console.error('Error al cargar datos de transacciones:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para agregar una nueva transacción
  const addTransaction = async (transaction: NewTransaction): Promise<boolean> => {
    setLoading(true);
    try {
      await transactionService.addTransaction(transaction);
      // Refrescar datos después de agregar la transacción
      await refreshData();
      return true;
    } catch (error) {
      console.error('Error al agregar transacción:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener transacciones por mes y año
  const getTransactionsByMonth = async (month: number, year: number): Promise<Transaction[]> => {
    setLoading(true);
    try {
      const response = await transactionService.getTransactionsByMonth(month, year);
      return response.transactions;
    } catch (error) {
      console.error('Error al obtener transacciones por mes:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Valor del contexto que será proporcionado
  const contextValue: TransactionContextType = {
    balance,
    loading,
    recentTransactions,
    incomeTransactions,
    expenseTransactions,
    addTransaction,
    refreshData,
    getTransactionsByMonth,
  };

  return (
    <TransactionContext.Provider value={contextValue}>
      {children}
    </TransactionContext.Provider>
  );
};