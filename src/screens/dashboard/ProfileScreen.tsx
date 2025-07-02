import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, Avatar } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../theme/theme';

const ProfileScreen = () => {
  const { user, logout, isLiderComunidad, isJefeCalle } = useAuth();

  const getRoleLabel = () => {
    if (isLiderComunidad()) return 'Líder de Comunidad';
    if (isJefeCalle()) return 'Jefe de Calle';
    return 'Usuario';
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar Sesión', onPress: logout, style: 'destructive' },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>Mi Perfil</Title>
        <Paragraph style={styles.subtitle}>Configuración de usuario</Paragraph>
      </View>

      <Card style={styles.profileCard}>
        <Card.Content style={styles.profileContent}>
          <Avatar.Image
            size={100}
            source={
              user?.foto_perfil
                ? { uri: user.foto_perfil }
                : require('../../../assets/default-avatar.png')
            }
            style={styles.avatar}
          />
          <Title style={styles.userName}>{user?.nom_user}</Title>
          <Paragraph style={styles.userRole}>{getRoleLabel()}</Paragraph>
          <Paragraph style={styles.userEmail}>{user?.correo}</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.infoCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Información Personal</Title>
          <View style={styles.infoRow}>
            <Paragraph style={styles.infoLabel}>Cédula:</Paragraph>
            <Paragraph style={styles.infoValue}>{user?.ced_user}</Paragraph>
          </View>
          <View style={styles.infoRow}>
            <Paragraph style={styles.infoLabel}>Usuario:</Paragraph>
            <Paragraph style={styles.infoValue}>{user?.user}</Paragraph>
          </View>
          <View style={styles.infoRow}>
            <Paragraph style={styles.infoLabel}>Correo:</Paragraph>
            <Paragraph style={styles.infoValue}>{user?.correo}</Paragraph>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.actionCard}>
        <Card.Content>
          <Button
            mode="outlined"
            onPress={handleLogout}
            style={styles.logoutButton}
            textColor={colors.error}
          >
            Cerrar Sesión
          </Button>
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
  header: {
    backgroundColor: colors.primary,
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.9,
  },
  profileCard: {
    margin: 16,
    elevation: 2,
  },
  profileContent: {
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    marginBottom: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userRole: {
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    color: colors.textSecondary,
  },
  infoCard: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
  },
  sectionTitle: {
    marginBottom: 16,
    color: colors.text,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontWeight: '600',
    color: colors.text,
  },
  infoValue: {
    color: colors.textSecondary,
  },
  actionCard: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
  },
  logoutButton: {
    borderColor: colors.error,
  },
});

export default ProfileScreen;