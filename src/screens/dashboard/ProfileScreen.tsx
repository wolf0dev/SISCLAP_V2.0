import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Card,
  Title,
  Avatar,
  HelperText,
  Divider,
} from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { colors } from '../../theme/theme';

const ProfileScreen = () => {
  const { user, updateProfile, changePassword, logout } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(user?.foto_perfil || null);

  const profileFormik = useFormik({
    initialValues: {
      nom_user: user?.nom_user || '',
      correo: user?.correo || '',
      user: user?.user || '',
      ced_user: user?.ced_user || '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      nom_user: Yup.string().required('El nombre es requerido'),
      correo: Yup.string()
        .email('Correo electrónico inválido')
        .required('El correo electrónico es requerido'),
      user: Yup.string().required('El nombre de usuario es requerido'),
      ced_user: Yup.string().required('La cédula es requerida'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await updateProfile({
          ...values,
          foto_perfil: profileImage || '',
        });
        showSnackbar('Perfil actualizado exitosamente', 'success');
      } catch (error: any) {
        showSnackbar(error.message || 'Error al actualizar perfil', 'error');
      } finally {
        setLoading(false);
      }
    },
  });

  const passwordFormik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string().required('La contraseña actual es requerida'),
      newPassword: Yup.string()
        .required('La nueva contraseña es requerida')
        .min(6, 'La contraseña debe tener al menos 6 caracteres'),
      confirmPassword: Yup.string()
        .required('Confirma tu nueva contraseña')
        .oneOf([Yup.ref('newPassword')], 'Las contraseñas no coinciden'),
    }),
    onSubmit: async (values) => {
      setPasswordLoading(true);
      try {
        await changePassword(values.oldPassword, values.newPassword);
        showSnackbar('Contraseña actualizada exitosamente. Inicia sesión nuevamente.', 'success');
        passwordFormik.resetForm();
      } catch (error: any) {
        showSnackbar(error.message || 'Error al cambiar contraseña', 'error');
      } finally {
        setPasswordLoading(false);
      }
    },
  });

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permisos requeridos', 'Se necesitan permisos para acceder a la galería');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setProfileImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const getRoleLabel = () => {
    if (user?.id_rol_user === 1) return 'Líder de Comunidad';
    if (user?.id_rol_user === 2) return 'Jefe de Calle';
    return 'Usuario';
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Info Card */}
      <Card style={styles.card}>
        <Card.Content style={styles.profileHeader}>
          <TouchableOpacity onPress={pickImage}>
            <Avatar.Image
              size={120}
              source={
                profileImage
                  ? { uri: profileImage }
                  : require('../../../assets/default-avatar.png')
              }
              style={styles.avatar}
            />
            <Text style={styles.changePhotoText}>Cambiar foto</Text>
          </TouchableOpacity>
          
          <View style={styles.userInfo}>
            <Title style={styles.userName}>{user?.nom_user}</Title>
            <Text style={styles.userRole}>{getRoleLabel()}</Text>
            <Text style={styles.userEmail}>{user?.correo}</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Profile Form */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Información Personal</Title>
          
          <TextInput
            label="Nombre Completo"
            value={profileFormik.values.nom_user}
            onChangeText={profileFormik.handleChange('nom_user')}
            onBlur={profileFormik.handleBlur('nom_user')}
            error={profileFormik.touched.nom_user && Boolean(profileFormik.errors.nom_user)}
            style={styles.input}
            mode="outlined"
            disabled={loading}
          />
          <HelperText type="error" visible={profileFormik.touched.nom_user && Boolean(profileFormik.errors.nom_user)}>
            {profileFormik.errors.nom_user}
          </HelperText>

          <TextInput
            label="Correo Electrónico"
            value={profileFormik.values.correo}
            onChangeText={profileFormik.handleChange('correo')}
            onBlur={profileFormik.handleBlur('correo')}
            error={profileFormik.touched.correo && Boolean(profileFormik.errors.correo)}
            style={styles.input}
            mode="outlined"
            disabled={loading}
            keyboardType="email-address"
          />
          <HelperText type="error" visible={profileFormik.touched.correo && Boolean(profileFormik.errors.correo)}>
            {profileFormik.errors.correo}
          </HelperText>

          <TextInput
            label="Cédula"
            value={profileFormik.values.ced_user}
            onChangeText={profileFormik.handleChange('ced_user')}
            onBlur={profileFormik.handleBlur('ced_user')}
            error={profileFormik.touched.ced_user && Boolean(profileFormik.errors.ced_user)}
            style={styles.input}
            mode="outlined"
            disabled={true}
            keyboardType="numeric"
          />

          <TextInput
            label="Nombre de Usuario"
            value={profileFormik.values.user}
            onChangeText={profileFormik.handleChange('user')}
            onBlur={profileFormik.handleBlur('user')}
            error={profileFormik.touched.user && Boolean(profileFormik.errors.user)}
            style={styles.input}
            mode="outlined"
            disabled={loading}
          />
          <HelperText type="error" visible={profileFormik.touched.user && Boolean(profileFormik.errors.user)}>
            {profileFormik.errors.user}
          </HelperText>

          <Button
            mode="contained"
            onPress={() => profileFormik.handleSubmit()}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Guardar Cambios
          </Button>
        </Card.Content>
      </Card>

      {/* Change Password Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Cambiar Contraseña</Title>
          
          <TextInput
            label="Contraseña Actual"
            value={passwordFormik.values.oldPassword}
            onChangeText={passwordFormik.handleChange('oldPassword')}
            onBlur={passwordFormik.handleBlur('oldPassword')}
            error={passwordFormik.touched.oldPassword && Boolean(passwordFormik.errors.oldPassword)}
            secureTextEntry={!showPasswords}
            style={styles.input}
            mode="outlined"
            disabled={passwordLoading}
          />
          <HelperText type="error" visible={passwordFormik.touched.oldPassword && Boolean(passwordFormik.errors.oldPassword)}>
            {passwordFormik.errors.oldPassword}
          </HelperText>

          <TextInput
            label="Nueva Contraseña"
            value={passwordFormik.values.newPassword}
            onChangeText={passwordFormik.handleChange('newPassword')}
            onBlur={passwordFormik.handleBlur('newPassword')}
            error={passwordFormik.touched.newPassword && Boolean(passwordFormik.errors.newPassword)}
            secureTextEntry={!showPasswords}
            style={styles.input}
            mode="outlined"
            disabled={passwordLoading}
          />
          <HelperText type="error" visible={passwordFormik.touched.newPassword && Boolean(passwordFormik.errors.newPassword)}>
            {passwordFormik.errors.newPassword}
          </HelperText>

          <TextInput
            label="Confirmar Nueva Contraseña"
            value={passwordFormik.values.confirmPassword}
            onChangeText={passwordFormik.handleChange('confirmPassword')}
            onBlur={passwordFormik.handleBlur('confirmPassword')}
            error={passwordFormik.touched.confirmPassword && Boolean(passwordFormik.errors.confirmPassword)}
            secureTextEntry={!showPasswords}
            style={styles.input}
            mode="outlined"
            disabled={passwordLoading}
            right={
              <TextInput.Icon
                icon={showPasswords ? 'eye-off' : 'eye'}
                onPress={() => setShowPasswords(!showPasswords)}
              />
            }
          />
          <HelperText type="error" visible={passwordFormik.touched.confirmPassword && Boolean(passwordFormik.errors.confirmPassword)}>
            {passwordFormik.errors.confirmPassword}
          </HelperText>

          <Button
            mode="contained"
            onPress={() => passwordFormik.handleSubmit()}
            loading={passwordLoading}
            disabled={passwordLoading}
            style={styles.button}
          >
            Cambiar Contraseña
          </Button>
        </Card.Content>
      </Card>

      {/* Logout Button */}
      <Card style={styles.card}>
        <Card.Content>
          <Button
            mode="outlined"
            onPress={() => {
              Alert.alert(
                'Cerrar Sesión',
                '¿Estás seguro de que deseas cerrar sesión?',
                [
                  { text: 'Cancelar', style: 'cancel' },
                  { text: 'Cerrar Sesión', onPress: logout, style: 'destructive' },
                ]
              );
            }}
            style={[styles.button, styles.logoutButton]}
            labelStyle={styles.logoutButtonText}
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
  card: {
    margin: 16,
    elevation: 2,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    marginBottom: 8,
  },
  changePhotoText: {
    textAlign: 'center',
    color: colors.primary,
    fontSize: 12,
    marginBottom: 16,
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
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
  sectionTitle: {
    marginBottom: 16,
    color: colors.text,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
  },
  logoutButton: {
    borderColor: colors.error,
  },
  logoutButtonText: {
    color: colors.error,
  },
});

export default ProfileScreen;