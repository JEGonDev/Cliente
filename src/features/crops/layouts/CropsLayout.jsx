import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { CropCard } from '../ui/CropCard';
import { useMonitoring } from '../hooks/useMonitoring';

export const CropsLayout = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Usar el contexto de monitoreo en lugar de datos mock
  const {
    crops,
    loading,
    error,
    fetchUserCrops,
    selectCrop
  } = useMonitoring();

  // Cargar cultivos al montar el componente y configurar actualización periódica
  useEffect(() => {
    let intervalId = null;

    // Carga inicial
    fetchUserCrops();

    // Solo configurar el intervalo si no hay modales abiertos
    if (!isModalOpen) {
      intervalId = setInterval(() => {
        // Solo actualizar si el documento está visible
        if (!document.hidden) {
          fetchUserCrops();
        }
      }, 5000);
    }

    // Limpiar intervalo al desmontar el componente
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [fetchUserCrops, isModalOpen]);

  const handleCardClick = (crop) => {
    selectCrop(crop);
    navigate(`/monitoring/crops/${crop.id}/real-time`);
  };

  const handleAddCrop = () => {
    navigate('/monitoring/crops/create');
  };

  // Estado de carga
  if (loading && crops.length === 0) { // Solo mostrar loading en la carga inicial
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <span className="ml-4 text-gray-600">Cargando cultivos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cultivos</h1>
          <p className="text-gray-600">Gestiona tus cultivos y su monitoreo</p>
        </div>
        <button
          onClick={handleAddCrop}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus size={20} />
          Nuevo cultivo
        </button>
      </div>

      {/* Lista vertical de cultivos */}
      <div className="flex flex-col gap-4">
        {crops.map(crop => (
          <CropCard
            key={crop.id}
            crop={crop}
            onClick={handleCardClick}
            onModalOpen={() => setIsModalOpen(true)}
            onModalClose={() => setIsModalOpen(false)}
          />
        ))}
      </div>

      {/* Mensaje cuando no hay cultivos */}
      {crops.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🌱</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No hay cultivos activos
          </h3>
          <p className="text-gray-600 mb-6">
            Comienza creando tu primer cultivo para empezar a monitorearlo
          </p>
          <button
            onClick={handleAddCrop}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus size={20} />
            Crear primer cultivo
          </button>
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mt-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}
    </div>
  );
};