import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Image, 
  Dimensions, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  SafeAreaView
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';

const Tab = createMaterialTopTabNavigator();
const { height } = Dimensions.get('window');

const AuthScreen: React.FC = () => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const Logo = () => (
    <View style={[styles.logoContainer, keyboardVisible && styles.logoContainerSmall]}>
      <Image
        source={require('../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          onScrollBeginDrag={() => setKeyboardVisible(true)}
          onScrollEndDrag={() => setKeyboardVisible(false)}
        >
          <Logo />
          
          <View style={styles.tabContainer}>
            <Tab.Navigator
              screenOptions={{
                tabBarActiveTintColor: '#F9BE00',
                tabBarInactiveTintColor: '#666',
                tabBarIndicatorStyle: { backgroundColor: '#F9BE00' },
                tabBarLabelStyle: { fontWeight: 'bold', textTransform: 'none' },
                tabBarStyle: { elevation: 0, shadowOpacity: 0 },
              }}
            >
              <Tab.Screen name="Iniciar Sesión" component={Login} />
              <Tab.Screen name="Registrarse" component={Register} />
            </Tab.Navigator>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: height * 0.3,
    backgroundColor: 'black',
  },
  logoContainerSmall: {
    height: height * 0.15,
  },
  logo: {
    width: 150,
    height: 150,
  },
  tabContainer: {
    flex: 1,
  },
});

export default AuthScreen;
