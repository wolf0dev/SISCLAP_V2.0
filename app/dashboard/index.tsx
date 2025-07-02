import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { 
  Card, 
  Title, 
  Paragraph, 
  Avatar, 
  Chip,
  Surface,
  Text
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';

const { width } = Dimensions.get('window');

export default function DashboardHome() {
  const { user, isLiderComunidad, isJefeCalle } = useAuth();
  const router = useRouter();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const getRoleInfo = () => {
    if (isLiderComunidad()) {
      return {
        label: 'Líder de Comunidad',
        description: 'Acceso completo a todas las funcionalidades del sistema',
        color: '#D32F2F',
      };
    } else if (isJefeCalle()) {
      return {
        label: 'Jefe de Calle',
        description: 'Gestión de beneficiarios y reportes de tu calle asignada',
        color: '#1976D2',
      };
    }
    return {
      label: 'Usuario',
      description: 'Acceso básico al sistema',
      color: '#757575',
    };
  };

  const roleInfo = getRoleInfo();

  const cards = [
    {
      title: 'Beneficiarios',
      description: 'Gestionar beneficiarios del sistema',
      icon: 'account-group',
      route: '/dashboard/beneficiarios',
      color: '#FF4040',
      roles: [1, 2],
    },
    {
      title: 'Dependientes',
      description: 'Gestionar dependientes de beneficiarios',
      icon: 'account-plus',
      route: '/dashboard/dependientes',
      color: '#FF6B6B',
      roles: [1, 2],
    },
    {
      title: 'Beneficiarios Inactivos',
      description: 'Ver y reactivar beneficiarios inactivos',
      icon: 'account-off',
      route: '/dashboard/beneficiarios/inactivos',
      color: '#D32F2F',
      roles: [1, 2],
    },
    {
      title: 'Reportes',
      description: 'Generar reportes del sistema',
      icon: 'file-chart',
      route: '/dashboard/reportes',
      color: '#FF4040',
      roles: [1, 2],
    },
  ];

  const canAccessCard = (cardRoles: number[]) => {
    return user && cardRoles.includes(user.id_rol_user);
  };

  const visibleCards = cards.filter(card => canAccessCard(card.roles));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <Surface style={styles.headerCard}>
          <View style={styles.headerContent}>
            <View style={styles.headerText}>
              <View style={styles.greetingRow}>
                <Text variant="headlineMedium" style={styles.greeting}>
                  {getGreeting()}, {user?.nom_user}!
                </Text>
                <Chip 
                  style={[styles.roleChip, { backgroundColor: roleInfo.color }]}
                  textStyle={styles.roleChipText}
                >
                  {roleInfo.label}
                </Chip>
              </View>
              
              <Text variant="titleMedium" style={styles.systemTitle}>
                Sistema de Gestión de Beneficios
              </Text>
              <Text variant="bodyMedium" style={styles.description}>
                {roleInfo.description}
              </Text>
            </View>
            
            <Avatar.Image
              size={100}
              source={{
                uri: user?.foto_perfil || 'https://via.placeholder.com/150'
              }}
              style={styles.avatar}
            />
          </View>
        </Surface>

        {/* Cards Grid */}
        <View style={styles.cardsContainer}>
          {visibleCards.map((card, index) => (
            <Card 
              key={index} 
              style={styles.card}
              onPress={() => router.push(card.route as any)}
            >
              <Card.Content style={styles.cardContent}>
                <View style={[styles.iconContainer, { backgroundColor: card.color }]}>
                  <MaterialCommunityIcons 
                    name={card.icon as any} 
                    size={32} 
                    color="white" 
                  />
                </View>
                <Title style={styles.cardTitle}>{card.title}</Title>
                <Paragraph style={styles.cardDescription}>
                  {card.description}
                </Paragraph>
              </Card.Content>
            </Card>
          ))}
        </View>

        {/* Info Section */}
        <Surface style={styles.infoCard}>
          <Title style={styles.infoTitle}>Acerca del Sistema</Title>
          <Paragraph style={styles.infoParagraph}>
            El Sistema de Gestión de Beneficios es una herramienta diseñada para facilitar 
            la administración de beneficiarios y sus dependientes en la comunidad Brisas del Orinoco II.
          </Paragraph>
          <Paragraph style={styles.infoParagraph}>
            Con este sistema, los administradores pueden gestionar de manera eficiente 
            toda la información relacionada con los beneficiarios de la comunidad.
          </Paragraph>
        </Surface>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    padding: 16,
  },
  headerCard: {
    padding: 20,
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: '#FF4040',
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerText: {
    flex: 1,
    paddingRight: 16,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  greeting: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 8,
  },
  roleChip: {
    marginTop: 4,
  },
  roleChipText: {
    color: 'white',
    fontSize: 12,
  },
  systemTitle: {
    color: 'white',
    marginBottom: 8,
  },
  description: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  avatar: {
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    width: (width - 48) / 2,
    marginBottom: 16,
    elevation: 4,
    borderRadius: 12,
  },
  cardContent: {
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 12,
    textAlign: 'center',
    color: '#666',
  },
  infoCard: {
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },
  infoTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  infoParagraph: {
    marginBottom: 12,
    lineHeight: 20,
    color: '#666',
  },
});