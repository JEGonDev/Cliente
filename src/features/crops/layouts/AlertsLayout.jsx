import { useState, useEffect } from 'react';
import { useMonitoring } from '../hooks/useMonitoring';
import { ThresholdConfig } from '../ui/ThresholdConfig';
import { AlertItem } from '../ui/AlertItem';

/**
 * Layout para la sección de alertas y configuración
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.alerts - Lista de alertas 
 */
export const AlertsLayout = ({ alerts = [] }) => {
  const {
    alerts: contextAlerts,
    crops,
    loading,
    error,
    fetchUserAlerts,
    deleteAlert
  } = useMonitoring();

  const [filters, setFilters] = useState({
    type: 'all',
    parameter: 'all',
    crop: 'all',
    period: 'today'
  });

  const [initialLoad, setInitialLoad] = useState(true);

  // Cargar alertas al montar el componente y configurar actualización periódica
  useEffect(() => {
    const loadAlerts = async () => {
      try {
        await fetchUserAlerts();
      } finally {
        if (initialLoad) {
          setInitialLoad(false);
        }
      }
    };

    // Carga inicial
    loadAlerts();

    // Configurar intervalo de actualización cada 10 segundos
    const intervalId = setInterval(loadAlerts, 10000);

    // Limpiar intervalo al desmontar el componente
    return () => clearInterval(intervalId);
  }, [fetchUserAlerts, initialLoad]);

  // Usar alertas del contexto o las pasadas por props
  const alertsToShow = alerts.length > 0 ? alerts : contextAlerts;

  // Mapear nivel de alerta a tipo de UI
  const mapAlertLevelToType = (level) => {
    const levelMap = {
      'critical': 'error',
      'warning': 'warning',
      'info': 'info'
    };
    return levelMap[level] || 'info';
  };

  // Formatear fecha para mostrar tiempo transcurrido
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `hace ${diffInMinutes} minutos`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `hace ${hours} horas`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `hace ${days} días`;
    }
  };

  // Extraer el valor y umbral del mensaje de alerta (si existe)
  const extractValueAndThreshold = (message) => {
    const valueMatch = message.match(/:\s*([\d.]+)\s*([°\w/]+)/);
    return valueMatch ? {
      value: `${valueMatch[1]}${valueMatch[2]}`,
      threshold: '-' // Si no tenemos el umbral explícito, mostramos un guión
    } : {
      value: '-',
      threshold: '-'
    };
  };

  // Filtrar y ordenar alertas según los filtros seleccionados
  const filteredAlerts = alertsToShow
    .filter(alert => {
      if (filters.type !== 'all' && mapAlertLevelToType(alert.alertLevel) !== filters.type) return false;
      if (filters.parameter !== 'all' && alert.sensorType !== filters.parameter) return false;
      if (filters.crop !== 'all' && alert.cropId.toString() !== filters.crop) return false;
      // Aquí podrías agregar filtro por período usando alertDatetime
      return true;
    })
    .sort((a, b) => new Date(b.alertDatetime) - new Date(a.alertDatetime)); // Ordenar de más nueva a más antigua

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleDeleteAlert = async (alertId) => {
    await deleteAlert(alertId);
  };

  // Estados de carga y error
  if (loading && initialLoad) {  // Solo mostrar loading en la carga inicial
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <span className="ml-4 text-gray-600">Cargando alertas...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-700">Error: {error}</p>
          <button
            onClick={fetchUserAlerts}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Sistema de alertas</h1>

      {/* Filtros de alertas */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Tipo de alerta</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="all">Todas</option>
              <option value="error">Error</option>
              <option value="warning">Advertencia</option>
              <option value="info">Información</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Parámetro</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={filters.parameter}
              onChange={(e) => handleFilterChange('parameter', e.target.value)}
            >
              <option value="all">Todos</option>
              <option value="temperature">Temperatura</option>
              <option value="humidity">Humedad</option>
              <option value="ec">EC</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Cultivo</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={filters.crop}
              onChange={(e) => handleFilterChange('crop', e.target.value)}
            >
              <option value="all">Todos</option>
              {crops.map(crop => (
                <option key={crop.id} value={crop.id}>{crop.cropName}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Periodo</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={filters.period}
              onChange={(e) => handleFilterChange('period', e.target.value)}
            >
              <option value="today">Hoy</option>
              <option value="yesterday">Ayer</option>
              <option value="week">Última semana</option>
              <option value="month">Último mes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de alertas */}
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-4">
          Historial de alertas ({filteredAlerts.length})
        </h2>

        {filteredAlerts.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <div className="text-gray-400 text-4xl mb-4">🔔</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay alertas para mostrar
            </h3>
            <p className="text-gray-600">
              {alertsToShow.length === 0 ?
                'No tienes alertas registradas' :
                'No hay alertas que coincidan con los filtros aplicados'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAlerts.map(alert => {
              const { value, threshold } = extractValueAndThreshold(alert.alertMessage);
              return (
                <AlertItem
                  key={alert.id}
                  type={mapAlertLevelToType(alert.alertLevel)}
                  parameter={alert.sensorType}
                  crop={alert.cropName}
                  message={alert.alertMessage}
                  value={value}
                  threshold={threshold}
                  time={formatTimeAgo(alert.alertDatetime)}
                  onDelete={() => handleDeleteAlert(alert.id)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Configuración de umbrales */}
      <ThresholdConfig />
    </div>
  );
};