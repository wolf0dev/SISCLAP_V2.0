import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDependientes } from '../../src/hooks/useDependientes';
import { useBeneficiarios } from '../../src/hooks/useBeneficiarios';
import DependienteCard from '@/components/cards/DependienteCard';
import DependienteModal from '@/components/modals/DependienteModal';
import DependienteDetailModal from '../../src/components/modals/DependienteDetailModal';
import LoadingScreen from '../../src/components/common/LoadingScreen';
import { Dependiente, DependienteForm } from '../../src/types';

export default function DependientesScreen() {
  const { beneficiarios } = useBeneficiarios();
  const {
    dependientes,
    loading,
    error,
    loadDependientes,
    createDependiente,
    updateDependiente,
    deleteDependiente
  } = useDependientes();

  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDependiente, setSelectedDependiente] = useState<Dependiente | undefined>();
  const [modalLoading, setModalLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedDependienteForDetail, setSelectedDependienteForDetail] = useState<Dependiente | null>(null);

  // Get all dependientes from all beneficiarios
  React.useEffect(() => {
    const loadAllDependientes = async () => {
      const activeBeneficiarios = beneficiarios.filter(b => b.estatus === 'ACTIVO');
      for (const beneficiario of activeBeneficiarios) {
        await loadDependientes(beneficiario.cedula);
      }
    };

    if (beneficiarios.length > 0) {
      loadAllDependientes();
    }
  }, [beneficiarios]);

  // Filter dependientes based on search
  const filteredDependientes = dependientes.filter(d => 
    d.nombre_apellido.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.cedula.includes(searchQuery) ||
    d.cedula_beneficiario.includes(searchQuery)
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCreateDependiente = () => {
    setSelectedDependiente(undefined);
    setModalVisible(true);
  };

  const handleEditDependiente = (dependiente: Dependiente) => {
    setSelectedDependiente(dependiente);
    setModalVisible(true);
  };

  const handleViewDependiente = (dependiente: Dependiente) => {
    setSelectedDependienteForDetail(dependiente);
    setDetailModalVisible(true);
  };

  const handleDeleteDependiente = (dependiente: Dependiente) => {
    Alert.alert(
      'Eliminar Dependiente',
      `¿Estás seguro de que deseas eliminar a ${dependiente.nombre_apellido}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDependiente(dependiente.cedula);
              Alert.alert('Éxito', 'Dependiente eliminado correctamente');
            } catch (error) {
              Alert.alert('Error', error instanceof Error ? error.message : 'Error al eliminar dependiente');
            }
          }
        }
      ]
    );
  };

  const handleSubmitForm = async (data: DependienteForm) => {
    try {
      setModalLoading(true);
      
      if (selectedDependiente) {
        await updateDependiente(selectedDependiente.cedula, data);
        Alert.alert('Éxito', 'Dependiente actualizado correctamente');
      } else {
        await createDependiente(data);
        Alert.alert('Éxito', 'Dependiente creado correctamente');
      }
      
      setModalVisible(false);
      setSelectedDependiente(undefined);
    } catch (error) {
      throw error;
    } finally {
      setModalLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    const activeBeneficiarios = beneficiarios.filter(b => b.estatus === 'ACTIVO');
    for (const beneficiario of activeBeneficiarios) {
      await loadDependientes(beneficiario.cedula);
    }
    setSearchQuery('');
    setRefreshing(false);
  };

  if (loading && !refreshing) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dependientes</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleCreateDependiente}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre, cédula o beneficiario..."
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

      {/* Stats Card */}
      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{filteredDependientes.length}</Text>
          <Text style={styles.statLabel}>Total Dependientes</Text>
        </View>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
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
        {filteredDependientes.length === 0 && !loading ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="person-add-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>
              {searchQuery ? 'No se encontraron dependientes' : 'No hay dependientes registrados'}
            </Text>
            {!searchQuery && (
              <TouchableOpacity style={styles.emptyButton} onPress={handleCreateDependiente}>
                <Text style={styles.emptyButtonText}>Agregar primer dependiente</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredDependientes.map((dependiente) => (
            <DependienteCard
              key={dependiente.cedula}
              dependiente={dependiente}
              beneficiario={beneficiarios.find(b => b.cedula === dependiente.cedula_beneficiario)}
              onView={() => handleViewDependiente(dependiente)}
              onEdit={() => handleEditDependiente(dependiente)}
              onDelete={() => handleDeleteDependiente(dependiente)}
            />
          ))
        )}
      </ScrollView>

      <DependienteModal
        visible={modalVisible}
        dependiente={selectedDependiente}
        beneficiarios={beneficiarios.filter(b => b.estatus === 'ACTIVO')}
        onClose={() => {
          setModalVisible(false);
          setSelectedDependiente(undefined);
        }}
        onSubmit={handleSubmitForm}
        loading={modalLoading}
      />

      <DependienteDetailModal
        visible={detailModalVisible}
        dependiente={selectedDependienteForDetail}
        beneficiario={selectedDependienteForDetail ? beneficiarios.find(b => b.cedula === selectedDependienteForDetail.cedula_beneficiario) : undefined}
        onClose={() => {
          setDetailModalVisible(false);
          setSelectedDependienteForDetail(null);
        }}
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
  statsCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#9C27B0',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
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