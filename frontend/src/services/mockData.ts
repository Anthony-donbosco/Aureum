// mockData.ts
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  type: string;
  birthdate: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  subcategory?: string;
  amount: number;
  date: string;
  dateObj: Date;
  detail: string;
}

export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Usuario de Prueba',
    email: 'test@example.com',
    password: 'password123',
    type: 'standard',
    birthdate: '1990-01-01'
  },
  {
    id: 'user-2',
    name: 'Fabricio Salazar',
    email: 'fabricio@example.com',
    password: 'password123',
    type: 'personal',
    birthdate: '01/01/1990'
  }
];

export const mockBalance = 950.00;

export const mockTransactions: Transaction[] = [
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

export const mockUserData = {
  defaultUser: {
    name: 'anthony rivera',
    email: 'anthony@gmail.com',
    type: 'cliente',
    birthdate: '2000-01-01'
  },
  
  // Tipos de usuario disponibles
  userTypes: ['cliente', 'administrador', 'vendedor'],
  
  // Configuraciones predeterminadas
  settings: {
    language: 'es',
    theme: 'light',
    notifications: true
  },
  
  // Datos de perfil de ejemplo
  profileExample: {
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    location: 'SOYAGOD',
    phoneNumber: '6136-8548',
    profilePicture: ''
  }
};