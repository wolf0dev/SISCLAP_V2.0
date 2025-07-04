import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Beneficiario } from '../../types';

interface BeneficiarioFormProps {
  beneficiario?: Beneficiario;
  onSubmit: (data: Omit<Beneficiario, 'id' | 'fechaRegistro'>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function BeneficiarioForm({ 
  beneficiario, 
  onSubmit, 
  onCancel, 
  loading = false 
}: BeneficiarioFormProps) {
  const [formData, setFormData] = useState({
    nombre: beneficiario?.nombre || '',
    apellido: beneficiario?.apellido || '',
    cedula: beneficiario?.cedula || '',
    telefono: beneficiario?.telefono || '',
    email: beneficiario?.email || '',
    fechaNacimiento: beneficiario?.fechaNacimiento || '',
    direccion: {
      calle: beneficiario?.direccion.calle || '',
      casa: beneficiario?.direccion.casa || '',
      sector: beneficiario?.direccion.sector || 'Brisas del Orinoco II'
    },
    status: beneficiario?.status || 'Activo' as const,
    dependientes: beneficiario?.dependientes || [],
    beneficiosRecibidos: beneficiario?.beneficiosRecibidos || []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es requerido';
    if (!formData.cedula.trim()) newErrors.cedula = 'La cédula es requerida';
    if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es requerido';
    if (!formData.fechaNacimiento.trim()) newErrors.fechaNacimiento = 'La fecha de nacimiento es requerida';
    if (!formData.direccion.calle.trim()) newErrors.calle = 'La calle es requerida';
    if (!formData.direccion.casa.trim()) newErrors.casa = 'El número de casa es requerido';

    // Validate cedula format (basic validation)
    if (formData.cedula && !/^\d{7,8}$/.test(formData.cedula)) {
      newErrors.cedula = 'La cédula debe tener 7 u 8 dígitos';
    }

    // Validate phone format
    if (formData.telefono && !/^0\d{3}-\d{7}$/.test(formData.telefono)) {
      newErrors.telefono = 'Formato: 0XXX-XXXXXXX';
    }

    // Validate email if provided
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Por favor corrige los errores en el formulario');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Error al guardar');
    }
  };

  const updateField = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {beneficiario ? 'Editar Beneficiario' : 'Nuevo Beneficiario'}
        </Text>
      </View>

      <View style={styles.form}>
        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Personal</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre *</Text>
            <TextInput
              style={[styles.input, errors.nombre && styles.inputError]}
              value={formData.nombre}
              onChangeText={(value) => updateField('nombre', value)}
              placeholder="Ingrese el nombre"
              autoCapitalize="words"
            />
            {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Apellido *</Text>
            <TextInput
              style={[styles.input, errors.apellido && styles.inputError]}
              value={formData.apellido}
              onChangeText={(value) => updateField('apellido', value)}
              placeholder="Ingrese el apellido"
              autoCapitalize="words"
            />
            {errors.apellido && <Text style={styles.errorText}>{errors.apellido}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Cédula *</Text>
            <TextInput
              style={[styles.input, errors.cedula && styles.inputError]}
              value={formData.cedula}
              onChangeText={(value) => updateField('cedula', value)}
              placeholder="12345678"
              keyboardType="numeric"
              maxLength={8}
            />
            {errors.cedula && <Text style={styles.errorText}>{errors.cedula}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Fecha de Nacimiento *</Text>
            <TextInput
              style={[styles.input, errors.fechaNacimiento && styles.inputError]}
              value={formData.fechaNacimiento}
              onChangeText={(value) => updateField('fechaNacimiento', value)}
              placeholder="YYYY-MM-DD"
            />
            {errors.fechaNacimiento && <Text style={styles.errorText}>{errors.fechaNacimiento}</Text>}
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de Contacto</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Teléfono *</Text>
            <TextInput
              style={[styles.input, errors.telefono && styles.inputError]}
              value={formData.telefono}
              onChangeText={(value) => updateField('telefono', value)}
              placeholder="0414-1234567"
              keyboardType="phone-pad"
            />
            {errors.telefono && <Text style={styles.errorText}>{errors.telefono}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              value={formData.email}
              onChangeText={(value) => updateField('email', value)}
              placeholder="ejemplo@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>
        </View>

        {/* Address Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dirección</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Calle *</Text>
            <TextInput
              style={[styles.input, errors.calle && styles.inputError]}
              value={formData.direccion.calle}
              onChangeText={(value) => updateField('direccion.calle', value)}
              placeholder="Calle 1"
            />
            {errors.calle && <Text style={styles.errorText}>{errors.calle}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Casa *</Text>
            <TextInput
              style={[styles.input, errors.casa && styles.inputError]}
              value={formData.direccion.casa}
              onChangeText={(value) => updateField('direccion.casa', value)}
              placeholder="15"
            />
            {errors.casa && <Text style={styles.errorText}>{errors.casa}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Sector</Text>
            <TextInput
              style={styles.input}
              value={formData.direccion.sector}
              onChangeText={(value) => updateField('direccion.sector', value)}
              placeholder="Brisas del Orinoco II"
            />
          </View>
        </View>

        {/* Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estado</Text>
          <View style={styles.statusContainer}>
            <TouchableOpacity
              style={[
                styles.statusButton,
                formData.status === 'Activo' && styles.statusButtonActive
              ]}
              onPress={() => updateField('status', 'Activo')}
            >
              <Text style={[
                styles.statusButtonText,
                formData.status === 'Activo' && styles.statusButtonTextActive
              ]}>
                Activo
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.statusButton,
                formData.status === 'Inactivo' && styles.statusButtonActive
              ]}
              onPress={() => updateField('status', 'Inactivo')}
            >
              <Text style={[
                styles.statusButtonText,
                formData.status === 'Inactivo' && styles.statusButtonTextActive
              ]}>
                Inactivo
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onCancel}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <>
              <Ionicons name="checkmark" size={20} color="white" />
              <Text style={styles.submitButtonText}>
                {beneficiario ? 'Actualizar' : 'Crear'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  form: {
    padding: 20,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#FF4040',
  },
  errorText: {
    color: '#FF4040',
    fontSize: 12,
    marginTop: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statusButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  statusButtonActive: {
    backgroundColor: '#FF4040',
    borderColor: '#FF4040',
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  statusButtonTextActive: {
    color: 'white',
  },
  actions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#FF4040',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});