import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { useTransaction } from '../../context/TransactionContext';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { formatCurrency } from '../../utils/formatUtils';
import Loader from '../common/Loader';

const Expense: React.FC = () => {
  const { expenseTransactions, fetchExpenseTransactions } = useTransaction();
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    loadExpenseData();
  }, []);

  const loadExpenseData = async () => {
    setIsLoading(true);
    try {
      await fetchExpenseTransactions();
    } catch (error) {
      console.error('Error loading expense data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadExpenseData();
    setRefreshing(false);
  };

  const addExpense = () => {
    navigation.navigate('AddTransaction', { type: 'expense' });
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
      default:
        return <FontAwesome5 name="receipt" size={20} color="#484848" />;
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={expenseTransactions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <View style={styles.transactionLeftContent}>
              <View style={styles.transactionIconContainer}>
                {getTransactionIcon(item.category)}
              </View>
              <View>
                <Text style={styles.transactionTitle}>{item.category}</Text>
                <Text style={styles.transactionDate}>{item.date}</Text>
              </View>
            </View>
            <Text style={styles.transactionAmount}>
              -{formatCurrency(item.amount)}
            </Text>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay egresos registrados</Text>
          </View>
        }
      />
      <TouchableOpacity style={styles.addButton} onPress={addExpense}>
        <Text style={styles.addButtonText}>+ Añadir Egresos</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
    fontSize: 16,
  },
  transactionDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  transactionAmount: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#F44336',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  addButton: {
    backgroundColor: '#F9BE00',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Expense;