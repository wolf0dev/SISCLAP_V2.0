import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';

interface FormInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  error?: string;
  touched?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  multiline?: boolean;
  numberOfLines?: number;
  disabled?: boolean;
  placeholder?: string;
  right?: React.ReactNode;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChangeText,
  onBlur,
  error,
  touched,
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  disabled = false,
  placeholder,
  right,
}) => {
  const hasError = touched && Boolean(error);

  return (
    <>
      <TextInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        error={hasError}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        disabled={disabled}
        placeholder={placeholder}
        mode="outlined"
        style={styles.input}
        right={right}
      />
      <HelperText type="error" visible={hasError}>
        {error}
      </HelperText>
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 8,
  },
});

export default FormInput;