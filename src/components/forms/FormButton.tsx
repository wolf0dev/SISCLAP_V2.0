import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

interface FormButtonProps {
  title: string;
  onPress: () => void;
  mode?: 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal';
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  style?: any;
}

const FormButton: React.FC<FormButtonProps> = ({
  title,
  onPress,
  mode = 'contained',
  loading = false,
  disabled = false,
  icon,
  style,
}) => {
  return (
    <Button
      mode={mode}
      onPress={onPress}
      loading={loading}
      disabled={disabled || loading}
      icon={icon}
      style={[styles.button, style]}
      contentStyle={styles.buttonContent}
    >
      {title}
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default FormButton;