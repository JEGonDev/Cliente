import { useState, useEffect, useCallback } from 'react';
import { useMonitoring } from '../hooks/useMonitoring';
import { Plus, Upload, Save, X } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * Sección para crear lecturas manuales y procesar lotes de lecturas
 * Integra las funcionalidades faltantes: createReading y processBatchReadings
 */
export const ManualReadingSection = () => {
  const {
    selectedCrop,
    sensors,
    createReading,
    processBatchReadings,
    fetchSensorsByCropId,
    loading: globalLoading
  } = useMonitoring();

  const [activeMode, setActiveMode] = useState('single'); // 'single' | 'batch'
  const [loading, setLoading] = useState(false);
  const [singleReading, setSingleReading] = useState({
    sensorId: '',
    readingValue: '',
    readingDate: new Date().toISOString().slice(0, 16), // formato datetime-local
    notes: ''
  });

  const [batchReadings, setBatchReadings] = useState([]);
  const [newBatchReading, setNewBatchReading] = useState({
    sensorId: '',
    readingValue: '',
    readingDate: new Date().toISOString().slice(0, 16)
  });

  const [csvData, setCsvData] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Cargar sensores cuando cambie el cultivo seleccionado
  useEffect(() => {
    let isMounted = true;

    const loadSensors = async () => {
      if (!selectedCrop?.id) return;

      try {
        setLoading(true);
        await fetchSensorsByCropId(selectedCrop.id);
      } catch (error) {
        if (isMounted) {
          setErrorMessage('Error al cargar los sensores');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadSensors();

    return () => {
      isMounted = false;
    };
  }, [selectedCrop?.id, fetchSensorsByCropId]);

  // Memoizar la función de filtrado de sensores
  const cropSensors = useCallback(() => {
    console.log('cropSensors - Current sensors:', sensors);
    console.log('cropSensors - Selected crop:', selectedCrop);
    // Los sensores ya vienen filtrados por cultivo desde el backend
    return sensors;
  }, [sensors]);

  const handleSingleReadingSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCrop) {
      setErrorMessage('Selecciona un cultivo primero');
      return;
    }

    try {
      const readingData = {
        cropId: selectedCrop.id,
        readings: [{
          sensorId: parseInt(singleReading.sensorId),
          value: parseFloat(singleReading.readingValue)
        }]
      };

      const result = await processBatchReadings(readingData);

      if (result) {
        setSuccessMessage('Lectura creada exitosamente');
        // Resetear formulario
        setSingleReading({
          sensorId: '',
          readingValue: '',
          readingDate: new Date().toISOString().slice(0, 16),
          notes: ''
        });

        // Limpiar mensaje después de 3 segundos
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      setErrorMessage(error.message || 'Error al crear la lectura');
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  const addToBatch = () => {
    if (!newBatchReading.sensorId || !newBatchReading.readingValue) {
      setErrorMessage('Completa todos los campos obligatorios');
      return;
    }

    const sensor = cropSensors().find(s => s.id === parseInt(newBatchReading.sensorId));

    setBatchReadings(prev => [...prev, {
      ...newBatchReading,
      id: Date.now(), // ID temporal para React keys
      sensorName: sensor?.sensorType || 'Sensor desconocido',
      sensorUnit: sensor?.unitOfMeasurement || ''
    }]);

    // Resetear formulario de nuevo batch
    setNewBatchReading({
      sensorId: '',
      readingValue: '',
      readingDate: new Date().toISOString().slice(0, 16)
    });
  };

  const removeBatchReading = (id) => {
    setBatchReadings(prev => prev.filter(reading => reading.id !== id));
  };

  const handleBatchSubmit = async () => {
    if (batchReadings.length === 0) {
      setErrorMessage('Agrega al menos una lectura al lote');
      return;
    }

    if (!selectedCrop) {
      setErrorMessage('Selecciona un cultivo primero');
      return;
    }

    try {
      const batchData = {
        cropId: selectedCrop.id,
        readings: batchReadings.map(reading => ({
          sensorId: parseInt(reading.sensorId),
          value: parseFloat(reading.readingValue)
        }))
      };

      const result = await processBatchReadings(batchData);

      if (result) {
        setSuccessMessage(`Lote de ${batchReadings.length} lecturas procesado exitosamente`);
        setBatchReadings([]);
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      setErrorMessage(error.message || 'Error al procesar el lote de lecturas');
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  const parseCSV = () => {
    try {
      const lines = csvData.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim());

      // Verificar headers esperados
      const expectedHeaders = ['sensorId', 'readingValue'];
      const hasValidHeaders = expectedHeaders.every(h => headers.includes(h));

      if (!hasValidHeaders) {
        setErrorMessage('El CSV debe tener las columnas: sensorId, readingValue');
        return;
      }

      const parsedReadings = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const reading = {};

        headers.forEach((header, index) => {
          reading[header] = values[index];
        });

        // Validar datos
        const sensor = cropSensors().find(s => s.id === parseInt(reading.sensorId));
        if (sensor && reading.readingValue) {
          parsedReadings.push({
            ...reading,
            id: Date.now() + i,
            sensorName: sensor.sensorType,
            sensorUnit: sensor.unitOfMeasurement
          });
        }
      }

      setBatchReadings(prev => [...prev, ...parsedReadings]);
      setCsvData('');
      setSuccessMessage(`${parsedReadings.length} lecturas agregadas desde CSV`);
      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (error) {
      setErrorMessage('Error al procesar el CSV: ' + error.message);
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  if (!selectedCrop) {
    return (
      <div className="bg-white rounded-lg p-6">
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Selecciona un cultivo
          </h3>
          <p className="text-gray-600">
            Necesitas seleccionar un cultivo para crear lecturas manuales
          </p>
        </div>
      </div>
    );
  }

  const availableSensors = cropSensors();
  console.log('ManualReadingSection - Available sensors:', availableSensors);

  if (!loading && !globalLoading && availableSensors.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6">
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-4">🌱</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay sensores configurados
          </h3>
          <p className="text-gray-600 mb-4">
            Este cultivo aún no tiene sensores asociados. Necesitas configurar sensores para poder crear lecturas manuales.
          </p>
          <a
            href={`/monitoring/crops/${selectedCrop.id}/sensors`}
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded hover:bg-green-700 transition-colors"
          >
            <span className="mr-2">➕</span>
            Configurar sensores
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Lecturas Manuales</h2>
        <p className="text-gray-600">
          Cultivo: <span className="font-medium">{selectedCrop.name}</span>
        </p>
      </div>

      {/* Mensajes de estado */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          {errorMessage}
        </div>
      )}

      {/* Estado de carga */}
      {(loading || globalLoading) && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <span className="ml-3 text-gray-600">Cargando...</span>
        </div>
      )}

      {!loading && !globalLoading && (
        <>
          {/* Tabs para modo individual vs lote */}
          <div className="flex border-b mb-6">
            <button
              onClick={() => setActiveMode('single')}
              className={`px-4 py-2 font-medium ${activeMode === 'single'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              Lectura Individual
            </button>
            <button
              onClick={() => setActiveMode('batch')}
              className={`px-4 py-2 font-medium ${activeMode === 'batch'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              Lote de Lecturas ({batchReadings.length})
            </button>
          </div>

          {/* Modo Individual */}
          {activeMode === 'single' && (
            <form onSubmit={handleSingleReadingSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sensor *
                  </label>
                  <select
                    value={singleReading.sensorId}
                    onChange={(e) => setSingleReading(prev => ({
                      ...prev,
                      sensorId: e.target.value
                    }))}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  >
                    <option value="">Seleccionar sensor</option>
                    {availableSensors.map(sensor => (
                      <option key={sensor.id} value={sensor.id}>
                        {sensor.sensorType} ({sensor.unitOfMeasurement})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor de Lectura *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={singleReading.readingValue}
                    onChange={(e) => setSingleReading(prev => ({
                      ...prev,
                      readingValue: e.target.value
                    }))}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Save size={16} />
                {loading ? 'Guardando...' : 'Crear Lectura'}
              </button>
            </form>
          )}

          {/* Modo Lote */}
          {activeMode === 'batch' && (
            <div className="space-y-6">
              {/* Formulario para agregar al lote */}
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-4">Agregar Lectura al Lote</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <select
                    value={newBatchReading.sensorId}
                    onChange={(e) => setNewBatchReading(prev => ({
                      ...prev,
                      sensorId: e.target.value
                    }))}
                    className="p-2 border rounded focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="">Seleccionar sensor</option>
                    {availableSensors.map(sensor => (
                      <option key={sensor.id} value={sensor.id}>
                        {sensor.sensorType} ({sensor.unitOfMeasurement})
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    step="0.01"
                    value={newBatchReading.readingValue}
                    onChange={(e) => setNewBatchReading(prev => ({
                      ...prev,
                      readingValue: e.target.value
                    }))}
                    placeholder="Valor de lectura"
                    className="p-2 border rounded focus:ring-2 focus:ring-primary focus:border-primary"
                  />

                  <button
                    type="button"
                    onClick={addToBatch}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-green-700 transition-colors"
                  >
                    <Plus size={16} />
                    Agregar al Lote
                  </button>
                </div>
              </div>

              {/* Lista de lecturas en el lote */}
              {batchReadings.length > 0 && (
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-4">Lecturas en el Lote ({batchReadings.length})</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {batchReadings.map(reading => (
                      <div key={reading.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex-1">
                          <span className="font-medium">{reading.sensorName}</span>
                          <span className="ml-2 text-gray-600">
                            {reading.readingValue}{reading.sensorUnit}
                          </span>
                        </div>
                        <button
                          onClick={() => removeBatchReading(reading.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleBatchSubmit}
                    disabled={loading}
                    className="mt-4 w-full py-2 bg-primary text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Procesando...' : `Procesar Lote (${batchReadings.length} lecturas)`}
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

ManualReadingSection.propTypes = {
  // No props necesarios, usa el contexto de monitoreo
};