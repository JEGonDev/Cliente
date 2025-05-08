import { ArrowLeft } from 'lucide-react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button } from '../../../ui/components/Button'; // Importamos nuestro nuevo componente Button

/**
 * Layout para formularios de creación/edición de módulos
 * 
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido del formulario
 * @param {string} props.title - Título del formulario
 * @param {string} props.submitText - Texto del botón de envío
 * @param {Function} props.onSubmit - Función para manejar envío
 * @param {Function} props.onCancel - Función para manejar cancelación
 */
export const ModuleFormLayout = ({ 
  children, 
  title, 
  submitText = 'Guardar', 
  onSubmit,
  onCancel
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Link to="/education" className="flex items-center text-primary hover:underline mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" />
        <span>Volver a módulos</span>
      </Link>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-textFont mb-6">{title}</h1>
        
        <form onSubmit={onSubmit}>
          {children}
          
          <div className="mt-8 flex justify-end gap-4">
            <Button
              variant="white"
              onClick={onCancel}
              type="button"
            >
              Cancelar
            </Button>
            
            <Button
              variant="primary"
              type="submit"
            >
              {submitText}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

ModuleFormLayout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  submitText: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};