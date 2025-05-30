import PropTypes from 'prop-types';

/**
 * Componente para mostrar gráficos de datos históricos
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.data - Datos para mostrar en el gráfico
 * @param {string} props.type - Tipo de gráfico (línea, barras, etc.)
 */
export const DataChart = ({ data = [], type = 'line' }) => {
  if (data.length === 0) {
    return <div>No hay datos para mostrar</div>;
  }

  // Calcular los valores mínimo y máximo de temperatura y fechas
  const minTemp = Math.min(...data.map(item => item.temp));
  const maxTemp = Math.max(...data.map(item => item.temp));
  const minDate = new Date(Math.min(...data.map(item => new Date(item.date).getTime())));
  const maxDate = new Date(Math.max(...data.map(item => new Date(item.date).getTime())));

  // Función para convertir fecha a formato legible
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
  };

  // Añadir márgenes para que el gráfico no quede pegado a los bordes
  const margin = { top: 20, right: 30, bottom: 40, left: 40 };
  const width = 1200 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  return (
    <div className="w-full">
      <div className="w-full h-64 bg-gray-50 rounded-lg relative overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
        >
          <g transform={`translate(${margin.left},${margin.top})`}>
            {/* Líneas de cuadrícula */}
            <g>
              {Array(6).fill().map((_, i) => (
                <line
                  key={`grid-line-${i}`}
                  x1={0}
                  y1={(i / 5) * height}
                  x2={width}
                  y2={(i / 5) * height}
                  stroke="#e0e0e0"
                  strokeWidth="1"
                />
              ))}
              {Array(12).fill().map((_, i) => (
                <line
                  key={`grid-col-${i}`}
                  x1={(i / 11) * width}
                  y1={0}
                  x2={(i / 11) * width}
                  y2={height}
                  stroke="#e0e0e0"
                  strokeWidth="1"
                />
              ))}
            </g>

            {/* Línea del gráfico */}
            <path
              d={`M${data.map((item, index) => {
                const x = (index / (data.length - 1)) * width;
                const y = height - ((item.temp - minTemp) / (maxTemp - minTemp)) * height;
                return `L${x},${y}`;
              }).join(' ')}`}
              fill="none"
              stroke="#ef4444"
              strokeWidth="3"
            />

            {/* Puntos de datos */}
            {data.map((item, i) => {
              const x = (i / (data.length - 1)) * width;
              const y = height - ((item.temp - minTemp) / (maxTemp - minTemp)) * height;
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="5"
                  fill="white"
                  stroke="#ef4444"
                  strokeWidth="2"
                />
              );
            })}
          </g>
        </svg>

        {/* Etiquetas del eje X */}
        <div className="absolute bottom-0 w-full px-4 flex justify-between text-xs text-gray-500">
          {data.map((item, index) => (
            <div key={index}>{formatDate(item.date)}</div>
          ))}
        </div>

        {/* Etiquetas del eje Y */}
        <div className="absolute left-2 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
          <div>{maxTemp} °C</div>
          <div>{(minTemp + maxTemp) / 2} °C</div>
          <div>{minTemp} °C</div>
        </div>
      </div>

      {/* Leyenda */}
      <div className="mt-4 flex justify-center items-center text-sm text-gray-600">
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-1"></span>
          <span>Temperatura</span>
        </div>
      </div>
    </div>
  );
};

DataChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.string.isRequired,
    temp: PropTypes.number.isRequired,
  })),
  type: PropTypes.string,
};
