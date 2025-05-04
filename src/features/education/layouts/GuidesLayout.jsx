import PropTypes from 'prop-types';
import { GuideItem } from './../ui/GuideItem';

/**
 * Sección que muestra guías descargables
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.guides - Lista de guías a mostrar
 */
export const GuidesLayout = ({ guides = [] }) => {
  // Si no hay guías, mostrar una sección vacía
  if (guides.length === 0) {
    return null;
  }
  
  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold mb-4">Guías descargables</h2>
      
      <div className="bg-white border border-gray-200 rounded-lg">
        {guides.map((guide, index) => (
          <GuideItem 
            key={guide.id} 
            guide={guide} 
            index={index + 1} 
          />
        ))}
      </div>
    </section>
  );
};

// Validación de propiedades
GuidesSection.propTypes = {
  guides: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string,
      description: PropTypes.string.isRequired,
      imageUrl: PropTypes.string
    })
  )
};