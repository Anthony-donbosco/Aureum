import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView,
  Alert,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import SecureInput from '../components/common/SecureInput';
import { useAuth, AuthContextType } from '../context/AuthContext';
import Loader from '../components/common/Loader';

// Definir tipo para navegación
type NavigationProp = {
  goBack: () => void;
};

// Definir tipo para la actualización del perfil
interface ProfileUpdate {
  name: string;
  email: string;
}

const EditProfileScreen: React.FC = () => {
  const auth = useAuth() as AuthContextType;
  const [name, setName] = useState(auth.user?.name || '');
  const [email, setEmail] = useState(auth.user?.email || '');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  const isFormValid = () => {
    return name.trim() !== '' && 
           email.trim() !== '' && 
           !name.match(/[<>$\/=]/) && 
           !email.match(/[<>$\/=]/);
  };

  const handleUpdateProfile = async () => {
    if (!isFormValid()) {
      if (name.trim() === '' || email.trim() === '') {
        Alert.alert('Error', 'Todos los campos son requeridos');
      } else if (name.match(/[<>$\/=]/) || email.match(/[<>$\/=]/)) {
        Alert.alert('Error', 'Los campos contienen caracteres no permitidos');
      }
      return;
    }
    
    setIsLoading(true);
    try {
      const profileData: ProfileUpdate = { name, email };
      
      // Siempre asumimos que el método existe después del casting
      if (auth.updateProfile) {
        await auth.updateProfile(profileData);
        Alert.alert(
          'Éxito',
          'Perfil actualizado correctamente',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        // Implementación alternativa o mensaje de error
        console.error('La función updateProfile no está implementada en el contexto de autenticación');
        Alert.alert('Error', 'Esta funcionalidad no está disponible actualmente');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      Alert.alert('Error', 'No se pudo actualizar el perfil');
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
        <Text style={styles.headerTitle}>¿Deseas editar tu perfil?</Text>
      </View>

      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }}
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.editAvatarButton}>
          <Text style={styles.editAvatarText}>Editar tu Avatar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <TouchableOpacity style={styles.formItem}>
          <Ionicons name="person-outline" size={24} color="#666" style={styles.formIcon} />
          <SecureInput
            placeholder="Editar tu nombre"
            value={name}
            onChangeText={setName}
          />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.formItem}>
          <Ionicons name="mail-outline" size={24} color="#666" style={styles.formIcon} />
          <SecureInput
            placeholder="Editar tu Correo"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity
        style={[styles.button, !isFormValid() && styles.buttonDisabled]}
        onPress={handleUpdateProfile}
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
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  editAvatarButton: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  editAvatarText: {
    color: '#666',
    fontSize: 14,
  },
  form: {
    padding: 20,
  },
  formItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  formIcon: {
    marginRight: 10,
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 20,
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

export default EditProfileScreen;