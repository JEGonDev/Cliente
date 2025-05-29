import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMonitoring } from '../hooks/useMonitoring';
import { GlobalThresholdsEditor } from '../ui/GlobalThresholdsEditor';
import { SensorSelector } from '../ui/SensorSelector';

export const CreateCultivationLayout = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basic');

  // Usar el contexto de monitoreo
  const {
    createCrop,
    error
  } = useMonitoring();

  // Estados locales
  const [cultivationData, setCultivationData] = useState({
    cropName: '',
    cropType: ''
  });

  // Estado para umbrales globales
  const [thresholds, setThresholds] = useState({
    temperature: { min: 18, max: 26 },
    humidity: { min: 60, max: 80 },
    ec: { min: 1.0, max: 1.6 }
  });

  // Estado para sensores seleccionados
  const [selectedSensorIds, setSelectedSensorIds] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleBasicDataChange = (e) => {
    const { name, value } = e.target;
    setCultivationData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSensorSelectionChange = (newSelection) => {
    setSelectedSensorIds(newSelection);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar datos básicos
    if (!cultivationData.cropName.trim()) {
      alert('El nombre del cultivo es obligatorio');
      return;
    }

    if (!cultivationData.cropType.trim()) {
      alert('Debe ingresar un tipo de cultivo');
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage('');

    try {
      // Enviar solo los datos requeridos por el backend
      const cropData = {
        cropName: cultivationData.cropName,
        cropType: cultivationData.cropType
      };

      console.log('Enviando datos del cultivo:', cropData);

      // Crear el cultivo usando el contexto
      const newCrop = await createCrop(cropData);

      if (newCrop) {
        console.log('Cultivo creado exitosamente:', newCrop);
        setSuccessMessage('Cultivo creado correctamente pero para el ideal funcionamiento recuerda ajustar los umbrales y asociar o crear sensores para tu cultivo');
        // Limpiar el formulario
        setCultivationData({
          cropName: '',
          cropType: ''
        });
      }
    } catch (error) {
      console.error('Error al crear cultivo:', error);
      alert('Error al crear el cultivo. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/monitoring/crops');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto mt-10 space-y-6 bg-white p-6 rounded-lg shadow"
    >
      {/* Contenedor flex para alinear botón y título */}
      <div className="flex items-center gap-5 justify-start mb-8">
        <button
          type="button"
          onClick={handleCancel}
          disabled={isSubmitting}
          className="px-3 py-1.5 text-black rounded hover:bg-blue-100 flex items-center gap-1 transition-colors duration-300 disabled:opacity-50"
        >
          <span>←</span>
          <span>Volver</span>
        </button>

        <h1 className="text-2xl font-bold text-gray-800">Crear Nuevo Cultivo</h1>
      </div>

      {/* Mostrar errores */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-700">Error: {error}</p>
        </div>
      )}

      {/* Indicador de carga */}
      {isSubmitting && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-600 mr-2"></div>
            <p className="text-blue-700">Creando cultivo...</p>
          </div>
        </div>
      )}

      {/* Mensaje de éxito */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
          <div className="flex items-center">
            <span className="text-green-600 mr-2">✓</span>
            <p className="text-green-700">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Tabs de navegación */}
      <div className="flex gap-6 border-b border-gray-300 mb-6">
        {['basic', 'thresholds', 'sensors'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`pb-2 font-semibold text-gray-700 ${activeTab === tab
              ? 'border-b-2 border-primary text-primary'
              : 'hover:text-primary'
              }`}
          >
            {tab === 'basic' && 'Información Básica'}
            {tab === 'thresholds' && 'Umbrales'}
            {tab === 'sensors' && 'Sensores'}
          </button>
        ))}
      </div>

      {/* Contenido según la pestaña activa */}
      {activeTab === 'basic' && (
        <div className="space-y-6">
          {/* Nombre del cultivo */}
          <div>
            <label htmlFor="cropName" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del cultivo *
            </label>
            <input
              type="text"
              id="cropName"
              name="cropName"
              value={cultivationData.cropName}
              onChange={handleBasicDataChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-primary focus:border-primary"
              placeholder="Ingrese el nombre del cultivo"
              required
            />
          </div>

          {/* Tipo de cultivo */}
          <div>
            <label htmlFor="cropType" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de cultivo *
            </label>
            <input
              type="text"
              id="cropType"
              name="cropType"
              value={cultivationData.cropType}
              onChange={handleBasicDataChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-primary focus:border-primary"
              placeholder="Ingrese el tipo de cultivo"
              required
            />
          </div>
        </div>
      )}

      {activeTab === 'thresholds' && (
        <GlobalThresholdsEditor
          thresholds={thresholds}
          setThresholds={setThresholds}
          disabled={!cultivationData.cropName.trim()} // Deshabilitar si no hay nombre de cultivo
        />
      )}

      {activeTab === 'sensors' && (
        <div className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
            <p className="text-yellow-700">
              Nota: Los sensores y umbrales se podrán configurar después de crear el cultivo.
            </p>
          </div>
          <SensorSelector
            selectedSensorIds={selectedSensorIds}
            onSensorSelectionChange={handleSensorSelectionChange}
            disabled={!cultivationData.cropName.trim()} // Deshabilitar si no hay nombre de cultivo
          />
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex justify-end gap-4 pt-6">
        <button
          type="button"
          onClick={handleCancel}
          disabled={isSubmitting}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors duration-300 disabled:opacity-50"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={isSubmitting || !cultivationData.cropName.trim() || !cultivationData.cropType.trim()}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting && (
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
          )}
          {isSubmitting ? 'Creando...' : 'Crear Cultivo'}
        </button>
      </div>
    </form>
  );
};