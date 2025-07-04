import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';

export default function ForgotUsernameScreen() {
  const { recoverUser, loading } = useAuth();
  const [formData, setFormData] = useState({
    ced_user: '',
    nom_user: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.ced_user.trim()) {
      newErrors.ced_user = 'La cédula es requerida';
    } else if (!/^\d{7,8}$/.test(formData.ced_user)) {
      newErrors.ced_user = 'La cédula debe tener 7 u 8 dígitos';
    }

    if (!formData.nom_user.trim()) {
      newErrors.nom_user = 'El nombre completo es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRecoverUser = async () => {
    if (!validateForm()) return;

    try {
      const response = await recoverUser(formData);
      
      Alert.alert(
        'Usuario Recuperado',
        `Tu nombre de usuario es: ${response.Usuario}`,
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(auth)/login')
          }
        ]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Error al recuperar usuario'
      );
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <View style={styles.iconContainer}>
              <Ionicons name="person-circle" size={48} color="#FF4040" />
            </View>
            <Text style={styles.title}>Recuperar Usuario</Text>
            <Text style={styles.subtitle}>
              Ingresa tu cédula y nombre completo para recuperar tu nombre de usuario
            </Text>
          </View>

          {/* Recovery Form */}
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Cédula</Text>
              <View style={[styles.inputContainer, errors.ced_user && styles.inputError]}>
                <Ionicons name="card-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={formData.ced_user}
                  onChangeText={(value) => updateField('ced_user', value)}
                  placeholder="12345678"
                  keyboardType="numeric"
                  maxLength={8}
                />
              </View>
              {errors.ced_user && <Text style={styles.errorText}>{errors.ced_user}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre Completo</Text>
              <View style={[styles.inputContainer, errors.nom_user && styles.inputError]}>
                <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={formData.nom_user}
                  onChangeText={(value) => updateField('nom_user', value)}
                  placeholder="Ingrese su nombre completo"
                  autoCapitalize="words"
                />
              </View>
              {errors.nom_user && <Text style={styles.errorText}>{errors.nom_user}</Text>}
            </View>

            <TouchableOpacity
              style={[styles.recoverButton, loading && styles.recoverButtonDisabled]}
              onPress={handleRecoverUser}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <>
                  <Ionicons name="search-outline" size={20} color="white" />
                  <Text style={styles.recoverButtonText}>Recuperar Usuario</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Info Box */}
            <View style={styles.infoBox}>
              <Ionicons name="information-circle-outline" size={20} color="#2196F3" />
              <Text style={styles.infoText}>
                Asegúrate de ingresar exactamente el mismo nombre que usaste al registrarte.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: 8,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 64, 64, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
  },
  inputError: {
    borderColor: '#FF4040',
  },
  inputIcon: {
    marginLeft: 16,
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: '#FF4040',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  recoverButton: {
    backgroundColor: '#FF4040',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    gap: 8,
  },
  recoverButtonDisabled: {
    opacity: 0.6,
  },
  recoverButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#e3f2fd',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#1976d2',
    lineHeight: 20,
  },
});