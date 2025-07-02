import { View, Text, StyleSheet } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { colors } from '../../src/theme/theme';

export default function DependientesScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dependientes</Text>
        <Text style={styles.subtitle}>Gestión de dependientes</Text>
      </View>
      
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Funcionalidad en desarrollo</Title>
            <Paragraph>Esta sección estará disponible próximamente.</Paragraph>
          </Card.Content>
        </Card>
      </View>
    </View>
  );
}

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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    elevation: 2,
  },
});