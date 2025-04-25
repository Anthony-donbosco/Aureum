import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Alert
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import SecureInput from '../common/SecureInput';
import { useTransactions } from '../../context/TransactionContext'; // Cambiado de useTransaction a useTransactions
import { validateInput } from '../../utils/securityUtils';
import Loader from '../common/Loader';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Definir tipos para las props y parámetros
interface RouteParams {
  type: 'income' | 'expense';
}

type TransactionRouteProps = RouteProp<{ params: RouteParams }, 'params'>;

type NavigationProp = {
  navigate: (screen: string, params?: any) => void;
  goBack: () => void;
};

// Definir interfaces para eventos
interface DateTimePickerEvent {
  type: string;
  nativeEvent: {
    timestamp?: number;
  };
}

const TransactionForm: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<TransactionRouteProps>();
  const { type } = route.params;
  const { addTransaction } = useTransactions(); // Cambiado de useTransaction a useTransactions
  
  const [detail, setDetail] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const isIncomeForm = type === 'income';
  const formTitle = isIncomeForm ? 'Añadir Ingreso' : 'Añadir Egreso';
  
  const incomeCategories = ['Salario', 'Venta', 'Otros'];
  const expenseCategories = [
    'Supermercado', 
    'Servicio de Luz', 
    'Gasolina', 
    'Gastos Médicos',
    'Servicio de agua',
    'Otros'
  ];
  
  const categories = isIncomeForm ? incomeCategories : expenseCategories;

  const isFormValid = () => {
    return detail.trim() !== '' && 
           amount.trim() !== '' && 
           category.trim() !== '' &&
           validateInput(detail).isValid && 
           validateInput(amount).isValid;
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const handleAddTransaction = async () => {
    if (!isFormValid()) return;
    
    setIsLoading(true);
    try {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount)) {
        Alert.alert('Error', 'Por favor ingrese un monto válido');
        return;
      }
      
      await addTransaction({
        type: isIncomeForm ? 'income' : 'expense',
        detail,
        amount: parsedAmount,
        date: format(date, 'dd MMM', { locale: es }),
        category,
      });
      
      Alert.alert(
        'Éxito',
        `${isIncomeForm ? 'Ingreso' : 'Egreso'} añadido correctamente`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error adding transaction:', error);
      Alert.alert('Error', 'Hubo un problema al añadir la transacción');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {isIncomeForm ? '¿Quieres añadir un ingreso extra?' : '¿Quieres añadir un egreso extra?'}
      </Text>
      
      <View style={styles.form}>
        <Text style={styles.sectionTitle}>
          {isIncomeForm ? 'Ingresos' : 'Egresos'}
        </Text>
        
        <SecureInput
          placeholder={`Ingrese el detalle del ${isIncomeForm ? 'ingreso' : 'egreso'}`}
          value={detail}
          onChangeText={setDetail}
        />
        
        <TouchableOpacity 
          style={styles.dateInput}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateInputText}>
            Fecha del {isIncomeForm ? 'ingreso' : 'egreso'}: {format(date, 'dd/MM/yyyy')}
          </Text>
        </TouchableOpacity>
        
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
        
        <SecureInput
          placeholder="Cantidad que se gastó"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
        
        <Text style={styles.categoryLabel}>Seleccione una categoría:</Text>
        <View style={styles.categoryContainer}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryItem,
                category === cat && styles.selectedCategory
              ]}
              onPress={() => setCategory(cat)}
            >
              <Text 
                style={[
                  styles.categoryText,
                  category === cat && styles.selectedCategoryText
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <TouchableOpacity
        style={[styles.button, !isFormValid() && styles.buttonDisabled]}
        onPress={handleAddTransaction}
        disabled={!isFormValid()}
      >
        <Text style={styles.buttonText}>{`Añadir ${isIncomeForm ? 'Ingreso' : 'Egreso'}`}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  form: {
    backgroundColor: '#F9F9F9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  dateInput: {
    backgroundColor: '#F2F2F2',
    borderRadius: 20,
    padding: 12,
    marginVertical: 8,
  },
  dateInputText: {
    fontSize: 16,
  },
  categoryLabel: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  categoryItem: {
    backgroundColor: '#F2F2F2',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 5,
  },
  selectedCategory: {
    backgroundColor: '#F9BE00',
  },
  categoryText: {
    fontSize: 14,
  },
  selectedCategoryText: {
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#F9BE00',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#D1D1D1',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default TransactionForm;