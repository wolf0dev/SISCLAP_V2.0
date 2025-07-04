import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BeneficiarioForm from '../forms/BeneficiarioForm';
import { Beneficiario } from '../../types';

interface BeneficiarioModalProps {
  visible: boolean;
  beneficiario?: Beneficiario;
  onClose: () => void;
  onSubmit: (data: Omit<Beneficiario, 'id' | 'fechaRegistro'>) => Promise<void>;
  loading?: boolean;
}

export default function BeneficiarioModal({
  visible,
  beneficiario,
  onClose,
  onSubmit,
  loading = false
}: BeneficiarioModalProps) {
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
        
        <BeneficiarioForm
          beneficiario={beneficiario}
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