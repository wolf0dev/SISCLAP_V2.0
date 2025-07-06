import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

export interface PDFGenerationOptions {
  title: string;
  content: string;
  fileName?: string;
}

class PDFService {
  private generateHTMLContent(title: string, content: string): string {
    const currentDate = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${title}</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              margin: 0;
              padding: 20px;
              color: #333;
              line-height: 1.6;
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #FF4040;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .logo {
              width: 80px;
              height: 80px;
              margin: 0 auto 15px;
              background: #FF4040;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 24px;
              font-weight: bold;
            }
            .title {
              font-size: 28px;
              font-weight: bold;
              color: #FF4040;
              margin: 10px 0;
            }
            .subtitle {
              font-size: 16px;
              color: #666;
              margin: 5px 0;
            }
            .community {
              font-size: 14px;
              color: #FF4040;
              font-weight: 500;
            }
            .date {
              font-size: 12px;
              color: #999;
              margin-top: 10px;
            }
            .content {
              margin: 20px 0;
            }
            .section {
              margin-bottom: 25px;
              background: #f9f9f9;
              padding: 20px;
              border-radius: 8px;
              border-left: 4px solid #FF4040;
            }
            .section-title {
              font-size: 20px;
              font-weight: bold;
              color: #333;
              margin-bottom: 15px;
              border-bottom: 1px solid #ddd;
              padding-bottom: 10px;
            }
            .stats-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 15px;
              margin: 20px 0;
            }
            .stat-card {
              background: white;
              padding: 15px;
              border-radius: 8px;
              text-align: center;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .stat-number {
              font-size: 32px;
              font-weight: bold;
              color: #FF4040;
              margin-bottom: 5px;
            }
            .stat-label {
              font-size: 14px;
              color: #666;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 15px 0;
              background: white;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            th, td {
              padding: 12px;
              text-align: left;
              border-bottom: 1px solid #ddd;
            }
            th {
              background: #FF4040;
              color: white;
              font-weight: bold;
            }
            tr:nth-child(even) {
              background: #f9f9f9;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              text-align: center;
              color: #666;
              font-size: 12px;
            }
            .highlight {
              background: #fff3cd;
              padding: 10px;
              border-radius: 4px;
              border-left: 4px solid #ffc107;
              margin: 10px 0;
            }
            @media print {
              body { margin: 0; }
              .header { page-break-after: avoid; }
              .section { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">SGB</div>
            <div class="title">SISCLAP</div>
            <div class="subtitle">Sistema de Gestión de Beneficios</div>
            <div class="community">Brisas del Orinoco II</div>
            <div class="date">Generado el ${currentDate}</div>
          </div>
          
          <div class="content">
            ${content}
          </div>
          
          <div class="footer">
            <p>Sistema de Gestión de Beneficios - Brisas del Orinoco II</p>
            <p>Documento generado automáticamente por SISCLAP</p>
          </div>
        </body>
      </html>
    `;
  }

  async generatePDF(options: PDFGenerationOptions): Promise<string> {
    try {
      const { title, content, fileName = `reporte_${Date.now()}.html` } = options;
      
      // Generate HTML content
      const htmlContent = this.generateHTMLContent(title, content);
      
      // Create file path
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      
      // Write HTML file
      await FileSystem.writeAsStringAsync(fileUri, htmlContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      
      return fileUri;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Error al generar el archivo PDF');
    }
  }

  async sharePDF(fileUri: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        // For web, create a download link
        const response = await fetch(fileUri);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileUri.split('/').pop() || 'reporte.html';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        // For mobile platforms
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(fileUri, {
            mimeType: 'text/html',
            dialogTitle: 'Compartir Reporte',
          });
        } else {
          throw new Error('Sharing no está disponible en este dispositivo');
        }
      }
    } catch (error) {
      console.error('Error sharing PDF:', error);
      throw new Error('Error al compartir el archivo');
    }
  }

  formatCargaFamiliarContent(data: any): string {
    return `
      <div class="section">
        <div class="section-title">Reporte de Carga Familiar</div>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number">${data.totalBeneficiarios}</div>
            <div class="stat-label">Total Beneficiarios</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${data.totalDependientes}</div>
            <div class="stat-label">Total Dependientes</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${data.familiasConHijos}</div>
            <div class="stat-label">Familias con Dependientes</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${data.familiasSinHijos}</div>
            <div class="stat-label">Familias sin Dependientes</div>
          </div>
        </div>
        <div class="highlight">
          <strong>Promedio de dependientes por familia:</strong> ${data.promedioHijosPorFamilia.toFixed(2)}
        </div>
      </div>
    `;
  }

  formatHabitantesPorCalleContent(data: any[]): string {
    const tableRows = data.map(item => `
      <tr>
        <td>${item.calle}</td>
        <td style="text-align: center;">${item.habitantes}</td>
        <td style="text-align: center;">${((item.habitantes / data.reduce((acc, curr) => acc + curr.habitantes, 0)) * 100).toFixed(1)}%</td>
      </tr>
    `).join('');

    return `
      <div class="section">
        <div class="section-title">Habitantes por Calle</div>
        <table>
          <thead>
            <tr>
              <th>Calle</th>
              <th style="text-align: center;">Habitantes</th>
              <th style="text-align: center;">Porcentaje</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
        <div class="highlight">
          <strong>Total de habitantes:</strong> ${data.reduce((acc, curr) => acc + curr.habitantes, 0)}
        </div>
      </div>
    `;
  }

  formatRangoEdadContent(data: any[]): string {
    const tableRows = data.map(item => `
      <tr>
        <td>${item.rango} años</td>
        <td style="text-align: center;">${item.cantidad}</td>
        <td style="text-align: center;">${((item.cantidad / data.reduce((acc, curr) => acc + curr.cantidad, 0)) * 100).toFixed(1)}%</td>
      </tr>
    `).join('');

    return `
      <div class="section">
        <div class="section-title">Distribución por Rango de Edad</div>
        <table>
          <thead>
            <tr>
              <th>Rango de Edad</th>
              <th style="text-align: center;">Cantidad</th>
              <th style="text-align: center;">Porcentaje</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
        <div class="highlight">
          <strong>Total de personas:</strong> ${data.reduce((acc, curr) => acc + curr.cantidad, 0)}
        </div>
      </div>
    `;
  }

  formatBeneficiariosConDependientesContent(data: any[]): string {
    const tableRows = data.slice(0, 20).map(item => `
      <tr>
        <td>${item.beneficiario.nombre_apellido}</td>
        <td>${item.beneficiario.cedula}</td>
        <td style="text-align: center;">${item.dependientes.length}</td>
        <td>${item.beneficiario.nom_calle || `Calle ${item.beneficiario.id_calle}`}</td>
        <td>${item.beneficiario.telefono}</td>
      </tr>
    `).join('');

    return `
      <div class="section">
        <div class="section-title">Beneficiarios con Dependientes</div>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number">${data.length}</div>
            <div class="stat-label">Total Beneficiarios</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${data.reduce((acc, curr) => acc + curr.dependientes.length, 0)}</div>
            <div class="stat-label">Total Dependientes</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${data.filter(item => item.dependientes.length > 0).length}</div>
            <div class="stat-label">Con Dependientes</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${(data.reduce((acc, curr) => acc + curr.dependientes.length, 0) / data.length).toFixed(1)}</div>
            <div class="stat-label">Promedio por Familia</div>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Beneficiario</th>
              <th>Cédula</th>
              <th style="text-align: center;">Dependientes</th>
              <th>Dirección</th>
              <th>Teléfono</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
        ${data.length > 20 ? `<div class="highlight"><strong>Nota:</strong> Se muestran los primeros 20 registros de ${data.length} total.</div>` : ''}
      </div>
    `;
  }
}

export const pdfService = new PDFService();