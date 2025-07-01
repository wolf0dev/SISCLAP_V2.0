# Sistema de Gestión de Beneficios - Mobile App

Esta es la versión móvil del Sistema de Gestión de Beneficios para la comunidad Brisas del Orinoco II, desarrollada con React Native y Expo.

## Características

- **Autenticación**: Login seguro con JWT
- **Gestión de Beneficiarios**: CRUD completo de beneficiarios
- **Gestión de Dependientes**: Administración de dependientes por beneficiario
- **Reportes**: Generación y exportación de reportes
- **Gestión de Usuarios**: Solo para líderes de comunidad
- **Roles**: Líder de Comunidad y Jefe de Calle
- **Interfaz Nativa**: Diseño optimizado para dispositivos móviles

## Tecnologías Utilizadas

- **React Native**: Framework para desarrollo móvil
- **Expo**: Plataforma de desarrollo
- **React Navigation**: Navegación entre pantallas
- **React Native Paper**: Componentes UI Material Design
- **Formik + Yup**: Manejo de formularios y validación
- **Axios**: Cliente HTTP
- **AsyncStorage**: Almacenamiento local
- **TypeScript**: Tipado estático

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Instalar Expo CLI globalmente:
```bash
npm install -g @expo/cli
```

3. Iniciar el proyecto:
```bash
npm start
```

## Desarrollo

### Para Android:
```bash
npm run android
```

### Para iOS:
```bash
npm run ios
```

### Para Web:
```bash
npm run web
```

## Build para Producción

### Android APK:
```bash
npm run build:android
```

### iOS:
```bash
npm run build:ios
```

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
├── contexts/           # Contextos de React (Auth, Theme, etc.)
├── navigation/         # Configuración de navegación
├── screens/           # Pantallas de la aplicación
├── services/          # Servicios API
├── theme/            # Configuración de tema
└── types/            # Tipos TypeScript
```

## Configuración

1. Actualizar la URL de la API en `src/services/api.ts`
2. Configurar los assets en la carpeta `assets/`
3. Actualizar la configuración en `app.json`

## Funcionalidades por Rol

### Líder de Comunidad:
- Acceso completo a todos los beneficiarios
- Gestión de usuarios
- Reportes generales
- Todas las funcionalidades del sistema

### Jefe de Calle:
- Acceso solo a beneficiarios de su calle asignada
- Gestión de dependientes de su calle
- Reportes filtrados por su calle
- Perfil personal

## Notas de Desarrollo

- La aplicación está optimizada para Android principalmente
- Se requiere conexión a internet para todas las funcionalidades
- Los datos se sincronizan en tiempo real con el servidor
- La autenticación se mantiene localmente con AsyncStorage

## Licencia

Este proyecto está bajo la Licencia Apache 2.0.