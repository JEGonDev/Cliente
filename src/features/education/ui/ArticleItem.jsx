import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/**
 * Componente unificado para mostrar un artículo en diferentes contextos:
 * - Vista de detalle (solo título)
 * - Lista de recomendados (título, autor, fecha)
 * - Modo administrador (estilos o funcionalidades extra)
 *  
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.article - Datos del artículo
 * @param {string|number} props.article.id - Identificador del artículo
 * @param {string} props.article.title - Título del artículo
 * @param {string} [props.article.author] - Autor del artículo (opcional)
 * @param {string} [props.article.date] - Fecha del artículo (opcional)
 * @param {boolean} [props.isAdmin=false] - Activa modo administrador con estilos extras
 */
export const ArticleItem = ({ article, isAdmin = false }) => {
  const { id, title, author, date } = article;
  const hasMeta = author || date;

  // Si tiene autor o fecha, lo renderizamos como tarjeta de recomendado
  if (hasMeta) {
    return (
      <div
        className={`border p-4 rounded-md transition-shadow hover:shadow-md ${
          isAdmin ? 'bg-yellow-50' : 'bg-white'
        }`}
      >
        <Link
          to={`/education/articles/${id}`}
          className="block text-blue-600 font-medium hover:underline mb-2"
        >
          {title}
        </Link>
        <div className="flex items-center justify-between text-sm text-gray-500">
          {author && <span>{author}</span>}
          {date && <span>{date}</span>}
        </div>
      </div>
    );
  }

  // De lo contrario, lo mostramos como enlace simple
  return (
    <Link
      to={`/education/articles/${id}`}
      className={`block text-sm text-blue-600 hover:underline mb-1 ${
        isAdmin ? 'font-bold' : ''
      }`}
    >
      {title || 'Artículo de diseño'}
    </Link>
  );
};

ArticleItem.propTypes = {
  article: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string,
    date: PropTypes.string,
  }).isRequired,
  isAdmin: PropTypes.bool,
};