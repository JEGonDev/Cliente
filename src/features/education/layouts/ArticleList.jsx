import PropTypes from 'prop-types';
import { PencilIcon, TrashIcon, LinkIcon } from '@heroicons/react/24/outline';

/**
 * Componente para mostrar una lista de artículos educativos
 * Incluye opciones de administración si el usuario es administrador
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.articles - Lista de artículos a mostrar
 * @param {boolean} props.isAdmin - Si es administrador se muestran acciones adicionales
 * @param {Function} props.onEdit - Función para editar un artículo
 * @param {Function} props.onDelete - Función para eliminar un artículo
 */
export const ArticlesList = ({
  articles = [],
  isAdmin = false,
  onEdit = () => {},
  onDelete = () => {}
}) => {
  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {articles.map(article => (
        <div 
          key={article.articleId || article.id} 
          className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
        >
          <div className="bg-gradient-to-r from-primary to-green-700 h-4"></div>
          <div className="p-4">
            <h3 className="font-medium text-gray-800 mb-2">{article.title}</h3>
            
            <div className="flex items-center justify-between">
              <a 
                href={article.articleUrl || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary text-sm hover:underline"
              >
                <LinkIcon className="w-4 h-4 mr-1" />
                Ver artículo
              </a>
              
              {isAdmin && (
                <div className="flex space-x-2">
                  <button 
                    onClick={() => onEdit(article.articleId || article.id)}
                    className="text-gray-500 hover:text-primary transition-colors"
                    title="Editar artículo"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onDelete(article.articleId || article.id)}
                    className="text-gray-500 hover:text-red-500 transition-colors"
                    title="Eliminar artículo"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

ArticlesList.propTypes = {
  articles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      articleId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      title: PropTypes.string.isRequired,
      articleUrl: PropTypes.string
    })
  ),
  isAdmin: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func
};