import PropTypes from 'prop-types';
import { Button } from '../../../ui/components/Button';

/**
 * Panel de control administrativo para módulos educativos
 * 
 * Este componente muestra tres botones para crear, modificar o eliminar un módulo.
 * 
 * @param {Object} props
 * @param {Function} props.onCreateClick - Función que se ejecuta al hacer clic en "Crear módulo"
 * @param {Function} props.onEditClick - Función que se ejecuta al hacer clic en "Modificar módulo"
 * @param {Function} props.onDeleteClick - Función que se ejecuta al hacer clic en "Eliminar módulo"
 */
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