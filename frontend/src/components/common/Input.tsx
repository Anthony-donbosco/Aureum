
import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
  KeyboardTypeOptions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: KeyboardTypeOptions;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  multiline?: boolean;
  numberOfLines?: number;
  editable?: boolean;
  maxLength?: number;
}

const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  secureTextEntry = false,
  autoCapitalize = 'none',
  keyboardType = 'default',
  style,
  inputStyle,
  leftIcon,
  rightIcon,
  multiline = false,
  numberOfLines = 1,
  editable = true,
  maxLength
}) => {
  const [showPassword, setShowPassword] = useState(false);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Render password toggle icon
  const renderPasswordIcon = () => {
    return (
      <TouchableOpacity 
        onPress={togglePasswordVisibility}
        style={styles.iconContainer}
      >
        <Ionicons 
          name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
          size={20} 
          color="#666" 
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={[
        styles.inputContainer,
        error ? styles.inputError : null,
        !editable ? styles.inputDisabled : null
      ]}>
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
        
        <TextInput
          style={[
            styles.input,
            leftIcon ? styles.inputWithLeftIcon : null,
            (rightIcon || secureTextEntry) ? styles.inputWithRightIcon : null,
            inputStyle
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#999"
          secureTextEntry={secureTextEntry && !showPassword}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          maxLength={maxLength}
        />
        
        {secureTextEntry ? renderPasswordIcon() : rightIcon && (
          <View style={styles.iconContainer}>{rightIcon}</View>
        )}
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    width: '100%',
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  inputWithRightIcon: {
    paddingRight: 8,
  },
  iconContainer: {
    padding: 10,
  },
  inputError: {
    borderColor: '#F44336',
  },
  inputDisabled: {
    backgroundColor: '#E5E5E5',
    opacity: 0.7,
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginTop: 4,
  }
});

export default Input;