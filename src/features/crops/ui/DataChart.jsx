import PropTypes from 'prop-types';

/**
 * Componente para mostrar gráficos de datos históricos
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.data - Datos para mostrar en el gráfico
 * @param {string} props.type - Tipo de gráfico (línea, barras, etc.)
 */
export const DataChart = ({ 
  data = {}, 
  type = 'line' 
}) => {
  // Este componente es solo una maqueta visual, implementaríamos
  // una biblioteca de gráficos real como Recharts en una implementación completa
  
  return (
    <div className="w-full">
      <div className="w-full h-64 bg-gray-50 rounded-lg relative overflow-hidden">
        {/* Líneas de cuadrícula */}
        <div className="absolute inset-0 grid grid-cols-12 grid-rows-6">
          {Array(12).fill().map((_, i) => (
            <div key={`col-${i}`} className="border-r border-gray-200 h-full"></div>
          ))}
          {Array(6).fill().map((_, i) => (
            <div key={`row-${i}`} className="border-b border-gray-200 w-full"></div>
          ))}
        </div>
        
        {/* Línea del gráfico (simulada) */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 400" preserveAspectRatio="none">
          <path 
            d="M0,200 C50,180 100,220 150,190 C200,160 250,180 300,210 C350,240 400,220 450,210 C500,200 550,190 600,180 C650,170 700,190 750,180 C800,170 850,160 900,170 C950,180 1000,170 1050,180 C1100,190 1150,200 1200,190" 
            fill="none" 
            stroke="#ef4444" 
            strokeWidth="3"
          />
          <g>
            {/* Puntos de datos */}
            {[0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950, 1000, 1050, 1100, 1150, 1200].map((x, i) => {
              // Generamos un valor y aleatorio que siga un patrón similar a la curva
              const y = 200 - 20 * Math.sin(i / 10) + Math.random() * 10;
              return (
                <circle key={i} cx={x} cy={y} r="4" fill="white" stroke="#ef4444" strokeWidth="2" />
              );
            })}
          </g>
        </svg>
        
        {/* Etiquetas del eje X */}
        <div className="absolute bottom-0 w-full px-4 flex justify-between text-xs text-gray-500">
          <div>6 abr</div>
          <div>8 abr</div>
          <div>11 abr</div>
          <div>14 abr</div>
          <div>17 abr</div>
          <div>20 abr</div>
          <div>23 abr</div>
          <div>26 abr</div>
          <div>29 abr</div>
          <div>2 may</div>
          <div>5 may</div>
        </div>
        
        {/* Etiquetas del eje Y */}
        <div className="absolute left-2 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
          <div>24</div>
          <div>18</div>
          <div>12</div>
          <div>6</div>
          <div>0</div>
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
  data: PropTypes.object,
  type: PropTypes.string
};