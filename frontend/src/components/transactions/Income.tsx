import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  ScrollView,
  RefreshControl
} from 'react-native';
import { useTransactions } from '../../context/TransactionContext'; // Cambiado de useTransaction a useTransactions
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { formatCurrency } from '../../utils/formatUtils';
import Loader from '../common/Loader';

// Definir el tipo para la navegación
type NavigationProp = {
  navigate: (screen: string, params?: any) => void;
};

const Income: React.FC = () => {
  const { incomeTransactions, refreshData } = useTransactions(); // Cambiado a useTransactions y refreshData
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    loadIncomeData();
  }, []);

  const loadIncomeData = async () => {
    setIsLoading(true);
    try {
      await refreshData(); // Cambiado a refreshData en lugar de fetchIncomeTransactions
    } catch (error) {
      console.error('Error loading income data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadIncomeData();
    setRefreshing(false);
  };

  const addIncome = () => {
    navigation.navigate('AddTransaction', { type: 'income' });
  };

  const getTransactionIcon = (category: string) => {
    switch (category.toLowerCase()) {
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
      <FlatList
        data={incomeTransactions}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <View style={styles.transactionLeftContent}>
              <View style={styles.transactionIconContainer}>
                {getTransactionIcon(item.category)}
              </View>
              <View>
                <Text style={styles.transactionTitle}>{item.category}</Text>
                <Text style={styles.transactionSubtitle}>{item.subcategory || ''}</Text>
                <Text style={styles.transactionDate}>{item.date}</Text>
              </View>
            </View>
            <Text style={styles.transactionAmount}>
              +{formatCurrency(item.amount)}
            </Text>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay ingresos registrados</Text>
          </View>
        }
      />
      <TouchableOpacity style={styles.addButton} onPress={addIncome}>
        <Text style={styles.addButtonText}>+ Añadir Ingresos</Text>
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
  transactionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  transactionDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  transactionAmount: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#4CAF50',
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

export default Income;