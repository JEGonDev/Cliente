import { ModuleDetailLayout } from '../layouts/ModuleDetailLayout';
import { Header } from '../../../ui/layouts/Header';
import { ModuleHeader } from '../ui/ModuleHeader';

// Componentes modales
import { ArticleFormModal } from '../ui/ArticleFormModal';
import { GuideFormModal } from '../ui/GuideFormModal';
import { VideoFormModal } from '../ui/VideoFormModal';
import { DeleteConfirmationModal } from '../ui/DeleteConfirmationModal';

// Componentes para cada sección
import { SectionHeader } from '../layouts/SectionHeader';
import { ArticlesList } from '../layouts/ArticleList';
import { GuidesList } from '../layouts/GuidesList';
import { VideosList } from '../layouts/VideosList';

// Hook personalizado que centraliza toda la lógica
import { useModuleDetails } from '../hooks/useModuleDetails';

/**
 * Página que muestra los detalles completos de un módulo educativo
 * Permite ver, crear, editar y eliminar artículos, guías y videos
 * 
 * @returns {JSX.Element} Página de detalles del módulo
 */
export const OpenModulePage = () => {
  // Usamos el hook personalizado que encapsula toda la lógica
  const {
    // Estados principales
    moduleId,
    isAdmin,
    module,
    articles,
    guides,
    videos,
    moduleTags,
    
    // Estados de carga y errores
    isLoading,
    loadingArticles,
    loadingGuides,
    loadingVideos,
    moduleError,
    articleError,
    guideError,
    videoError,
    
    // Estados de modales
    articleModalOpen,
    guideModalOpen,
    videoModalOpen,
    deleteModalOpen,
    
    // IDs seleccionados
    selectedArticleId,
    selectedGuideId,
    selectedVideoId,
    
    // Estados de eliminación
    isDeleting,
    deleteModalProps,
    
    // Funciones de modales de artículos
    openCreateArticleModal,
    openEditArticleModal,
    confirmDeleteArticle,
    
    // Funciones de modales de guías
    openCreateGuideModal,
    openEditGuideModal,
    confirmDeleteGuide,
    
    // Funciones de modales de videos
    openCreateVideoModal,
    openEditVideoModal,
    confirmDeleteVideo,
    
    // Funciones de cierre de modales
    closeArticleModal,
    closeGuideModal,
    closeVideoModal,
    closeDeleteModal,
    
    // Funciones de operaciones
    handleDelete,
    refreshContent
  } = useModuleDetails();

  return (
    <>
      <Header />
      
      <ModuleDetailLayout>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : moduleError ? (
          <div className="bg-red-100 text-red-800 p-4 rounded-md shadow mb-6">
            <h3 className="font-medium mb-2">Error al cargar el módulo</h3>
            <p className="text-sm">{moduleError}</p>
          </div>
        ) : !module ? (
          <div className="bg-yellow-100 text-yellow-800 p-4 rounded-md shadow mb-6">
            <h3 className="font-medium mb-2">Módulo no encontrado</h3>
            <p className="text-sm">No se encontró el módulo solicitado.</p>
          </div>
        ) : (
          <>
            {/* Encabezado del módulo */}
            <div className="mb-10">
              <ModuleHeader 
                videoCount={videos?.length || 0}
                articleCount={articles?.length || 0}
                guideCount={guides?.length || 0}
                title={module.title || ''}
                description={module.description || ''}
                tags={moduleTags}
              />
            </div>

            {/* Sección de artículos */}
            <section className="mb-12">
              <SectionHeader 
                title="Artículos" 
                isAdmin={isAdmin}
                onAdd={openCreateArticleModal}
              />
              
              {loadingArticles ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : articleError ? (
                <div className="bg-orange-50 text-orange-800 p-3 rounded-md mb-6">
                  <p className="text-sm">No se pudieron cargar los artículos. Intente más tarde.</p>
                </div>
              ) : articles?.length === 0 ? (
                <div className="bg-gray-50 text-gray-600 p-6 rounded-md text-center mb-6">
                  <p>No hay artículos disponibles para este módulo.</p>
                  {isAdmin && (
                    <button 
                      className="mt-2 text-primary hover:underline text-sm"
                      onClick={openCreateArticleModal}
                    >
                      + Agregar primer artículo
                    </button>
                  )}
                </div>
              ) : (
                <ArticlesList 
                  articles={articles || []} 
                  isAdmin={isAdmin}
                  onEdit={openEditArticleModal}
                  onDelete={confirmDeleteArticle}
                />
              )}
            </section>

            {/* Sección de guías */}
            <section className="mb-12">
              <SectionHeader 
                title="Guías descargables" 
                isAdmin={isAdmin}
                onAdd={openCreateGuideModal}
              />
              
              {loadingGuides ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : guideError ? (
                <div className="bg-orange-50 text-orange-800 p-3 rounded-md mb-6">
                  <p className="text-sm">No se pudieron cargar las guías. Intente más tarde.</p>
                </div>
              ) : guides?.length === 0 ? (
                <div className="bg-gray-50 text-gray-600 p-6 rounded-md text-center mb-6">
                  <p>No hay guías disponibles para este módulo.</p>
                  {isAdmin && (
                    <button 
                      className="mt-2 text-primary hover:underline text-sm"
                      onClick={openCreateGuideModal}
                    >
                      + Agregar primera guía
                    </button>
                  )}
                </div>
              ) : (
                <GuidesList 
                  guides={guides || []} 
                  isAdmin={isAdmin}
                  onEdit={openEditGuideModal}
                  onDelete={confirmDeleteGuide}
                />
              )}
            </section>

            {/* Sección de videos */}
            <section className="mb-12">
              <SectionHeader 
                title="Videos" 
                isAdmin={isAdmin}
                onAdd={openCreateVideoModal}
              />
              
              {loadingVideos ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : videoError ? (
                <div className="bg-orange-50 text-orange-800 p-3 rounded-md mb-6">
                  <p className="text-sm">No se pudieron cargar los videos. Intente más tarde.</p>
                </div>
              ) : videos?.length === 0 ? (
                <div className="bg-gray-50 text-gray-600 p-6 rounded-md text-center mb-6">
                  <p>No hay videos disponibles para este módulo.</p>
                  {isAdmin && (
                    <button 
                      className="mt-2 text-primary hover:underline text-sm"
                      onClick={openCreateVideoModal}
                    >
                      + Agregar primer video
                    </button>
                  )}
                </div>
              ) : (
                <VideosList 
                  videos={videos || []} 
                  isAdmin={isAdmin}
                  onEdit={openEditVideoModal}
                  onDelete={confirmDeleteVideo}
                />
              )}
            </section>
          </>
        )}
      </ModuleDetailLayout>

      {/* Modal de artículo */}
      <ArticleFormModal 
        isOpen={articleModalOpen}
        onClose={closeArticleModal}
        moduleId={Number(moduleId)}
        articleId={selectedArticleId}
        onSuccess={refreshContent}
      />

      {/* Modal de guía */}
      <GuideFormModal 
        isOpen={guideModalOpen}
        onClose={closeGuideModal}
        moduleId={Number(moduleId)}
        guideId={selectedGuideId}
        onSuccess={refreshContent}
      />

      {/* Modal de video */}
      <VideoFormModal 
        isOpen={videoModalOpen}
        onClose={closeVideoModal}
        moduleId={Number(moduleId)}
        videoId={selectedVideoId}
        onSuccess={refreshContent}
      />

      {/* Modal de confirmación de eliminación */}
      <DeleteConfirmationModal 
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        {...deleteModalProps}
      />
    </>
  );
};