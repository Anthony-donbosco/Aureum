import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { validateInput } from '../../utils/securityUtils';

interface SecureInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

const SecureInput: React.FC<SecureInputProps> = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean>(true);

  useEffect(() => {
    if (value) {
      const validationResult = validateInput(value);
      setIsValid(validationResult.isValid);
      setError(validationResult.isValid ? null : validationResult.message);
    } else {
      setError(null);
      setIsValid(true);
    }
  }, [value]);

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, !isValid && styles.inputError]}
        placeholder={placeholder}
        value={value}
        onChangeText={(text) => {
          onChangeText(text);
        }}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 8,
  },
  input: {
    backgroundColor: '#F2F2F2',
    borderRadius: 20,
    padding: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});

export default SecureInput;