import PropTypes from 'prop-types';
import { ActionButton } from '../ui/ActionButton';
import { GuideCard } from '../ui/GuideCard';

/**
 * Sección de guías descargables
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.guides - Lista de guías
 * @param {boolean} props.isAdmin - Si es administrador se muestran botones de acción
 */
export const GuidesSection = ({
  guides = [],
  isAdmin = false
}) => {
  // Descripción general de las guías
  const description = "Explora nuestras guías sobre hidroponía y cultivos sostenibles.";
  
  return (
    <section>
      <p className="text-sm text-gray-700 mb-6">
        {description}
      </p>
      
      {/* Lista de guías */}
      <div>
        {guides.length > 0 ? (
          guides.map((guide) => (
            <div key={guide.id} className="mb-6">
              <GuideCard 
                title={guide.title}
                description={guide.description}
                imageUrl={guide.imageUrl}
              />
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">No hay guías disponibles.</p>
        )}
      </div>
      
      {/* Botones de acción (solo para administradores) */}
      {isAdmin && (
        <div className="flex flex-wrap gap-4 mt-6 mb-6 justify-center">
          <ActionButton 
            text="Agregar guía" 
            variant="add" 
          />
          
          <ActionButton 
            text="Eliminar guía" 
            variant="delete" 
          />
        </div>
      )}
    </section>
  );
};

GuidesSection.propTypes = {
  guides: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      imageUrl: PropTypes.string
    })
  ),
  isAdmin: PropTypes.bool
};