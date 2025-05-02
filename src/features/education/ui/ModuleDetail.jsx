import { useState } from 'react';
import { ContentCounter } from './components/ContentCounter';
import { ArticleItem } from './components/ArticleItem';
import { GuideItem } from './components/GuideItem';
import { VideoItem } from './components/VideoItem';

/**
 * Componente para mostrar el detalle de un módulo educativo
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.module - Datos del módulo a mostrar
 * @param {boolean} props.isAdmin - Indica si se muestra en modo administrador
 */
export const ModuleDetail = ({ module = {}, isAdmin = false }) => {
  // Datos de ejemplo para mostrar en la maquetación
  // En implementación real, esto vendría de props o de un custom hook
  const [moduleData] = useState({
    title: module.title || 'Introducción al módulo',
    description: module.description || 'Lorem ipsum dolor sit et for Figma, created to help designers design the landing page quickly without having to spend much time. It is crafted with a vision to support any web project and thereby creating a block system that helps with all the use cases. The kit contains 170+ blocks and 500+ components. It\'s fully customizable, well-organized layers, text, color and effect styles.',
    articles: module.articles || [
      { id: 1, title: 'article design 1' },
      { id: 2, title: 'article design 2' },
      { id: 3, title: 'article design 3' },
      { id: 4, title: 'article design 4' },
      { id: 5, title: 'article design 5' },
      { id: 6, title: 'article design 6' },
    ],
    guides: module.guides || [
      { id: 1, description: 'Lorem ipsum dolor sit et for Figma, created to help designers design the landing page quickly without having to spend much time.', image: '/api/placeholder/150/150' },
      { id: 2, description: 'Lorem ipsum dolor sit et for Figma, created to help designers design the landing page quickly without having to spend much time.', image: '/api/placeholder/150/150' },
      { id: 3, description: 'Lorem ipsum dolor sit et for Figma, created to help designers design the landing page quickly without having to spend much time.', image: '/api/placeholder/150/150' },
    ],
    videos: module.videos || [
      { id: 1, title: 'Configuración inicial del sistema NFT', thumbnail: '/api/placeholder/400/300' },
      { id: 2, title: 'Mantenimiento del cultivo hidropónico', thumbnail: '/api/placeholder/400/300' },
      { id: 3, title: 'Control de plagas en hidroponía', thumbnail: '/api/placeholder/400/300' },
    ]
  });

  return (
    <div className="bg-white p-6 rounded-md shadow">
      {/* Título y descripción */}
      <h1 className="text-2xl font-bold mb-4">{moduleData.title}</h1>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {module.tags && module.tags.map((tag, idx) => (
          <span key={idx} className="text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
            #{tag}
          </span>
        ))}
      </div>
      
      <p className="text-gray-700 mb-6">{moduleData.description}</p>
      
      <ContentCounter 
        videos={moduleData.videos.length} 
        articles={moduleData.articles.length} 
        guides={moduleData.guides.length} 
      />
      
      {/* Artículos relacionados */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Artículos que podrían interesarte</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {moduleData.articles.map((article) => (
            <ArticleItem 
              key={article.id} 
              article={article} 
              isAdmin={isAdmin} 
            />
          ))}
        </div>
      </div>
      
      {/* Guías descargables */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Guías descargables</h2>
        <div className="space-y-4">
          {moduleData.guides.map((guide, index) => (
            <GuideItem 
              key={guide.id} 
              guide={guide} 
              index={index + 1}
              isAdmin={isAdmin} 
            />
          ))}
        </div>
        
        {isAdmin && (
          <button className="mt-4 bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition-colors">
            Agregar guía
          </button>
        )}
      </div>
      
      {/* Videos */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Videos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {moduleData.videos.map((video) => (
            <VideoItem 
              key={video.id} 
              video={video} 
              isAdmin={isAdmin} 
            />
          ))}
        </div>
        
        {isAdmin && (
          <button className="mt-4 bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition-colors">
            Agregar video
          </button>
        )}
      </div>
    </div>
  );
};