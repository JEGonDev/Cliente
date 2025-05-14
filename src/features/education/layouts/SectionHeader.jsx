import PropTypes from 'prop-types';
import { Button } from '../../../ui/components/Button';

/**
 * Componente que muestra el encabezado de sección con acciones de administrador
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título de la sección
 * @param {boolean} props.isAdmin - Si es administrador se muestran acciones adicionales
 * @param {Function} props.onAdd - Función para agregar un nuevo elemento
 */
export const SectionHeader = ({ 
  title, 
  isAdmin = false,
  onAdd = () => {}
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      
      {isAdmin && (
        <Button 
          variant="primary" 
          size="sm" 
          onClick={onAdd}
        >
          Agregar
        </Button>
      )}
    </div>
  );
};

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  isAdmin: PropTypes.bool,
  onAdd: PropTypes.func
};