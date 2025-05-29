import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { CropCard } from '../ui/CropCard';
import { useMonitoring } from '../hooks/useMonitoring';

export const CropsLayout = () => {
  const navigate = useNavigate();

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
    // Carga inicial
    fetchUserCrops();

    // Configurar intervalo de actualización cada 5 segundos
    const intervalId = setInterval(() => {
      fetchUserCrops();
    }, 5000); // 5000ms = 5 segundos

    // Limpiar intervalo al desmontar el componente
    return () => clearInterval(intervalId);
  }, [fetchUserCrops]);

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

  // Estado de error
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-700">Error: {error}</p>
          <button
            onClick={fetchUserCrops}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header con título y botón de agregar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Cultivos</h1>

        <button
          onClick={handleAddCrop}
          className="inline-flex items-center bg-primary px-4 py-2 bg-green-800 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nuevo cultivo
        </button>
      </div>

      {/* Lista de cultivos */}
      {crops.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-4xl mb-4">🌱</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No tienes cultivos registrados
          </h3>
          <p className="text-gray-600 mb-4">
            Comienza creando tu primer cultivo hidropónico
          </p>
          <button
            onClick={handleAddCrop}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-700"
          >
            Crear primer cultivo
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4 w-full">
          {crops.map((crop) => (
            <CropCard key={crop.id} crop={crop} onClick={handleCardClick} />
          ))}
        </div>
      )}
    </div>
  );
};