import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { reportesApi } from '../../src/services/api';
import { pdfService } from '../../src/services/pdfService';
import { useBeneficiarios } from '../../src/hooks/useBeneficiarios';

export default function ReportesScreen() {
  const { beneficiarios } = useBeneficiarios();
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

  // Calculate real-time stats
  const totalBeneficiarios = beneficiarios.length;
  const beneficiariosActivos = beneficiarios.filter(b => b.estatus === 'Activo').length;
  const beneficiariosInactivos = beneficiarios.filter(b => b.estatus === 'Inactivo').length;
  const callesUnicas = [...new Set(beneficiarios.map(b => b.id_calle))].length;

  const stats = [
    { label: 'Total Beneficiarios', value: totalBeneficiarios.toString(), color: '#FF4040' },
    { label: 'Beneficiarios Activos', value: beneficiariosActivos.toString(), color: '#4CAF50' },
    { label: 'Beneficiarios Inactivos', value: beneficiariosInactivos.toString(), color: '#F44336' },
    { label: 'Calles Registradas', value: callesUnicas.toString(), color: '#2196F3' },
  ];

  const generateReport = async (reportType: typeof reportTypes[0]) => {
    try {
      setLoadingReports(prev => ({ ...prev, [reportType.id]: true }));
      
      const response = await reportType.generator();
      
      if (response.success && response.data) {
        // Show preview first
        let message = '';
        let pdfContent = '';
        
        switch (reportType.id) {
          case 'carga-familiar':
            const cfData = response.data;
            message = `Total de Beneficiarios: ${cfData.totalBeneficiarios}\nFamilias con dependientes: ${cfData.familiasConHijos}\nFamilias sin dependientes: ${cfData.familiasSinHijos}\nPromedio de dependientes por familia: ${cfData.promedioHijosPorFamilia.toFixed(1)}`;
            pdfContent = pdfService.formatCargaFamiliarContent(cfData);
            break;
            
          case 'habitantes-calle':
            const hcData = response.data;
            if (Array.isArray(hcData)) {
              message = hcData.map((item: any) => `${item.calle}: ${item.habitantes} habitantes`).join('\n');
              pdfContent = pdfService.formatHabitantesPorCalleContent(hcData);
            } else {
              message = `${hcData.calle}: ${hcData.habitantes} habitantes`;
              pdfContent = pdfService.formatHabitantesPorCalleContent([hcData]);
            }
            break;
            
          case 'rango-edad':
            const reData = response.data;
            message = reData.map((item: any) => `${item.rango} años: ${item.cantidad} personas`).join('\n');
            pdfContent = pdfService.formatRangoEdadContent(reData);
            break;
            
          case 'beneficiarios-dependientes':
            const bdData = response.data;
            message = `Total de registros: ${bdData.length}\n\nPrimeros 5 beneficiarios:\n${bdData.slice(0, 5).map((item: any) => `${item.beneficiario.nombre_apellido} (${item.dependientes.length} dependientes)`).join('\n')}`;
            pdfContent = pdfService.formatBeneficiariosConDependientesContent(bdData);
            break;
        }
        
        Alert.alert(
          reportType.title, 
          message, 
          [
            { text: 'Cerrar' },
            { 
              text: 'Generar PDF', 
              onPress: () => exportToPDF(reportType.title, pdfContent)
            }
          ]
        );
      } else {
        Alert.alert('Error', response.error || 'Error al generar el reporte');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      Alert.alert('Error', 'Error de conexión al generar el reporte');
    } finally {
      setLoadingReports(prev => ({ ...prev, [reportType.id]: false }));
    }
  };

  const exportToPDF = async (title: string, content: string) => {
    try {
      setLoadingReports(prev => ({ ...prev, 'pdf': true }));
      
      const fileName = `${title.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.html`;
      
      const fileUri = await pdfService.generatePDF({
        title,
        content,
        fileName
      });
      
      await pdfService.sharePDF(fileUri);
      
      Alert.alert('Éxito', 'Reporte generado y compartido exitosamente');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      Alert.alert('Error', 'Error al generar el archivo PDF');
    } finally {
      setLoadingReports(prev => ({ ...prev, 'pdf': false }));
    }
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
              
              // Combine all content
              let completeContent = '';
              
              if (cfReport.success && cfReport.data) {
                completeContent += pdfService.formatCargaFamiliarContent(cfReport.data);
              }
              
              if (hcReport.success && hcReport.data) {
                const hcData = Array.isArray(hcReport.data) ? hcReport.data : [hcReport.data];
                completeContent += pdfService.formatHabitantesPorCalleContent(hcData);
              }
              
              if (reReport.success && reReport.data) {
                completeContent += pdfService.formatRangoEdadContent(reReport.data);
              }
              
              if (bdReport.success && bdReport.data) {
                completeContent += pdfService.formatBeneficiariosConDependientesContent(bdReport.data);
              }
              
              if (completeContent) {
                await exportToPDF('Reporte Completo SISCLAP', completeContent);
              } else {
                Alert.alert('Error', 'No se pudieron generar los datos del reporte');
              }
            } catch (error) {
              console.error('Error generating complete report:', error);
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
                      <Ionicons name="document-text" size={20} color="#666" />
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
              onPress={() => {
                Alert.alert(
                  'Exportar Datos',
                  'Selecciona un reporte específico para exportar a PDF, o genera el reporte completo.',
                  [{ text: 'Entendido' }]
                );
              }}
            >
              <Ionicons name="share" size={32} color="#4CAF50" />
              <Text style={styles.quickActionText}>Exportar a PDF</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* API Info */}
        <View style={styles.apiInfoContainer}>
          <Text style={styles.sectionTitle}>Información del Sistema</Text>
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
              <Text style={styles.apiInfoText}>Datos sincronizados en tiempo real</Text>
            </View>
            <View style={styles.apiInfoItem}>
              <Ionicons name="document" size={20} color="#9C27B0" />
              <Text style={styles.apiInfoText}>Exportación PDF disponible</Text>
            </View>
          </View>
        </View>

        {/* Loading Indicator */}
        {loadingReports['pdf'] && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingCard}>
              <ActivityIndicator size="large" color="#FF4040" />
              <Text style={styles.loadingText}>Generando PDF...</Text>
            </View>
          </View>
        )}
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
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingCard: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});