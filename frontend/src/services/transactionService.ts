import { mockTransactions, mockBalance } from './mockData';

// Simulated transaction service for demo purposes
export const transactionService = {
  getBalance: async () => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return { balance: mockBalance };
  },
  
  getIncomeTransactions: async () => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const incomeTransactions = mockTransactions.filter(t => t.type === 'income');
    
    return { transactions: incomeTransactions };
  },
  
  getExpenseTransactions: async () => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const expenseTransactions = mockTransactions.filter(t => t.type === 'expense');
    
    return { transactions: expenseTransactions };
  },
  
  getRecentTransactions: async () => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Sort by date descending and take the first 5
    const sortedTransactions = [...mockTransactions].sort((a, b) => {
      return new Date(b.dateObj).getTime() - new Date(a.dateObj).getTime();
    }).slice(0, 5);
    
    return { transactions: sortedTransactions };
  },
  
  getTransactionsByMonth: async (month, year) => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Filter transactions by month and year
    const filteredTransactions = mockTransactions.filter(t => {
      const date = new Date(t.dateObj);
      return date.getMonth() + 1 === month && date.getFullYear() === year;
    });
    
    return { transactions: filteredTransactions };
  },
  
  addTransaction: async (transaction) => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Create new transaction
    const newTransaction = {
      id: 'tx-' + Date.now(),
      ...transaction,
      dateObj: new Date()
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

// services/mockData.ts
export const mockUsers = [
  {
    id: 'user-1',
    name: 'Fabricio Salazar',
    email: 'fabricio@example.com',
    password: 'password123',
    type: 'personal',
    birthdate: '01/01/1990'
  }
];

export const mockBalance = 950.00;

export const mockTransactions = [
  {
    id: 'tx-1',
    type: 'income',
    category: 'Salario',
    subcategory: 'Salarios',
    amount: 900.00,
    date: '10 mar',
    dateObj: new Date(2025, 2, 10),
    detail: 'Salario mensual'
  },
  {
    id: 'tx-2',
    type: 'income',
    category: 'Venta',
    subcategory: 'Venta',
    amount: 50.00,
    date: '28 abr',
    dateObj: new Date(2025, 3, 28),
    detail: 'Venta de artículos'
  },
  {
    id: 'tx-3',
    type: 'income',
    category: 'Venta',
    subcategory: 'Venta de celular',
    amount: 250.00,
    date: '30 abr',
    dateObj: new Date(2025, 3, 30),
    detail: 'Venta de teléfono usado'
  },
  {
    id: 'tx-4',
    type: 'expense',
    category: 'Supermercado',
    amount: 150.00,
    date: '20 mar',
    dateObj: new Date(2025, 2, 20),
    detail: 'Compras semanales'
  },
  {
    id: 'tx-5',
    type: 'expense',
    category: 'Servicio de Luz',
    amount: 50.00,
    date: '21 mar',
    dateObj: new Date(2025, 2, 21),
    detail: 'Factura mensual'
  },
  {
    id: 'tx-6',
    type: 'expense',
    category: 'Gasolina',
    amount: 50.00,
    date: '18 mar',
    dateObj: new Date(2025, 2, 18),
    detail: 'Tanque lleno'
  },
  {
    id: 'tx-7',
    type: 'expense',
    category: 'Gastos Medicos',
    amount: 100.00,
    date: '15 mar',
    dateObj: new Date(2025, 2, 15),
    detail: 'Consulta médica'
  },
  {
    id: 'tx-8',
    type: 'expense',
    category: 'Servicio de agua',
    amount: 10.00,
    date: '28 mar',
    dateObj: new Date(2025, 2, 28),
    detail: 'Factura bimestral'
  }
];

// utils/formatUtils.ts
export const formatCurrency = (amount: number): string => {
  return `$ ${amount.toFixed(2)}`;
};

export const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
};