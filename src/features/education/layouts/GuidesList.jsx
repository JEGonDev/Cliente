import PropTypes from 'prop-types';
import { PencilIcon, TrashIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';

/**
 * Componente para mostrar una lista de guías educativas descargables
 * Incluye opciones de administración si el usuario es administrador
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.guides - Lista de guías a mostrar
 * @param {boolean} props.isAdmin - Si es administrador se muestran acciones adicionales
 * @param {Function} props.onEdit - Función para editar una guía
 * @param {Function} props.onDelete - Función para eliminar una guía
 */
export const GuidesList = ({
  guides = [],
  isAdmin = false,
  onEdit = () => {},
  onDelete = () => {}
}) => {
  if (!guides || guides.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {guides.map((guide, index) => (
        <div 
          key={guide.guideId || guide.id}
          className={`p-4 flex flex-col sm:flex-row gap-4 ${
            index < guides.length - 1 ? 'border-b border-gray-200' : ''
          }`}
        >
          <div className="flex-grow">
            <div className="flex justify-between">
              <h3 className="font-medium text-gray-800 mb-2">{guide.title}</h3>
              
              {isAdmin && (
                <div className="flex space-x-2">
                  <button 
                    onClick={() => onEdit(guide.guideId || guide.id)}
                    className="text-gray-500 hover:text-primary transition-colors"
                    title="Editar guía"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onDelete(guide.guideId || guide.id)}
                    className="text-gray-500 hover:text-red-500 transition-colors"
                    title="Eliminar guía"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            
            {guide.description && (
              <p className="text-gray-600 text-sm mb-3">{guide.description}</p>
            )}
            
            <a 
              href={guide.pdfUrl || '#'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary text-sm hover:underline"
            >
              <DocumentArrowDownIcon className="w-4 h-4 mr-1" />
              Descargar guía
            </a>
          </div>
          
          {guide.imageUrl && (
            <div className="flex-shrink-0">
              <img 
                src={guide.imageUrl}
                alt={guide.title}
                className="w-24 h-24 object-cover rounded-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/100x100?text=Guía';
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

GuidesList.propTypes = {
  guides: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      guideId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      pdfUrl: PropTypes.string,
      imageUrl: PropTypes.string
    })
  ),
  isAdmin: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func
};