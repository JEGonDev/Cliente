import React from 'react';

/**
 * Componente que muestra las publicaciones recientes en el panel de administración
 * Incluye funcionalidad para eliminar publicaciones
 */
export const RecentPublications = () => {
  // Datos de muestra para las publicaciones
  const publications = [
    {
      id: 1,
      title: "Comparación de cultivos",
      author: "Samantha 12"
    },
    {
      id: 2,
      title: "¿Es el futuro la hidroponía?",
      author: "Camila JK"
    }
  ];

  /**
   * Maneja la eliminación de una publicación
   * @param {number} publicationId - ID de la publicación a eliminar
   */
  const handleDeletePublication = (publicationId) => {
    // TODO: Implementar lógica de eliminación
    console.log(`Eliminar publicación con ID: ${publicationId}`);
  };

  return (
    <div className="bg-white">
      <h2 className="text-base font-semibold text-gray-800 mb-3">
        Publicaciones Recientes
      </h2>
      
      <div className="space-y-3">
        {publications.length > 0 ? (
          publications.map((publication) => (
            <div key={publication.id} className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-sm text-gray-800">
                  {publication.title} - {publication.author}
                </p>
              </div>
              <button 
                onClick={() => handleDeletePublication(publication.id)}
                className="ml-4 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
              >
                Eliminar
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">No hay publicaciones recientes</p>
          </div>
        )}
      </div>
    </div>
  );
};