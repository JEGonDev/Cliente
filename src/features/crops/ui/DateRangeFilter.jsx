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
          </select>
        </div>
        
        <div>
          <label className="block text-sm text-gray-600 mb-1">Parámetro</label>
          <select className="w-full p-2 border border-gray-300 rounded">
            <option>Temperatura</option>
            <option>Humedad</option>
            <option>EC</option>
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
    </div>
  );
};