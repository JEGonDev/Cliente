import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMonitoring } from '../hooks/useMonitoring';
import { motion } from 'framer-motion';

export const CreateCultivationLayout = () => {
  const navigate = useNavigate();

  const { createCrop, error } = useMonitoring();

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
      const cropData = {
        cropName: cultivationData.cropName,
        cropType: cultivationData.cropType
      };

      const newCrop = await createCrop(cropData);

      if (newCrop) {
        setSuccessMessage('¡Cultivo creado exitosamente!');
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
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl">
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-[#23582a] to-[#3a8741] rounded-t-2xl">
          <h3 className="text-xl font-semibold text-white">🌱 Crear nuevo cultivo</h3>
          <button
            onClick={() => navigate('/monitoring/crops')}
            className="text-white text-3xl font-extrabold rounded-full hover:bg-[#2f6b35] hover:text-white transition-all duration-200 w-9 h-9 flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-5">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Información básica</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="cropName" className="block text-sm font-medium text-gray-600 mb-1">
                    Nombre del cultivo
                  </label>
                  <input
                    type="text"
                    id="cropName"
                    name="cropName"
                    value={cultivationData.cropName}
                    onChange={handleBasicDataChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                    placeholder="Ej: Tomate Invernadero 1"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="cropType" className="block text-sm font-medium text-gray-600 mb-1">
                    Tipo de cultivo
                  </label>
                  <input
                    type="text"
                    id="cropType"
                    name="cropType"
                    value={cultivationData.cropType}
                    onChange={handleBasicDataChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                    placeholder="Ej: Tomate Cherry"
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="p-4 bg-green-100 border border-green-300 text-green-800 rounded-lg">
                {successMessage}
              </div>
            )}

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate('/monitoring/crops')}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 text-white bg-green-500 bg-primary rounded-lg hover:bg-green-600 transition-all ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Creando...' : 'Crear cultivo'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};
