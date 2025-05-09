// src/features/education/ui/AdminControlPanel.jsx
import PropTypes from 'prop-types';
import { Button } from '../../../ui/components/Button';

export const AdminControlPanel = ({
  onCreateClick,
  onEditClick,
  onDeleteClick
}) => {
  return (
    <div className="flex flex-wrap gap-4 mt-8 justify-center">
      <Button 
        variant="primary"
        size="lg"
        onClick={onCreateClick}
      >
        Crear módulo
      </Button>
      
      <Button 
        variant="primary"
        size="lg"
        onClick={onEditClick}
      >
        Modificar módulo
      </Button>
      
      <Button 
        variant="primary"
        size="lg"
        onClick={onDeleteClick}
      >
        Eliminar módulo
      </Button>
    </div>
  );
};

AdminControlPanel.propTypes = {
  onCreateClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired
};