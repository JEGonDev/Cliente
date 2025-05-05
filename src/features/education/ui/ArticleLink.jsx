import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/**
 * Enlace a un artículo relacionado
 * 
 * @param {Object} props - Propiedades del componente  
 * @param {string} props.id - Identificador del artículo
 * @param {string} props.text - Texto del enlace
 * @param {string} props.url - URL del artículo (opcional)
 */
export const ArticleLink = ({ 
  text, 
  url = '#' 
}) => {
    return (
        <Link 
          to={url} 
          className="inline-block mr-3 mb-2 text-sm text-gray-700 hover:text-green-900 hover:underline font-bold"
        >
          {text}
        </Link>
      );
    };

ArticleLink.propTypes = {
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  url: PropTypes.string
};