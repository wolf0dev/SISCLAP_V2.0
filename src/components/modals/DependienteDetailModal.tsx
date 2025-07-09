import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Dependiente, Beneficiario } from '../../types';

interface DependienteDetailModalProps {
  visible: boolean;
  dependiente: Dependiente | null;
  beneficiario?: Beneficiario;
  onClose: () => void;
}

const { width } = Dimensions.get('window');

export default function DependienteDetailModal({
  visible,
  dependiente,
  beneficiario,
  onClose
}: DependienteDetailModalProps) {
  if (!dependiente) return null;

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

  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getGenderIcon = (genero: string) => {
    return genero === 'Masculino' ? 'man' : 'woman';
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

  const edad = calcularEdad(dependiente.fecha_nacimiento);
  const parentescoColor = getParentescoColor(dependiente.parentesco);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalles del Dependiente</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <View style={[styles.avatar, { backgroundColor: parentescoColor }]}>
                <Ionicons 
                  name={getGenderIcon(dependiente.genero) as any} 
                  size={40} 
                  color="white" 
                />
              </View>
              <View style={[styles.parentescoBadge, { backgroundColor: parentescoColor }]}>
                <Ionicons 
                  name={getParentescoIcon(dependiente.parentesco) as any} 
                  size={12} 
                  color="white" 
                />
                <Text style={styles.parentescoText}>{dependiente.parentesco}</Text>
              </View>
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{dependiente.nombre_apellido}</Text>
              <Text style={styles.profileSubtitle}>
                {dependiente.profesion} • {edad} años
              </Text>
              <View style={styles.cedulaContainer}>
                <Ionicons name="card" size={16} color="#666" />
                <Text style={styles.cedulaText}>C.I. {dependiente.cedula}</Text>
              </View>
            </View>
          </View>

          {/* Beneficiary Relationship Card */}
          {beneficiario && (
            <View style={styles.relationshipCard}>
              <View style={styles.relationshipHeader}>
                <Ionicons name="link" size={20} color="#FF4040" />
                <Text style={styles.relationshipTitle}>Relación Familiar</Text>
              </View>
              <View style={styles.beneficiarioInfo}>
                <View style={styles.beneficiarioAvatar}>
                  <Ionicons name="person-circle" size={32} color="#FF4040" />
                </View>
                <View style={styles.beneficiarioDetails}>
                  <Text style={styles.beneficiarioName}>{beneficiario.nombre_apellido}</Text>
                  <Text style={styles.beneficiarioRole}>Beneficiario Principal</Text>
                  <View style={styles.beneficiarioLocation}>
                    <Ionicons name="location" size={14} color="#666" />
                    <Text style={styles.beneficiarioLocationText}>
                      {beneficiario.nom_calle || `Calle ${beneficiario.id_calle}`}, Casa {beneficiario.numero_casa}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Information Cards */}
          <View style={styles.cardsContainer}>
            {/* Personal Information */}
            <View style={styles.infoCard}>
              <View style={styles.cardHeader}>
                <Ionicons name="person" size={20} color="#FF4040" />
                <Text style={styles.cardTitle}>Información Personal</Text>
              </View>
              <View style={styles.cardContent}>
                <InfoRow 
                  icon="calendar" 
                  label="Fecha de Nacimiento" 
                  value={formatearFecha(dependiente.fecha_nacimiento)} 
                />
                <InfoRow 
                  icon="transgender" 
                  label="Género" 
                  value={dependiente.genero} 
                />
                <InfoRow 
                  icon="heart" 
                  label="Estado Civil" 
                  value={dependiente.estado_civil} 
                />
                <InfoRow 
                  icon="school" 
                  label="Grado de Instrucción" 
                  value={dependiente.grado_instruccion} 
                />
              </View>
            </View>

            {/* Contact Information */}
            <View style={styles.infoCard}>
              <View style={styles.cardHeader}>
                <Ionicons name="call" size={20} color="#2196F3" />
                <Text style={styles.cardTitle}>Información de Contacto</Text>
              </View>
              <View style={styles.cardContent}>
                <InfoRow 
                  icon="call" 
                  label="Teléfono" 
                  value={dependiente.telefono} 
                />
                {beneficiario && (
                  <InfoRow 
                    icon="location" 
                    label="Dirección" 
                    value={`${beneficiario.nom_calle || `Calle ${beneficiario.id_calle}`}, Casa ${beneficiario.numero_casa}`} 
                  />
                )}
              </View>
            </View>

            {/* Professional Information */}
            <View style={styles.infoCard}>
              <View style={styles.cardHeader}>
                <Ionicons name="briefcase" size={20} color="#FF9800" />
                <Text style={styles.cardTitle}>Información Profesional</Text>
              </View>
              <View style={styles.cardContent}>
                <InfoRow 
                  icon="briefcase" 
                  label="Profesión" 
                  value={dependiente.profesion} 
                />
                <InfoRow 
                  icon="school" 
                  label="Nivel Educativo" 
                  value={dependiente.grado_instruccion} 
                />
              </View>
            </View>

            {/* Health Information */}
            <View style={styles.infoCard}>
              <View style={styles.cardHeader}>
                <Ionicons name="medical" size={20} color="#4CAF50" />
                <Text style={styles.cardTitle}>Información de Salud</Text>
              </View>
              <View style={styles.cardContent}>
                <InfoRow 
                  icon="medical" 
                  label="Enfermedad Crónica" 
                  value={dependiente.enfermedad_cronica} 
                  isHealth={true}
                />
                <InfoRow 
                  icon="accessibility" 
                  label="Discapacidad" 
                  value={dependiente.discapacidad} 
                  isHealth={true}
                />
              </View>
            </View>
          </View>

          {/* Community Badge */}
          <View style={styles.communityBadge}>
            <Image 
              source={{ uri: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' }}
              style={styles.communityLogo}
            />
            <View style={styles.communityInfo}>
              <Text style={styles.communityTitle}>Brisas del Orinoco II</Text>
              <Text style={styles.communitySubtitle}>Sistema de Gestión de Beneficios</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

interface InfoRowProps {
  icon: string;
  label: string;
  value: string;
  isHealth?: boolean;
}

function InfoRow({ icon, label, value, isHealth = false }: InfoRowProps) {
  const getHealthColor = (value: string) => {
    if (value.toLowerCase() === 'ninguna' || value.toLowerCase() === 'ninguno') {
      return '#4CAF50';
    }
    return '#FF9800';
  };

  return (
    <View style={styles.infoRow}>
      <View style={styles.infoRowLeft}>
        <Ionicons name={icon as any} size={16} color="#666" />
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <Text style={[
        styles.infoValue,
        isHealth && { color: getHealthColor(value) }
      ]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: 'white',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  parentescoBadge: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'white',
    gap: 4,
  },
  parentescoText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  profileSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  cedulaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  cedulaText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  relationshipCard: {
    backgroundColor: 'white',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF4040',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  relationshipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  relationshipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 12,
  },
  beneficiarioInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  beneficiarioAvatar: {
    marginRight: 12,
  },
  beneficiarioDetails: {
    flex: 1,
  },
  beneficiarioName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  beneficiarioRole: {
    fontSize: 14,
    color: '#FF4040',
    fontWeight: '500',
    marginBottom: 4,
  },
  beneficiarioLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  beneficiarioLocationText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  cardsContainer: {
    padding: 16,
    gap: 16,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 12,
  },
  cardContent: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
  },
  communityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF4040',
  },
  communityLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  communityInfo: {
    flex: 1,
  },
  communityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF4040',
  },
  communitySubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});