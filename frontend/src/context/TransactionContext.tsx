import React, { createContext, useState, useContext } from 'react';
import { transactionService } from '../services/transactionService';
import { format, parse } from 'date-fns';
import { es } from 'date-fns/locale';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  subcategory?: string;
  amount: number;
  date: string;
  dateObj: Date;
  detail: string;
}

interface TransactionInput {
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
  detail: string;
}

interface TransactionContextData {
  balance: number;
  incomeTransactions: Transaction[];
  expenseTransactions: Transaction[];
  recentTransactions: Transaction[];
  transactions: Transaction[];
  fetchBalance: () => Promise<void>;
  fetchIncomeTransactions: () => Promise<void>;
  fetchExpenseTransactions: () => Promise<void>;
  fetchRecentTransactions: () => Promise<void>;
  fetchTransactionsByMonth: (month: number, year: number) => Promise<void>;
  addTransaction: (transaction: TransactionInput) => Promise<void>;
}

const TransactionContext = createContext<TransactionContextData>({} as TransactionContextData);

export const TransactionProvider: React.FC = ({ children }) => {
  const [balance, setBalance] = useState(0);
  const [incomeTransactions, setIncomeTransactions] = useState<Transaction[]>([]);
  const [expenseTransactions, setExpenseTransactions] = useState<Transaction[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const fetchBalance = async () => {
    try {
      // In a real app, this would make an API call
      const response = await transactionService.getBalance();
      setBalance(response.balance);
    } catch (error) {
      console.error('Fetch balance error:', error);
      throw error;
    }
  };

  const fetchIncomeTransactions = async () => {
    try {
      // In a real app, this would make an API call
      const response = await transactionService.getIncomeTransactions();
      
      // Process dates
      const processedTransactions = response.transactions.map(transaction => ({
        ...transaction,
        dateObj: parseDateString(transaction.date)
      }));
      
      setIncomeTransactions(processedTransactions);
    } catch (error) {
      console.error('Fetch income transactions error:', error);
      throw error;
    }
  };

  const fetchExpenseTransactions = async () => {
    try {
      // In a real app, this would make an API call
      const response = await transactionService.getExpenseTransactions();
      
      // Process dates
      const processedTransactions = response.transactions.map(transaction => ({
        ...transaction,
        dateObj: parseDateString(transaction.date)
      }));
      
      setExpenseTransactions(processedTransactions);
    } catch (error) {
      console.error('Fetch expense transactions error:', error);
      throw error;
    }
  };

  const fetchRecentTransactions = async () => {
    try {
      // In a real app, this would make an API call
      const response = await transactionService.getRecentTransactions();
      
      // Process dates
      const processedTransactions = response.transactions.map(transaction => ({
        ...transaction,
        dateObj: parseDateString(transaction.date)
      }));
      
      setRecentTransactions(processedTransactions);
    } catch (error) {
      console.error('Fetch recent transactions error:', error);
      throw error;
    }
  };

  const fetchTransactionsByMonth = async (month: number, year: number) => {
    try {
      // In a real app, this would make an API call
      const response = await transactionService.getTransactionsByMonth(month, year);
      
      // Process dates
      const processedTransactions = response.transactions.map(transaction => ({
        ...transaction,
        dateObj: parseDateString(transaction.date)
      }));
      
      setTransactions(processedTransactions);
    } catch (error) {
      console.error('Fetch transactions by month error:', error);
      throw error;
    }
  };

  const addTransaction = async (transaction: TransactionInput) => {
    try {
      // In a real app, this would make an API call
      await transactionService.addTransaction(transaction);
      
      // Update relevant transaction lists
      if (transaction.type === 'income') {
        await fetchIncomeTransactions();
      } else {
        await fetchExpenseTransactions();
      }
      
      // Update balance and recent transactions
      await fetchBalance();
      await fetchRecentTransactions();
    } catch (error) {
      console.error('Add transaction error:', error);
      throw error;
    }
  };

  // Helper function to parse date strings
  const parseDateString = (dateStr: string): Date => {
    try {
      // Try different date formats
      // Format: "15 mar", "28 abr", etc.
      return parse(dateStr, 'dd MMM', new Date(), { locale: es });
    } catch (error) {
      console.warn('Error parsing date:', dateStr, error);
      return new Date(); // Fallback to current date
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        balance,
        incomeTransactions,
        expenseTransactions,
        recentTransactions,
        transactions,
        fetchBalance,
        fetchIncomeTransactions,
        fetchExpenseTransactions,
        fetchRecentTransactions,
        fetchTransactionsByMonth,
        addTransaction
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransaction = () => {
  const context = useContext(TransactionContext);
  
  if (!context) {
    throw new Error('useTransaction must be used within a TransactionProvider');
  }
  
  return context;
};