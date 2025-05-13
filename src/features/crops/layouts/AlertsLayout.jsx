import PropTypes from 'prop-types';
import { ThresholdConfig } from '../ui/ThresholdConfig';
import { AlertItem } from '../ui/AlertItem';

/**
 * Layout para la sección de alertas y configuración
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.alerts - Lista de alertas 
 */
export const AlertsLayout = ({ alerts = [] }) => {
  // Datos de ejemplo para mostrar en la maquetación
  const demoAlerts = [
    {
      id: 1,
      type: 'error',
      parameter: 'Temperatura',
      crop: 'Fresas',
      message: 'Temperatura superior al umbral máximo',
      value: '26.8°C',
      threshold: '25°C',
      time: '5 min'
    },
    {
      id: 2,
      type: 'warning',
      parameter: 'EC',
      crop: 'Albahaca',
      message: 'EC inferior al umbral mínimo',
      value: '0.9 mS/cm',
      threshold: '1.0 mS/cm',
      time: '1h 20m'
    },
    {
      id: 3,
      type: 'info',
      parameter: 'Sistema',
      crop: 'Todos',
      message: 'Ciclo de luz reiniciado según programación',
      value: 'Reinicio',
      threshold: '-',
      time: '2h 35m'
    }
  ];

  // Usar alertas proporcionadas o demoAlerts si no hay ninguna
  const alertsToShow = alerts.length > 0 ? alerts : demoAlerts;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Sistema de alertas</h1>
      
      {/* Filtros de alertas */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Tipo de alerta</label>
            <select className="w-full p-2 border border-gray-300 rounded">
              <option>Todas</option>
              <option>Error</option>
              <option>Advertencia</option>
              <option>Información</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">Parámetro</label>
            <select className="w-full p-2 border border-gray-300 rounded">
              <option>Todos</option>
              <option>Temperatura</option>
              <option>Humedad</option>
              <option>EC</option>
             
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">Cultivo</label>
            <select className="w-full p-2 border border-gray-300 rounded">
              <option>Todos</option>
              <option>Lechuga</option>
              <option>Tomate</option>
              <option>Fresas</option>
              <option>Albahaca</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">Periodo</label>
            <select className="w-full p-2 border border-gray-300 rounded">
              <option>Hoy</option>
              <option>Ayer</option>
              <option>Última semana</option>
              <option>Último mes</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button className="bg-green-800 text-white px-4 py-2 rounded">
            Aplicar filtros
          </button>
        </div>
      </div>
      
      {/* Lista de alertas */}
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-4">Historial de alertas</h2>
        
        <div className="space-y-4">
          {alertsToShow.map(alert => (
            <AlertItem 
              key={alert.id}
              type={alert.type}
              parameter={alert.parameter}
              crop={alert.crop}
              message={alert.message}
              value={alert.value}
              threshold={alert.threshold}
              time={alert.time}
            />
          ))}
        </div>
      </div>
      
      {/* Configuración de umbrales */}
      <ThresholdConfig />
    </div>
  );
};

AlertsLayout.propTypes = {
  alerts: PropTypes.array
};