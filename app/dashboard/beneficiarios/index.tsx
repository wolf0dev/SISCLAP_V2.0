import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { 
  Searchbar, 
  FAB, 
  Card, 
  Title, 
  Paragraph, 
  Chip,
  IconButton,
  Menu,
  Text,
  ActivityIndicator
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { beneficiarioService, Beneficiario } from '../../../src/services/beneficiarioService';
import { useAuth } from '../../../src/contexts/AuthContext';
import { useSnackbar } from '../../../src/contexts/SnackbarContext';

export default function BeneficiariosList() {
  const [beneficiarios, setBeneficiarios] = useState<Beneficiario[]>([]);
  const [filteredBeneficiarios, setFilteredBeneficiarios] = useState<Beneficiario[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuVisible, setMenuVisible] = useState<string | null>(null);
  
  const { user, isLiderComunidad, isJefeCalle, getUserCalle } = useAuth();
  const { showSnackbar } = useSnackbar();
  const router = useRouter();

  useEffect(() => {
    fetchBeneficiarios();
  }, []);

  useEffect(() => {
    filterBeneficiarios();
  }, [searchQuery, beneficiarios]);

  const fetchBeneficiarios = async () => {
    setLoading(true);
    try {
      let data: Beneficiario[];
      
      if (isLiderComunidad()) {
        data = await beneficiarioService.getAll();
      } else if (isJefeCalle()) {
        const userCalle = getUserCalle();
        if (userCalle) {
          data = await beneficiarioService.getAllByUserCalle(userCalle);
        } else {
          data = [];
          showSnackbar('No se pudo determinar tu calle asignada', 'error');
        }
      } else {
        data = [];
        showSnackbar('No tienes permisos para ver beneficiarios', 'error');
      }

      const activeBeneficiarios = data.filter((b: Beneficiario) => beneficiarioService.isActive(b));
      setBeneficiarios(activeBeneficiarios);
    } catch (error: any) {
      console.error('Error al obtener beneficiarios:', error);
      const errorMessage = error.response?.data?.error || 'Error al cargar los beneficiarios';
      showSnackbar(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterBeneficiarios = () => {
    if (!searchQuery) {
      setFilteredBeneficiarios(beneficiarios);
      return;
    }

    const filtered = beneficiarios.filter((beneficiario) => {
      const searchTermLower = searchQuery.toLowerCase();
      return (
        beneficiario.cedula.toLowerCase().includes(searchTermLower) ||
        beneficiario.nombre_apellido.toLowerCase().includes(searchTermLower) ||
        beneficiario.telefono.toLowerCase().includes(searchTermLower) ||
        beneficiario.profesion.toLowerCase().includes(searchTermLower)
      );
    });

    setFilteredBeneficiarios(filtered);
  };

  const canAccessBeneficiario = (beneficiario: Beneficiario): boolean => {
    if (!user) return false;
    return beneficiarioService.canAccessBeneficiario(
      beneficiario, 
      user.id_rol_user, 
      user.id_calle
    );
  };

  const handleDisable = (beneficiario: Beneficiario) => {
    Alert.alert(
      'Deshabilitar Beneficiario',
      `¿Estás seguro de que deseas deshabilitar al beneficiario ${beneficiario.nombre_apellido}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Deshabilitar', 
          style: 'destructive',
          onPress: async () => {
            try {
              await beneficiarioService.updateStatus(beneficiario.cedula, 'Inactivo');
              showSnackbar('Beneficiario deshabilitado exitosamente', 'success');
              fetchBeneficiarios();
            } catch (error: any) {
              console.error('Error al deshabilitar beneficiario:', error);
              const errorMessage = error.response?.data?.error || 'Error al deshabilitar el beneficiario';
              showSnackbar(errorMessage, 'error');
            }
          }
        },
      ]
    );
  };

  const renderBeneficiario = ({ item }: { item: Beneficiario }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.cardInfo}>
            <Title style={styles.cardTitle}>{item.nombre_apellido}</Title>
            <Paragraph style={styles.cardSubtitle}>Cédula: {item.cedula}</Paragraph>
            <Paragraph style={styles.cardSubtitle}>Profesión: {item.profesion}</Paragraph>
            <Paragraph style={styles.cardSubtitle}>Teléfono: {item.telefono}</Paragraph>
            {isLiderComunidad() && item.nom_calle && (
              <Paragraph style={styles.cardSubtitle}>Calle: {item.nom_calle}</Paragraph>
            )}
          </View>
          <View style={styles.cardActions}>
            <Chip 
              mode="flat"
              style={[
                styles.statusChip,
                { backgroundColor: beneficiarioService.isActive(item) ? '#4CAF50' : '#F44336' }
              ]}
              textStyle={styles.statusChipText}
            >
              {beneficiarioService.isActive(item) ? 'Activo' : 'Inactivo'}
            </Chip>
            <Menu
              visible={menuVisible === item.cedula}
              onDismiss={() => setMenuVisible(null)}
              anchor={
                <IconButton
                  icon="dots-vertical"
                  onPress={() => setMenuVisible(item.cedula)}
                  disabled={!canAccessBeneficiario(item)}
                />
              }
            >
              <Menu.Item
                leadingIcon="eye"
                onPress={() => {
                  setMenuVisible(null);
                  router.push(`/dashboard/beneficiarios/detail?cedula=${item.cedula}`);
                }}
                title="Ver Detalles"
              />
              <Menu.Item
                leadingIcon="pencil"
                onPress={() => {
                  setMenuVisible(null);
                  router.push(`/dashboard/beneficiarios/form?cedula=${item.cedula}`);
                }}
                title="Editar"
              />
              <Menu.Item
                leadingIcon="account-off"
                onPress={() => {
                  setMenuVisible(null);
                  handleDisable(item);
                }}
                title="Deshabilitar"
              />
            </Menu>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4040" />
        <Text style={styles.loadingText}>Cargando beneficiarios...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          {isLiderComunidad() ? 'Beneficiarios - Todas las Calles' : 'Beneficiarios - Mi Calle'}
        </Text>
        <Searchbar
          placeholder="Buscar beneficiario..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>

      {filteredBeneficiarios.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="account-group" size={80} color="#ccc" />
          <Text variant="headlineSmall" style={styles.emptyTitle}>
            No hay beneficiarios registrados
          </Text>
          <Text variant="bodyMedium" style={styles.emptyDescription}>
            {isJefeCalle() 
              ? "No hay beneficiarios registrados en tu calle asignada."
              : "Comienza registrando un nuevo beneficiario en el sistema."
            }
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredBeneficiarios}
          renderItem={renderBeneficiario}
          keyExtractor={(item) => item.cedula}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/dashboard/beneficiarios/form')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    elevation: 2,
  },
  title: {
    marginBottom: 16,
    fontWeight: 'bold',
    color: '#FF4040',
  },
  searchbar: {
    elevation: 0,
    backgroundColor: '#F5F5F5',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
    elevation: 2,
    borderRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  cardActions: {
    alignItems: 'flex-end',
  },
  statusChip: {
    marginBottom: 8,
  },
  statusChipText: {
    color: 'white',
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    textAlign: 'center',
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#FF4040',
  },
});