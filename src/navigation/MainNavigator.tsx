import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/theme';

// Screens
import HomeScreen from '../screens/dashboard/HomeScreen';
import BeneficiariosScreen from '../screens/beneficiarios/BeneficiariosScreen';
import DependientesScreen from '../screens/dependientes/DependientesScreen';
import ReportesScreen from '../screens/reportes/ReportesScreen';
import ProfileScreen from '../screens/dashboard/ProfileScreen';

const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Beneficiarios') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Dependientes') {
            iconName = focused ? 'person-add' : 'person-add-outline';
          } else if (route.name === 'Reportes') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 1,
          borderTopColor: colors.lightGray,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Inicio',
        }}
      />
      <Tab.Screen
        name="Beneficiarios"
        component={BeneficiariosScreen}
        options={{
          title: 'Beneficiarios',
        }}
      />
      <Tab.Screen
        name="Dependientes"
        component={DependientesScreen}
        options={{
          title: 'Dependientes',
        }}
      />
      <Tab.Screen
        name="Reportes"
        component={ReportesScreen}
        options={{
          title: 'Reportes',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;