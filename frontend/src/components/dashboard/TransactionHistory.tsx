import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTransactions } from '../../context/TransactionContext'; // Cambiado de useTransaction a useTransactions
import { formatCurrency } from '../../utils/formatUtils';

// Definir el tipo para la navegación
type NavigationProp = {
  navigate: (screen: string, params?: any) => void;
};

const TransactionHistory: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { recentTransactions } = useTransactions();

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

  const viewAllTransactions = () => {
    navigation.navigate('Transactions');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Historial de Transacciones</Text>
        <TouchableOpacity onPress={viewAllTransactions}>
          <Text style={styles.viewAllText}>Ver Todo</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={recentTransactions.slice(0, 3)}
        keyExtractor={(item, index) => item.id || index.toString()}
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
            <Text 
              style={[
                styles.transactionAmount,
                item.type === 'income' ? styles.incomeText : styles.expenseText
              ]}
            >
              {item.type === 'income' ? '+' : '-'} {formatCurrency(item.amount)}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay transacciones recientes</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAllText: {
    color: '#F9BE00',
    fontWeight: '500',
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
    shadowOpacity: 0.05,
    shadowRadius: 3,
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
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  transactionAmount: {
    fontWeight: 'bold',
  },
  incomeText: {
    color: '#4CAF50',
  },
  expenseText: {
    color: '#F44336',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 14,
  }
});

export default TransactionHistory;