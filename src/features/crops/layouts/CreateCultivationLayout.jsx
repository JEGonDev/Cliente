import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import { GlobalThresholdsEditor } from '../ui/GlobalThresholdsEditor';
import { SensorSelector } from '../ui/SensorSelector'; // ✅ CORRECCIÓN 1: Cambié SensorCard por SensorSelector
 
=======
import { useMonitoring } from '../hooks/useMonitoring';

>>>>>>> 0a2550518ec84c66039853f89ca439e946330407
export const CreateCultivationLayout = () => {
  const navigate = useNavigate();

<<<<<<< HEAD
  // Estado para umbrales globales
  const [thresholds, setThresholds] = useState({
    temperature: { min: 0, max: 40 },
    humidity: { min: 20, max: 80 },
    ec: { min: 1, max: 3 },
  });

  // Estado para datos básicos del cultivo
  const [cultivationData, setCultivationData] = useState({
    name: '',
    typeId: '',
    status: 'active',
    startDate: '',
  });
=======
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
>>>>>>> 0a2550518ec84c66039853f89ca439e946330407

  // ✅ CORRECCIÓN 2: Agregar estado para sensores seleccionados
  const [selectedSensorIds, setSelectedSensorIds] = useState([]);

  // Maneja el cambio de inputs controlados en la pestaña 'basic'
  const handleBasicDataChange = (e) => {
    const { name, value } = e.target;
    setCultivationData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

<<<<<<< HEAD
  // ✅ CORRECCIÓN 3: Agregar handler para sensores
  const handleSensorSelectionChange = (newSelection) => {
    setSelectedSensorIds(newSelection);
  };

  // Maneja el submit del formulario
  const handleSubmit = (e) => {
=======
  const handleSubmit = async (e) => {
>>>>>>> 0a2550518ec84c66039853f89ca439e946330407
    e.preventDefault();

    // ✅ CORRECCIÓN 4: Incluir sensores en los datos de envío
    const submitData = {
      ...cultivationData,
      thresholds,
      sensorIds: selectedSensorIds // ← Agregado
    };

<<<<<<< HEAD
    console.log('Datos cultivo:', submitData);
    navigate('/monitoring/crops');
=======
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
        setSuccessMessage('¡Cultivo creado exitosamente!');
        // Redirigir a la página de cultivos después de un breve delay
        setTimeout(() => {
          navigate('/monitoring/crops');
        }, 1500);
      }
    } catch (error) {
      console.error('Error al crear cultivo:', error);
    } finally {
      setIsSubmitting(false);
    }
>>>>>>> 0a2550518ec84c66039853f89ca439e946330407
  };

  return (
<<<<<<< HEAD
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto mt-10 space-y-6 bg-white p-6 rounded-lg shadow"
    >
      {/* Contenedor flex para alinear botón y título */}
      <div className="flex items-center gap-5 justify-start mb-20">
        <button
          type="button"
          onClick={handleCancel}
          className="px-3 py-1.5 text-black rounded hover:bg-blue-100 flex items-center gap-1 transition-colors duration-300"
        >
          <span>←</span>
          <span>Volver</span>
        </button>

        <h1 className="text-2xl font-bold text-gray-800">Crear Nuevo Cultivo</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-300 mb-6">
        {['basic', 'thresholds', 'sensors'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`pb-2 font-semibold text-gray-700 ${
              activeTab === tab
                ? 'border-b-2 border-green-500 text-green-600'
                : 'hover:text-green-500'
            }`}
          >
            {tab === 'basic' && 'Información Básica'}
            {tab === 'thresholds' && 'Umbrales '}
            {tab === 'sensors' && 'Sensores'}
          </button>
        ))}
      </div>

      {/* Contenido según pestaña activa */}
      {activeTab === 'basic' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Información Básica del Cultivo
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Complete los datos fundamentales para identificar y clasificar su cultivo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del cultivo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={cultivationData.name}
                onChange={handleBasicDataChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                placeholder="Ej. Tomates Cherry"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de cultivo <span className="text-red-500">*</span>
              </label>
              <select
                name="typeId"
                value={cultivationData.typeId}
                onChange={handleBasicDataChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="">Seleccione un tipo</option>
                <option value="1">Hortalizas</option>
                <option value="2">Frutales</option>
                <option value="3">Legumbres</option>
                <option value="4">Hierbas Aromáticas</option>
                <option value="5">Vegetales de Hoja</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado del cultivo
              </label>
              <select
                name="status"
                value={cultivationData.status}
                onChange={handleBasicDataChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
                <option value="planning">En Planificación</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de inicio
              </label>
              <input
                type="date"
                name="startDate"
                value={cultivationData.startDate}
                onChange={handleBasicDataChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'thresholds' && (
        <GlobalThresholdsEditor thresholds={thresholds} setThresholds={setThresholds} />
      )}

      {/* ✅ CORRECCIÓN 5: Reemplazar la sección de sensores completa */}
      {activeTab === 'sensors' && (
        <SensorSelector
          selectedSensorIds={selectedSensorIds}
          onSensorSelectionChange={handleSensorSelectionChange}
        />
      )}

      {/* Botones Cancelar y Crear */}
      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary transition-colors duration-300"
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary transition-colors duration-300"
        >
          Crear Cultivo
        </button>
=======
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Crear nuevo cultivo</h1>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Información básica</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="cropName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del cultivo
                </label>
                <input
                  type="text"
                  id="cropName"
                  name="cropName"
                  value={cultivationData.cropName}
                  onChange={handleBasicDataChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ej: Tomate Invernadero 1"
                  required
                />
              </div>
              <div>
                <label htmlFor="cropType" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de cultivo
                </label>
                <input
                  type="text"
                  id="cropType"
                  name="cropType"
                  value={cultivationData.cropType}
                  onChange={handleBasicDataChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ej: Tomate Cherry"
                  required
                />
              </div>
            </div>
          </div>

          {/* Mensajes de estado */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800">{successMessage}</p>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/monitoring/crops')}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 text-white bg-primary rounded-lg hover:bg-green-700 transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              {isSubmitting ? 'Creando...' : 'Crear cultivo'}
            </button>
          </div>
        </form>
>>>>>>> 0a2550518ec84c66039853f89ca439e946330407
      </div>
    </div>
  );
};