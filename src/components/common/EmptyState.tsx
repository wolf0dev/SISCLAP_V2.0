import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { colors } from '../../theme/theme';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon,
}) => {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Title style={styles.title}>{title}</Title>
          <Paragraph style={styles.description}>{description}</Paragraph>
          {actionText && onAction && (
            <Button mode="contained" onPress={onAction} style={styles.button}>
              {actionText}
            </Button>
          )}
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    elevation: 2,
  },
  content: {
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 16,
    opacity: 0.6,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    color: colors.text,
  },
  description: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginBottom: 20,
  },
  button: {
    marginTop: 8,
  },
});

export default EmptyState;