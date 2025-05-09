import PropTypes from 'prop-types';
import { Button } from '../../../ui/components/Button';

export const DeleteModeNotice = ({
  onCancel,
  onConfirm,
  hasSelected = false
}) => {
  return (
    <div>
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
        <p className="text-yellow-700">
          Seleccione los módulos que desea eliminar y oprima el botón "Eliminar seleccionados".
        </p>
      </div>
      
      <div className="flex flex-wrap gap-4 mt-8 justify-center">
        <Button 
          variant="white"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        
        <Button 
          variant="danger"
          onClick={onConfirm}
          disabled={!hasSelected}
        >
          Eliminar seleccionados
        </Button>
      </div>
    </div>
  );
};

DeleteModeNotice.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  hasSelected: PropTypes.bool
};