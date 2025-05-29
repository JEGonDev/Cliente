import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalThresholdsEditor } from '../ui/GlobalThresholdsEditor';
import { SensorSelector } from '../ui/SensorSelector'; // ✅ CORRECCIÓN 1: Cambié SensorCard por SensorSelector

export const CreateCultivationLayout = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basic');

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

  // ✅ CORRECCIÓN 3: Agregar handler para sensores
  const handleSensorSelectionChange = (newSelection) => {
    setSelectedSensorIds(newSelection);
  };

  // Maneja el submit del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ CORRECCIÓN 4: Incluir sensores en los datos de envío
    const submitData = {
      ...cultivationData,
      thresholds,
      sensorIds: selectedSensorIds // ← Agregado
    };

    console.log('Datos cultivo:', submitData);
    navigate('/monitoring/crops');
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
            className={`pb-2 font-semibold text-gray-700 ${activeTab === tab
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
      </div>
    </form>
  );
};