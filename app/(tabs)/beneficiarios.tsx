import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useBeneficiarios } from '../../src/hooks/useBeneficiarios';
import BeneficiarioCard from '../../src/components/cards/BeneficiarioCard';
import BeneficiarioModal from '../../src/components/modals/BeneficiarioModal';
import LoadingScreen from '../../src/components/common/LoadingScreen';
import { Beneficiario, BeneficiarioForm } from '../../src/types';

export default function BeneficiariosScreen() {
  const {
    beneficiarios,
    loading,
    error,
    loadBeneficiarios,
    searchBeneficiarios,
    createBeneficiario,
    updateBeneficiario,
    updateEstatusBeneficiario
  } = useBeneficiarios();

  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBeneficiario, setSelectedBeneficiario] = useState<Beneficiario | undefined>();
  const [modalLoading, setModalLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      await searchBeneficiarios(query);
    } else {
      await loadBeneficiarios();
    }
  };

  const handleCreateBeneficiario = () => {
    setSelectedBeneficiario(undefined);
    setModalVisible(true);
  };

  const handleEditBeneficiario = (beneficiario: Beneficiario) => {
    setSelectedBeneficiario(beneficiario);
    setModalVisible(true);
  };

  const handleViewBeneficiario = (beneficiario: Beneficiario) => {
    const edad = new Date().getFullYear() - new Date(beneficiario.fecha_nacimiento).getFullYear();
    
    Alert.alert(
      `${beneficiario.nombre_apellido}`,
      `Cédula: ${beneficiario.cedula}\n` +
      `Edad: ${edad} años\n` +
      `Género: ${beneficiario.genero}\n` +
      `Estado Civil: ${beneficiario.estado_civil}\n` +
      `Profesión: ${beneficiario.profesion}\n` +
      `Instrucción: ${beneficiario.grado_instruccion}\n` +
      `Teléfono: ${beneficiario.telefono}\n` +
      `Dirección: ${beneficiario.nom_calle || `Calle ${beneficiario.id_calle}`}, Casa ${beneficiario.numero_casa}\n` +
      `Enfermedad Crónica: ${beneficiario.enfermedad_cronica}\n` +
      `Discapacidad: ${beneficiario.discapacidad}\n` +
      `Estado: ${beneficiario.estatus}`,
      [{ text: 'Cerrar' }]
    );
  };

  const handleToggleStatus = (beneficiario: Beneficiario) => {
    const newStatus = beneficiario.estatus === 'Activo' ? 'Inactivo' : 'Activo';
    const action = newStatus === 'Activo' ? 'activar' : 'desactivar';
    
    Alert.alert(
      'Cambiar Estado',
      `¿Estás seguro de que deseas ${action} a ${beneficiario.nombre_apellido}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              await updateEstatusBeneficiario(beneficiario.cedula, newStatus);
              Alert.alert('Éxito', `Beneficiario ${action === 'activar' ? 'activado' : 'desactivado'} correctamente`);
            } catch (error) {
              Alert.alert('Error', error instanceof Error ? error.message : 'Error al cambiar estado');
            }
          }
        }
      ]
    );
  };

  const handleSubmitForm = async (data: BeneficiarioForm) => {
    try {
      setModalLoading(true);
      
      if (selectedBeneficiario) {
        await updateBeneficiario(selectedBeneficiario.cedula, data);
        Alert.alert('Éxito', 'Beneficiario actualizado correctamente');
      } else {
        await createBeneficiario(data);
        Alert.alert('Éxito', 'Beneficiario creado correctamente');
      }
      
      setModalVisible(false);
      setSelectedBeneficiario(undefined);
    } catch (error) {
      throw error;
    } finally {
      setModalLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadBeneficiarios();
    setSearchQuery('');
    setRefreshing(false);
  };

  if (loading && !refreshing) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Beneficiarios</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleCreateBeneficiario}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre o cédula..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => handleSearch('')}
          >
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadBeneficiarios}>
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView 
        style={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {beneficiarios.length === 0 && !loading ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>
              {searchQuery ? 'No se encontraron beneficiarios' : 'No hay beneficiarios registrados'}
            </Text>
            {!searchQuery && (
              <TouchableOpacity style={styles.emptyButton} onPress={handleCreateBeneficiario}>
                <Text style={styles.emptyButtonText}>Agregar primer beneficiario</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          beneficiarios.map((beneficiario) => (
            <BeneficiarioCard
              key={beneficiario.cedula}
              beneficiario={beneficiario}
              onView={() => handleViewBeneficiario(beneficiario)}
              onEdit={() => handleEditBeneficiario(beneficiario)}
              onToggleStatus={() => handleToggleStatus(beneficiario)}
            />
          ))
        )}
      </ScrollView>

      <BeneficiarioModal
        visible={modalVisible}
        beneficiario={selectedBeneficiario}
        onClose={() => {
          setModalVisible(false);
          setSelectedBeneficiario(undefined);
        }}
        onSubmit={handleSubmitForm}
        loading={modalLoading}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#FF4040',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    margin: 20,
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
    marginBottom: 8,
  },
  retryButton: {
    alignSelf: 'flex-start',
  },
  retryText: {
    color: '#1976d2',
    fontSize: 14,
    fontWeight: '500',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#FF4040',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});