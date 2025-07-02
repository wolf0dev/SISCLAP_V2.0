import { View, Text, StyleSheet } from 'react-native';

export default function BeneficiariosScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Beneficiarios</Text>
        <Text style={styles.subtitle}>Gestión de beneficiarios del sistema</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.message}>Funcionalidad en desarrollo</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FF4040',
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    fontSize: 18,
    color: '#757575',
    textAlign: 'center',
  },
});