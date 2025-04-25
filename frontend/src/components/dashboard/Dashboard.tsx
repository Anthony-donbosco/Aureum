import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  RefreshControl,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useTransactions } from '../../context/TransactionContext'; // Cambiado de useTransaction a useTransactions
import { formatCurrency } from '../../utils/formatUtils';
import TransactionHistory from './TransactionHistory';
import Chart from './Chart';
import Loader from '../common/Loader';

const { width } = Dimensions.get('window');

// Definir el tipo para la navegación
type NavigationProp = {
  navigate: (screen: string, params?: any) => void;
};

const Dashboard: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();
  const { 
    balance, 
    loading: transactionLoading,
    recentTransactions,
    incomeTransactions,
    expenseTransactions,
    refreshData // Cambiado de fetchBalance, fetchRecentTransactions, etc. al método unificado refreshData
  } = useTransactions();
  
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'income' | 'expense'>('overview');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      await refreshData(); // Usando el método unificado de refreshData
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

  const getTotalIncome = () => {
    return incomeTransactions.reduce((sum, item) => sum + item.amount, 0);
  };

  const getTotalExpense = () => {
    return expenseTransactions.reduce((sum, item) => sum + item.amount, 0);
  };

  if (isLoading) {
    return <Loader />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            <View style={styles.chartSection}>
              <Text style={styles.sectionTitle}>Resumen</Text>
              <Chart />
            </View>
            <TransactionHistory />
          </>
        );
      case 'income':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabContentTitle}>Total de Ingresos</Text>
            <Text style={styles.incomeAmount}>{formatCurrency(getTotalIncome())}</Text>
            <View style={styles.incomeDetail}>
              <Text style={styles.detailLabel}>
                Ingresos Mensuales: {formatCurrency(getTotalIncome())}
              </Text>
              <Text style={styles.detailLabel}>
                Número de Transacciones: {incomeTransactions.length}
              </Text>
              <Text style={styles.detailLabel}>
                Ingreso Promedio: {formatCurrency(incomeTransactions.length ? getTotalIncome() / incomeTransactions.length : 0)}
              </Text>
            </View>
          </View>
        );
      case 'expense':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabContentTitle}>Total de Egresos</Text>
            <Text style={styles.expenseAmount}>{formatCurrency(getTotalExpense())}</Text>
            <View style={styles.expenseDetail}>
              <Text style={styles.detailLabel}>
                Egresos Mensuales: {formatCurrency(getTotalExpense())}
              </Text>
              <Text style={styles.detailLabel}>
                Número de Transacciones: {expenseTransactions.length}
              </Text>
              <Text style={styles.detailLabel}>
                Egreso Promedio: {formatCurrency(expenseTransactions.length ? getTotalExpense() / expenseTransactions.length : 0)}
              </Text>
            </View>
          </View>
        );
      default:
        return null;
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
          <Text style={styles.greeting}>Hola, {user?.name?.split(' ')[0] || 'Usuario'}</Text>
          <View style={styles.iconContainer}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="moon-outline" size={22} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={22} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Fondos Disponibles</Text>
        <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('AddTransaction', { type: 'income' })}
          >
            <View style={[styles.actionButtonInner, styles.incomeButton]}>
              <Ionicons name="add-circle-outline" size={16} color="white" />
              <Text style={styles.actionButtonText}>Ingresos</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('AddTransaction', { type: 'expense' })}
          >
            <View style={[styles.actionButtonInner, styles.expenseButton]}>
              <Ionicons name="remove-circle-outline" size={16} color="white" />
              <Text style={styles.actionButtonText}>Egresos</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
            Resumen
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'income' && styles.activeTab]}
          onPress={() => setActiveTab('income')}
        >
          <Text style={[styles.tabText, activeTab === 'income' && styles.activeTabText]}>
            Ingresos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'expense' && styles.activeTab]}
          onPress={() => setActiveTab('expense')}
        >
          <Text style={[styles.tabText, activeTab === 'expense' && styles.activeTabText]}>
            Egresos
          </Text>
        </TouchableOpacity>
      </View>

      {renderTabContent()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: 'white',
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  iconContainer: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 15,
  },
  balanceCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    margin: 20,
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
    flexDirection: 'row',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
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
    marginLeft: 5,
  },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    marginBottom: 15,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#F9BE00',
    borderRadius: 10,
  },
  tabText: {
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#000',
    fontWeight: 'bold',
  },
  tabContent: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  tabContentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  incomeAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
  },
  expenseAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F44336',
    marginBottom: 20,
  },
  incomeDetail: {
    width: '100%',
    backgroundColor: '#F8F8F8',
    padding: 15,
    borderRadius: 10,
  },
  expenseDetail: {
    width: '100%',
    backgroundColor: '#F8F8F8',
    padding: 15,
    borderRadius: 10,
  },
  detailLabel: {
    fontSize: 14,
    marginBottom: 8,
    color: '#666',
  },
  chartSection: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
});

export default Dashboard;