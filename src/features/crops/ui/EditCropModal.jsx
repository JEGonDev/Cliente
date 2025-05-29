import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useMonitoring } from '../hooks/useMonitoring';

export const EditCropModal = ({ isOpen, onClose, crop }) => {
  const { updateCrop, deleteCrop } = useMonitoring();
  const [formData, setFormData] = useState({
    cropName: '',
    cropType: ''
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const isInitialMount = useRef(true);
  const previousCropId = useRef(crop?.id);

  useEffect(() => {
    // Solo actualizar el formulario si:
    // 1. Es el montaje inicial, o
    // 2. Ha cambiado el ID del cultivo (significa que estamos editando un cultivo diferente)
    if (isInitialMount.current || previousCropId.current !== crop?.id) {
      if (crop) {
        setFormData({
          cropName: crop.cropName || crop.name || '',
          cropType: crop.cropType || ''
        });
        previousCropId.current = crop.id;
      }
      isInitialMount.current = false;
    }
  }, [crop]);

  // Resetear el formulario cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      isInitialMount.current = true;
      setIsDeleting(false);
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const updateData = {
        cropName: formData.cropName,
        cropType: formData.cropType
      };

      await updateCrop(crop.id, updateData);
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Editar Cultivo</h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Cultivo
            </label>
            <input
              type="text"
              value={formData.cropName}
              onChange={(e) => setFormData(prev => ({ ...prev, cropName: e.target.value }))}
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

          <div className="flex justify-between pt-4 border-t mt-6">
            <button
              type="button"
              onClick={handleDelete}
              className={`px-4 py-2 text-white rounded transition-colors ${isDeleting
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-gray-500 hover:bg-gray-600'
                }`}
            >
              {isDeleting ? '¿Confirmar eliminación?' : 'Eliminar'}
            </button>

            <div className="space-x-2">
              <button
                type="button"
                onClick={() => {
                  setIsDeleting(false);
                  onClose();
                }}
                className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded hover:bg-green-700 transition-colors"
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
    cropType: PropTypes.string
  })
}; 