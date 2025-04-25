import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Image,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';

// Definir tipo para navegación
type NavigationProp = {
  navigate: (screen: string) => void;
  goBack: () => void;
};

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Manejar la navegación a pantallas que podrían no estar definidas
  const navigateToScreen = (screenName: 'EditProfile' | 'ChangePassword' | string) => {
    // Para pantallas que sabemos que existen
    if (screenName === 'EditProfile' || screenName === 'ChangePassword') {
      navigation.navigate(screenName);
    } else {
      // Para pantallas que podrían no estar implementadas
      Alert.alert('Próximamente', 'Esta funcionalidad estará disponible pronto.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hola, {user?.name || 'Usuario'}</Text>
      </View>

      <View style={styles.profileSection}>
        <Text style={styles.sectionTitle}>Configuraciones</Text>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigateToScreen('EditProfile')}
        >
          <View style={styles.menuIconContainer}>
            <FontAwesome5 name="user-edit" size={18} color="#666" />
          </View>
          <Text style={styles.menuText}>Editar Perfil</Text>
          <FontAwesome5 name="chevron-right" size={16} color="#CCC" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigateToScreen('ChangePassword')}
        >
          <View style={styles.menuIconContainer}>
            <FontAwesome5 name="lock" size={18} color="#666" />
          </View>
          <Text style={styles.menuText}>Cambiar Contraseña</Text>
          <FontAwesome5 name="chevron-right" size={16} color="#CCC" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigateToScreen('AboutApp')}
        >
          <View style={styles.menuIconContainer}>
            <FontAwesome5 name="info-circle" size={18} color="#666" />
          </View>
          <Text style={styles.menuText}>Acerca de Aureum</Text>
          <FontAwesome5 name="chevron-right" size={16} color="#CCC" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigateToScreen('Terms')}
        >
          <View style={styles.menuIconContainer}>
            <FontAwesome5 name="file-contract" size={18} color="#666" />
          </View>
          <Text style={styles.menuText}>Términos y condiciones</Text>
          <FontAwesome5 name="chevron-right" size={16} color="#CCC" />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <FontAwesome5 name="sign-out-alt" size={18} color="#FFF" />
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
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
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#F44336',
    padding: 15,
    borderRadius: 10,
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default ProfileScreen;