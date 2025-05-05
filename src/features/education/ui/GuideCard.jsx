import PropTypes from 'prop-types';

/**
 * Tarjeta para mostrar una guía descargable con imagen
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título de la guía
 * @param {string} props.description - Descripción de la guía
 * @param {string} props.imageUrl - URL de la imagen
 */
export const GuideCard = ({ 
  title = 'Guía paso 1', 
  description = 'Accede a nuestras guías detalladas y fáciles de seguir sobre hidroponía. Estas guías están diseñadas para proporcionarte toda la información que necesitas para comenzar y optimizar tu cultivo hidropónico. Descarga nuestras guías prácticas sobre sistemas de cultivo, control de nutrientes, y mejores prácticas, y lleva tu experiencia de cultivo al siguiente nivel.',
  imageUrl = '/path/to/image.jpg'
}) => {
  return (
    <div className="mb-8 border-b border-gray-200 pb-6">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <div className="flex flex-col gap-4">
        {/* Descripción de la guía */}
        <p className="text-gray-700 text-sm">{description}</p>

        {/* Imagen debajo de la descripción */}
        {imageUrl && (
          <div className="w-50 h-48"> 
            <img 
              src={imageUrl} 
              alt={title}
              className="w-full h-full object-cover rounded" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/128x128?text=Guía';
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
GuideCard.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  imageUrl: PropTypes.string
};