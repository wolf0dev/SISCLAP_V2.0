import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Beneficiario } from '../../types';

interface BeneficiarioCardProps {
  beneficiario: Beneficiario;
  onView: () => void;
  onEdit: () => void;
  onDelete?: () => void;
  onToggleStatus?: () => void;
}

export default function BeneficiarioCard({ 
  beneficiario, 
  onView, 
  onEdit, 
  onDelete,
  onToggleStatus
}: BeneficiarioCardProps) {
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

  return (
    <TouchableOpacity style={styles.card} onPress={onView}>
      <View style={styles.cardHeader}>
        <Text style={styles.beneficiarioName}>
          {beneficiario.nombre_apellido}
        </Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: beneficiario.estatus === 'Activo' ? '#4CAF50' : '#F44336' }
        ]}>
          <Text style={styles.statusText}>{beneficiario.estatus}</Text>
        </View>
      </View>
      
      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <Ionicons name="card" size={16} color="#666" />
          <Text style={styles.infoText}>Cédula: {beneficiario.cedula}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="call" size={16} color="#666" />
          <Text style={styles.infoText}>Teléfono: {beneficiario.telefono}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="location" size={16} color="#666" />
          <Text style={styles.infoText}>
            {beneficiario.nom_calle || `Calle ${beneficiario.id_calle}`}, Casa {beneficiario.numero_casa}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="calendar" size={16} color="#666" />
          <Text style={styles.infoText}>
            Edad: {calcularEdad(beneficiario.fecha_nacimiento)} años
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="briefcase" size={16} color="#666" />
          <Text style={styles.infoText}>
            Profesión: {beneficiario.profesion}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="school" size={16} color="#666" />
          <Text style={styles.infoText}>
            Instrucción: {beneficiario.grado_instruccion}
          </Text>
        </View>
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
        {onToggleStatus && (
          <TouchableOpacity style={styles.actionButton} onPress={onToggleStatus}>
            <Ionicons 
              name={beneficiario.estatus === 'Activo' ? 'pause' : 'play'} 
              size={18} 
              color="#9C27B0" 
            />
            <Text style={[styles.actionText, { color: '#9C27B0' }]}>
              {beneficiario.estatus === 'Activo' ? 'Desactivar' : 'Activar'}
            </Text>
          </TouchableOpacity>
        )}
        {onDelete && (
          <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
            <Ionicons name="trash" size={18} color="#F44336" />
            <Text style={[styles.actionText, { color: '#F44336' }]}>Eliminar</Text>
          </TouchableOpacity>
        )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  beneficiarioName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
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