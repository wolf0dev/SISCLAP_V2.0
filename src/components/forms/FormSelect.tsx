import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Menu, HelperText } from 'react-native-paper';

interface Option {
  label: string;
  value: string | number;
}

interface FormSelectProps {
  label: string;
  value: string | number;
  onValueChange: (value: string | number) => void;
  options: Option[];
  error?: string;
  touched?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  value,
  onValueChange,
  options,
  error,
  touched,
  disabled = false,
  placeholder = 'Seleccionar...',
}) => {
  const [visible, setVisible] = useState(false);
  const hasError = touched && Boolean(error);

  const selectedOption = options.find(option => option.value === value);
  const displayValue = selectedOption ? selectedOption.label : '';

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const selectOption = (optionValue: string | number) => {
    onValueChange(optionValue);
    closeMenu();
  };

  return (
    <View style={styles.container}>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <TextInput
            label={label}
            value={displayValue}
            placeholder={placeholder}
            mode="outlined"
            editable={false}
            error={hasError}
            disabled={disabled}
            onTouchStart={disabled ? undefined : openMenu}
            right={<TextInput.Icon icon="chevron-down" onPress={disabled ? undefined : openMenu} />}
            style={styles.input}
          />
        }
      >
        {options.map((option) => (
          <Menu.Item
            key={option.value}
            onPress={() => selectOption(option.value)}
            title={option.label}
          />
        ))}
      </Menu>
      <HelperText type="error" visible={hasError}>
        {error}
      </HelperText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  input: {
    marginBottom: 8,
  },
});

export default FormSelect;