// Re-exportar la interfaz Transaction para que otros archivos puedan importarla
export type { Transaction } from './mockData';

import { mockTransactions as importedTransactions, mockBalance as importedBalance, Transaction as MockTransaction } from './mockData';

// Variables locales para poder modificarlas
let mockBalance = importedBalance;
let mockTransactions = [...importedTransactions]; // Copia para no modificar los originales

// Interfaz para los datos de transacciones nuevas
export interface NewTransaction {
  type: 'income' | 'expense';
  category: string;
  subcategory?: string;
  amount: number;
  detail: string;
  date?: string;
}

// Simulated transaction service for demo purposes
export const transactionService = {
  getBalance: async (): Promise<{ balance: number }> => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return { balance: mockBalance };
  },
  
  getIncomeTransactions: async (): Promise<{ transactions: MockTransaction[] }> => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const incomeTransactions = mockTransactions.filter(t => t.type === 'income');
    
    return { transactions: incomeTransactions };
  },
  
  getExpenseTransactions: async (): Promise<{ transactions: MockTransaction[] }> => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const expenseTransactions = mockTransactions.filter(t => t.type === 'expense');
    
    return { transactions: expenseTransactions };
  },
  
  getRecentTransactions: async (): Promise<{ transactions: MockTransaction[] }> => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Sort by date descending and take the first 5
    const sortedTransactions = [...mockTransactions].sort((a, b) => {
      return new Date(b.dateObj).getTime() - new Date(a.dateObj).getTime();
    }).slice(0, 5);
    
    return { transactions: sortedTransactions };
  },
  
  getTransactionsByMonth: async (month: number, year: number): Promise<{ transactions: MockTransaction[] }> => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Filter transactions by month and year
    const filteredTransactions = mockTransactions.filter(t => {
      const date = new Date(t.dateObj);
      return date.getMonth() + 1 === month && date.getFullYear() === year;
    });
    
    return { transactions: filteredTransactions };
  },
  
  addTransaction: async (transaction: NewTransaction): Promise<{ transaction: MockTransaction }> => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Create new transaction
    const newTransaction: MockTransaction = {
      id: 'tx-' + Date.now(),
      ...transaction,
      dateObj: new Date(),
      date: transaction.date || new Date().toLocaleDateString('es', { day: '2-digit', month: 'short' })
    };
    
    // In a real app, this would save to a database
    mockTransactions.push(newTransaction);
    
    // Update balance
    if (transaction.type === 'income') {
      mockBalance += transaction.amount;
    } else {
      mockBalance -= transaction.amount;
    }
    
    return { transaction: newTransaction };
  }
};

// utils/formatUtils.ts - Estas funciones deberían moverse a un archivo separado
export const formatCurrency = (amount: number): string => {
  return `$ ${amount.toFixed(2)}`;
};

export const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
};