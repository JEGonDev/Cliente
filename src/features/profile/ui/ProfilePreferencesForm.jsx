import { useState } from 'react';
import { FormButton } from '../../../ui/components/FormButton';
import { RiSaveLine } from 'react-icons/ri';

/**
 * Formulario para gestionar las preferencias del usuario
 * 
 * @returns {JSX.Element} Formulario de preferencias
 */
export const ProfilePreferencesForm = () => {
  // Estado para manejar las preferencias (sin lógica por ahora)
  const [preferences, setPreferences] = useState({
    notifications: true,
    newsletter: false,
    language: 'es',
    theme: 'light'
  });
  
  // Manejador de cambios de campos (sin lógica real por ahora)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Manejador de envío del formulario (sin lógica real por ahora)
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar los datos
    alert('Preferencias guardadas correctamente');
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-lg font-semibold mb-4">Preferencias</h2>
      
      {/* Notificaciones */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-md font-medium mb-2">Notificaciones</h3>
        
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="notifications"
                name="notifications"
                type="checkbox"
                checked={preferences.notifications}
                onChange={handleChange}
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="notifications" className="font-medium text-gray-700">
                Recibir notificaciones del sistema
              </label>
              <p className="text-gray-500">Alertas sobre actualizaciones, mensajes y cambios en tu cultivo.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="newsletter"
                name="newsletter"
                type="checkbox"
                checked={preferences.newsletter}
                onChange={handleChange}
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="newsletter" className="font-medium text-gray-700">
                Suscribirse al boletín mensual
              </label>
              <p className="text-gray-500">Recibe novedades, consejos y noticias sobre hidroponía.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Idioma */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-md font-medium mb-2">Idioma</h3>
        
        <select
          id="language"
          name="language"
          value={preferences.language}
          onChange={handleChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
        >
          <option value="es">Español</option>
          <option value="en">English</option>
          <option value="fr">Français</option>
          <option value="pt">Português</option>
        </select>
      </div>
      
      {/* Tema */}
      <div>
        <h3 className="text-md font-medium mb-2">Tema</h3>
        
        <div className="grid grid-cols-3 gap-3">
          <div className={`flex flex-col items-center p-3 rounded-md cursor-pointer border ${preferences.theme === 'light' ? 'border-primary bg-green-50' : 'border-gray-200'}`}
               onClick={() => setPreferences({...preferences, theme: 'light'})}>
            <div className="w-full h-12 bg-white border border-gray-200 rounded-md mb-2"></div>
            <div className="text-sm font-medium">Claro</div>
          </div>
          
          <div className={`flex flex-col items-center p-3 rounded-md cursor-pointer border ${preferences.theme === 'dark' ? 'border-primary bg-green-50' : 'border-gray-200'}`}
               onClick={() => setPreferences({...preferences, theme: 'dark'})}>
            <div className="w-full h-12 bg-gray-800 border border-gray-700 rounded-md mb-2"></div>
            <div className="text-sm font-medium">Oscuro</div>
          </div>
          
          <div className={`flex flex-col items-center p-3 rounded-md cursor-pointer border ${preferences.theme === 'system' ? 'border-primary bg-green-50' : 'border-gray-200'}`}
               onClick={() => setPreferences({...preferences, theme: 'system'})}>
            <div className="w-full h-12 bg-gradient-to-r from-white to-gray-800 border border-gray-200 rounded-md mb-2"></div>
            <div className="text-sm font-medium">Sistema</div>
          </div>
        </div>
        
        <p className="mt-2 text-xs text-gray-500">El tema "Sistema" se adapta automáticamente según la configuración de tu dispositivo.</p>
      </div>
      
      {/* Privacidad */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-md font-medium mb-2">Privacidad</h3>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Perfil público</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" name="publicProfile" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Compartir datos de cultivo</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" name="shareData" checked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>
      
      {/* Botón de guardar */}
      <div className="flex justify-end">
        <FormButton 
          text="Guardar Preferencias" 
          icon={<RiSaveLine className="text-lg" />} 
          type="submit"
        />
      </div>
    </form>
  );
};