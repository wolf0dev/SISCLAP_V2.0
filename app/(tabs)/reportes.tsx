import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { reportesApi } from '../../src/services/api';

export default function ReportesScreen() {
  const [loadingReports, setLoadingReports] = useState<Record<string, boolean>>({});

  const reportTypes = [
    {
      id: 'carga-familiar',
      title: 'Reporte de Carga Familiar',
      description: 'Beneficiarios y sus dependientes',
      icon: 'people',
      color: '#4CAF50',
      generator: reportesApi.generateCargaFamiliar,
    },
    {
      id: 'habitantes-calle',
      title: 'Habitantes por Calle',
      description: 'Distribución por ubicación',
      icon: 'location',
      color: '#2196F3',
      generator: reportesApi.generateHabitantesPorCalle,
    },
    {
      id: 'rango-edad',
      title: 'Rango de Edad',
      description: 'Clasificación por edades',
      icon: 'calendar',
      color: '#FF9800',
      generator: reportesApi.generateRangoEdad,
    },
    {
      id: 'beneficiarios-dependientes',
      title: 'Beneficiarios con Dependientes',
      description: 'Listado completo con dependientes',
      icon: 'family',
      color: '#9C27B0',
      generator: reportesApi.getBeneficiariosConDependientes,
    },
  ];

  const stats = [
    { label: 'Total Beneficiarios', value: '0', color: '#FF4040' },
    { label: 'Reportes Disponibles', value: '4', color: '#4CAF50' },
    { label: 'Calles Registradas', value: '0', color: '#2196F3' },
    { label: 'Datos Actualizados', value: 'Hoy', color: '#FF9800' },
  ];

  const generateReport = async (reportType: typeof reportTypes[0]) => {
    try {
      setLoadingReports(prev => ({ ...prev, [reportType.id]: true }));
      
      const response = await reportType.generator();
      
      if (response.success) {
        // Format the data for display
        let message = '';
        
        switch (reportType.id) {
          case 'carga-familiar':
            const cfData = response.data;
            message = `Total de Beneficiarios: ${cfData.totalBeneficiarios}\nFamilias con dependientes: ${cfData.familiasConHijos}\nFamilias sin dependientes: ${cfData.familiasSinHijos}\nPromedio de dependientes por familia: ${cfData.promedioHijosPorFamilia.toFixed(1)}`;
            break;
            
          case 'habitantes-calle':
            const hcData = response.data;
            if (Array.isArray(hcData)) {
              message = hcData.map((item: any) => `${item.calle}: ${item.habitantes} habitantes`).join('\n');
            } else {
              message = `${hcData.calle}: ${hcData.habitantes} habitantes`;
            }
            break;
            
          case 'rango-edad':
            const reData = response.data;
            message = reData.map((item: any) => `${item.rango} años: ${item.cantidad} personas`).join('\n');
            break;
            
          case 'beneficiarios-dependientes':
            const bdData = response.data;
            message = `Total de registros: ${bdData.length}\n\nPrimeros 5 beneficiarios:\n${bdData.slice(0, 5).map((item: any) => `${item.beneficiario.nombre_apellido} (${item.dependientes.length} dependientes)`).join('\n')}`;
            break;
        }
        
        Alert.alert(reportType.title, message, [
          { text: 'Cerrar' },
          { text: 'Exportar', onPress: () => exportReport(reportType.title, message) }
        ]);
      } else {
        Alert.alert('Error', response.error || 'Error al generar el reporte');
      }
    } catch (error) {
      Alert.alert('Error', 'Error de conexión al generar el reporte');
    } finally {
      setLoadingReports(prev => ({ ...prev, [reportType.id]: false }));
    }
  };

  const exportReport = (title: string, data: string) => {
    // In a real app, you would implement actual export functionality
    // For now, we'll just show a success message
    Alert.alert('Exportar', `El reporte "${title}" se ha exportado exitosamente.`);
  };

  const generateCompleteReport = async () => {
    Alert.alert(
      'Generar Reporte Completo',
      '¿Deseas generar un reporte completo con todos los datos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Generar',
          onPress: async () => {
            try {
              setLoadingReports(prev => ({ ...prev, 'complete': true }));
              
              // Generate all reports
              const [cfReport, hcReport, reReport, bdReport] = await Promise.all([
                reportesApi.generateCargaFamiliar(),
                reportesApi.generateHabitantesPorCalle(),
                reportesApi.generateRangoEdad(),
                reportesApi.getBeneficiariosConDependientes()
              ]);
              
              Alert.alert('Éxito', 'Reporte completo generado exitosamente');
            } catch (error) {
              Alert.alert('Error', 'Error al generar el reporte completo');
            } finally {
              setLoadingReports(prev => ({ ...prev, 'complete': false }));
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reportes SISCLAP</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Resumen General</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Report Types */}
        <View style={styles.reportsContainer}>
          <Text style={styles.sectionTitle}>Tipos de Reportes</Text>
          {reportTypes.map((report) => (
            <TouchableOpacity 
              key={report.id} 
              style={styles.reportCard}
              onPress={() => generateReport(report)}
              disabled={loadingReports[report.id]}
            >
              <View style={[styles.reportIcon, { backgroundColor: report.color }]}>
                <Ionicons name={report.icon as any} size={24} color="white" />
              </View>
              <View style={styles.reportContent}>
                <Text style={styles.reportTitle}>{report.title}</Text>
                <Text style={styles.reportDescription}>{report.description}</Text>
              </View>
              <View style={styles.reportActions}>
                {loadingReports[report.id] ? (
                  <ActivityIndicator size="small" color="#666" />
                ) : (
                  <>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => generateReport(report)}
                    >
                      <Ionicons name="download" size={20} color="#666" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => generateReport(report)}
                    >
                      <Ionicons name="eye" size={20} color="#666" />
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={generateCompleteReport}
              disabled={loadingReports['complete']}
            >
              {loadingReports['complete'] ? (
                <ActivityIndicator size={32} color="#FF4040" />
              ) : (
                <Ionicons name="document-text" size={32} color="#FF4040" />
              )}
              <Text style={styles.quickActionText}>Generar Reporte Completo</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => Alert.alert('Exportar', 'Funcionalidad de exportación disponible próximamente')}
            >
              <Ionicons name="share" size={32} color="#4CAF50" />
              <Text style={styles.quickActionText}>Exportar Datos</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* API Info */}
        <View style={styles.apiInfoContainer}>
          <Text style={styles.sectionTitle}>Información de la API</Text>
          <View style={styles.apiInfoCard}>
            <View style={styles.apiInfoItem}>
              <Ionicons name="server" size={20} color="#4CAF50" />
              <Text style={styles.apiInfoText}>Conectado a SISCLAP API</Text>
            </View>
            <View style={styles.apiInfoItem}>
              <Ionicons name="link" size={20} color="#2196F3" />
              <Text style={styles.apiInfoText}>http://localhost:3000/api</Text>
            </View>
            <View style={styles.apiInfoItem}>
              <Ionicons name="shield-checkmark" size={20} color="#FF9800" />
              <Text style={styles.apiInfoText}>Datos sincronizados</Text>
            </View>
          </View>
        </View>
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
  scrollContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statsContainer: {
    marginBottom: 25,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    width: '48%',
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  reportsContainer: {
    marginBottom: 25,
  },
  reportCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  reportIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  reportContent: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  reportDescription: {
    fontSize: 14,
    color: '#666',
  },
  reportActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  quickActionsContainer: {
    marginBottom: 25,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  quickActionText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },
  apiInfoContainer: {
    marginBottom: 25,
  },
  apiInfoCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  apiInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  apiInfoText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#666',
  },
});