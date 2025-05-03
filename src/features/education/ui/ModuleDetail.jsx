import PropTypes from 'prop-types';
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
  const {
    title = 'Introducción al módulo',
    description = 'Lorem ipsum dolor sit et for Figma, created to help designers design the landing page quickly...',
    tags = [],
    articles = [],
    guides = [],
    videos = [],
  } = module;

  return (
    <div className="bg-white p-6 rounded-md shadow">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>

      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, idx) => (
          <span key={idx} className="text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
            #{tag}
          </span>
        ))}
      </div>

      <p className="text-gray-700 mb-6">{description}</p>

      <ContentCounter 
        videos={videos.length} 
        articles={articles.length} 
        guides={guides.length} 
      />

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Artículos que podrían interesarte</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {articles.map((article) => (
            <ArticleItem 
              key={article.id} 
              article={article} 
              isAdmin={isAdmin} 
            />
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Guías descargables</h2>
        <div className="space-y-4">
          {guides.map((guide, index) => (
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

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Videos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => (
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

ModuleDetail.propTypes = {
  module: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    articles: PropTypes.arrayOf(PropTypes.object),
    guides: PropTypes.arrayOf(PropTypes.object),
    videos: PropTypes.arrayOf(PropTypes.object),
  }),
  isAdmin: PropTypes.bool,
};
