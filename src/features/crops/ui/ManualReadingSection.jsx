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

  // Memoizar la función de filtrado de sensores
  const cropSensors = useCallback(() => {
    return sensors.filter(s => s.cropId === selectedCrop?.id);
  }, [sensors, selectedCrop?.id]);

  // Cargar sensores solo cuando cambie el cultivo seleccionado
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

  const handleSingleReadingSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCrop) {
      setErrorMessage('Selecciona un cultivo primero');
      return;
    }

    try {
      const readingData = {
        cropId: selectedCrop.id,
        sensorId: parseInt(singleReading.sensorId),
        readingValue: parseFloat(singleReading.readingValue),
        readingDate: new Date(singleReading.readingDate).toISOString(),
        notes: singleReading.notes || null
      };

      const result = await createReading(readingData);

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
          readingValue: parseFloat(reading.readingValue),
          readingDate: new Date(reading.readingDate).toISOString()
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
      const expectedHeaders = ['sensorId', 'readingValue', 'readingDate'];
      const hasValidHeaders = expectedHeaders.every(h => headers.includes(h));

      if (!hasValidHeaders) {
        setErrorMessage('El CSV debe tener las columnas: sensorId, readingValue, readingDate');
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
        if (sensor && reading.readingValue && reading.readingDate) {
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
          {!selectedCrop ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-4">📊</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Selecciona un cultivo
              </h3>
              <p className="text-gray-600">
                Necesitas seleccionar un cultivo para crear lecturas manuales
              </p>
            </div>
          ) : cropSensors().length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No hay sensores asociados a este cultivo.
                <br />
                Asocia sensores primero para poder crear lecturas.
              </p>
            </div>
          ) : (
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
                        {cropSensors().map(sensor => (
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha y Hora *
                      </label>
                      <input
                        type="datetime-local"
                        value={singleReading.readingDate}
                        onChange={(e) => setSingleReading(prev => ({
                          ...prev,
                          readingDate: e.target.value
                        }))}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-primary"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notas (opcional)
                      </label>
                      <input
                        type="text"
                        value={singleReading.notes}
                        onChange={(e) => setSingleReading(prev => ({
                          ...prev,
                          notes: e.target.value
                        }))}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="Observaciones adicionales..."
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
                        {cropSensors().map(sensor => (
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

                      <div className="flex gap-2">
                        <input
                          type="datetime-local"
                          value={newBatchReading.readingDate}
                          onChange={(e) => setNewBatchReading(prev => ({
                            ...prev,
                            readingDate: e.target.value
                          }))}
                          className="flex-1 p-2 border rounded focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                        <button
                          type="button"
                          onClick={addToBatch}
                          className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Sección CSV */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-4">Importar desde CSV</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Formato: sensorId, readingValue, readingDate (YYYY-MM-DDTHH:mm)
                    </p>
                    <div className="flex gap-2">
                      <textarea
                        value={csvData}
                        onChange={(e) => setCsvData(e.target.value)}
                        placeholder="sensorId,readingValue,readingDate&#10;1,25.5,2024-01-15T10:30&#10;2,75.2,2024-01-15T10:30"
                        className="flex-1 p-2 border rounded focus:ring-2 focus:ring-primary focus:border-primary h-20"
                      />
                      <button
                        type="button"
                        onClick={parseCSV}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                      >
                        <Upload size={16} />
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
                              <span className="ml-2 text-sm text-gray-500">
                                {new Date(reading.readingDate).toLocaleString()}
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
        </>
      )}
    </div>
  );
};

ManualReadingSection.propTypes = {
  // No props necesarios, usa el contexto de monitoreo
};