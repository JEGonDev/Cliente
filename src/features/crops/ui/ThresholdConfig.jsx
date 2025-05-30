import { useEffect, useState } from 'react';

/**
 * Componente para configurar umbrales de alertas
 * Los umbrales dependen del cultivo activo y no son editables
 */
export const ThresholdConfig = () => {
  const [cropThresholds, setCropThresholds] = useState(null);

  // Simular llamada a backend para obtener umbrales del cultivo
  useEffect(() => {
    // Aquí puedes reemplazar con tu llamada real a la API
    const fetchThresholds = async () => {
      // Simulando respuesta de la API
      const data = {
        temperature: { min: 18.0, max: 26.0 },
        humidity: { min: 60, max: 80 },
        ec: { min: 1.0, max: 1.6 },
        ph: { min: 5.5, max: 6.5 }
      };
      setCropThresholds(data);
    };

    fetchThresholds();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Configuración de alertas</h2>
      </div>

      {/* Umbrales de cultivo */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h3 className="font-medium mb-4">Umbrales de alerta del cultivo actual</h3>

        {cropThresholds ? (
          ['temperature', 'humidity', 'ec'].map(param => (
            <div key={param} className="mb-4">
              <div className="text-sm font-medium text-gray-700 mb-2 capitalize">
                {param === 'ec' ? 'EC (mS/cm)' : param === 'ph' ? 'pH' : param.charAt(0).toUpperCase() + param.slice(1) + (param !== 'ph' ? (param === 'humidity' ? ' (%)' : ' (°C)') : '')}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Mínimo</label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-200 rounded bg-gray-100 text-gray-700"
                    value={cropThresholds[param]?.min}
                    readOnly
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Máximo</label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-200 rounded bg-gray-100 text-gray-700"
                    value={cropThresholds[param]?.max}
                    readOnly
                    disabled
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">Cargando umbrales del cultivo...</p>
        )}
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
        <button className="px-4 py-2 bg-primary text-white rounded hover:bg-green-700">
          Guardar configuración
        </button>
      </div>
    </div>
  );
};
