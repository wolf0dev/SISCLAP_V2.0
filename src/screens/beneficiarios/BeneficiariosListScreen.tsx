import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Searchbar,
  FAB,
  Chip,
  Text,
  Button,
  Menu,
  IconButton,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { beneficiarioService, Beneficiario } from '../../services/beneficiarioService';
import { useAuth } from '../../contexts/AuthContext';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { colors } from '../../theme/theme';
import LoadingScreen from '../LoadingScreen';

const BeneficiariosListScreen = () => {
  const navigation = useNavigation();
  const { user, isLiderComunidad, isJefeCalle, getUserCalle } = useAuth();
  const { showSnackbar } = useSnackbar();
  
  const [beneficiarios, setBeneficiarios] = useState<Beneficiario[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuVisible, setMenuVisible] = useState<string | null>(null);

  const fetchBeneficiarios = async () => {
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

      const activeBeneficiarios = data.filter((b: Beneficiario) => 
        beneficiarioService.isActive(b)
      );
      setBeneficiarios(activeBeneficiarios);
    } catch (error: any) {
      console.error('Error al obtener beneficiarios:', error);
      showSnackbar('Error al cargar los beneficiarios', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBeneficiarios();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchBeneficiarios();
  };

  const filteredBeneficiarios = beneficiarios.filter((beneficiario) => {
    const searchTermLower = searchQuery.toLowerCase();
    return (
      beneficiario.cedula.toLowerCase().includes(searchTermLower) ||
      beneficiario.nombre_apellido.toLowerCase().includes(searchTermLower) ||
      beneficiario.telefono.toLowerCase().includes(searchTermLower) ||
      beneficiario.profesion.toLowerCase().includes(searchTermLower)
    );
  });

  const handleMenuAction = (action: string, beneficiario: Beneficiario) => {
    setMenuVisible(null);
    
    switch (action) {
      case 'view':
        navigation.navigate('BeneficiarioDetail' as never, { cedula: beneficiario.cedula } as never);
        break;
      case 'edit':
        navigation.navigate('BeneficiarioForm' as never, { 
          cedula: beneficiario.cedula, 
          isEditing: true 
        } as never);
        break;
      case 'disable':
        // Implementar lógica de deshabilitación
        break;
    }
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
              style={[
                styles.statusChip,
                { backgroundColor: beneficiarioService.isActive(item) ? colors.success : colors.error }
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
                />
              }
            >
              <Menu.Item
                onPress={() => handleMenuAction('view', item)}
                title="Ver Detalles"
                leadingIcon="eye"
              />
              <Menu.Item
                onPress={() => handleMenuAction('edit', item)}
                title="Editar"
                leadingIcon="pencil"
              />
              <Menu.Item
                onPress={() => handleMenuAction('disable', item)}
                title="Deshabilitar"
                leadingIcon="account-remove"
              />
            </Menu>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Buscar beneficiario..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      {isJefeCalle() && (
        <Card style={styles.infoCard}>
          <Card.Content>
            <Text style={styles.infoText}>
              Mostrando beneficiarios de tu calle asignada
            </Text>
          </Card.Content>
        </Card>
      )}

      {filteredBeneficiarios.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={80} color={colors.gray} />
          <Title style={styles.emptyTitle}>No hay beneficiarios registrados</Title>
          <Paragraph style={styles.emptyText}>
            {isJefeCalle() 
              ? "No hay beneficiarios registrados en tu calle asignada."
              : "Comienza registrando un nuevo beneficiario en el sistema."
            }
          </Paragraph>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('BeneficiarioForm' as never)}
            style={styles.emptyButton}
          >
            Registrar Beneficiario
          </Button>
        </View>
      ) : (
        <FlatList
          data={filteredBeneficiarios}
          renderItem={renderBeneficiario}
          keyExtractor={(item) => item.cedula}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('BeneficiarioForm' as never)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchbar: {
    margin: 16,
    elevation: 2,
  },
  infoCard: {
    marginHorizontal: 16,
    marginBottom: 8,
    elevation: 1,
  },
  infoText: {
    color: colors.info,
    fontSize: 14,
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  card: {
    marginBottom: 12,
    elevation: 2,
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
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  cardActions: {
    alignItems: 'flex-end',
  },
  statusChip: {
    marginBottom: 8,
  },
  statusChipText: {
    color: colors.white,
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
  emptyText: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginBottom: 24,
  },
  emptyButton: {
    paddingHorizontal: 24,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
});

export default BeneficiariosListScreen;