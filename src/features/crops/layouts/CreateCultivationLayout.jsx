import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMonitoring } from '../hooks/useMonitoring';

export const CreateCultivationLayout = () => {
  const navigate = useNavigate();

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

  const handleBasicDataChange = (e) => {
    const { name, value } = e.target;
    setCultivationData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
  };

  return (
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
      </div>
    </div>
  );
};