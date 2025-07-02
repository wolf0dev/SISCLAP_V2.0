import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { 
  Drawer, 
  Avatar, 
  Title, 
  Caption, 
  Divider,
  Switch,
  TouchableRipple,
  Text
} from 'react-native-paper';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const CustomDrawerContent = (props: any) => {
  const { user, logout, isLiderComunidad, isJefeCalle } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const getRoleLabel = () => {
    if (isLiderComunidad()) return 'Líder de Comunidad';
    if (isJefeCalle()) return 'Jefe de Calle';
    return 'Usuario';
  };

  const menuItems = [
    {
      label: 'Inicio',
      icon: 'home',
      route: '/dashboard',
      roles: [1, 2],
    },
    {
      label: 'Beneficiarios',
      icon: 'account-group',
      route: '/dashboard/beneficiarios',
      roles: [1, 2],
    },
    {
      label: 'Beneficiarios Inactivos',
      icon: 'account-off',
      route: '/dashboard/beneficiarios/inactivos',
      roles: [1, 2],
    },
    {
      label: 'Dependientes',
      icon: 'account-plus',
      route: '/dashboard/dependientes',
      roles: [1, 2],
    },
    {
      label: 'Reportes',
      icon: 'file-chart',
      route: '/dashboard/reportes',
      roles: [1, 2],
    },
    {
      label: 'Gestión de Usuarios',
      icon: 'account-cog',
      route: '/dashboard/users',
      roles: [1],
    },
  ];

  const canAccessMenuItem = (roles: number[]) => {
    return user && roles.includes(user.id_rol_user);
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View style={styles.userInfo}>
              <Avatar.Image
                source={{
                  uri: user?.foto_perfil || 'https://via.placeholder.com/150'
                }}
                size={50}
              />
              <View style={styles.userDetails}>
                <Title style={styles.title}>{user?.nom_user}</Title>
                <Caption style={styles.caption}>{getRoleLabel()}</Caption>
              </View>
            </View>
          </View>

          <Divider />

          <Drawer.Section style={styles.drawerSection}>
            {menuItems.map((item) => {
              if (!canAccessMenuItem(item.roles)) return null;
              
              return (
                <DrawerItem
                  key={item.route}
                  icon={({ color, size }) => (
                    <MaterialCommunityIcons name={item.icon as any} color={color} size={size} />
                  )}
                  label={item.label}
                  onPress={() => props.navigation.navigate(item.route)}
                />
              );
            })}
          </Drawer.Section>

          <Divider />

          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              icon={({ color, size }) => (
                <MaterialCommunityIcons name="account" color={color} size={size} />
              )}
              label="Mi Perfil"
              onPress={() => props.navigation.navigate('/dashboard/profile')}
            />
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>

      <Drawer.Section style={styles.bottomDrawerSection}>
        <TouchableRipple onPress={toggleTheme}>
          <View style={styles.preference}>
            <Text>Modo Oscuro</Text>
            <View pointerEvents="none">
              <Switch value={isDarkMode} />
            </View>
          </View>
        </TouchableRipple>
        
        <DrawerItem
          icon={({ color, size }) => (
            <MaterialCommunityIcons name="exit-to-app" color={color} size={size} />
          )}
          label="Cerrar Sesión"
          onPress={logout}
        />
      </Drawer.Section>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
    paddingVertical: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userDetails: {
    marginLeft: 15,
    flexDirection: 'column',
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
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