import PropTypes from 'prop-types';
import { Button } from '../../../ui/components/Button';

export const AdminActions = ({ 
  onAddClick,
  onDeleteClick,
  onEditClick,
  resourceType = 'recurso'
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <Button 
        variant="primary"
        size="sm"
        onClick={onAddClick}
      >
        Agregar {resourceType}
      </Button>
      <Button 
        variant="danger"
        size="sm"
        onClick={onDeleteClick}
      >
        Eliminar {resourceType}
      </Button>
      <Button 
        variant="outline"
        size="sm"
        onClick={onEditClick}
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