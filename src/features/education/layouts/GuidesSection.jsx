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
  const description = "Landify is a landing page UI kit for Figma, created to help designers design the landing page quickly without having to spend much time. It is crafted with a vision to support any web project and thereby creating a block system that helps with all the use cases. The kit contains 170+ blocks and 50D+ components. It's fully customizable, well-organized layers, text, color and effect styles.";
  
  // Datos quemados directamente si no hay guías
  const demoGuides = guides.length > 0 ? guides : [
    { 
      id: 1, 
      title: 'Guía paso 1', 
      description: 'Landify is a landing page UI kit for Figma, created to help designers design the landing page quickly without having to spend much time. It is crafted with a vision to support any web project and thereby creating a block system that helps with all the use cases. The kit contains 170+ blocks and 50D+ components. It\'s fully customizable, well-organized layers, text, color and effect styles.',
      imageUrl: 'https://redagricola.com/wp-content/uploads/2023/05/dsc_0022-scaled.jpg'
    },
    { 
      id: 2, 
      title: 'Guía paso 2', 
      description: 'Landify is a landing page UI kit for Figma, created to help designers design the landing page quickly without having to spend much time. It is crafted with a vision to support any web project and thereby creating a block system that helps with all the use cases. The kit contains 170+ blocks and 50D+ components. It\'s fully customizable, well-organized layers, text, color and effect styles.',
      imageUrl: 'https://media.istockphoto.com/id/626603008/es/foto/verduras-hidrop%C3%B3nica.jpg?s=612x612&w=0&k=20&c=G_pmg0FcRHsTPL6etJN4xs7LnD-72YmfJq2eyDtc4Gs='
    },
    { 
      id: 3, 
      title: 'Guía paso 3', 
      description: 'Landify is a landing page UI kit for Figma, created to help designers design the landing page quickly without having to spend much time. It is crafted with a vision to support any web project and thereby creating a block system that helps with all the use cases. The kit contains 170+ blocks and 50D+ components. It\'s fully customizable, well-organized layers, text, color and effect styles.',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_u7M8OrUQLVIKJVDHthoDmunaBrJQFZtfRfI-NEBJbdOemzsDIfZM0f9KioskZwXHGbs&usqp=CAU'
    }
  ];

  return (
    <section>
      <p className="text-sm text-gray-700 mb-6">
        {description}
      </p>
      
      {/* Lista de guías */}
      <div>
        {demoGuides.map((guide) => (
          <div key={guide.id} className="mb-6">
            {/* Título y descripción arriba */}
            <GuideCard 
              title={guide.title}
              description={guide.description}
              imageUrl={guide.imageUrl}
            />
          </div>
        ))}
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