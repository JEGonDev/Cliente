import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useMonitoring } from '../hooks/useMonitoring';
import { Filter } from 'lucide-react';

/**
 * Componente para filtrar datos por rango de fechas, cultivo y parámetro
 */
export const DateRangeFilter = ({ onFiltersChange }) => {
  const [filters, setFilters] = useState({
    cropId: '',
    sensorType: 'TEMPERATURE',
    startDate: '',
    endDate: '',
    sensorId: ''
  });

  const {
    crops,
    sensors,
    selectedCrop,
    fetchUserCrops,
    fetchSensorsByCropId,
    fetchReadingHistory,
    loading
  } = useMonitoring();

  // Cargar cultivos al montar el componente
  useEffect(() => {
    fetchUserCrops();
  }, [fetchUserCrops]);

  // Cargar sensores cuando se selecciona un cultivo
  useEffect(() => {
    if (filters.cropId) {
      fetchSensorsByCropId(parseInt(filters.cropId));
    }
  }, [filters.cropId, fetchSensorsByCropId]);

  // Establecer fechas por defecto
  useEffect(() => {
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);

    setFilters(prev => ({
      ...prev,
      startDate: prev.startDate || lastWeek.toISOString().split('T')[0],
      endDate: prev.endDate || today.toISOString().split('T')[0]
    }));
  }, []);

  // Tipos de sensores disponibles
  const sensorTypes = [
    { value: 'TEMPERATURE', label: 'Temperatura' },
    { value: 'HUMIDITY', label: 'Humedad' },
    { value: 'EC', label: 'Conductividad (EC)' },
    { value: 'PH', label: 'pH' }
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [key]: value
      };

      // Reset sensor cuando cambia el cultivo
      if (key === 'cropId') {
        newFilters.sensorId = '';
      }

      return newFilters;
    });
  };

  const handleApplyFilters = async () => {
    // Validar filtros
    if (!filters.cropId) {
      alert('Selecciona un cultivo');
      return;
    }

    if (!filters.startDate || !filters.endDate) {
      alert('Selecciona un rango de fechas válido');
      return;
    }

    if (new Date(filters.startDate) > new Date(filters.endDate)) {
      alert('La fecha de inicio no puede ser posterior a la fecha de fin');
      return;
    }

    // Preparar parámetros para la consulta
    const queryParams = {
      cropId: parseInt(filters.cropId),
      startDate: new Date(filters.startDate).toISOString(),
      endDate: new Date(filters.endDate + 'T23:59:59').toISOString(),
      limit: 1000
    };

    // Agregar filtro de sensor específico si se selecciona
    if (filters.sensorId) {
      queryParams.sensorId = parseInt(filters.sensorId);
    }

    try {
      // Ejecutar consulta
      await fetchReadingHistory(queryParams);

      // Notificar a componente padre si se proporciona callback
      if (onFiltersChange) {
        onFiltersChange(queryParams);
      }

      console.log('Filtros aplicados:', queryParams);

    } catch (error) {
      console.error('Error al aplicar filtros:', error);
      alert('Error al cargar los datos. Inténtalo de nuevo.');
    }
  };

  const handleQuickDateRange = (days) => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - days);

    setFilters(prev => ({
      ...prev,
      startDate: startDate.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0]
    }));
  };

  // Filtrar sensores por tipo seleccionado
  const filteredSensors = sensors.filter(sensor =>
    sensor.type === filters.sensorType || !filters.sensorType
  );

  return (
    <div className="space-y-4">
      {/* Filtros principales */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Cultivo</label>
          <select
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
            value={filters.cropId}
            onChange={(e) => handleFilterChange('cropId', e.target.value)}
            disabled={loading}
          >
            <option value="">Seleccionar cultivo</option>
            {crops.map(crop => (
              <option key={crop.id} value={crop.id}>
                {crop.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Tipo de sensor</label>
          <select
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
            value={filters.sensorType}
            onChange={(e) => handleFilterChange('sensorType', e.target.value)}
          >
            {sensorTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Sensor específico</label>
          <select
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
            value={filters.sensorId}
            onChange={(e) => handleFilterChange('sensorId', e.target.value)}
            disabled={!filters.cropId || filteredSensors.length === 0}
          >
            <option value="">Todos los sensores</option>
            {filteredSensors.map(sensor => (
              <option key={sensor.id} value={sensor.id}>
                {sensor.name} ({sensor.type})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Acciones rápidas</label>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => handleQuickDateRange(7)}
              className="px-2 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              7d
            </button>
            <button
              type="button"
              onClick={() => handleQuickDateRange(30)}
              className="px-2 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              30d
            </button>
            <button
              type="button"
              onClick={() => handleQuickDateRange(90)}
              className="px-2 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              90d
            </button>
          </div>
        </div>
      </div>

      {/* Rango de fechas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Fecha de inicio</label>
          <input
            type="date"
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Fecha de fin</label>
          <input
            type="date"
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={handleApplyFilters}
            disabled={loading || !filters.cropId}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
            )}
            <Filter className="h-4 w-4" />
            {loading ? 'Cargando...' : 'Aplicar filtros'}
          </button>
        </div>
      </div>

      {/* Información adicional */}
      {filters.cropId && (
        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
          <p>
            <strong>Filtros activos:</strong>
            {crops.find(c => c.id === parseInt(filters.cropId))?.name} |
            {sensorTypes.find(t => t.value === filters.sensorType)?.label} |
            {filters.startDate} a {filters.endDate}
            {filteredSensors.length > 0 && ` | ${filteredSensors.length} sensores disponibles`}
          </p>
        </div>
      )}
    </div>
  );
};

DateRangeFilter.propTypes = {
  onFiltersChange: PropTypes.func
};