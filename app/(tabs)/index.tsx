import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Avatar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/theme';

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
        <Title style={styles.menuTitle}>Funcionalidades</Title>
        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              activeOpacity={0.8}
            >
              <Card style={[styles.menuCard, { backgroundColor: item.color }]}>
                <Card.Content style={styles.menuCardContent}>
                  <Ionicons name={item.icon as any} size={32} color="#fff" />
                  <Title style={styles.menuItemTitle}>{item.title}</Title>
                  <Paragraph style={styles.menuItemDescription}>{item.description}</Paragraph>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Info Section */}
      <Card style={styles.infoCard}>
        <Card.Content>
          <Title style={styles.infoTitle}>Acerca del Sistema</Title>
          <Paragraph style={styles.infoText}>
            El Sistema de Gestión de Beneficios es una herramienta diseñada para facilitar
            la administración de beneficiarios y sus dependientes en la comunidad Brisas del Orinoco II.
          </Paragraph>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    padding: 24,
    paddingTop: 60,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: colors.white,
    opacity: 0.9,
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.8,
  },
  menuContainer: {
    padding: 20,
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: '48%',
    marginBottom: 16,
  },
  menuCard: {
    borderRadius: 12,
    elevation: 3,
  },
  menuCardContent: {
    alignItems: 'center',
    padding: 20,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  menuItemDescription: {
    fontSize: 12,
    color: colors.white,
    opacity: 0.9,
    textAlign: 'center',
  },
  infoCard: {
    margin: 20,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});