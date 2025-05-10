import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ModuleDetailLayout } from '../layouts/ModuleDetailLayout';
import { ArticlesLayout } from '../layouts/ArticlesLayout';
import { GuidesLayout } from '../layouts/GuidesLayout';
import { VideosLayout } from '../layouts/VideosLayout';
import { Header } from '../../../ui/layouts/Header';
import { SidebarLayout } from '../layouts/SidebarLayout ';
import { AuthContext } from '../../authentication/context/AuthContext';
import { ModuleHeader } from '../ui/ModuleHeader';
import { AdminActions } from '../ui/AdminActions';
import { useModules } from '../hooks/useModules';
import { useArticles } from '../hooks/useArticles';
import { useGuides } from '../hooks/useGuides';
import { useVideos } from '../hooks/useVideos';

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
    handleCreateArticle,
    handleUpdateArticle,
    handleDeleteArticle 
  } = useArticles();
  
  const { 
    guides, 
    loading: loadingGuides, 
    error: guideError,
    fetchGuidesByModuleId,
    handleCreateGuide,
    handleUpdateGuide,
    handleDeleteGuide 
  } = useGuides();
  
  const { 
    videos, 
    loading: loadingVideos, 
    error: videoError,
    fetchVideosByModuleId,
    handleCreateVideo,
    handleUpdateVideo,
    handleDeleteVideo 
  } = useVideos();

  // Estado para la sección que se está editando (si hay)
  const [editingSection, setEditingSection] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // Cargar datos al iniciar
  useEffect(() => {
    if (moduleId) {
      fetchModuleById(moduleId);
      fetchArticlesByModuleId(moduleId);
      fetchGuidesByModuleId(moduleId);
      fetchVideosByModuleId(moduleId);
    }
  }, [moduleId]);

  // Manejadores para artículos
  const handleAddArticle = () => {
    setEditingSection('article');
    setEditingId(null);
    // Aquí podrías navegar a un formulario o mostrar un modal
    console.log('Añadir artículo');
  };

  const handleEditArticle = (articleId) => {
    setEditingSection('article');
    setEditingId(articleId);
    console.log('Editar artículo', articleId);
  };

  // Manejadores para guías
  const handleAddGuide = () => {
    setEditingSection('guide');
    setEditingId(null);
    console.log('Añadir guía');
  };

  const handleEditGuide = (guideId) => {
    setEditingSection('guide');
    setEditingId(guideId);
    console.log('Editar guía', guideId);
  };

  // Manejadores para videos
  const handleAddVideo = () => {
    setEditingSection('video');
    setEditingId(null);
    console.log('Añadir video');
  };

  const handleEditVideo = (videoId) => {
    setEditingSection('video');
    setEditingId(videoId);
    console.log('Editar video', videoId);
  };
  
  // Estado de carga general
  const isLoading = loadingModule || loadingArticles || loadingGuides || loadingVideos;
  const hasError = moduleError || articleError || guideError || videoError;

  return (
    <>
      <Header />
      <div className="flex">
        <SidebarLayout activeIcon="settings" onIconClick={(id) => console.log(id)} />

        <ModuleDetailLayout>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">Cargando contenido educativo...</p>
            </div>
          ) : hasError ? (
            <div className="bg-red-100 text-red-800 p-4 rounded">
              <p>Ha ocurrido un error al cargar el contenido.</p>
              {moduleError && <p>{moduleError}</p>}
            </div>
          ) : !module ? (
            <div className="bg-yellow-100 text-yellow-800 p-4 rounded">
              <p>No se encontró el módulo solicitado.</p>
            </div>
          ) : (
            <>
              <ModuleHeader 
                videoCount={videos?.length || 0}
                articleCount={articles?.length || 0}
                guideCount={guides?.length || 0}
                title={module.title}
                description={module.description}
                tags={module.tags || []}
              />

              {/* Sección de artículos con controles de administrador */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Artículos que podrían interesarte</h2>
                  {isAdmin && (
                    <AdminActions
                      onAddClick={handleAddArticle}
                      onDeleteClick={() => handleDeleteArticle(editingId)}
                      onEditClick={() => handleEditArticle(editingId)}
                      resourceType="artículo"
                    />
                  )}
                </div>
                <ArticlesLayout articles={articles || []} />
              </div>

              {/* Sección de guías con controles de administrador */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Guías descargables</h2>
                  {isAdmin && (
                    <AdminActions
                      onAddClick={handleAddGuide}
                      onDeleteClick={() => handleDeleteGuide(editingId)}
                      onEditClick={() => handleEditGuide(editingId)}
                      resourceType="guía"
                    />
                  )}
                </div>
                <GuidesLayout guides={guides || []} />
              </div>

              {/* Sección de videos con controles de administrador */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Videos</h2>
                  {isAdmin && (
                    <AdminActions
                      onAddClick={handleAddVideo}
                      onDeleteClick={() => handleDeleteVideo(editingId)}
                      onEditClick={() => handleEditVideo(editingId)}
                      resourceType="video"
                    />
                  )}
                </div>
                <VideosLayout videos={videos || []} />
              </div>
            </>
          )}
        </ModuleDetailLayout>
      </div>
    </>
  );
};