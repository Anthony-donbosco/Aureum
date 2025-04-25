import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native';
import SecureInput from '../common/SecureInput';
import { useAuth } from '../../context/AuthContext';
import Loader from '../common/Loader';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { login } = useAuth();

  const isFormValid = () => {
    return email.trim() !== '' && 
           password.trim() !== '' && 
           !email.match(/[<>$\/=]/) && 
           !password.match(/[<>$\/=]/);
  };

  const handleLogin = async () => {
    if (!isFormValid()) return;
    
    setIsLoading(true);
    try {
      await login(email, password);
      // Navigation will be handled by the navigation container based on auth state
    } catch (error) {
      console.error('Login error:', error);
      // Handle login error
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>INICIO DE SESIÓN</Text>
      
      <SecureInput
        placeholder="Ingrese su correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      
      <SecureInput
        placeholder="Ingrese su contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity
        style={[styles.button, !isFormValid() && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={!isFormValid()}
      >
        <Text style={styles.buttonText}>INICIAR SESIÓN</Text>
      </TouchableOpacity>
      
      <View style={styles.linkContainer}>
        <Text style={styles.linkText}>¿Aún no tienes una cuenta? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Regístrate Aquí</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
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

export default Login;