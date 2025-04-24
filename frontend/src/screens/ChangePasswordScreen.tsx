import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Alert,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import SecureInput from '../components/common/SecureInput';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';

const ChangePasswordScreen: React.FC = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const { changePassword } = useAuth();

  const isFormValid = () => {
    return oldPassword.trim() !== '' && 
           newPassword.trim() !== '' && 
           confirmPassword.trim() !== '' &&
           newPassword === confirmPassword &&
           !oldPassword.match(/[<>$\/=]/) && 
           !newPassword.match(/[<>$\/=]/) && 
           !confirmPassword.match(/[<>$\/=]/);
  };

  const handleChangePassword = async () => {
    if (!isFormValid()) {
      if (newPassword !== confirmPassword) {
        Alert.alert('Error', 'Las contraseñas nuevas no coinciden');
      }
      return;
    }
    
    setIsLoading(true);
    try {
      await changePassword(oldPassword, newPassword);
      Alert.alert(
        'Éxito',
        'Contraseña cambiada correctamente',
        [
          { 
            text: 'OK', 
            onPress: () => navigation.goBack() 
          }
        ]
      );
    } catch (error) {
      console.error('Change password error:', error);
      Alert.alert('Error', 'No se pudo cambiar la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>¿Deseas cambiar tu contraseña?</Text>
      </View>

      <View style={styles.form}>
        <SecureInput
          placeholder="Ingresa tu antigua contraseña"
          value={oldPassword}
          onChangeText={setOldPassword}
          secureTextEntry
        />
        
        <SecureInput
          placeholder="Ingresa la nueva contraseña"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />
        
        <SecureInput
          placeholder="Confirma la contraseña"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
      </View>
      
      <TouchableOpacity
        style={[styles.button, !isFormValid() && styles.buttonDisabled]}
        onPress={handleChangePassword}
        disabled={!isFormValid()}
      >
        <Text style={styles.buttonText}>Guardar Cambios</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  form: {
    padding: 20,
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#D1D1D1',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ChangePasswordScreen;