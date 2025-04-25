import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { useTransactions } from '../context/TransactionContext'; // Cambiado a useTransactions
import { format } from 'date-fns';
import { FontAwesome5 } from '@expo/vector-icons';
import { formatCurrency } from '../utils/formatUtils';
import Header from '../components/common/Header';
import Loader from '../components/common/Loader';

interface MarkedDates {
  [date: string]: {
    marked?: boolean;
    dotColor?: string;
    selected?: boolean;
    selectedColor?: string;
  };
}

// Definir la interfaz Transaction
interface Transaction {
  id?: string;
  type: 'income' | 'expense';
  category: string;
  detail?: string;
  amount: number;
  date: string;
  dateObj?: Date;
}

const CalendarScreen: React.FC = () => {
  const { getTransactionsByMonth, refreshData } = useTransactions(); // Cambiado a useTransactions
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [monthExpenses, setMonthExpenses] = useState(0);
  const [expensesByCategory, setExpensesByCategory] = useState<{ [key: string]: number }>({});
  const [dayTransactions, setDayTransactions] = useState<Transaction[]>([]);
  const [selectedDay, setSelectedDay] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    loadTransactionData();
  }, []);

  const loadTransactionData = async () => {
    setIsLoading(true);
    try {
      const month = selectedDate.getMonth() + 1;
      const year = selectedDate.getFullYear();
      
      // Usar getTransactionsByMonth y guardarlo en el estado local
      const monthlyTransactions = await getTransactionsByMonth(month, year);
      setTransactions(monthlyTransactions);
      
      // Process transactions data
      processTransactions(monthlyTransactions);
    } catch (error) {
      console.error('Error loading calendar data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const processTransactions = (transactionData: Transaction[]) => {
    // Mark dates with transactions
    const marked: MarkedDates = {};
    let totalExpenses = 0;
    const expenseCategories: { [key: string]: number } = {};
    
    transactionData.forEach(transaction => {
      // Asegurar que dateObj existe, o crear una a partir de date si es string
      const dateObj = transaction.dateObj || new Date(transaction.date);
      const dateStr = dateObj instanceof Date 
        ? dateObj.toISOString().split('T')[0] 
        : new Date().toISOString().split('T')[0];
      
      // Mark transaction dates
      if (!marked[dateStr]) {
        marked[dateStr] = { 
          marked: true,
          dotColor: transaction.type === 'income' ? '#4CAF50' : '#F44336'
        };
      }
      
      // Calculate monthly expenses
      if (transaction.type === 'expense') {
        totalExpenses += transaction.amount;
        
        // Group expenses by category
        if (!expenseCategories[transaction.category]) {
          expenseCategories[transaction.category] = 0;
        }
        expenseCategories[transaction.category] += transaction.amount;
      }
    });
    
    // Set today as selected if no date is selected
    if (!selectedDay) {
      const today = new Date().toISOString().split('T')[0];
      marked[today] = { ...marked[today], selected: true, selectedColor: '#F9BE00' };
      setSelectedDay(today);
      
      // Filter transactions for the selected day
      filterDayTransactions(today, transactionData);
    }
    
    setMarkedDates(marked);
    setMonthExpenses(totalExpenses);
    setExpensesByCategory(expenseCategories);
  };

  const filterDayTransactions = (dateStr: string, transactionData: Transaction[] = transactions) => {
    const dayTxs = transactionData.filter(tx => {
      const txDate = tx.dateObj || new Date(tx.date);
      return txDate instanceof Date 
        ? txDate.toISOString().split('T')[0] === dateStr
        : false;
    });
    setDayTransactions(dayTxs);
  };

  const onDayPress = (day: DateData) => {
    const dateStr = day.dateString;
    
    // Update marked dates
    const newMarkedDates = { ...markedDates };
    
    // Remove selection from the previous date
    if (selectedDay && newMarkedDates[selectedDay]) {
      newMarkedDates[selectedDay] = { 
        ...newMarkedDates[selectedDay], 
        selected: false 
      };
    }
    
    // Mark the new selected date
    newMarkedDates[dateStr] = { 
      ...newMarkedDates[dateStr],
      marked: newMarkedDates[dateStr]?.marked || false, 
      dotColor: newMarkedDates[dateStr]?.dotColor,
      selected: true, 
      selectedColor: '#F9BE00'
    };
    
    setMarkedDates(newMarkedDates);
    setSelectedDay(dateStr);
    
    // Filter transactions for the selected day
    filterDayTransactions(dateStr);
  };

  const onMonthChange = (month: DateData) => {
    const newDate = new Date(month.year, month.month - 1, 1);
    setSelectedDate(newDate);
    loadTransactionData();
  };

  const getCategoryPercentage = (categoryAmount: number) => {
    if (monthExpenses === 0) return 0;
    return Math.round((categoryAmount / monthExpenses) * 100);
  };

  const getTransactionIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'gastos medicos':
        return <FontAwesome5 name="hospital" size={20} color="#484848" />;
      case 'supermercado':
        return <FontAwesome5 name="shopping-cart" size={20} color="#484848" />;
      case 'servicio de luz':
        return <FontAwesome5 name="lightbulb" size={20} color="#484848" />;
      case 'gasolina':
        return <FontAwesome5 name="gas-pump" size={20} color="#484848" />;
      case 'servicio de agua':
        return <FontAwesome5 name="tint" size={20} color="#484848" />;
      case 'salario':
        return <FontAwesome5 name="briefcase" size={20} color="#484848" />;
      case 'venta':
        return <FontAwesome5 name="dollar-sign" size={20} color="#484848" />;
      default:
        return <FontAwesome5 name="money-bill" size={20} color="#484848" />;
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <Header title="Calendario" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={onDayPress}
            onMonthChange={onMonthChange}
            markedDates={markedDates}
            theme={{
              selectedDayBackgroundColor: '#F9BE00',
              todayTextColor: '#F9BE00',
              arrowColor: '#F9BE00',
              monthTextColor: '#000',
              textMonthFontWeight: 'bold',
              textDayFontSize: 14,
              textMonthFontSize: 16,
            }}
          />
        </View>
        
        {/* Selected Day Transactions */}
        <View style={styles.dayTransactionsContainer}>
          <Text style={styles.sectionTitle}>
            Transacciones del {selectedDay ? format(new Date(selectedDay), 'dd/MM/yyyy') : 'día'}
          </Text>
          
          {dayTransactions.length > 0 ? (
            dayTransactions.map((transaction, index) => (
              <View key={index} style={styles.transactionItem}>
                <View style={styles.transactionLeftContent}>
                  <View style={styles.transactionIconContainer}>
                    {getTransactionIcon(transaction.category)}
                  </View>
                  <View>
                    <Text style={styles.transactionTitle}>{transaction.category}</Text>
                    <Text style={styles.transactionDetail}>{transaction.detail || ''}</Text>
                  </View>
                </View>
                <Text 
                  style={[
                    styles.transactionAmount,
                    transaction.type === 'income' ? styles.incomeText : styles.expenseText
                  ]}
                >
                  {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No hay transacciones para este día</Text>
          )}
        </View>
        
        {/* Monthly Summary */}
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Resumen Mensual</Text>
          
          <View style={styles.expenseSummary}>
            <Text style={styles.expenseTitle}>Gastos Totales:</Text>
            <Text style={styles.expenseAmount}>{formatCurrency(monthExpenses)}</Text>
          </View>
          
          {/* Expense Categories */}
          {Object.entries(expensesByCategory).length > 0 ? (
            <View style={styles.categoriesList}>
              {Object.entries(expensesByCategory).map(([category, amount], index) => (
                <View key={index} style={styles.categoryItem}>
                  <View style={styles.categoryHeader}>
                    <View style={styles.categoryIconContainer}>
                      {getTransactionIcon(category)}
                    </View>
                    <Text style={styles.categoryName}>{category}</Text>
                    <Text style={styles.categoryPercentage}>
                      {getCategoryPercentage(amount as number)}%
                    </Text>
                  </View>
                  
                  <View style={styles.progressBarContainer}>
                    <View 
                      style={[
                        styles.progressBar, 
                        { width: `${getCategoryPercentage(amount as number)}%` }
                      ]} 
                    />
                  </View>
                  
                  <Text style={styles.categoryAmount}>
                    {formatCurrency(amount as number)}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>No hay gastos registrados este mes</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  calendarContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  dayTransactionsContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 15,
    marginTop: 0,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  transactionLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#F2F2F2',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  transactionTitle: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  transactionDetail: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  transactionAmount: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  incomeText: {
    color: '#4CAF50',
  },
  expenseText: {
    color: '#F44336',
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    padding: 20,
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 15,
    marginTop: 0,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  expenseSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#F8F8F8',
    padding: 15,
    borderRadius: 8,
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F44336',
  },
  categoriesList: {
    marginTop: 10,
  },
  categoryItem: {
    marginBottom: 15,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  categoryIconContainer: {
    width: 30,
    height: 30,
    backgroundColor: '#F2F2F2',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  categoryName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  categoryPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    marginBottom: 5,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F9BE00',
    borderRadius: 4,
  },
  categoryAmount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  }
});

export default CalendarScreen;