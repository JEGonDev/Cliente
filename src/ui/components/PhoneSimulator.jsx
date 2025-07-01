import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

export const PhoneSimulator = ({ className = '' }) => {
  const data = [
    { name: '19:25', temperatura: 24, humedad: 40 },
    { name: '19:26', temperatura: 28, humedad: 35 },
    { name: '19:27', temperatura: 32, humedad: 30 },
    { name: '19:28', temperatura: 36, humedad: 25 },
    { name: '19:29', temperatura: 40, humedad: 20 },
  ];

  return (
    <div
      className={`hidden sm:block relative w-full max-w-xs sm:max-w-sm bg-black rounded-[2.5rem] p-2 shadow-2xl border-4 border-gray-300 ${className}`}
    >
      {/* Notch superior */}
      <div className="w-24 h-2 rounded-b-xl bg-black mx-auto mb-1"></div>

      {/* Header celular */}
      <div className="bg-white rounded-[2rem] overflow-hidden">
        <div className="bg-primary py-2 text-center text-white font-medium text-[10px] sm:text-xs rounded-t-[2rem]">
          <div className="flex items-center justify-center space-x-3 sm:space-x-6">
            <img src="src/assets/header/logo2.png" className="h-6 w-auto" />
            <p className="hover:underline cursor-default">Educación</p>
            <p className="hover:underline cursor-default">Comunidad</p>
            <p className="hover:underline text-yellow-300 cursor-default">Monitoreo</p>
          </div>
        </div>

        {/* Contenedor principal con barra lateral y contenido */}
        <div className="flex">
          {/* Barra lateral */}
          <div className="w-16 bg-gray-100 font-medium p-2 text-[8px] sm:text-[10px] space-y-3 text-gray-400">
            <p className="border-b border-gray-150 pb-1">Monitoreo</p>

            <div className="flex font-bold text-gray-600">
              <span>🌱Cultivos</span>
            </div>
            <div className="flex font-bold text-green-600">
              <span>📊 Datos</span>
            </div>
            <div className="flex relative">
              <span className="relative font-bold text-gray-600">🔔 Alerta</span>
            </div>
          </div>

          <div className="flex-1 p-2 grid grid-cols-1 gap-2 text-xs">
            {/* Card Temperatura */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 p-2 flex justify-between items-center">
         
              <span className="text-[10px] sm:text-xs text-gray-500">🌡️ Temperatura</span>
              <span className="text-[10px] sm:text-xs font-medium text-red-500">40.0°C</span>
            </div>

            {/* Card Humedad */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 p-2 flex justify-between items-center">
              <span className="text-[10px] sm:text-xs text-gray-500">💧 Humedad</span>
              <span className="text-[10px] sm:text-xs font-medium text-blue-500">20%</span>
            </div>

            {/* Card EC */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 p-2 flex justify-between items-center">
              <span className="text-[10px] sm:text-xs text-gray-500">⚡ EC</span>
              <span className="text-[10px] sm:text-xs font-medium text-green-500">0.00PPM</span>
            </div>

            {/* Gráfica de Temperatura */}
            <div className="bg-gray-50 rounded p-1">
              <p className="text-[10px] sm:text-xs font-medium text-gray-600 mb-1">Gráfica de Temperatura</p>
              <div className="w-full">
                <ResponsiveContainer width="100%" height={80}>
                  <LineChart data={data} margin={{ left: 0, right: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={7} />
                    <YAxis fontSize={7} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="temperatura"
                      stroke="#f87171"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Gráfica de Humedad */}
            <div className="bg-gray-50 rounded p-1">
              <p className="text-[10px] sm:text-xs font-medium text-gray-600 mb-1">Gráfica de Humedad</p>
              <div className="w-full">
                <ResponsiveContainer width="100%" height={80}>
                  <LineChart data={data} margin={{ left: 0, right: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={7} />
                    <YAxis fontSize={7} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="humedad"
                      stroke="#60a5fa"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Botón inferior simulado */}
        <div className="py-1 bg-black rounded-b-[2rem]"></div>
      </div>
    </div>
  );
};
