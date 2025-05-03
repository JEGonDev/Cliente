import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/**
 * Componente para mostrar un artículo en la vista de detalle de módulo
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.article - Datos del artículo
 * @param {boolean} props.isAdmin - Indica si se muestra en modo administrador
 */
export const ArticleItem = ({ article, isAdmin = false  }) => {
  return (
    <Link 
      to={`/education/articles/${article.id}`}
      className="block text-sm text-blue-600 hover:underline mb-1"
    >
      {article.title || "Artículo de diseño"}
    </Link>
  );
};

ArticleItem.propTypes = {
  article: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
  }).isRequired,
  isAdmin: PropTypes.bool,  // Validación para isAdmin, es opcional
};
