import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const sampleData = [
  { time: '00:00', temp: 22, hum: 80, cond: 1.2 },
  { time: '02:00', temp: 21, hum: 75, cond: 1.3 },
  { time: '04:00', temp: 20, hum: 70, cond: 1.4 },
  { time: '06:00', temp: 22, hum: 68, cond: 1.2 },
  { time: '08:00', temp: 25, hum: 65, cond: 1.1 },
  { time: '10:00', temp: 28, hum: 60, cond: 1.0 },
  { time: '12:00', temp: 30, hum: 55, cond: 0.9 },
  { time: '14:00', temp: 29, hum: 58, cond: 1.1 },
  { time: '16:00', temp: 27, hum: 62, cond: 1.2 },
  { time: '18:00', temp: 24, hum: 66, cond: 1.3 },
  { time: '20:00', temp: 23, hum: 70, cond: 1.4 },
  { time: '22:00', temp: 22, hum: 75, cond: 1.5 }
];

// Funciones para formatear etiquetas y tooltips
const formatTemperature = (value) => `${value} °C`;
const formatHumidity = (value) => `${value} %`;
const formatConductivity = (value) => `${value} dS/m`;

export const RealTimeChart = () => {
  return (
    <div className="w-full space-y-6">
      {/* Gráfica de Temperatura */}
      <div className="h-80 bg-white rounded-lg p-4 shadow">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sampleData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" stroke="#4b5563" tick={{ fontSize: 12 }} />
            <YAxis
              domain={[15, 35]}
              tickFormatter={formatTemperature}
              stroke="#4b5563"
              tick={{ fontSize: 12 }}
            />
            <Tooltip formatter={(value) => formatTemperature(value)} />
            <Legend verticalAlign="top" height={36} />
            <Line
              type="monotone"
              dataKey="temp"
              name="Temperatura (°C)"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfica de Humedad */}
      <div className="h-80 bg-white rounded-lg p-4 shadow">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sampleData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" stroke="#4b5563" tick={{ fontSize: 12 }} />
            <YAxis
              domain={[0, 100]}
              tickFormatter={formatHumidity}
              stroke="#4b5563"
              tick={{ fontSize: 12 }}
            />
            <Tooltip formatter={(value) => formatHumidity(value)} />
            <Legend verticalAlign="top" height={36} />
            <Line
              type="monotone"
              dataKey="hum"
              name="Humedad relativa (%)"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfica de Conductividad */}
      <div className="h-80 bg-white rounded-lg p-4 shadow">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sampleData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" stroke="#4b5563" tick={{ fontSize: 12 }} />
            <YAxis
              domain={[0, 2]}
              tickFormatter={formatConductivity}
              stroke="#4b5563"
              tick={{ fontSize: 12 }}
            />
            <Tooltip formatter={(value) => formatConductivity(value)} />
            <Legend verticalAlign="top" height={36} />
            <Line
              type="monotone"
              dataKey="cond"
              name="Conductividad (dS/m)"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
