import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import {
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
  Divider,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { colors } from '../theme/theme';

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const { user, logout, isLiderComunidad, isJefeCalle } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

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
    <View style={styles.drawerContent}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View style={styles.userInfo}>
              <Avatar.Image
                source={
                  user?.foto_perfil
                    ? { uri: user.foto_perfil }
                    : require('../../assets/default-avatar.png')
                }
                size={50}
              />
              <View style={styles.userDetails}>
                <Title style={styles.title}>{user?.nom_user}</Title>
                <Caption style={styles.caption}>{getRoleLabel()}</Caption>
                <Caption style={styles.caption}>{user?.correo}</Caption>
              </View>
            </View>
          </View>

          <Drawer.Section style={styles.drawerSection}>
            <Drawer.Item
              icon={({ color, size }) => (
                <Ionicons name="home-outline" color={color} size={size} />
              )}
              label="Inicio"
              active={props.state.index === 0}
              onPress={() => props.navigation.navigate('Home')}
            />
            
            <Drawer.Item
              icon={({ color, size }) => (
                <Ionicons name="people-outline" color={color} size={size} />
              )}
              label="Beneficiarios"
              active={props.state.index === 1}
              onPress={() => props.navigation.navigate('Beneficiarios')}
            />

            <Drawer.Item
              icon={({ color, size }) => (
                <Ionicons name="person-remove-outline" color={color} size={size} />
              )}
              label="Beneficiarios Inactivos"
              active={props.state.index === 2}
              onPress={() => props.navigation.navigate('BeneficiariosInactivos')}
            />

            <Drawer.Item
              icon={({ color, size }) => (
                <Ionicons name="person-add-outline" color={color} size={size} />
              )}
              label="Dependientes"
              active={props.state.index === 3}
              onPress={() => props.navigation.navigate('Dependientes')}
            />

            <Drawer.Item
              icon={({ color, size }) => (
                <Ionicons name="document-text-outline" color={color} size={size} />
              )}
              label="Reportes"
              active={props.state.index === 4}
              onPress={() => props.navigation.navigate('Reportes')}
            />

            {isLiderComunidad() && (
              <Drawer.Item
                icon={({ color, size }) => (
                  <Ionicons name="settings-outline" color={color} size={size} />
                )}
                label="Gestión de Usuarios"
                active={props.state.index === 5}
                onPress={() => props.navigation.navigate('Users')}
              />
            )}

            <Drawer.Item
              icon={({ color, size }) => (
                <Ionicons name="person-outline" color={color} size={size} />
              )}
              label="Mi Perfil"
              onPress={() => props.navigation.navigate('Profile')}
            />
          </Drawer.Section>

          <Drawer.Section title="Configuración">
            <TouchableRipple onPress={toggleTheme}>
              <View style={styles.preference}>
                <Text>Modo Oscuro</Text>
                <View pointerEvents="none">
                  <Switch value={isDarkMode} />
                </View>
              </View>
            </TouchableRipple>
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>

      <Drawer.Section style={styles.bottomDrawerSection}>
        <Drawer.Item
          icon={({ color, size }) => (
            <Ionicons name="log-out-outline" color={color} size={size} />
          )}
          label="Cerrar Sesión"
          onPress={handleLogout}
        />
      </Drawer.Section>
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: colors.primary,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userDetails: {
    marginLeft: 15,
    flex: 1,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: 'bold',
    color: colors.white,
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});

export default CustomDrawerContent;