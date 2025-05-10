import { Filter } from 'lucide-react';

/**
 * Componente para filtrar datos por rango de fechas, cultivo y parámetro
 */
export const DateRangeFilter = () => {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Cultivo</label>
          <select className="w-full p-2 border border-gray-300 rounded">
            <option>Todos</option>
            <option>Lechuga</option>
            <option>Tomate</option>
            <option>Fresas</option>
            <option>Albahaca</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm text-gray-600 mb-1">Parámetro</label>
          <select className="w-full p-2 border border-gray-300 rounded">
            <option>Temperatura</option>
            <option>Humedad</option>
            <option>EC</option>
            <option>pH</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm text-gray-600 mb-1">Desde</label>
          <input 
            type="date" 
            className="w-full p-2 border border-gray-300 rounded"
            defaultValue="2025-04-01"
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-600 mb-1">Hasta</label>
          <input 
            type="date" 
            className="w-full p-2 border border-gray-300 rounded"
            defaultValue="2025-04-30"
          />
        </div>
      </div>
      
      <div className="mt-4 flex gap-3">
        <button className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200">
          <Filter size={18} className="mr-1" />
          Filtrar
        </button>
        
        <button className="px-4 py-2 bg-green-800 text-white rounded hover:bg-green-700">
          Exportar datos
        </button>
      </div>
    </div>
  );
};