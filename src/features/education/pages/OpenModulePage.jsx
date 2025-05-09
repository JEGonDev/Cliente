import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ModuleDetailLayout } from '../layouts/ModuleDetailLayout';
import { ArticlesLayout } from '../layouts/ArticlesLayout';
import { GuidesLayout } from '../layouts/GuidesLayout';
import { VideosLayout } from '../layouts/VideosLayout';
import { Header } from '../../../ui/layouts/Header';
import { SidebarLayout } from '../layouts/SidebarLayout ';
import { AuthContext } from '../../authentication/context/AuthContext';
import { Button } from '../../../ui/components/Button';
import { ModuleHeader } from '../ui/ModuleHeader';
import { AdminActions } from '../ui/AdminActions';

export const OpenModulePage = () => {
  // Obtener información de autenticación y roles
  const { isAdmin } = useContext(AuthContext);
  const { moduleId } = useParams();

  // Datos del módulo (simulados para maquetación)
  const moduleData = {
    id: 1,
    title: 'Introducción al módulo',
    description: 'Lorem ipsum dolor sit et for Figma, created to help designers design the landing page quickly without having to spend much time. It is crafted with a vision to support and web project and thereby creating a block system that helps with all the use cases.',
    tags: ['Principiantes', 'PrimerosPasos', 'General'],
    articles: [
      {
        id: 1,
        title: 'Artículo básico para principiantes',
        author: 'María García',
        date: '10/04/2023'
      },
    ],
    guides: [
      {
        id: 1,
        title: 'Guía paso 1',
        description: 'Ya tuve problemas con acumulación de sales en las raíces. Recomiendo revisar los niveles cada dos semanas y monitorear la conductividad eléctrica (EC) para evitar sobre-fertilización.',
        imageUrl: '/api/placeholder/100/100'
      },
    ],
    videos: [
      {
        id: 1,
        title: 'Introducción a la hidroponía',
        thumbnailUrl: '/api/placeholder/300/200',
        duration: '5:34'
      },
    ]
  };

  // Funciones de administración
  const handleAddArticle = () => {
    console.log('Añadir artículo');
  };

  const handleDeleteArticle = () => {
    console.log('Eliminar artículo');
  };

  const handleEditArticle = () => {
    console.log('Editar artículo');
  };

  const handleAddGuide = () => {
    console.log('Añadir guía');
  };

  const handleDeleteGuide = () => {
    console.log('Eliminar guía');
  };

  const handleEditGuide = () => {
    console.log('Editar guía');
  };

  const handleAddVideo = () => {
    console.log('Añadir video');
  };

  const handleDeleteVideo = () => {
    console.log('Eliminar video');
  };

  const handleEditVideo = () => {
    console.log('Editar video');
  };

  return (
    <>
      <Header />
      <div className="flex">
        <SidebarLayout activeIcon="settings" onIconClick={(id) => console.log(id)} />

        <ModuleDetailLayout>
          <ModuleHeader 
            videoCount={moduleData.videos.length}
            articleCount={moduleData.articles.length}
            guideCount={moduleData.guides.length}
          />

          {/* Sección de artículos con controles de administrador */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Artículos que podrían interesarte</h2>
              {isAdmin && (
                <AdminActions
                  onAddClick={handleAddArticle}
                  onDeleteClick={handleDeleteArticle}
                  onEditClick={handleEditArticle}
                  resourceType="artículo"
                />
              )}
            </div>
            <ArticlesLayout articles={moduleData.articles} />
          </div>

          {/* Sección de guías con controles de administrador */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Guías descargables</h2>
              {isAdmin && (
                <AdminActions
                  onAddClick={handleAddGuide}
                  onDeleteClick={handleDeleteGuide}
                  onEditClick={handleEditGuide}
                  resourceType="guía"
                />
              )}
            </div>
            <GuidesLayout guides={moduleData.guides} />
          </div>

          {/* Sección de videos con controles de administrador */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Videos</h2>
              {isAdmin && (
                <AdminActions
                  onAddClick={handleAddVideo}
                  onDeleteClick={handleDeleteVideo}
                  onEditClick={handleEditVideo}
                  resourceType="video"
                />
              )}
            </div>
            <VideosLayout videos={moduleData.videos} />
          </div>
        </ModuleDetailLayout>
      </div>
    </>
  );
};