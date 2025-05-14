import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ModuleDetailLayout } from '../layouts/ModuleDetailLayout';
import { Header } from '../../../ui/layouts/Header';
import { AuthContext } from '../../authentication/context/AuthContext';
import { ModuleHeader } from '../ui/ModuleHeader';
import { useModules } from '../hooks/useModules';
import { useArticles } from '../hooks/useArticles';
import { useGuides } from '../hooks/useGuides';
import { useVideos } from '../hooks/useVideos';

// Importar nuevos componentes modal
import { ArticleFormModal } from '../ui/ArticleFormModal';
import { GuideFormModal } from '../ui/GuideFormModal';
import { VideoFormModal } from '../ui/VideoFormModal';
import { DeleteConfirmationModal } from '../ui/DeleteConfirmationModal';

// Componentes para cada sección
import { SectionHeader } from '../ui/SectionHeader';
import { ArticlesList } from '../ui/ArticleList';
import { GuidesList } from '../ui/GuidesList';
import { VideosList } from '../ui/VideosList';

export const OpenModulePage = () => {
  // Obtener información de autenticación y roles
  const { isAdmin } = useContext(AuthContext);
  const { moduleId } = useParams();

  // Hooks personalizados para cada tipo de contenido
  const { 
    module, 
    loading: loadingModule, 
    error: moduleError, 
    fetchModuleById 
  } = useModules();
  
  const { 
    articles, 
    loading: loadingArticles, 
    error: articleError,
    fetchArticlesByModuleId,
    handleDeleteArticle 
  } = useArticles();
  
  const { 
    guides, 
    loading: loadingGuides, 
    error: guideError,
    fetchGuidesByModuleId,
    handleDeleteGuide 
  } = useGuides();
  
  const { 
    videos, 
    loading: loadingVideos, 
    error: videoError,
    fetchVideosByModuleId,
    handleDeleteVideo 
  } = useVideos();

  // Estado para controlar las modales
  const [articleModalOpen, setArticleModalOpen] = useState(false);
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  
  // Estados para guardar los IDs de elementos seleccionados para edición o eliminación
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [selectedGuideId, setSelectedGuideId] = useState(null);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  
  // Estado para controlar el tipo de elemento a eliminar
  const [deleteType, setDeleteType] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Estado para controlar si se ha intentado cargar los datos
  const [loadAttempted, setLoadAttempted] = useState(false);

  // Cargar datos al iniciar
  useEffect(() => {
    const loadModuleData = async () => {
      if (moduleId) {
        try {
          // Primero intentamos cargar el módulo principal
          await fetchModuleById(moduleId);
          
          // Luego cargamos todos los contenidos relacionados, capturando errores individualmente
          try {
            await fetchArticlesByModuleId(moduleId);
          } catch (error) {
            console.error("Error cargando artículos:", error);
          }
          
          try {
            await fetchGuidesByModuleId(moduleId);
          } catch (error) {
            console.error("Error cargando guías:", error);
          }
          
          try {
            await fetchVideosByModuleId(moduleId);
          } catch (error) {
            console.error("Error cargando videos:", error);
          }
        } catch (error) {
          console.error("Error cargando el módulo:", error);
        } finally {
          setLoadAttempted(true);
        }
      }
    };

    loadModuleData();
  }, [moduleId]);

  // Funciones para abrir modales de creación
  const openCreateArticleModal = () => {
    setSelectedArticleId(null);
    setArticleModalOpen(true);
  };

  const openCreateGuideModal = () => {
    setSelectedGuideId(null);
    setGuideModalOpen(true);
  };

  const openCreateVideoModal = () => {
    setSelectedVideoId(null);
    setVideoModalOpen(true);
  };

  // Funciones para abrir modales de edición
  const openEditArticleModal = (id) => {
    setSelectedArticleId(id);
    setArticleModalOpen(true);
  };

  const openEditGuideModal = (id) => {
    setSelectedGuideId(id);
    setGuideModalOpen(true);
  };

  const openEditVideoModal = (id) => {
    setSelectedVideoId(id);
    setVideoModalOpen(true);
  };

  // Funciones para confirmar eliminación
  const confirmDeleteArticle = (id) => {
    setDeleteType('article');
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  const confirmDeleteGuide = (id) => {
    setDeleteType('guide');
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  const confirmDeleteVideo = (id) => {
    setDeleteType('video');
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  // Función para realizar la eliminación
  const handleDelete = async () => {
    if (!deleteId || !deleteType) return;
    
    setIsDeleting(true);
    try {
      let success = false;
      
      switch (deleteType) {
        case 'article':
          success = await handleDeleteArticle(deleteId);
          if (success) await fetchArticlesByModuleId(moduleId);
          break;
        case 'guide':
          success = await handleDeleteGuide(deleteId);
          if (success) await fetchGuidesByModuleId(moduleId);
          break;
        case 'video':
          success = await handleDeleteVideo(deleteId);
          if (success) await fetchVideosByModuleId(moduleId);
          break;
      }
      
      if (success) {
        setDeleteModalOpen(false);
        setDeleteId(null);
        setDeleteType('');
      }
    } catch (error) {
      console.error(`Error eliminando ${deleteType}:`, error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Función de recarga para actualizar datos después de operaciones CRUD
  const refreshContent = async () => {
    if (moduleId) {
      try {
        await fetchArticlesByModuleId(moduleId);
        await fetchGuidesByModuleId(moduleId);
        await fetchVideosByModuleId(moduleId);
      } catch (error) {
        console.error("Error refrescando contenido:", error);
      }
    }
  };

  // Estado de carga general
  const isLoading = loadingModule && !loadAttempted;

  // Procesamos los tags para asegurarnos de que nunca enviemos algo incorrecto
  const getModuleTags = () => {
    if (!module || !module.tags) return [];
    
    // Si los tags son strings, los usamos directamente
    if (Array.isArray(module.tags) && module.tags.length > 0) {
      if (typeof module.tags[0] === 'string') {
        return module.tags;
      }
      
      // Si son objetos, extraemos la propiedad name
      if (typeof module.tags[0] === 'object' && module.tags[0] !== null) {
        return module.tags;
      }
    }
    
    return [];
  };

  // Mensajes para el modal de eliminación
  const getDeleteModalProps = () => {
    switch (deleteType) {
      case 'article':
        return {
          title: "Eliminar artículo",
          message: "¿Estás seguro de que deseas eliminar este artículo?"
        };
      case 'guide':
        return {
          title: "Eliminar guía",
          message: "¿Estás seguro de que deseas eliminar esta guía?"
        };
      case 'video':
        return {
          title: "Eliminar video",
          message: "¿Estás seguro de que deseas eliminar este video?"
        };
      default:
        return {
          title: "Confirmar eliminación",
          message: "¿Estás seguro de que deseas eliminar este elemento?"
        };
    }
  };

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
                tags={getModuleTags()}
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
        onClose={() => setArticleModalOpen(false)}
        moduleId={Number(moduleId)}
        articleId={selectedArticleId}
        onSuccess={refreshContent}
      />

      {/* Modal de guía */}
      <GuideFormModal 
        isOpen={guideModalOpen}
        onClose={() => setGuideModalOpen(false)}
        moduleId={Number(moduleId)}
        guideId={selectedGuideId}
        onSuccess={refreshContent}
      />

      {/* Modal de video */}
      <VideoFormModal 
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        moduleId={Number(moduleId)}
        videoId={selectedVideoId}
        onSuccess={refreshContent}
      />

      {/* Modal de confirmación de eliminación */}
      <DeleteConfirmationModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        {...getDeleteModalProps()}
      />
    </>
  );
};