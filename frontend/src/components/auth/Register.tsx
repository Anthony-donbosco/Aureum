import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  Platform 
} from 'react-native';
import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import SecureInput from '../common/SecureInput';
import { useAuth } from '../../context/AuthContext';
import Loader from '../common/Loader';

// Definimos una interfaz para el usuario que se va a registrar
interface RegisterUserData {
  name: string;
  email: string;
  password: string;
  birthdate: string;
  type: 'personal' | 'business';
}

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [registerType, setRegisterType] = useState<'personal' | 'business'>('personal');
  
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { register } = useAuth();

  const isFormValid = () => {
    return name.trim() !== '' && 
           email.trim() !== '' && 
           password.trim() !== '' &&
           birthdate.trim() !== '' &&
           !name.match(/[<>$\/=]/) && 
           !email.match(/[<>$\/=]/) && 
           !password.match(/[<>$\/=]/);
  };

  const handleRegister = async () => {
    if (!isFormValid()) return;
    
    setIsLoading(true);
    try {
      const userData: RegisterUserData = {
        name,
        email,
        password,
        birthdate,
        type: registerType
      };
      
      await register(userData);
      // Navigation will be handled by navigation container based on auth state
    } catch (error) {
      console.error('Registration error:', error);
      // Handle registration error
    } finally {
      setIsLoading(false);
    }
  };

  // Formato guiado para la fecha de nacimiento
  const handleBirthdateInput = (text) => {
    // Permitir solo números y barras
    const filtered = text.replace(/[^0-9/]/g, '');
    
    // Agregar barras automáticamente
    let formatted = filtered;
    
    // Si se han ingresado 2 dígitos, agregar una barra
    if (filtered.length === 2 && !filtered.includes('/') && filtered.length > birthdate.length) {
      formatted = filtered + '/';
    }
    // Si se han ingresado 5 caracteres (DD/MM) agregar otra barra
    else if (filtered.length === 5 && filtered.split('/').length === 2 && filtered.length > birthdate.length) {
      formatted = filtered + '/';
    }
    
    setBirthdate(formatted);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>REGÍSTRATE</Text>
      
      <View style={styles.typeSelector}>
        <TouchableOpacity
          style={[
            styles.typeButton,
            registerType === 'personal' && styles.selectedTypeButton
          ]}
          onPress={() => setRegisterType('personal')}
        >
          <Text 
            style={[
              styles.typeButtonText,
              registerType === 'personal' && styles.selectedTypeButtonText
            ]}
          >
            Registrarse como usuario
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.typeButton,
            registerType === 'business' && styles.selectedTypeButton
          ]}
          onPress={() => setRegisterType('business')}
        >
          <Text 
            style={[
              styles.typeButtonText,
              registerType === 'business' && styles.selectedTypeButtonText
            ]}
          >
            Registrar tu empresa
          </Text>
        </TouchableOpacity>
      </View>
      
      <SecureInput
        placeholder="Ingrese su nombre completo"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />
      
      {/* Campo de fecha con formato guiado */}
      <View style={styles.datePickerContainer}>
        <Ionicons name="calendar-outline" size={24} color="#666" style={styles.dateIcon} />
        <TextInput
          style={[styles.dateInput, birthdate ? styles.dateText : styles.datePlaceholder]}
          placeholder="DD/MM/AAAA"
          value={birthdate}
          onChangeText={handleBirthdateInput}
          keyboardType="numeric"
          maxLength={10}
        />
      </View>
      
      <SecureInput
        placeholder="Ingrese su correo"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      
      <SecureInput
        placeholder="Ingrese una contraseña segura"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity
        style={[styles.button, !isFormValid() && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={!isFormValid()}
      >
        <Text style={styles.buttonText}>REGISTRATE</Text>
      </TouchableOpacity>
      
      <View style={styles.linkContainer}>
        <Text style={styles.linkText}>¿Ya tienes una cuenta? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Inicia Sesión aquí</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  typeSelector: {
    flexDirection: 'column',
    width: '100%',
    marginBottom: 20,
  },
  typeButton: {
    backgroundColor: '#F2F2F2',
    padding: 12,
    borderRadius: 20,
    marginVertical: 5,
    alignItems: 'center',
  },
  selectedTypeButton: {
    backgroundColor: '#F9BE00',
  },
  typeButtonText: {
    color: '#666',
  },
  selectedTypeButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: 20,
    padding: 12,
    width: '100%',
    marginVertical: 8,
  },
  dateIcon: {
    marginRight: 10,
  },
  dateInput: {
    flex: 1,
    fontSize: 16,
  },
  dateText: {
    color: '#000',
    fontSize: 16,
  },
  datePlaceholder: {
    color: '#999',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#F9BE00',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 20,
    alignItems: 'center',
    width: '80%',
  },
  buttonDisabled: {
    backgroundColor: '#D1D1D1',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  linkText: {
    color: '#666',
  },
  link: {
    color: '#F9BE00',
    fontWeight: 'bold',
  },
});

export default Register;