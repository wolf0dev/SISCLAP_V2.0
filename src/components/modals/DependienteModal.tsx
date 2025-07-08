import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DependienteForm from '@/components/forms/DependienteForm';
import { Dependiente, DependienteForm as DependienteFormType, Beneficiario } from '../../types';

interface DependienteModalProps {
  visible: boolean;
  dependiente?: Dependiente;
  beneficiarios: Beneficiario[];
  onClose: () => void;
  onSubmit: (data: DependienteFormType) => Promise<void>;
  loading?: boolean;
}

export default function DependienteModal({
  visible,
  dependiente,
  beneficiarios,
  onClose,
  onSubmit,
  loading = false
}: DependienteModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        
        <DependienteForm
          dependiente={dependiente}
          beneficiarios={beneficiarios}
          onSubmit={onSubmit}
          onCancel={onClose}
          loading={loading}
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    padding: 8,
  },
});