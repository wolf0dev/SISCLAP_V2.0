import React, { useState, useEffect } from 'react';
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
import { Picker } from '@react-native-picker/picker';
import { Beneficiario, BeneficiarioForm as BeneficiarioFormType, GENEROS, ESTADOS_CIVILES, GRADOS_INSTRUCCION, ESTATUS } from '../../types';
import { useCalles } from '../../hooks/useCalles';

interface BeneficiarioFormProps {
  beneficiario?: Beneficiario;
  onSubmit: (data: BeneficiarioFormType) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function BeneficiarioForm({ 
  beneficiario, 
  onSubmit, 
  onCancel, 
  loading = false 
}: BeneficiarioFormProps) {
  const { calles, loading: callesLoading } = useCalles();
  
  const [formData, setFormData] = useState<BeneficiarioFormType>({
    cedula: beneficiario?.cedula || '',
    nombre_apellido: beneficiario?.nombre_apellido || '',
    profesion: beneficiario?.profesion || '',
    fecha_nacimiento: beneficiario?.fecha_nacimiento || '',
    grado_instruccion: beneficiario?.grado_instruccion || 'Primaria',
    enfermedad_cronica: beneficiario?.enfermedad_cronica || 'Ninguna',
    discapacidad: beneficiario?.discapacidad || 'Ninguna',
    genero: beneficiario?.genero || 'Masculino',
    telefono: beneficiario?.telefono || '',
    numero_casa: beneficiario?.numero_casa || '',
    id_calle: beneficiario?.id_calle || (calles.length > 0 ? calles[0].id_calle : 1),
    estado_civil: beneficiario?.estado_civil || 'Soltero',
    estatus: beneficiario?.estatus || 'ACTIVO'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (calles.length > 0 && !beneficiario) {
      setFormData(prev => ({ ...prev, id_calle: calles[0].id_calle }));
    }
  }, [calles, beneficiario]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.cedula.trim()) newErrors.cedula = 'La cédula es requerida';
    if (!formData.nombre_apellido.trim()) newErrors.nombre_apellido = 'El nombre y apellido son requeridos';
    if (!formData.profesion.trim()) newErrors.profesion = 'La profesión es requerida';
    if (!formData.fecha_nacimiento.trim()) newErrors.fecha_nacimiento = 'La fecha de nacimiento es requerida';
    if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es requerido';
    if (!formData.numero_casa.trim()) newErrors.numero_casa = 'El número de casa es requerido';

    // Validate cedula format (7-8 digits)
    if (formData.cedula && !/^\d{7,8}$/.test(formData.cedula)) {
      newErrors.cedula = 'La cédula debe tener 7 u 8 dígitos';
    }

    // Validate phone format
    if (formData.telefono && !/^04\d{9}$/.test(formData.telefono.replace(/[-\s]/g, ''))) {
      newErrors.telefono = 'Formato: 04XXXXXXXXX';
    }

    // Validate date format
    if (formData.fecha_nacimiento && !/^\d{4}-\d{2}-\d{2}$/.test(formData.fecha_nacimiento)) {
      newErrors.fecha_nacimiento = 'Formato: YYYY-MM-DD';
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

  const updateField = (field: keyof BeneficiarioFormType, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (callesLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4040" />
        <Text style={styles.loadingText}>Cargando formulario...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {beneficiario ? 'Editar Beneficiario' : 'Nuevo Beneficiario'}
        </Text>
      </View>

      <View style={styles.form}>
        {/* Información Personal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Personal</Text>
          
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
            <Text style={styles.label}>Nombre y Apellido *</Text>
            <TextInput
              style={[styles.input, errors.nombre_apellido && styles.inputError]}
              value={formData.nombre_apellido}
              onChangeText={(value) => updateField('nombre_apellido', value)}
              placeholder="Juan Pérez"
              autoCapitalize="words"
            />
            {errors.nombre_apellido && <Text style={styles.errorText}>{errors.nombre_apellido}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Fecha de Nacimiento *</Text>
            <TextInput
              style={[styles.input, errors.fecha_nacimiento && styles.inputError]}
              value={formData.fecha_nacimiento}
              onChangeText={(value) => updateField('fecha_nacimiento', value)}
              placeholder="1990-05-15"
            />
            {errors.fecha_nacimiento && <Text style={styles.errorText}>{errors.fecha_nacimiento}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Género *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.genero}
                onValueChange={(value) => updateField('genero', value)}
                style={styles.picker}
              >
                {GENEROS.map(genero => (
                  <Picker.Item key={genero} label={genero} value={genero} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Estado Civil *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.estado_civil}
                onValueChange={(value) => updateField('estado_civil', value)}
                style={styles.picker}
              >
                {ESTADOS_CIVILES.map(estado => (
                  <Picker.Item key={estado} label={estado} value={estado} />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        {/* Información Profesional */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Profesional</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Profesión *</Text>
            <TextInput
              style={[styles.input, errors.profesion && styles.inputError]}
              value={formData.profesion}
              onChangeText={(value) => updateField('profesion', value)}
              placeholder="Ingeniero, Docente, Estudiante, etc."
              autoCapitalize="words"
            />
            {errors.profesion && <Text style={styles.errorText}>{errors.profesion}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Grado de Instrucción *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.grado_instruccion}
                onValueChange={(value) => updateField('grado_instruccion', value)}
                style={styles.picker}
              >
                {GRADOS_INSTRUCCION.map(grado => (
                  <Picker.Item key={grado} label={grado} value={grado} />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        {/* Información de Contacto */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de Contacto</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Teléfono *</Text>
            <TextInput
              style={[styles.input, errors.telefono && styles.inputError]}
              value={formData.telefono}
              onChangeText={(value) => updateField('telefono', value)}
              placeholder="04141234567"
              keyboardType="phone-pad"
            />
            {errors.telefono && <Text style={styles.errorText}>{errors.telefono}</Text>}
          </View>
        </View>

        {/* Dirección */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dirección</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Calle *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.id_calle}
                onValueChange={(value) => updateField('id_calle', value)}
                style={styles.picker}
              >
                {calles.map(calle => (
                  <Picker.Item 
                    key={calle.id_calle} 
                    label={calle.nom_calle} 
                    value={calle.id_calle} 
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Número de Casa *</Text>
            <TextInput
              style={[styles.input, errors.numero_casa && styles.inputError]}
              value={formData.numero_casa}
              onChangeText={(value) => updateField('numero_casa', value)}
              placeholder="123"
            />
            {errors.numero_casa && <Text style={styles.errorText}>{errors.numero_casa}</Text>}
          </View>
        </View>

        {/* Información Médica */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Médica</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Enfermedad Crónica</Text>
            <TextInput
              style={styles.input}
              value={formData.enfermedad_cronica}
              onChangeText={(value) => updateField('enfermedad_cronica', value)}
              placeholder="Ninguna, Diabetes, Hipertensión, etc."
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Discapacidad</Text>
            <TextInput
              style={styles.input}
              value={formData.discapacidad}
              onChangeText={(value) => updateField('discapacidad', value)}
              placeholder="Ninguna, Visual, Auditiva, Motora, etc."
              autoCapitalize="words"
            />
          </View>
        </View>

        {/* Estado */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estado</Text>
          <View style={styles.statusContainer}>
            {ESTATUS.map(status => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.statusButton,
                  formData.estatus === status && styles.statusButtonActive
                ]}
                onPress={() => updateField('estatus', status)}
              >
                <Text style={[
                  styles.statusButtonText,
                  formData.estatus === status && styles.statusButtonTextActive
                ]}>
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
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