import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  TextInput,
} from 'react-native-paper';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { colors } from '../../theme/theme';
import FormInput from '../../components/forms/FormInput';

const LoginScreen = () => {
  const { login } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('El nombre de usuario es requerido'),
      password: Yup.string().required('La contraseña es requerida'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await login(values.username, values.password);
        showSnackbar('Inicio de sesión exitoso', 'success');
      } catch (error: any) {
        showSnackbar(error.message || 'Error al iniciar sesión', 'error');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../assets/clap-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>Iniciar Sesión</Title>
            <Paragraph style={styles.subtitle}>
              Sistema de Gestión de Beneficios
            </Paragraph>

            <FormInput
              label="Nombre de Usuario"
              value={formik.values.username}
              onChangeText={formik.handleChange('username')}
              onBlur={formik.handleBlur('username')}
              error={formik.errors.username}
              touched={formik.touched.username}
              disabled={loading}
            />

            <FormInput
              label="Contraseña"
              value={formik.values.password}
              onChangeText={formik.handleChange('password')}
              onBlur={formik.handleBlur('password')}
              error={formik.errors.password}
              touched={formik.touched.password}
              secureTextEntry={!showPassword}
              disabled={loading}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />

            <Button
              mode="contained"
              onPress={() => formik.handleSubmit()}
              loading={loading}
              disabled={loading}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </Card.Content>
        </Card>

        <Paragraph style={styles.footer}>
          Brisas del Orinoco II - Sistema de Gestión de Beneficios
        </Paragraph>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 150,
    height: 150,
  },
  card: {
    marginBottom: 20,
    elevation: 8,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    color: colors.primary,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    color: colors.textSecondary,
  },
  button: {
    marginTop: 16,
    backgroundColor: colors.primary,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  footer: {
    textAlign: 'center',
    color: colors.white,
    fontSize: 12,
    opacity: 0.8,
  },
});

export default LoginScreen;