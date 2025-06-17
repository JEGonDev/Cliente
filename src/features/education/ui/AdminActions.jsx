import PropTypes from 'prop-types';
import { Button } from '../../../ui/components/Button';

/**
 * Componente de acciones administrativas
 * 
 * Muestra tres botones para agregar, eliminar y editar un recurso.
 * El texto del recurso se puede personalizar a través de la prop `resourceType`.
 * 
 * @param {Object} props
 * @param {Function} props.onAddClick - Función que se ejecuta al hacer clic en "Agregar"
 * @param {Function} props.onDeleteClick - Función que se ejecuta al hacer clic en "Eliminar"
 * @param {Function} props.onEditClick - Función que se ejecuta al hacer clic en "Editar"
 * @param {string} [props.resourceType='recurso'] - Texto del tipo de recurso que se está administrando
 */
export const AdminActions = ({ 
  onAddClick,
  onDeleteClick,
  onEditClick,
  resourceType = 'recurso'
}) => {
  const dynamicButtonClass = "transition-transform duration-200 ease-in-out hover:-translate-y-0.5 active:scale-95";

  return (
    <div className="flex justify-between items-center gap-2 mb-4">
      <Button 
        variant="primary" 
        size="sm" 
        onClick={onAddClick}
        className={dynamicButtonClass}
      >
        Agregar {resourceType}
      </Button>
      
      <Button 
        variant="danger" 
        size="sm" 
        onClick={onDeleteClick}
        className={dynamicButtonClass}
      >
        Eliminar {resourceType}
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onEditClick}
        className={dynamicButtonClass}
      >
        Editar {resourceType}
      </Button>
    </div>
  );
};

AdminActions.propTypes = {
  onAddClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  resourceType: PropTypes.string
};
