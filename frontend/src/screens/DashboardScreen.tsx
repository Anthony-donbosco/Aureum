import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView,
  RefreshControl
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTransaction } from '../context/TransactionContext';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import Loader from '../components/common/Loader';
import { formatCurrency } from '../utils/formatUtils';

const DashboardScreen: React.FC = () => {
  const { user } = useAuth();
  const { 
    balance, 
    recentTransactions, 
    fetchBalance, 
    fetchRecentTransactions 
  } = useTransaction();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchBalance(),
        fetchRecentTransactions()
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  if (isLoading) {
    return <Loader />;
  }

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

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.greeting}>Hola, {user?.name?.split(' ')[0]}</Text>
          <View style={styles.iconContainer}>
            <TouchableOpacity>
              <Ionicons name="moon-outline" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="notifications-outline" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Fondos Disponibles</Text>
        <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionButtonInner, styles.incomeButton]}>
              <Text style={styles.actionButtonText}>Ingresos</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionButtonInner, styles.expenseButton]}>
              <Text style={styles.actionButtonText}>Egresos</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.chartSection}>
        {/* Chart placeholder */}
        <View style={styles.chartPlaceholder}>
          <View style={styles.barChart}>
            <View style={[styles.bar, { height: 40 }]} />
            <View style={[styles.bar, { height: 80 }]} />
            <View style={[styles.bar, { height: 20 }]} />
            <View style={[styles.bar, { height: 60 }]} />
          </View>
          <View style={styles.pieChart} />
        </View>
      </View>

      <View style={styles.transactionsSection}>
        <Text style={styles.sectionTitle}>Historial de ingresos y egresos</Text>
        {recentTransactions.map((transaction, index) => (
          <View key={index} style={styles.transactionItem}>
            <View style={styles.transactionLeftContent}>
              <View style={styles.transactionIconContainer}>
                {getTransactionIcon(transaction.category)}
              </View>
              <View>
                <Text style={styles.transactionTitle}>{transaction.category}</Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
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
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconContainer: {
    flexDirection: 'row',
    width: 60,
    justifyContent: 'space-between',
  },
  balanceCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    margin: 20,
    marginTop: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  actionButtonInner: {
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 5,
  },
  incomeButton: {
    backgroundColor: '#4CAF50',
  },
  expenseButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  chartSection: {
    padding: 20,
  },
  chartPlaceholder: {
    height: 150,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  barChart: {
    flex: 1,
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  bar: {
    width: 20,
    backgroundColor: '#56CCF2',
    borderRadius: 5,
  },
  pieChart: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F2F2F2',
    borderWidth: 15,
    borderColor: '#56CCF2',
  },
  transactionsSection: {
    padding: 20,
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
});