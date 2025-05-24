import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine
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

// Componentes de iconos
const HumidityIcon = () => (
  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
  </svg>
);

const TemperatureIcon = () => (
  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v4a6 6 0 1012 0V6a4 4 0 00-4-4zM8 6a2 2 0 114 0v7.5a3.5 3.5 0 11-4-3.45V6z" clipRule="evenodd" />
  </svg>
);

const ConductivityIcon = () => (
  <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
  </svg>
);

export const RealTimeChart = () => {
  return (
    <div className="w-full space-y-6">
      {/* Grid para humedad y temperatura */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Gráfica de Humedad */}
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center gap-2 mb-4">
            <HumidityIcon />
            <h3 className="text-lg font-semibold text-blue-600">Humedad</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sampleData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" stroke="#4b5563" tick={{ fontSize: 12 }} />
                <YAxis
                  domain={[50, 90]}
                  tickFormatter={formatHumidity}
                  stroke="#4b5563"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip formatter={(value) => formatHumidity(value)} />
                <Legend verticalAlign="bottom" height={36} />
                
                {/* Líneas de umbral */}
                <ReferenceLine y={80} stroke="#f97316" strokeDasharray="4 4" strokeWidth={1.5} />
                <ReferenceLine y={60} stroke="#f97316" strokeDasharray="4 4" strokeWidth={1.5} />
                
                <Line
                  type="monotone"
                  dataKey="hum"
                  name="humedad"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                
                {/* Líneas para la leyenda de umbrales */}
                <Line
                  type="monotone"
                  dataKey={() => null}
                  name="Umbral máximo"
                  stroke="#f97316"
                  strokeDasharray="4 4"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey={() => null}
                  name="Umbral mínimo" 
                  stroke="#f97316"
                  strokeDasharray="4 4"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfica de Temperatura */}
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center gap-2 mb-4">
            <TemperatureIcon />
            <h3 className="text-lg font-semibold text-red-600">Temperatura</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sampleData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" stroke="#4b5563" tick={{ fontSize: 12 }} />
                <YAxis
                  domain={[15, 30]}
                  tickFormatter={formatTemperature}
                  stroke="#4b5563"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip formatter={(value) => formatTemperature(value)} />
                <Legend verticalAlign="bottom" height={36} />
                
                {/* Líneas de umbral */}
                <ReferenceLine y={26} stroke="#f97316" strokeDasharray="4 4" strokeWidth={1.5} />
                <ReferenceLine y={18} stroke="#f97316" strokeDasharray="4 4" strokeWidth={1.5} />
                
                <Line
                  type="monotone"
                  dataKey="temp"
                  name="temperatura"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                
                {/* Líneas para la leyenda de umbrales */}
                <Line
                  type="monotone"
                  dataKey={() => null}
                  name="Umbral máximo"
                  stroke="#f97316"
                  strokeDasharray="4 4"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey={() => null}
                  name="Umbral mínimo"
                  stroke="#f97316"
                  strokeDasharray="4 4"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Gráfica de Conductividad - Ancho completo */}
      <div className="bg-white rounded-lg p-4 shadow">
        <div className="flex items-center gap-2 mb-4">
          <ConductivityIcon />
          <h3 className="text-lg font-semibold text-purple-600">Conductividad eléctrica (EC)</h3>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sampleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" stroke="#4b5563" tick={{ fontSize: 12 }} />
              <YAxis
                domain={[0.5, 2]}
                tickFormatter={formatConductivity}
                stroke="#4b5563"
                tick={{ fontSize: 12 }}
              />
              <Tooltip formatter={(value) => formatConductivity(value)} />
              <Legend verticalAlign="bottom" height={36} />
              
              {/* Líneas de umbral */}
              <ReferenceLine y={1.6} stroke="#f97316" strokeDasharray="4 4" strokeWidth={1.5} />
              <ReferenceLine y={0.9} stroke="#f97316" strokeDasharray="4 4" strokeWidth={1.5} />
              
              <Line
                type="monotone"
                dataKey="cond"
                name="conductividad"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              
              {/* Líneas para la leyenda de umbrales */}
              <Line
                type="monotone"
                dataKey={() => null}
                name="Umbral máximo"
                stroke="#f97316"
                strokeDasharray="4 4"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey={() => null}
                name="Umbral mínimo"
                stroke="#f97316"
                strokeDasharray="4 4"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};