import PropTypes from 'prop-types';
import { ArrowDownCircle } from 'lucide-react';

/**
 * Componente para mostrar un elemento de guía descargable
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.guide - Datos de la guía
 * @param {number} props.index - Número de paso de la guía
 */
export const GuideItem = ({ guide, index }) => {
  const { title, description, imageUrl } = guide;
  
  return (
    <div className="border-b border-gray-200 py-4 last:border-b-0">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <h3 className="font-medium mb-2">Guía paso {index}</h3>
          <p className="text-sm text-gray-600 mb-2">{description}</p>
          
          <button className="inline-flex items-center text-sm text-green-700 hover:text-green-800 mt-2">
            <ArrowDownCircle className="mr-1 h-4 w-4" />
            Descargar guía
          </button>
        </div>
        
        {imageUrl && (
          <div className="flex-shrink-0">
            <img 
              src={imageUrl}
              alt={`Paso ${index} - ${title}`}
              className="w-24 h-24 object-cover rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Validación de propiedades
GuideItem.propTypes = {
  guide: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string,
    description: PropTypes.string.isRequired,
    imageUrl: PropTypes.string
  }).isRequired,
  index: PropTypes.number.isRequired
};