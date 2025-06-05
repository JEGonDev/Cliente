import { useState, useEffect } from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer, Image } from '@react-pdf/renderer';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Download, FileText, Eye } from 'lucide-react';

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    color: '#1f2937'
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    color: '#4b5563'
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
    color: '#374151'
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15
  },
  statBox: {
    padding: 10,
    backgroundColor: '#f3f4f6',
    borderRadius: 5,
    width: '23%'
  },
  statTitle: {
    fontSize: 10,
    color: '#6b7280'
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937'
  },
  chartContainer: {
    marginVertical: 15,
    height: 200,
    width: '100%'
  },
  chart: {
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  }
});

export const SensorDataPDF = ({
  cropName,
  sensorType,
  dateRange,
  stats,
  chartRef,
  data
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [chartImage, setChartImage] = useState(null);

  // Capturar la imagen del gráfico cuando el componente se monta o cuando cambian los datos
  useEffect(() => {
    const captureChart = async () => {
      if (chartRef?.current) {
        try {
          const canvas = await html2canvas(chartRef.current);
          const imageData = canvas.toDataURL('image/png');
          setChartImage(imageData);
        } catch (error) {
          console.error('Error al capturar el gráfico:', error);
        }
      }
    };

    captureChart();
  }, [chartRef, data]);

  // Función para generar y descargar el PDF
  const generatePDF = async () => {
    try {
      // Crear nuevo documento PDF
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Configurar fuentes y estilos
      doc.setFont('helvetica');

      // Agregar título y subtítulo
      doc.setFontSize(24);
      doc.text('Reporte de Sensor', 20, 20);

      doc.setFontSize(14);
      doc.text(`Cultivo: ${cropName}`, 20, 35);
      doc.text(`Sensor: ${sensorType}`, 20, 45);
      doc.text(`Período: ${dateRange}`, 20, 55);

      // Agregar estadísticas
      doc.setFontSize(16);
      doc.text('Estadísticas', 20, 70);

      doc.setFontSize(12);
      const statsY = 85;
      doc.text(`Valor mínimo: ${stats.min}`, 20, statsY);
      doc.text(`Valor máximo: ${stats.max}`, 20, statsY + 10);
      doc.text(`Promedio: ${stats.avg}`, 20, statsY + 20);
      doc.text(`Desviación estándar: ${stats.stdDev}`, 20, statsY + 30);

      // Agregar gráfico si está disponible
      if (chartImage) {
        const imgWidth = pageWidth - 40; // 20mm de margen a cada lado
        const imgHeight = 80; // Altura fija para el gráfico
        doc.addImage(chartImage, 'PNG', 20, statsY + 45, imgWidth, imgHeight);

        // Ajustar posición Y para la tabla
        const tableY = statsY + imgHeight + 60;

        // Agregar tabla de datos
        doc.setFontSize(16);
        doc.text('Datos Registrados', 20, tableY);

        // Encabezados de la tabla
        doc.setFontSize(12);
        doc.text('Fecha', 20, tableY + 15);
        doc.text('Valor', 80, tableY + 15);

        // Datos de la tabla (limitados a los últimos 20 registros)
        const lastReadings = data.slice(-20);
        lastReadings.forEach((reading, index) => {
          const y = tableY + 25 + (index * 10);
          if (y < pageHeight - 20) {
            doc.text(reading.fecha, 20, y);
            doc.text(reading.valor.toString(), 80, y);
          }
        });
      }

      // Guardar el PDF
      doc.save(`reporte_${cropName}_${sensorType}_${dateRange}.pdf`);
    } catch (error) {
      console.error('Error al generar el PDF:', error);
    }
  };

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          Exportar Reporte PDF
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setIsPreviewOpen(!isPreviewOpen)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            {isPreviewOpen ? (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Ocultar vista previa
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Vista previa
              </>
            )}
          </button>
          <button
            onClick={generatePDF}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary-dark"
          >
            <Download className="w-4 h-4 mr-2" />
            Descargar PDF
          </button>
        </div>
      </div>

      {isPreviewOpen && (
        <div className="mt-4 border border-gray-200 rounded-lg">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h4 className="text-sm font-medium text-gray-700">
              Vista previa del PDF
            </h4>
          </div>
          <div className="h-[600px]">
            <PDFViewer style={{ width: '100%', height: '100%' }}>
              <Document>
                <Page size="A4" style={styles.page}>
                  <View style={styles.section}>
                    <Text style={styles.title}>Reporte de Sensor</Text>
                    <Text style={styles.subtitle}>{cropName}</Text>
                    <Text style={styles.text}>Sensor: {sensorType}</Text>
                    <Text style={styles.text}>Período: {dateRange}</Text>

                    <View style={styles.statsContainer}>
                      <View style={styles.statBox}>
                        <Text style={styles.statTitle}>Valor mínimo</Text>
                        <Text style={styles.statValue}>{stats.min}</Text>
                      </View>
                      <View style={styles.statBox}>
                        <Text style={styles.statTitle}>Valor máximo</Text>
                        <Text style={styles.statValue}>{stats.max}</Text>
                      </View>
                      <View style={styles.statBox}>
                        <Text style={styles.statTitle}>Promedio</Text>
                        <Text style={styles.statValue}>{stats.avg}</Text>
                      </View>
                      <View style={styles.statBox}>
                        <Text style={styles.statTitle}>Desviación estándar</Text>
                        <Text style={styles.statValue}>{stats.stdDev}</Text>
                      </View>
                    </View>

                    {/* Gráfico */}
                    {chartImage && (
                      <View style={styles.chartContainer}>
                        <Image
                          src={chartImage}
                          style={styles.chart}
                        />
                      </View>
                    )}

                    {/* Tabla de lecturas */}
                    <View style={{ marginTop: 20 }}>
                      <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>Historial de Lecturas</Text>
                      <View style={{ flexDirection: 'row', backgroundColor: '#f3f4f6', padding: 8, marginBottom: 5 }}>
                        <Text style={{ flex: 2, fontSize: 10, fontWeight: 'bold' }}>Fecha y Hora</Text>
                        <Text style={{ flex: 1, fontSize: 10, fontWeight: 'bold' }}>Valor</Text>
                      </View>
                      {data.slice(-10).map((reading, index) => (
                        <View key={index} style={{ flexDirection: 'row', padding: 8, backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb' }}>
                          <Text style={{ flex: 2, fontSize: 10 }}>{reading.fecha}</Text>
                          <Text style={{ flex: 1, fontSize: 10 }}>{reading.valor}</Text>
                        </View>
                      ))}
                    </View>

                    {/* Información del sensor */}
                    <View style={{ marginTop: 20, padding: 10, backgroundColor: '#f3f4f6', borderRadius: 5 }}>
                      <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 5 }}>Detalles del Sensor</Text>
                      <Text style={{ fontSize: 10, marginBottom: 3 }}>Tipo: {sensorType}</Text>
                      <Text style={{ fontSize: 10 }}>Período de análisis: {dateRange}</Text>
                    </View>
                  </View>
                </Page>
              </Document>
            </PDFViewer>
          </div>
        </div>
      )}
    </div>
  );
}; 