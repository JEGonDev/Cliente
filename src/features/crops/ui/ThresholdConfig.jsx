import { Cog } from 'lucide-react';

/**
 * Componente para configurar umbrales de alertas
 */
export const ThresholdConfig = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Configuración de alertas</h2>
        
        <button className="text-blue-600 flex items-center text-sm">
          <Cog size={16} className="mr-1" />
          Configuración avanzada
        </button>
      </div>
      
      {/* Umbrales globales */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h3 className="font-medium mb-4">Umbrales de alerta globales</h3>
        
        {/* Temperatura */}
        <div className="mb-4">
          <div className="text-sm font-medium text-gray-700 mb-2">Temperatura (°C)</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Mínimo</label>
              <input 
                type="number" 
                className="w-full p-2 border border-gray-300 rounded"
                defaultValue="18.0"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Máximo</label>
              <input 
                type="number" 
                className="w-full p-2 border border-gray-300 rounded"
                defaultValue="26.0"
              />
            </div>
          </div>
        </div>
        
        {/* Humedad */}
        <div className="mb-4">
          <div className="text-sm font-medium text-gray-700 mb-2">Humedad (%)</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Mínimo</label>
              <input 
                type="number" 
                className="w-full p-2 border border-gray-300 rounded"
                defaultValue="60"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Máximo</label>
              <input 
                type="number" 
                className="w-full p-2 border border-gray-300 rounded"
                defaultValue="80"
              />
            </div>
          </div>
        </div>
        
        {/* EC */}
        <div className="mb-4">
          <div className="text-sm font-medium text-gray-700 mb-2">EC (mS/cm)</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Mínimo</label>
              <input 
                type="number" 
                className="w-full p-2 border border-gray-300 rounded"
                defaultValue="1.0"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Máximo</label>
              <input 
                type="number" 
                className="w-full p-2 border border-gray-300 rounded"
                defaultValue="1.6"
                step="0.1"
              />
            </div>
          </div>
        </div>
        
        {/* pH */}
        <div className="mb-4">
          <div className="text-sm font-medium text-gray-700 mb-2">pH</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Mínimo</label>
              <input 
                type="number" 
                className="w-full p-2 border border-gray-300 rounded"
                defaultValue="5.5"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Máximo</label>
              <input 
                type="number" 
                className="w-full p-2 border border-gray-300 rounded"
                defaultValue="6.5"
                step="0.1"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Configuración de notificaciones */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h3 className="font-medium mb-4">Configuración de notificaciones</h3>
        
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="email-alerts"
              className="text-green-600 rounded mr-2"
              defaultChecked
            />
            <label htmlFor="email-alerts" className="text-sm">Recibir alertas por correo electrónico</label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="sms-alerts"
              className="text-green-600 rounded mr-2"
            />
            <label htmlFor="sms-alerts" className="text-sm">Recibir alertas por SMS</label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="push-alerts"
              className="text-green-600 rounded mr-2"
              defaultChecked
            />
            <label htmlFor="push-alerts" className="text-sm">Recibir notificaciones push</label>
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm text-gray-700 mb-2">Frecuencia de resumen diario</label>
          <select className="w-full p-2 border border-gray-300 rounded">
            <option>Cada 4 horas</option>
            <option>Cada 6 horas</option>
            <option>Cada 12 horas</option>
            <option>Una vez al día</option>
          </select>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm text-gray-700 mb-2">Prioridad mínima para notificación</label>
          <select className="w-full p-2 border border-gray-300 rounded">
            <option>Todas las alertas</option>
            <option>Solo advertencias y errores</option>
            <option>Solo errores</option>
          </select>
        </div>
      </div>
      
      {/* Botón de guardar */}
      <div className="flex justify-end">
        <button className="px-4 py-2 bg-green-800 text-white rounded hover:bg-green-700">
          Guardar configuración
        </button>
      </div>
    </div>
  );
};