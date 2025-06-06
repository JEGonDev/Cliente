<<<<<<< HEAD
import PropTypes from 'prop-types';
import { ThresholdConfig } from '../ui/ThresholdConfig';
=======
import { useState, useEffect } from 'react';
import { useMonitoring } from '../hooks/useMonitoring';
>>>>>>> 0a2550518ec84c66039853f89ca439e946330407
import { AlertItem } from '../ui/AlertItem';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * Layout para la sección de alertas y configuración
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.alerts - Lista de alertas 
 */
export const AlertsLayout = ({ alerts = [] }) => {
<<<<<<< HEAD
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
=======
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

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
      'CRITICAL': 'error',
      'HIGH': 'error',
      'MEDIUM': 'warning',
      'LOW': 'warning',
      'INFO': 'info'
    };

    // Normalizar el nivel a mayúsculas para hacer la comparación más robusta
    const normalizedLevel = level?.toUpperCase();
    return levelMap[normalizedLevel] || 'info';
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
>>>>>>> 0a2550518ec84c66039853f89ca439e946330407
    }
  ];

<<<<<<< HEAD
  // Usar alertas proporcionadas o demoAlerts si no hay ninguna
  const alertsToShow = alerts.length > 0 ? alerts : demoAlerts;
=======
  // Extraer el valor y umbral del mensaje de alerta (si existe)
  const extractValueAndThreshold = (message) => {
    // Patrones para diferentes formatos de mensaje
    const patterns = [
      // Formato general: "Valor por encima/debajo del umbral máximo/mínimo de [tipo sensor]: X [unidad] (máximo/mínimo: Y)"
      /.*?:\s*([\d.,]+)\s*([°%\w/]+)\s*\((?:máximo|mínimo):\s*([\d.,]+)(?:\s*([°%\w/]+))?\)/i,

      // Formato específico para humedad: "Valor de humedad: X% (umbral: Y%)"
      /.*?humedad:\s*([\d.,]+)\s*([%])\s*\((?:umbral|máximo|mínimo):\s*([\d.,]+)(?:\s*([%]))?\)/i,

      // Formato para conductividad: "Valor de conductividad: X mS/cm (umbral: Y mS/cm)"
      /.*?conductividad:\s*([\d.,]+)\s*(mS\/cm)\s*\((?:umbral|máximo|mínimo):\s*([\d.,]+)(?:\s*(mS\/cm))?\)/i,

      // Formatos anteriores
      /Valor:\s*([\d.,]+)\s*([°%\w/]+)\s*\(Umbral:\s*([\d.,]+)\s*([°%\w/]+)\)/i,
      /([\d.,]+)\s*([°%\w/]+)\s*excede\s*(?:el\s*umbral\s*de)\s*([\d.,]+)\s*([°%\w/]+)/i,
      /([\d.,]+)\s*([°%\w/]+)\s*está\s*por\s*debajo\s*del\s*umbral\s*([\d.,]+)\s*([°%\w/]+)/i
    ];

    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match) {
        // Si encontramos una coincidencia, asegurarnos de que los valores usen punto como separador decimal
        const value = match[1].replace(',', '.');
        const unit = match[2] || '';
        const threshold = (match[3] || '').replace(',', '.');
        const thresholdUnit = match[4] || unit; // Usar la unidad del valor si no hay unidad específica para el umbral

        return {
          value: `${value}${unit}`,
          threshold: threshold ? `${threshold}${thresholdUnit}` : '-'
        };
      }
    }

    // Buscar valores específicos de humedad si los patrones anteriores fallan
    const humidityMatch = message.match(/.*?humedad.*?([\d.,]+)\s*%.*?(?:máximo|mínimo):\s*([\d.,]+)/i);
    if (humidityMatch) {
      return {
        value: `${humidityMatch[1].replace(',', '.')}%`,
        threshold: `${humidityMatch[2].replace(',', '.')}%`
      };
    }

    // Si no se encuentra un patrón conocido, buscar al menos el valor
    const valueMatch = message.match(/:\s*([\d.,]+)\s*([°%\w/]+)/);
    return {
      value: valueMatch ? `${valueMatch[1].replace(',', '.')}${valueMatch[2]}` : '-',
      threshold: '-'
    };
  };

  // Filtrar y ordenar alertas según los filtros seleccionados
  const filteredAlerts = alertsToShow
    .filter(alert => {
      // Filtro por tipo de alerta
      if (filters.type !== 'all' && mapAlertLevelToType(alert.alertLevel) !== filters.type) return false;

      // Filtro por parámetro (tipo de sensor)
      if (filters.parameter !== 'all') {
        const normalizedSensorType = alert.sensorType?.toLowerCase();
        const normalizedFilter = filters.parameter.toLowerCase();

        // Mapeo de tipos de sensores
        const sensorTypeMap = {
          'temperature': ['temperatura', 'sensor temperatura'],
          'humidity': ['humedad'],
          'ec': ['conductividad', 'conductividad electrica']
        };

        const validTypes = sensorTypeMap[normalizedFilter] || [];
        if (!validTypes.some(type => normalizedSensorType?.includes(type))) {
          return false;
        }
      }

      // Filtro por cultivo
      if (filters.crop !== 'all' && alert.cropId?.toString() !== filters.crop) return false;

      // Filtro por período
      if (filters.period !== 'all') {
        const alertDate = new Date(alert.alertDatetime);
        const now = new Date();

        switch (filters.period) {
          case 'today':
            return alertDate.toDateString() === now.toDateString();
          case 'yesterday': {
            const yesterday = new Date(now);
            yesterday.setDate(now.getDate() - 1);
            return alertDate.toDateString() === yesterday.toDateString();
          }
          case 'week': {
            const weekAgo = new Date(now);
            weekAgo.setDate(now.getDate() - 7);
            return alertDate >= weekAgo;
          }
          case 'month': {
            const monthAgo = new Date(now);
            monthAgo.setMonth(now.getMonth() - 1);
            return alertDate >= monthAgo;
          }
          default:
            return true;
        }
      }

      return true;
    })
    .sort((a, b) => new Date(b.alertDatetime) - new Date(a.alertDatetime));

  // Calcular índices para paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAlerts = filteredAlerts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAlerts.length / itemsPerPage);

  // Funciones de navegación
  const goToPage = (pageNumber) => {
    setCurrentPage(Math.max(1, Math.min(pageNumber, totalPages)));
  };

  // Resetear a la primera página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

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
>>>>>>> 0a2550518ec84c66039853f89ca439e946330407

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Sistema de alertas</h1>
      
      {/* Filtros de alertas */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Tipo de alerta</label>
<<<<<<< HEAD
            <select className="w-full p-2 border border-gray-300 rounded">
              <option>Todas</option>
              <option>Error</option>
              <option>Advertencia</option>
              <option>Información</option>
=======
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="all">Todas</option>
              <option value="error">Error</option>
              <option value="warning">Advertencia</option>
>>>>>>> 0a2550518ec84c66039853f89ca439e946330407
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
          <button className="bg-primary text-white px-4 py-2 rounded">
            Aplicar filtros
          </button>
        </div>
      </div>
      
      {/* Lista de alertas */}
      <div className="mb-6">
<<<<<<< HEAD
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
=======
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
          <>
            <div className="space-y-4">
              {currentAlerts.map(alert => {
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

            {/* Controles de paginación */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                <div className="flex flex-1 justify-between sm:hidden">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                      } border border-gray-300`}
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative ml-3 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                      } border border-gray-300`}
                  >
                    Siguiente
                  </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Mostrando <span className="font-medium">{indexOfFirstItem + 1}</span> a{' '}
                      <span className="font-medium">
                        {Math.min(indexOfLastItem, filteredAlerts.length)}
                      </span>{' '}
                      de <span className="font-medium">{filteredAlerts.length}</span> alertas
                    </p>
                  </div>
                  <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${currentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-500 hover:bg-gray-50'
                          } border border-gray-300`}
                      >
                        <span className="sr-only">Anterior</span>
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      {/* Números de página */}
                      {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        const isCurrentPage = pageNumber === currentPage;

                        return (
                          <button
                            key={pageNumber}
                            onClick={() => goToPage(pageNumber)}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${isCurrentPage
                              ? 'z-10 bg-primary text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                              : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                              }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center rounded-r-md px-2 py-2 ${currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-500 hover:bg-gray-50'
                          } border border-gray-300`}
                      >
                        <span className="sr-only">Siguiente</span>
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
>>>>>>> 0a2550518ec84c66039853f89ca439e946330407
    </div>
  );
};

AlertsLayout.propTypes = {
<<<<<<< HEAD
  alerts: PropTypes.array
=======
  alerts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    alertLevel: PropTypes.string,
    alertMessage: PropTypes.string,
    alertDatetime: PropTypes.string,
    sensorType: PropTypes.string,
    cropName: PropTypes.string
  }))
>>>>>>> 0a2550518ec84c66039853f89ca439e946330407
};