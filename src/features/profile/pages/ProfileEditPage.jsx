import { useState } from 'react';
import { Header } from '../../../ui/layouts/Header';
import { ProfileTabs } from '../ui/ProfileTabs';
import { ProfileForm } from '../ui/ProfileForm';
import { ProfileSecurityForm } from '../ui/ProfileSecurityForm';
import { ProfilePreferencesForm } from '../ui/ProfilePreferencesForm';

/**
 * Página de edición de perfil de usuario
 * Permite al usuario modificar sus datos personales, seguridad y preferencias
 * 
 * @returns {JSX.Element} Página completa de edición de perfil
 */
export const ProfileEditPage = () => {
  // Estado para controlar la pestaña activa
  const [activeTab, setActiveTab] = useState('personal');
  
  // Renderizar el contenido según la pestaña activa
  const renderContent = () => {
    switch (activeTab) {
      case 'personal':
        return <ProfileForm />;
      case 'security':
        return <ProfileSecurityForm />;
      case 'preferences':
        return <ProfilePreferencesForm />;
      default:
        return <ProfileForm />;
    }
  };
  
  return (
    <>
      <Header />
      <div className="flex justify-center min-h-screen bg-gray-100 p-4 pt-8">
        <div className="w-full max-w-3xl bg-white shadow-md rounded-md p-6">
          {/* Cabecera del perfil */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gray-300 rounded-full overflow-hidden">
              <img 
                src="/api/placeholder/64/64" 
                alt="Avatar" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Mi Perfil</h1>
              <p className="text-gray-600">Actualiza tu información personal y configuración</p>
            </div>
          </div>
          
          {/* Pestañas del perfil */}
          <ProfileTabs 
            tabs={[
              { id: 'personal', label: 'Información Personal' },
              { id: 'security', label: 'Seguridad' },
              { id: 'preferences', label: 'Preferencias' }
            ]}
            onTabChange={setActiveTab}
            activeTab={activeTab}
          />
          
          {/* Contenido según la pestaña activa */}
          {renderContent()}
        </div>
      </div>
    </>
  );
};