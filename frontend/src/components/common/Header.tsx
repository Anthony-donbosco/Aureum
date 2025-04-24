import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  rightComponent?: React.ReactNode;
  onBackPress?: () => void;
  transparent?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = true,
  rightComponent,
  onBackPress,
  transparent = false
}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={[
      styles.container, 
      transparent ? styles.transparentContainer : null,
      { paddingTop: insets.top > 0 ? insets.top : 20 }
    ]}>
      <StatusBar 
        barStyle={transparent ? "light-content" : "dark-content"} 
        backgroundColor="transparent" 
        translucent 
      />
      
      <View style={styles.header}>
        {showBackButton ? (
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBackPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons 
              name="arrow-back" 
              size={24} 
              color={transparent ? "white" : "black"} 
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
        
        <Text style={[
          styles.title,
          transparent ? styles.titleLight : null
        ]}>
          {title}
        </Text>
        
        {rightComponent ? (
          <View style={styles.rightComponent}>
            {rightComponent}
          </View>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  transparentContainer: {
    backgroundColor: 'transparent',
    shadowColor: 'transparent',
    elevation: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    height: 50,
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  titleLight: {
    color: 'white',
  },
  rightComponent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeholder: {
    width: 30,
  }
});

export default Header;