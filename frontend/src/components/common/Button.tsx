import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle
} from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
  loading = false,
  variant = 'primary'
}) => {
  // Determine button styles based on variant
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryButton;
      case 'secondary':
        return styles.secondaryButton;
      case 'outline':
        return styles.outlineButton;
      case 'danger':
        return styles.dangerButton;
      default:
        return styles.primaryButton;
    }
  };

  // Determine text styles based on variant
  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
      case 'danger':
        return styles.primaryButtonText;
      case 'secondary':
        return styles.secondaryButtonText;
      case 'outline':
        return styles.outlineButtonText;
      default:
        return styles.primaryButtonText;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        disabled && styles.disabledButton,
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' ? '#F9BE00' : 'white'} 
        />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  primaryButton: {
    backgroundColor: '#F9BE00',
  },
  secondaryButton: {
    backgroundColor: '#F2F2F2',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#F9BE00',
  },
  dangerButton: {
    backgroundColor: '#F44336',
  },
  disabledButton: {
    backgroundColor: '#D1D1D1',
    borderColor: '#D1D1D1',
  },
  primaryButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryButtonText: {
    color: '#666',
    fontSize: 16,
  },
  outlineButtonText: {
    color: '#F9BE00',
    fontWeight: 'bold',
    fontSize: 16,
  }
});

export default Button;