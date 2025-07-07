import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useBeneficiarios } from '../../src/hooks/useBeneficiarios';

export default function HomeScreen() {
  const router = useRouter();
  const { beneficiarios, loading, loadBeneficiarios } = useBeneficiarios();
  const [refreshing, setRefreshing] = React.useState(false);

  const menuItems = [
    {
      title: 'Beneficiarios Activos',
      description: 'Gestionar beneficiarios activos',
      icon: 'people',
      route: '/beneficiarios',
      color: '#4CAF50',
    },
    {
      title: 'Beneficiarios Inactivos',
      description: 'Ver beneficiarios inactivos',
      icon: 'people-outline',
      route: '/beneficiarios-inactivos',
      color: '#F44336',
    },
    {
      title: 'Reportes',
      description: 'Generar reportes del sistema',
      icon: 'bar-chart',
      route: '/reportes',
      color: '#FF9800',
    },
    {
      title: 'Mi Perfil',
      description: 'Ver y editar perfil',
      icon: 'person',
      route: '/profile',
      color: '#2196F3',
    },
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadBeneficiarios();
    setRefreshing(false);
  };

  // Calculate real-time stats
  const totalBeneficiarios = beneficiarios.length;
  const beneficiariosActivos = beneficiarios.filter(b => b.estatus === 'ACTIVO').length;
  const beneficiariosInactivos = beneficiarios.filter(b => b.estatus === 'INACTIVO').length;
  
  // Calcular distribución por género
  const hombres = beneficiarios.filter(b => b.genero === 'Masculino').length;
  const mujeres = beneficiarios.filter(b => b.genero === 'Femenino').length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' }}
            style={styles.logo}
          />
          <Text style={styles.title}>SISCLAP</Text>
          <Text style={styles.subtitle}>Sistema de Gestión de Beneficios</Text>
          <Text style={styles.community}>Brisas del Orinoco II</Text>
        </View>

        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>¡Bienvenido!</Text>
          <Text style={styles.welcomeText}>
            Gestiona de manera eficiente los beneficiarios y reportes de la comunidad Brisas del Orinoco II
          </Text>
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Estadísticas en Tiempo Real</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{totalBeneficiarios}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#4CAF50' }]}>{beneficiariosActivos}</Text>
              <Text style={styles.statLabel}>Activos</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#F44336' }]}>{beneficiariosInactivos}</Text>
              <Text style={styles.statLabel}>Inactivos</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#2196F3' }]}>{hombres}</Text>
              <Text style={styles.statLabel}>Hombres</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#E91E63' }]}>{mujeres}</Text>
              <Text style={styles.statLabel}>Mujeres</Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, { borderLeftColor: item.color }]}
              onPress={() => router.push(item.route as any)}
            >
              <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                <Ionicons name={item.icon as any} size={24} color="white" />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsCard}>
          <Text style={styles.quickActionsTitle}>Acciones Rápidas</Text>
          <View style={styles.quickActionsRow}>
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => router.push('/beneficiarios')}
            >
              <Ionicons name="person-add" size={24} color="#4CAF50" />
              <Text style={styles.quickActionText}>Nuevo Beneficiario</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => router.push('/reportes')}
            >
              <Ionicons name="document-text" size={24} color="#FF9800" />
              <Text style={styles.quickActionText}>Generar Reporte</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activityCard}>
          <Text style={styles.activityTitle}>Información del Sistema</Text>
          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="server" size={16} color="#4CAF50" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>Sistema SISCLAP conectado</Text>
                <Text style={styles.activityTime}>API funcionando correctamente</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="shield-checkmark" size={16} color="#2196F3" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>Datos sincronizados</Text>
                <Text style={styles.activityTime}>Última actualización: ahora</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="people" size={16} color="#FF9800" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>Base de datos activa</Text>
                <Text style={styles.activityTime}>{totalBeneficiarios} registros disponibles</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  community: {
    fontSize: 14,
    color: '#FF4040',
    textAlign: 'center',
    marginTop: 5,
    fontWeight: '500',
  },
  welcomeCard: {
    backgroundColor: '#FF4040',
    padding: 20,
    borderRadius: 12,
    marginBottom: 25,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  statsCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF4040',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  menuContainer: {
    marginBottom: 25,
  },
  menuItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 14,
    color: '#666',
  },
  quickActionsCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickAction: {
    alignItems: 'center',
    padding: 16,
  },
  quickActionText: {
    fontSize: 12,
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },
  activityCard: {
    backgroundColor: 'white',
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
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
  },
});