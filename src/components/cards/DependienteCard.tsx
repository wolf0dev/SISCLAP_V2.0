import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Dependiente, Beneficiario } from '../../types';

interface DependienteCardProps {
  dependiente: Dependiente;
  beneficiario?: Beneficiario;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function DependienteCard({ 
  dependiente, 
  beneficiario,
  onView, 
  onEdit, 
  onDelete
}: DependienteCardProps) {
  const calcularEdad = (fechaNacimiento: string) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    
    return edad;
  };

  const getParentescoIcon = (parentesco: string) => {
    switch (parentesco.toLowerCase()) {
      case 'hijo':
      case 'hija':
        return 'person';
      case 'esposo':
      case 'esposa':
        return 'heart';
      case 'padre':
      case 'madre':
        return 'people';
      case 'hermano':
      case 'hermana':
        return 'people-circle';
      default:
        return 'person-add';
    }
  };

  const getParentescoColor = (parentesco: string) => {
    switch (parentesco.toLowerCase()) {
      case 'hijo':
      case 'hija':
        return '#4CAF50';
      case 'esposo':
      case 'esposa':
        return '#E91E63';
      case 'padre':
      case 'madre':
        return '#FF9800';
      case 'hermano':
      case 'hermana':
        return '#2196F3';
      default:
        return '#9C27B0';
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onView}>
      <View style={styles.cardHeader}>
        <View style={styles.nameContainer}>
          <Text style={styles.dependienteName}>
            {dependiente.nombre_apellido}
          </Text>
          <View style={[
            styles.parentescoBadge,
            { backgroundColor: getParentescoColor(dependiente.parentesco) }
          ]}>
            <Ionicons 
              name={getParentescoIcon(dependiente.parentesco) as any} 
              size={12} 
              color="white" 
            />
            <Text style={styles.parentescoText}>{dependiente.parentesco}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <Ionicons name="card" size={16} color="#666" />
          <Text style={styles.infoText}>Cédula: {dependiente.cedula}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="call" size={16} color="#666" />
          <Text style={styles.infoText}>Teléfono: {dependiente.telefono}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="calendar" size={16} color="#666" />
          <Text style={styles.infoText}>
            Edad: {calcularEdad(dependiente.fecha_nacimiento)} años
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="briefcase" size={16} color="#666" />
          <Text style={styles.infoText}>
            Profesión: {dependiente.profesion}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="school" size={16} color="#666" />
          <Text style={styles.infoText}>
            Instrucción: {dependiente.grado_instruccion}
          </Text>
        </View>
        {beneficiario && (
          <View style={styles.beneficiarioContainer}>
            <View style={styles.infoRow}>
              <Ionicons name="person-circle" size={16} color="#FF4040" />
              <Text style={[styles.infoText, { color: '#FF4040', fontWeight: '500' }]}>
                Beneficiario: {beneficiario.nombre_apellido}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="location" size={16} color="#FF4040" />
              <Text style={[styles.infoText, { color: '#FF4040' }]}>
                {beneficiario.nom_calle || `Calle ${beneficiario.id_calle}`}, Casa {beneficiario.numero_casa}
              </Text>
            </View>
          </View>
        )}
      </View>
      
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.actionButton} onPress={onView}>
          <Ionicons name="eye" size={18} color="#2196F3" />
          <Text style={[styles.actionText, { color: '#2196F3' }]}>Ver</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
          <Ionicons name="create" size={18} color="#FF9800" />
          <Text style={[styles.actionText, { color: '#FF9800' }]}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
          <Ionicons name="trash" size={18} color="#F44336" />
          <Text style={[styles.actionText, { color: '#F44336' }]}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    marginBottom: 12,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dependienteName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  parentescoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  parentescoText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardContent: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  beneficiarioContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
    flexWrap: 'wrap',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    marginBottom: 4,
  },
  actionText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '500',
  },
});