import { useState, useEffect } from 'react';

import { ModuleDetailLayout } from '../layouts/ModuleDetailLayout';
import { ModuleContentStats } from '../ui/ModuleContentStats';
import { ArticlesLayout } from '../layouts/ArticlesLayout';
import { GuidesLayout } from '../layouts/GuidesLayout';
import { VideosLayout } from '../layouts/VideosLayout';
import { Header } from '../../../ui/layouts/Header';
import { SidebarLayout } from '../layouts/SidebarLayout ';



/**
 * Página que muestra el detalle completo de un módulo educativo
 * Versión simplificada sin navegación lateral ni header
 */
export const ModuleDetailPage = () => {
  // Datos de ejemplo para maquetación
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
      { 
        id: 2, 
        title: 'Cómo elegir el mejor sistema hidropónico', 
        author: 'Juan Pérez', 
        date: '15/03/2023' 
      },
      { 
        id: 3, 
        title: 'Nutrientes esenciales para tus cultivos', 
        author: 'Ana Martínez', 
        date: '22/02/2023' 
      }
    ],
    guides: [
      {
        id: 1,
        title: 'Guía paso 1',
        description: 'Ya tuve problemas con acumulación de sales en las raíces. Recomiendo revisar los niveles cada dos semanas y monitorear la conductividad eléctrica (EC) para evitar sobre-fertilización.',
        imageUrl: '/api/placeholder/100/100'
      },
      {
        id: 2,
        title: 'Guía paso 2',
        description: 'Ya tuve problemas con acumulación de sales en las raíces. Recomiendo revisar los niveles cada dos semanas y monitorear la conductividad eléctrica (EC) para evitar sobre-fertilización.',
        imageUrl: '/api/placeholder/100/100'
      },
      {
        id: 3,
        title: 'Guía paso 3',
        description: 'Ya tuve problemas con acumulación de sales en las raíces. Recomiendo revisar los niveles cada dos semanas y monitorear la conductividad eléctrica (EC) para evitar sobre-fertilización.',
        imageUrl: '/api/placeholder/100/100'
      }
    ],
    videos: [
      {
        id: 1,
        title: 'Introducción a la hidroponía',
        thumbnailUrl: '/api/placeholder/300/200',
        duration: '5:34'
      },
      {
        id: 2,
        title: 'Montaje de tu primer sistema',
        thumbnailUrl: '/api/placeholder/300/200',
        duration: '8:23'
      },
      {
        id: 3,
        title: 'Cómo preparar nutrientes',
        thumbnailUrl: '/api/placeholder/300/200',
        duration: '6:15'
      }
    ]
  };
  
  return (
    <>
      <Header />
      <div className="flex">

        {/* Aquí agregamos el SidebarLayout con un manejo del icono activo */}
        <SidebarLayout activeIcon="settings" onIconClick={(id) => console.log(id)} />

        <ModuleDetailLayout>
          {/* Encabezado del módulo */}

          {/* Estadísticas de contenido */}
          <ModuleContentStats
            videoCount={moduleData.videos.length}
            articleCount={moduleData.articles.length}
            guideCount={moduleData.guides.length}
          />

          {/* Secciones de contenido */}
          <ArticlesLayout articles={moduleData.articles} />
          <GuidesLayout guides={moduleData.guides} />
          <VideosLayout videos={moduleData.videos} />
        </ModuleDetailLayout>
      </div>
    </>
  );
}