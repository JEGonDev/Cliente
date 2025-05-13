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
  console.log("Renderizando OpenModulePage");
  
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

  // Estado para controlar si se ha intentado cargar los datos
  const [loadAttempted, setLoadAttempted] = useState(false);

  // Cargar datos al iniciar
  useEffect(() => {
    console.log("Ejecutando useEffect en OpenModulePage");
    
    const loadModuleData = async () => {
      console.log("Cargando datos del módulo", moduleId);
      
      if (moduleId) {
        try {
          // Primero intentamos cargar el módulo principal
          const moduleData = await fetchModuleById(moduleId);
          console.log("Módulo cargado:", moduleData);
          
          // Luego cargamos todos los contenidos relacionados, capturando errores individualmente
          try {
            const articlesData = await fetchArticlesByModuleId(moduleId);
            console.log("Artículos cargados:", articlesData);
          } catch (error) {
            console.error("Error cargando artículos:", error);
          }
          
          try {
            const guidesData = await fetchGuidesByModuleId(moduleId);
            console.log("Guías cargadas:", guidesData);
          } catch (error) {
            console.error("Error cargando guías:", error);
          }
          
          try {
            const videosData = await fetchVideosByModuleId(moduleId);
            console.log("Videos cargados:", videosData);
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

  console.log("Module data:", module);
  console.log("Articles:", articles);
  console.log("Guides:", guides);
  console.log("Videos:", videos);

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
          ) : moduleError ? (
            <div className="bg-red-100 text-red-800 p-4 rounded">
              <p>Ha ocurrido un error al cargar el módulo.</p>
              <p className="text-sm">{moduleError}</p>
            </div>
          ) : !module ? (
            <div className="bg-yellow-100 text-yellow-800 p-4 rounded">
              <p>No se encontró el módulo solicitado.</p>
            </div>
          ) : (
            <>
              {/* Siempre mostramos el encabezado del módulo si existe */}
              <ModuleHeader 
                videoCount={videos?.length || 0}
                articleCount={articles?.length || 0}
                guideCount={guides?.length || 0}
                title={module.title || ''}
                description={module.description || ''}
                tags={getModuleTags()}
              />

              {/* Sección de artículos - Se muestra incluso si hay error, solo verificamos si está cargando */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Artículos</h2>
                  {isAdmin && (
                    <AdminActions
                      onAddClick={handleAddArticle}
                      onDeleteClick={() => handleDeleteArticle(editingId)}
                      onEditClick={() => handleEditArticle(editingId)}
                      resourceType="artículo"
                    />
                  )}
                </div>
                
                {loadingArticles ? (
                  <p className="text-gray-500">Cargando artículos...</p>
                ) : articleError ? (
                  <div className="bg-orange-50 text-orange-800 p-3 rounded mb-4">
                    <p className="text-sm">No se pudieron cargar los artículos. Intente más tarde.</p>
                  </div>
                ) : (
                  <ArticlesLayout 
                    articles={articles || []} 
                    isAdmin={isAdmin} 
                    onAddArticle={handleAddArticle}
                    onEditArticle={handleEditArticle}
                    onDeleteArticle={() => handleDeleteArticle(editingId)}
                  />
                )}
              </div>

              {/* Sección de guías */}
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
                
                {loadingGuides ? (
                  <p className="text-gray-500">Cargando guías...</p>
                ) : guideError ? (
                  <div className="bg-orange-50 text-orange-800 p-3 rounded mb-4">
                    <p className="text-sm">No se pudieron cargar las guías. Intente más tarde.</p>
                  </div>
                ) : (
                  <GuidesLayout 
                    guides={guides || []} 
                    isAdmin={isAdmin}
                    onAddGuide={handleAddGuide}
                    onEditGuide={handleEditGuide}
                    onDeleteGuide={() => handleDeleteGuide(editingId)}
                  />
                )}
              </div>

              {/* Sección de videos */}
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
                
                {loadingVideos ? (
                  <p className="text-gray-500">Cargando videos...</p>
                ) : videoError ? (
                  <div className="bg-orange-50 text-orange-800 p-3 rounded mb-4">
                    <p className="text-sm">No se pudieron cargar los videos. Intente más tarde.</p>
                  </div>
                ) : (
                  <VideosLayout 
                    videos={videos || []} 
                    isAdmin={isAdmin}
                    onAddVideo={handleAddVideo}
                    onEditVideo={handleEditVideo}
                    onDeleteVideo={() => handleDeleteVideo(editingId)}
                  />
                )}
              </div>
            </>
          )}
        </ModuleDetailLayout>
      </div>
    </>
  );
};