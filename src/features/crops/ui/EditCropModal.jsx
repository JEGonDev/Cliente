import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useMonitoring } from '../hooks/useMonitoring';

export const EditCropModal = ({ isOpen, onClose, crop }) => {
  const { updateCrop, deleteCrop } = useMonitoring();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    cropType: '',
    status: ''
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (crop) {
      setFormData({
        name: crop.cropName || crop.name || '',
        location: crop.location || '',
        cropType: crop.cropType || '',
        status: crop.status || 'active'
      });
    }
  }, [crop]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await updateCrop(crop.id, formData);
      onClose();
    } catch (err) {
      setError(err.message || 'Error al actualizar el cultivo');
    }
  };

  const handleDelete = async () => {
    if (!isDeleting) {
      setIsDeleting(true);
      return;
    }

    try {
      await deleteCrop(crop.id);
      onClose();
    } catch (err) {
      setError(err.message || 'Error al eliminar el cultivo');
    }
  };

  if (!isOpen || !crop) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-semibold mb-4">Editar Cultivo</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ubicación
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Cultivo
            </label>
            <input
              type="text"
              value={formData.cropType}
              onChange={(e) => setFormData(prev => ({ ...prev, cropType: e.target.value }))}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            >
              <option value="active">Activo</option>
              <option value="paused">Pausado</option>
              <option value="completed">Completado</option>
            </select>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={handleDelete}
              className={`px-4 py-2 text-white rounded ${isDeleting
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-gray-500 hover:bg-gray-600'
                }`}
            >
              {isDeleting ? '¿Confirmar eliminación?' : 'Eliminar'}
            </button>

            <div className="space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded hover:bg-green-700"
              >
                Guardar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

EditCropModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  crop: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string,
    cropName: PropTypes.string,
    location: PropTypes.string,
    cropType: PropTypes.string,
    status: PropTypes.string
  })
}; 