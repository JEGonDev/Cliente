import PropTypes from 'prop-types';
import { useState } from 'react';
import { FileText, Download, FileSpreadsheet, Eye } from 'lucide-react';
import { SensorDataPDF } from './SensorDataPDF';

/**
 * Sección para exportar datos históricos en diferentes formatos
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.data - Datos a exportar
 * @param {string} props.sensorType - Tipo de sensor
 * @param {string} props.cropName - Nombre del cultivo
 * @param {string} props.dateRange - Rango de fechas seleccionado
 * @param {Object} props.stats - Estadísticas de los datos
 * @param {Object} props.chartRef - Referencia al gráfico
 */
export const ExportSection = ({
  data,
  sensorType,
  cropName,
  dateRange,
  stats,
  chartRef
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Función para exportar como CSV
  const exportToCSV = () => {
    const headers = ['Fecha', 'Valor', 'Tipo'];
    const csvContent = [
      headers.join(','),
      ...data.map(row => [
        row.fecha,
        row.valor,
        sensorType
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `datos_${cropName}_${sensorType}_${dateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Función para exportar como JSON
  const exportToJSON = () => {
    const jsonData = {
      cropName,
      sensorType,
      dateRange,
      exportDate: new Date().toISOString(),
      readings: data
    };

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `datos_${cropName}_${sensorType}_${dateRange}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-medium">Exportar datos</h2>
          <p className="text-sm text-gray-600 mt-1">
            Descarga los datos históricos para su análisis
          </p>
        </div>
        <span className="text-sm text-gray-500">
          {data.length} registros disponibles
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Exportar como CSV */}
        <button
          onClick={exportToCSV}
          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3 mr-4">
              <FileSpreadsheet className="text-green-600" size={24} />
            </div>
            <div>
              <h3 className="font-medium">Exportar como CSV</h3>
              <p className="text-sm text-gray-500">Formato para hojas de cálculo</p>
            </div>
          </div>
          <Download size={20} className="text-gray-400" />
        </button>

        {/* Exportar como JSON */}
        <button
          onClick={exportToJSON}
          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3 mr-4">
              <FileText className="text-blue-600" size={24} />
            </div>
            <div>
              <h3 className="font-medium">Exportar como JSON</h3>
              <p className="text-sm text-gray-500">Formato para desarrolladores</p>
            </div>
          </div>
          <Download size={20} className="text-gray-400" />
        </button>

        {/* Exportar como PDF */}
        <button
          onClick={() => setIsPreviewOpen(!isPreviewOpen)}
          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center">
            <div className="bg-red-100 rounded-lg p-3 mr-4">
              <FileText className="text-red-600" size={24} />
            </div>
            <div>
              <h3 className="font-medium">Exportar como PDF</h3>
              <p className="text-sm text-gray-500">Reporte detallado con gráficos</p>
            </div>
          </div>
          <Eye size={20} className="text-gray-400" />
        </button>
      </div>

      {/* Información adicional */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Información incluida:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Fecha y hora de cada lectura</li>
          <li>• Valores registrados del sensor</li>
          <li>• Tipo de sensor y unidad de medida</li>
          <li>• Metadatos del cultivo</li>
        </ul>
      </div>

      {/* Componente PDF */}
      {isPreviewOpen && (
        <SensorDataPDF
          cropName={cropName}
          sensorType={sensorType}
          dateRange={dateRange}
          stats={stats}
          chartRef={chartRef}
          data={data}
        />
      )}
    </div>
  );
};

ExportSection.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    fecha: PropTypes.string,
    valor: PropTypes.number,
    tipo: PropTypes.string
  })).isRequired,
  sensorType: PropTypes.string.isRequired,
  cropName: PropTypes.string.isRequired,
  dateRange: PropTypes.string.isRequired,
  stats: PropTypes.shape({
    min: PropTypes.string,
    max: PropTypes.string,
    avg: PropTypes.string,
    stdDev: PropTypes.string
  }).isRequired,
  chartRef: PropTypes.object.isRequired
};