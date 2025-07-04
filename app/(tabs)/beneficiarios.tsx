import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function BeneficiariosScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const beneficiarios = [
    {
      id: '1',
      nombre: 'María González',
      cedula: '12345678',
      telefono: '0414-1234567',
      calle: 'Calle 1',
      status: 'Activo',
    },
    {
      id: '2',
      nombre: 'José Rodríguez',
      cedula: '87654321',
      telefono: '0424-7654321',
      calle: 'Calle 2',
      status: 'Activo',
    },
    {
      id: '3',
      nombre: 'Ana Martínez',
      cedula: '11223344',
      telefono: '0412-1122334',
      calle: 'Calle 3',
      status: 'Inactivo',
    },
  ];

  const filteredBeneficiarios = beneficiarios.filter(beneficiario =>
    beneficiario.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    beneficiario.cedula.includes(searchQuery)
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Beneficiarios</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre o cédula..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView style={styles.listContainer}>
        {filteredBeneficiarios.map((beneficiario) => (
          <TouchableOpacity key={beneficiario.id} style={styles.beneficiarioCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.beneficiarioName}>{beneficiario.nombre}</Text>
              <View style={[
                styles.statusBadge,
                { backgroundColor: beneficiario.status === 'Activo' ? '#4CAF50' : '#F44336' }
              ]}>
                <Text style={styles.statusText}>{beneficiario.status}</Text>
              </View>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.infoRow}>
                <Ionicons name="card" size={16} color="#666" />
                <Text style={styles.infoText}>Cédula: {beneficiario.cedula}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="call" size={16} color="#666" />
                <Text style={styles.infoText}>Teléfono: {beneficiario.telefono}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="location" size={16} color="#666" />
                <Text style={styles.infoText}>Calle: {beneficiario.calle}</Text>
              </View>
            </View>
            <View style={styles.cardActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="eye" size={18} color="#2196F3" />
                <Text style={[styles.actionText, { color: '#2196F3' }]}>Ver</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="create" size={18} color="#FF9800" />
                <Text style={[styles.actionText, { color: '#FF9800' }]}>Editar</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#FF4040',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  beneficiarioCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  beneficiarioName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardContent: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  actionText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
});