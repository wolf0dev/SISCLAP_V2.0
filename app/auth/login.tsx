import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { 
  Text, 
  TextInput, 
  Button, 
  Card, 
  IconButton,
  ActivityIndicator 
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../src/contexts/AuthContext';
import { useSnackbar } from '../../src/contexts/SnackbarContext';

const validationSchema = Yup.object({
  username: Yup.string().required('El nombre de usuario es requerido'),
  password: Yup.string().required('La contraseña es requerida'),
});

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showSnackbar } = useSnackbar();
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await login(values.username, values.password);
        router.replace('/dashboard');
      } catch (error) {
        console.error('Error en inicio de sesión:', error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/clap-logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Text variant="headlineMedium" style={styles.title}>
              Iniciar Sesión
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Sistema de Gestión de Beneficios
            </Text>

            <TextInput
              label="Nombre de Usuario"
              value={formik.values.username}
              onChangeText={formik.handleChange('username')}
              onBlur={formik.handleBlur('username')}
              error={formik.touched.username && Boolean(formik.errors.username)}
              style={styles.input}
              mode="outlined"
              disabled={loading}
            />
            {formik.touched.username && formik.errors.username && (
              <Text style={styles.errorText}>{formik.errors.username}</Text>
            )}

            <TextInput
              label="Contraseña"
              value={formik.values.password}
              onChangeText={formik.handleChange('password')}
              onBlur={formik.handleBlur('password')}
              error={formik.touched.password && Boolean(formik.errors.password)}
              secureTextEntry={!showPassword}
              style={styles.input}
              mode="outlined"
              disabled={loading}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />
            {formik.touched.password && formik.errors.password && (
              <Text style={styles.errorText}>{formik.errors.password}</Text>
            )}

            <Button
              mode="contained"
              onPress={formik.handleSubmit}
              style={styles.loginButton}
              disabled={loading}
              loading={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>

            <View style={styles.linksContainer}>
              <Button
                mode="text"
                onPress={() => router.push('/auth/recover-username')}
                style={styles.linkButton}
              >
                ¿Olvidaste tu usuario?
              </Button>
              <Button
                mode="text"
                onPress={() => router.push('/auth/recover-password')}
                style={styles.linkButton}
              >
                ¿Olvidaste tu contraseña?
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 150,
    height: 150,
  },
  card: {
    elevation: 8,
    borderRadius: 12,
  },
  cardContent: {
    padding: 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#FF4040',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
    color: '#666',
  },
  input: {
    marginBottom: 8,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 12,
    marginBottom: 16,
    marginLeft: 12,
  },
  loginButton: {
    marginTop: 24,
    marginBottom: 16,
    paddingVertical: 8,
  },
  linksContainer: {
    alignItems: 'center',
  },
  linkButton: {
    marginVertical: 4,
  },
});