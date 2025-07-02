import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const menuItems = [
    {
      title: 'Beneficiarios',
      description: 'Gestionar beneficiarios del sistema',
      icon: 'people',
      color: '#FF4040',
    },
    {
      title: 'Dependientes',
      description: 'Gestionar dependientes de beneficiarios',
      icon: 'person-add',
      color: '#FF6B6B',
    },
    {
      title: 'Reportes',
      description: 'Generar reportes del sistema',
      icon: 'document-text',
      color: '#0288D1',
    },
    {
      title: 'Configuración',
      description: 'Configurar el sistema',
      icon: 'settings',
      color: '#424242',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>¡Bienvenido!</Text>
        <Text style={styles.subtitle}>Sistema de Gestión de Beneficios</Text>
        <Text style={styles.description}>Brisas del Orinoco II</Text>
      </View>

      {/* Menu Grid */}
      <View style={styles.menuContainer}>
        <Text style={styles.menuTitle}>Funcionalidades</Text>
        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, { backgroundColor: item.color }]}
              activeOpacity={0.8}
            >
              <Ionicons name={item.icon as any} size={32} color="#fff" />
              <Text style={styles.menuItemTitle}>{item.title}</Text>
              <Text style={styles.menuItemDescription}>{item.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Info Section */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Acerca del Sistema</Text>
        <Text style={styles.infoText}>
          El Sistema de Gestión de Beneficios es una herramienta diseñada para facilitar
          la administración de beneficiarios y sus dependientes en la comunidad Brisas del Orinoco II.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FF4040',
    padding: 24,
    paddingTop: 60,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  menuContainer: {
    padding: 20,
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 16,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: '48%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  menuItemDescription: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
  },
  infoSection: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#757575',
    lineHeight: 20,
  },
});