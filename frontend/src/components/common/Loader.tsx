import React from 'react';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';

const Loader: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <ActivityIndicator size="large" color="#F9BE00" style={styles.spinner} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
  },
  spinner: {
    marginTop: 20,
  },
});

export default Loader;