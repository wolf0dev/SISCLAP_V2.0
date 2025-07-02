import { Drawer } from 'expo-router/drawer';
import { useAuth } from '../../src/contexts/AuthContext';
import CustomDrawerContent from '../../src/components/navigation/CustomDrawerContent';

export default function DashboardLayout() {
  const { user } = useAuth();

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FF4040',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        drawerStyle: {
          backgroundColor: '#fff',
          width: 280,
        },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: 'Inicio',
          title: 'Inicio',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="beneficiarios"
        options={{
          drawerLabel: 'Beneficiarios',
          title: 'Beneficiarios',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-group" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="dependientes"
        options={{
          drawerLabel: 'Dependientes',
          title: 'Dependientes',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-plus" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="reportes"
        options={{
          drawerLabel: 'Reportes',
          title: 'Reportes',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="file-chart" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          drawerLabel: 'Mi Perfil',
          title: 'Mi Perfil',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}