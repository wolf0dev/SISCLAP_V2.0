import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import CustomDrawerContent from '../components/CustomDrawerContent';

// Screens
import HomeScreen from '../screens/dashboard/HomeScreen';
import ProfileScreen from '../screens/dashboard/ProfileScreen';
import BeneficiariosListScreen from '../screens/beneficiarios/BeneficiariosListScreen';
import BeneficiarioFormScreen from '../screens/beneficiarios/BeneficiarioFormScreen';
import BeneficiarioDetailScreen from '../screens/beneficiarios/BeneficiarioDetailScreen';
import BeneficiariosInactivosScreen from '../screens/beneficiarios/BeneficiariosInactivosScreen';
import DependientesListScreen from '../screens/dependientes/DependientesListScreen';
import DependienteFormScreen from '../screens/dependientes/DependienteFormScreen';
import DependienteDetailScreen from '../screens/dependientes/DependienteDetailScreen';
import UsersListScreen from '../screens/users/UsersListScreen';
import UserFormScreen from '../screens/users/UserFormScreen';
import ReporteCargaFamiliarScreen from '../screens/reportes/ReporteCargaFamiliarScreen';
import ReporteHabitantesCalleScreen from '../screens/reportes/ReporteHabitantesCalleScreen';
import ReporteRangoEdadScreen from '../screens/reportes/ReporteRangoEdadScreen';
import ReporteDeVentaScreen from '../screens/reportes/ReporteDeVentaScreen';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const BeneficiariosStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="BeneficiariosList" 
      component={BeneficiariosListScreen}
      options={{ title: 'Beneficiarios' }}
    />
    <Stack.Screen 
      name="BeneficiarioForm" 
      component={BeneficiarioFormScreen}
      options={{ title: 'Formulario Beneficiario' }}
    />
    <Stack.Screen 
      name="BeneficiarioDetail" 
      component={BeneficiarioDetailScreen}
      options={{ title: 'Detalle Beneficiario' }}
    />
  </Stack.Navigator>
);

const DependientesStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="DependientesList" 
      component={DependientesListScreen}
      options={{ title: 'Dependientes' }}
    />
    <Stack.Screen 
      name="DependienteForm" 
      component={DependienteFormScreen}
      options={{ title: 'Formulario Dependiente' }}
    />
    <Stack.Screen 
      name="DependienteDetail" 
      component={DependienteDetailScreen}
      options={{ title: 'Detalle Dependiente' }}
    />
  </Stack.Navigator>
);

const UsersStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="UsersList" 
      component={UsersListScreen}
      options={{ title: 'Usuarios' }}
    />
    <Stack.Screen 
      name="UserForm" 
      component={UserFormScreen}
      options={{ title: 'Formulario Usuario' }}
    />
  </Stack.Navigator>
);

const ReportesStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="ReporteCargaFamiliar" 
      component={ReporteCargaFamiliarScreen}
      options={{ title: 'Carga Familiar' }}
    />
    <Stack.Screen 
      name="ReporteHabitantesCalle" 
      component={ReporteHabitantesCalleScreen}
      options={{ title: 'Habitantes por Calle' }}
    />
    <Stack.Screen 
      name="ReporteRangoEdad" 
      component={ReporteRangoEdadScreen}
      options={{ title: 'Rango de Edad' }}
    />
    <Stack.Screen 
      name="ReporteDeVenta" 
      component={ReporteDeVentaScreen}
      options={{ title: 'Reporte de Venta' }}
    />
  </Stack.Navigator>
);

const MainNavigator = () => {
  const { isLiderComunidad } = useAuth();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FF4040',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        drawerActiveTintColor: '#FF4040',
        drawerInactiveTintColor: '#666',
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Inicio',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      
      <Drawer.Screen
        name="Beneficiarios"
        component={BeneficiariosStack}
        options={{
          title: 'Beneficiarios',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="BeneficiariosInactivos"
        component={BeneficiariosInactivosScreen}
        options={{
          title: 'Beneficiarios Inactivos',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-remove-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Dependientes"
        component={DependientesStack}
        options={{
          title: 'Dependientes',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-add-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Reportes"
        component={ReportesStack}
        options={{
          title: 'Reportes',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }}
      />

      {isLiderComunidad() && (
        <Drawer.Screen
          name="Users"
          component={UsersStack}
          options={{
            title: 'Gestión de Usuarios',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="settings-outline" size={size} color={color} />
            ),
          }}
        />
      )}

      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Mi Perfil',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default MainNavigator;