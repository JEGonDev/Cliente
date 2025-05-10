import PropTypes from 'prop-types';
import { DateRangeFilter } from '../ui/DateRangeFilter';
import { DataChart } from '../ui/DataChart';
import { StatCard } from '../ui/StatCard';
import { ExportSection } from '../ui/ExportSection';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * Layout para la sección de historial y análisis de datos
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.data - Datos para mostrar en el gráfico
 * @param {Object} props.stats - Estadísticas para mostrar en las tarjetas
 */
export const DataHistoryLayout = ({ 
  data = {}, 
  stats = {} 
}) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Historial y análisis de datos</h1>
      
      {/* Filtros de búsqueda */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <DateRangeFilter />
      </div>
      
      {/* Gráfico principal de Temperatura */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Historial de Temperatura</h2>
          
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm rounded-full bg-gray-200 text-gray-800">Día</button>
            <button className="px-3 py-1 text-sm rounded-full bg-green-800 text-white">Semana</button>
            <button className="px-3 py-1 text-sm rounded-full bg-gray-200 text-gray-800">Mes</button>
          </div>
        </div>
        
        <DataChart />
      </div>
      
      {/* Gráfico de Conductividad */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Historial de Conductividad</h2>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={[0, 2]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="cond" name="Conductividad (dS/m)" stroke="#10b981" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Gráfico de Humedad */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Historial de Humedad</h2>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="hum" name="Humedad (%)" stroke="#3b82f6" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Tarjetas de estadísticas */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4">Estadísticas</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            label="Valor mínimo"
            value="16.4°C"
            color="blue"
            percentage={20}
          />
          <StatCard
            label="Valor promedio"
            value="20.0°C"
            color="blue"
            percentage={50}
          />
          <StatCard
            label="Valor máximo"
            value="23.2°C"
            color="blue"
            percentage={80}
          />
          <StatCard
            label="Desviación estándar"
            value="2.21°C"
            color="blue"
            percentage={30}
          />
        </div>
      </div>
      
      {/* Sección de exportación */}
      <ExportSection />
    </div>
  );
};

DataHistoryLayout.propTypes = {
  data: PropTypes.array, // Cambié de Object a Array para representar los datos de la gráfica
  stats: PropTypes.object
};
