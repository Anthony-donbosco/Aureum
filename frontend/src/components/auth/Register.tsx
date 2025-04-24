import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SecureInput from '../common/SecureInput';
import { useAuth } from '../../context/AuthContext';
import Loader from '../common/Loader';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [registerType, setRegisterType] = useState<'personal' | 'business'>('personal');
  const navigation = useNavigation();
  const { register } = useAuth();

  const isFormValid = () => {
    return name.trim() !== '' && 
           email.trim() !== '' && 
           password.trim() !== '' &&
           birthdate.trim() !== '' &&
           !name.match(/[<>$\/=]/) && 
           !email.match(/[<>$\/=]/) && 
           !password.match(/[<>$\/=]/) &&
           !birthdate.match(/[<>$\/=]/);
  };

  const handleRegister = async () => {
    if (!isFormValid()) return;
    
    setIsLoading(true);
    try {
      await register({
        name,
        email,
        password,
        birthdate,
        type: registerType
      });
      // Navigation will be handled by navigation container based on auth state
    } catch (error) {
      console.error('Registration error:', error);
      // Handle registration error
    } finally {
      setIsLoading(false);
    }
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
      
      <SecureInput
        placeholder="Ingrese su nacimiento"
        value={birthdate}
        onChangeText={setBirthdate}
      />
      
      <SecureInput
        placeholder="Ingrese su correo"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      
      <SecureInput
        placeholder="Ingrese un contraseño seguro"
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