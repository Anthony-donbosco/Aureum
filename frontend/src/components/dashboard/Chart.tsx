import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { useTransaction } from '../../context/TransactionContext';
import { formatCurrency } from '../../utils/formatUtils';

const { width } = Dimensions.get('window');

type ChartType = 'bar' | 'pie';

const Chart: React.FC = () => {
  const { incomeTransactions, expenseTransactions } = useTransaction();
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [loading, setLoading] = useState(false);

  const toggleChartType = () => {
    setLoading(true);
    setTimeout(() => {
      setChartType(chartType === 'bar' ? 'pie' : 'bar');
      setLoading(false);
    }, 300);
  };

  // Process data for charts
  const getChartData = () => {
    if (chartType === 'bar') {
      // Group transactions by category for bar chart
      const incomeByCategory = new Map();
      const expenseByCategory = new Map();

      incomeTransactions.forEach(transaction => {
        const currentAmount = incomeByCategory.get(transaction.category) || 0;
        incomeByCategory.set(transaction.category, currentAmount + transaction.amount);
      });

      expenseTransactions.forEach(transaction => {
        const currentAmount = expenseByCategory.get(transaction.category) || 0;
        expenseByCategory.set(transaction.category, currentAmount + transaction.amount);
      });

      // Process data for bar chart
      const labels = ['Ingresos', 'Egresos'];
      const incomeData = [...incomeByCategory.values()].reduce((a, b) => a + b, 0);
      const expenseData = [...expenseByCategory.values()].reduce((a, b) => a + b, 0);
      
      return {
        labels,
        datasets: [
          {
            data: [incomeData, expenseData],
          }
        ],
      };
    } else {
      // Group data for pie chart (showing expenses by category)
      const expensesByCategory = new Map();
      
      expenseTransactions.forEach(transaction => {
        const currentAmount = expensesByCategory.get(transaction.category) || 0;
        expensesByCategory.set(transaction.category, currentAmount + transaction.amount);
      });
      
      // Convert to data format for pie chart
      const pieData = [...expensesByCategory.entries()].map(([category, amount], index) => {
        // Generate colors based on index
        const colors = [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
          '#FF9F40', '#7BCFA9', '#E7E9ED', '#8A9FD1', '#C9CB3F'
        ];
        
        return {
          name: category,
          amount,
          color: colors[index % colors.length],
          legendFontColor: '#7F7F7F',
          legendFontSize: 12
        };
      });
      
      return pieData;
    }
  };

  const renderChart = () => {
    const chartConfig = {
      backgroundGradientFrom: '#fff',
      backgroundGradientTo: '#fff',
      color: (opacity = 1) => `rgba(249, 190, 0, ${opacity})`,
      strokeWidth: 2,
      barPercentage: 0.5,
    };

    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F9BE00" />
        </View>
      );
    }

    if (chartType === 'bar') {
      const barData = getChartData();
      return (
        <BarChart
          data={barData}
          width={width - 40}
          height={220}
          yAxisLabel="$"
          chartConfig={chartConfig}
          style={styles.chart}
          fromZero
          showValuesOnTopOfBars
        />
      );
    } else {
      const pieData = getChartData();
      return (
        <PieChart
          data={pieData}
          width={width - 40}
          height={220}
          chartConfig={chartConfig}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="0"
          style={styles.chart}
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {chartType === 'bar' ? 'Ingresos vs Egresos' : 'Distribución de Gastos'}
        </Text>
        <TouchableOpacity onPress={toggleChartType} style={styles.toggleButton}>
          <Text style={styles.toggleButtonText}>
            Cambiar a {chartType === 'bar' ? 'Pie' : 'Barra'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.chartContainer}>
        {renderChart()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleButton: {
    backgroundColor: '#F2F2F2',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  toggleButtonText: {
    color: '#666',
    fontSize: 12,
  },
  chartContainer: {
    alignItems: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 10,
  },
  loadingContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default Chart;