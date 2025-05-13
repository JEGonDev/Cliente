import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { DateRangeFilter } from '../ui/DateRangeFilter';
import { StatCard } from '../ui/StatCard';
import { ExportSection } from '../ui/ExportSection';

export const DataHistoryLayout = () => {
  const [range, setRange] = useState('semana');

  const data = [
    { fecha: '2025-05-01', temperatura: 18.2, humedad: 60, ec: 1.1 },
    { fecha: '2025-05-02', temperatura: 20.1, humedad: 62, ec: 1.2 },
    { fecha: '2025-05-03', temperatura: 21.5, humedad: 65, ec: 1.3 },
    { fecha: '2025-05-04', temperatura: 19.8, humedad: 63, ec: 1.2 },
    { fecha: '2025-05-05', temperatura: 22.3, humedad: 64, ec: 1.4 },
    { fecha: '2025-05-06', temperatura: 23.1, humedad: 67, ec: 1.5 },
    { fecha: '2025-05-07', temperatura: 20.7, humedad: 66, ec: 1.3 },
  ];

  // Simular filtrado por rango
  const getFilteredData = () => {
    if (range === 'día') {
      return [data[data.length - 1]]; // Último día
    } else if (range === 'semana') {
      return data.slice(-7); // Últimos 7 días
    } else if (range === 'mes') {
      return data; // Todo (simulado como mes)
    }
    return data;
  };

  const filteredData = getFilteredData();
  const temps = filteredData.map(d => d.temperatura);
  const min = Math.min(...temps).toFixed(1);
  const max = Math.max(...temps).toFixed(1);
  const avg = (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1);
  const stdDev = Math.sqrt(
    temps.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / temps.length
  ).toFixed(2);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Historial y análisis de datos</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <DateRangeFilter />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Historial de Datos</h2>
          <div className="flex gap-2">
            {['día', 'semana', 'mes'].map((label) => (
              <button
                key={label}
                onClick={() => setRange(label)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  range === label
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {label.charAt(0).toUpperCase() + label.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fecha" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="temperatura" stroke="#10b981" strokeWidth={2} />
            <Line type="monotone" dataKey="humedad" stroke="#3b82f6" strokeWidth={2} />
            <Line type="monotone" dataKey="ec" stroke="#f97316" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4">Estadísticas</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard label="Valor mínimo" value={`${min}°C`} color="blue" percentage={20} />
          <StatCard label="Valor promedio" value={`${avg}°C`} color="blue" percentage={50} />
          <StatCard label="Valor máximo" value={`${max}°C`} color="blue" percentage={80} />
          <StatCard label="Desviación estándar" value={`${stdDev}°C`} color="blue" percentage={30} />
        </div>
      </div>

      <ExportSection />
    </div>
  );
};
