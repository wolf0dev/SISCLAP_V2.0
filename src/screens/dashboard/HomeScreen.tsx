import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Avatar,
  Text,
  Chip,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../theme/theme';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user, isLiderComunidad, isJefeCalle } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const getRoleLabel = () => {
    if (isLiderComunidad()) return 'Líder de Comunidad';
    if (isJefeCalle()) return 'Jefe de Calle';
    return 'Usuario';
  };

  const getRoleColor = () => {
    if (isLiderComunidad()) return colors.error;
    if (isJefeCalle()) return colors.primary;
    return colors.gray;
  };

  const menuItems = [
    {
      title: 'Beneficiarios',
      description: 'Gestionar beneficiarios del sistema',
      icon: 'people-outline',
      color: colors.primary,
      onPress: () => navigation.navigate('Beneficiarios' as never),
      roles: [1, 2],
    },
    {
      title: 'Dependientes',
      description: 'Gestionar dependientes de beneficiarios',
      icon: 'person-add-outline',
      color: colors.primaryLight,
      onPress: () => navigation.navigate('Dependientes' as never),
      roles: [1, 2],
    },
    {
      title: 'Beneficiarios Inactivos',
      description: 'Ver y reactivar beneficiarios inactivos',
      icon: 'person-remove-outline',
      color: colors.error,
      onPress: () => navigation.navigate('BeneficiariosInactivos' as never),
      roles: [1, 2],
    },
    {
      title: 'Reportes',
      description: 'Generar reportes del sistema',
      icon: 'document-text-outline',
      color: colors.info,
      onPress: () => navigation.navigate('Reportes' as never),
      roles: [1, 2],
    },
    {
      title: 'Gestión de Usuarios',
      description: 'Administrar usuarios del sistema',
      icon: 'settings-outline',
      color: colors.secondary,
      onPress: () => navigation.navigate('Users' as never),
      roles: [1],
    },
  ];

  const canAccessMenuItem = (roles: number[]) => {
    return user && roles.includes(user.id_rol_user);
  };

  const visibleMenuItems = menuItems.filter(item => canAccessMenuItem(item.roles));

  return (
    <ScrollView style={styles.container}>
      {/* Header Card */}
      <Card style={styles.headerCard}>
        <Card.Content style={styles.headerContent}>
          <View style={styles.headerText}>
            <View style={styles.greetingRow}>
              <Title style={styles.greeting}>
                {getGreeting()}, {user?.nom_user}!
              </Title>
              <Chip
                style={[styles.roleChip, { backgroundColor: getRoleColor() }]}
                textStyle={styles.roleChipText}
              >
                {getRoleLabel()}
              </Chip>
            </View>
            <Paragraph style={styles.subtitle}>
              Sistema de Gestión de Beneficios
            </Paragraph>
            <Paragraph style={styles.description}>
              Bienvenido al sistema de gestión de beneficiarios de Brisas del Orinoco II
            </Paragraph>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile' as never)}>
            <Avatar.Image
              size={80}
              source={
                user?.foto_perfil
                  ? { uri: user.foto_perfil }
                  : require('../../../assets/default-avatar.png')
              }
              style={styles.avatar}
            />
          </TouchableOpacity>
        </Card.Content>
      </Card>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        <Title style={styles.menuTitle}>Funcionalidades</Title>
        <View style={styles.menuGrid}>
          {visibleMenuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <Card style={styles.menuCard}>
                <Card.Content style={styles.menuCardContent}>
                  <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                    <Ionicons name={item.icon as any} size={32} color={colors.white} />
                  </View>
                  <Title style={styles.menuItemTitle}>{item.title}</Title>
                  <Paragraph style={styles.menuItemDescription}>
                    {item.description}
                  </Paragraph>
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
          <Paragraph style={styles.infoText}>
            Con este sistema, los administradores pueden gestionar de manera eficiente
            toda la información relacionada con los beneficiarios de la comunidad.
          </Paragraph>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerCard: {
    margin: 16,
    elevation: 4,
    backgroundColor: colors.primary,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    flex: 1,
    marginRight: 16,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  greeting: {
    color: colors.white,
    fontWeight: 'bold',
    marginRight: 8,
    fontSize: 20,
  },
  roleChip: {
    marginTop: 4,
  },
  roleChipText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  subtitle: {
    color: colors.white,
    opacity: 0.9,
    fontSize: 16,
    marginBottom: 4,
  },
  description: {
    color: colors.white,
    opacity: 0.8,
    fontSize: 14,
  },
  avatar: {
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  menuContainer: {
    padding: 16,
  },
  menuTitle: {
    marginBottom: 16,
    color: colors.text,
    fontWeight: 'bold',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: (width - 48) / 2,
    marginBottom: 16,
  },
  menuCard: {
    elevation: 2,
    height: 160,
  },
  menuCardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  menuItemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 12,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  infoCard: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
  },
  infoTitle: {
    marginBottom: 12,
    color: colors.text,
    fontWeight: 'bold',
  },
  infoText: {
    marginBottom: 8,
    lineHeight: 20,
    color: colors.textSecondary,
  },
});

export default HomeScreen;