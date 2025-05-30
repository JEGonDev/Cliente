import React, { useState } from 'react';
import { AdminCommunityHeader } from '../ui/AdminCommunityHeader';
import { RecentPublications } from '../ui/RecentPublications';
import { ModerationReports } from '../ui/ModerationReports';
import { UsersList } from '../ui/UsersList';

/**
 * Página principal del administrador de comunidad
 * Integra todos los componentes de administración y maneja el estado global
 * 
 * Esta página permite a los administradores:
 * - Ver y gestionar publicaciones recientes
 * - Moderar usuarios reportados
 * - Administrar la lista de usuarios
 * - Buscar contenido específico
 */
export const AdminCommunityPage = () => {
  // Estado para controlar el tab activo
  const [activeTab, setActiveTab] = useState('publications');
  
  // Estado para el valor de búsqueda
  const [searchValue, setSearchValue] = useState('');

  /**
   * Maneja el cambio de tabs en la navegación
   * @param {string} tab - Nombre del tab a activar
   */
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    console.log(`Cambiando a tab: ${tab}`);
  };

  /**
   * Maneja los cambios en la barra de búsqueda
   * @param {Event} e - Evento de cambio del input
   */
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    console.log(`Buscando: ${value}`);
    // TODO: Implementar lógica de filtrado en tiempo real
  };

  /**
   * Renderiza el contenido principal basado en el tab activo
   * @returns {JSX.Element} Componente a renderizar
   */
  const renderMainContent = () => {
    switch (activeTab) {
      case 'publications':
        return <RecentPublications />;
      case 'reports':
        return <ModerationReports />;
      case 'users':
        return <UsersList />;
      default:
        return <RecentPublications />;
    }
  };

  /**
   * Determina si debe mostrar contenido adicional
   * Solo en el tab de publicaciones se muestran todos los componentes
   * @returns {boolean} Si debe mostrar contenido adicional
   */
  const shouldShowAdditionalContent = () => {
    return activeTab === 'publications';
  };

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen">
      {/* Header con navegación y búsqueda */}
      <AdminCommunityHeader 
        activeTab={activeTab}
        onTabChange={handleTabChange}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
      />
      
      {/* Contenido principal */}
      <div className="p-4 space-y-6">
        {/* Contenido principal basado en el tab activo */}
        {renderMainContent()}
        
        {/* Contenido adicional (solo visible en tab de publicaciones) */}
        {shouldShowAdditionalContent() && (
          <>
            {/* Sección de moderación */}
            <ModerationReports />
            
            {/* Lista de usuarios */}
            <UsersList />
          </>
        )}
      </div>
    </div>
  );
};