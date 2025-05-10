import { FileText, FileSpreadsheet,FileSignature } from 'lucide-react';

/**
 * Sección para exportar informes en diferentes formatos
 */
export const ExportSection = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-medium mb-4">Exportar Informe</h2>
      <p className="text-sm text-gray-600 mb-4">
        Descarga los datos históricos en diferentes formatos para su análisis posterior.
      </p>
      
      <div className="space-y-4">
        {/* Opción de exportar como CSV */}
        <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3 mr-4">
              <FileText className="text-blue-600" size={24} />
            </div>
            <div>
              <h3 className="font-medium">Exportar como CSV</h3>
              <p className="text-sm text-gray-500">Formato de datos separados por comas</p>
            </div>
          </div>
        </div>
        
        {/* Opción de exportar como Excel */}
        <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3 mr-4">
              <FileSpreadsheet className="text-green-600" size={24} />
            </div>
            <div>
              <h3 className="font-medium">Exportar como Excel</h3>
              <p className="text-sm text-gray-500">Libro de Excel con múltiples hojas</p>
            </div>
          </div>
        </div>
   {/* Opción de exportar como PDF */}
<div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition">
  <div className="flex items-center">
    <div className="bg-red-100 rounded-lg p-3 mr-4">
      <FileSignature className="text-gray-700" size={24} />
    </div>
    <div>
      <h3 className="font-medium">Exportar como PDF</h3>
      <p className="text-sm text-gray-500">Reporte con gráficas y estadísticas</p>
    </div>
  </div>
</div>
      </div>
      
      {/* Opciones de exportación */}
      <div className="mt-6 border-t border-gray-200 pt-4">
        <h3 className="text-sm font-medium mb-2">Opciones de exportación:</h3>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="include-charts"
              className="text-green-600 rounded mr-2"
              defaultChecked
            />
            <label htmlFor="include-charts" className="text-sm">Incluir gráficas</label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="include-stats"
              className="text-green-600 rounded mr-2"
              defaultChecked
            />
            <label htmlFor="include-stats" className="text-sm">Incluir estadísticas</label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="all-params"
              className="text-green-600 rounded mr-2"
            />
            <label htmlFor="all-params" className="text-sm">Todos los parámetros</label>
          </div>
        </div>
      </div>
    </div>
  );
};