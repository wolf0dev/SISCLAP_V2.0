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
import { Picker } from '@react-native-picker/picker';
import { 
  Dependiente, 
  DependienteForm as DependienteFormType, 
  Beneficiario,
  GENEROS, 
  ESTADOS_CIVILES, 
  GRADOS_INSTRUCCION, 
  PARENTESCOS 
} from '../../types';

interface DependienteFormProps {
  dependiente?: Dependiente;
  beneficiarios: Beneficiario[];
  onSubmit: (data: DependienteFormType) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function DependienteForm({ 
  dependiente, 
  beneficiarios,
  onSubmit, 
  onCancel, 
  loading = false 
}: DependienteFormProps) {
  const [formData, setFormData] = useState<DependienteFormType>({
    cedula: dependiente?.cedula || '',
    nombre_apellido: dependiente?.nombre_apellido || '',
    profesion: dependiente?.profesion || '',
    fecha_nacimiento: dependiente?.fecha_nacimiento || '',
    grado_instruccion: dependiente?.grado_instruccion || 'Primaria',
    enfermedad_cronica: dependiente?.enfermedad_cronica || 'Ninguna',
    discapacidad: dependiente?.discapacidad || 'Ninguna',
    genero: dependiente?.genero || 'Masculino',
    telefono: dependiente?.telefono || '',
    estado_civil: dependiente?.estado_civil || 'Soltero',
    parentesco: dependiente?.parentesco || 'Hijo',
    cedula_beneficiario: dependiente?.cedula_beneficiario || (beneficiarios.length > 0 ? beneficiarios[0].cedula : '')
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.cedula.trim()) newErrors.cedula = 'La cédula es requerida';
    if (!formData.nombre_apellido.trim()) newErrors.nombre_apellido = 'El nombre y apellido son requeridos';
    if (!formData.profesion.trim()) newErrors.profesion = 'La profesión es requerida';
    if (!formData.fecha_nacimiento.trim()) newErrors.fecha_nacimiento = 'La fecha de nacimiento es requerida';
    if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es requerido';
    if (!formData.cedula_beneficiario.trim()) newErrors.cedula_beneficiario = 'Debe seleccionar un beneficiario';

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

  const updateField = (field: keyof DependienteFormType, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const selectedBeneficiario = beneficiarios.find(b => b.cedula === formData.cedula_beneficiario);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {dependiente ? 'Editar Dependiente' : 'Nuevo Dependiente'}
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
              placeholder="María Pérez"
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
              placeholder="2010-03-20"
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
              placeholder="Estudiante, Empleado, etc."
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

        {/* Relación Familiar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Relación Familiar</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Parentesco *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.parentesco}
                onValueChange={(value) => updateField('parentesco', value)}
                style={styles.picker}
              >
                {PARENTESCOS.map(parentesco => (
                  <Picker.Item key={parentesco} label={parentesco} value={parentesco} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Beneficiario *</Text>
            <View style={[styles.pickerContainer, errors.cedula_beneficiario && styles.inputError]}>
              <Picker
                selectedValue={formData.cedula_beneficiario}
                onValueChange={(value) => updateField('cedula_beneficiario', value)}
                style={styles.picker}
              >
                <Picker.Item label="Seleccionar beneficiario..." value="" />
                {beneficiarios.map(beneficiario => (
                  <Picker.Item 
                    key={beneficiario.cedula} 
                    label={`${beneficiario.nombre_apellido} (${beneficiario.cedula})`} 
                    value={beneficiario.cedula} 
                  />
                ))}
              </Picker>
            </View>
            {errors.cedula_beneficiario && <Text style={styles.errorText}>{errors.cedula_beneficiario}</Text>}
            
            {selectedBeneficiario && (
              <View style={styles.beneficiarioInfo}>
                <Text style={styles.beneficiarioInfoTitle}>Información del Beneficiario:</Text>
                <Text style={styles.beneficiarioInfoText}>
                  📍 {selectedBeneficiario.nom_calle || `Calle ${selectedBeneficiario.id_calle}`}, Casa {selectedBeneficiario.numero_casa}
                </Text>
                <Text style={styles.beneficiarioInfoText}>
                  📞 {selectedBeneficiario.telefono}
                </Text>
              </View>
            )}
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
                {dependiente ? 'Actualizar' : 'Crear'}
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  beneficiarioInfo: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF4040',
  },
  beneficiarioInfoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  beneficiarioInfoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
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