import { ArrowLeft } from 'lucide-react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button } from '../../../ui/components/Button';

/**
 * Layout para formularios de creación/edición de módulos
 */
export const ModuleFormLayout = ({
  children,
  title,
  submitText = 'Guardar',
  onSubmit,
  onCancel
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-5 lg:px-6 py-8 text-sm font-inter">

      {/* Volver atrás */}
      <Link
        to="/education"
        className="inline-flex items-center text-[#23582a] hover:text-[#1b4721] transition-colors duration-200 mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        <span className="font-medium text-sm">Volver a módulos</span>
      </Link>

      {/* Contenedor principal */}
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">

        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#eaf3ec] to-white border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-[#23582a] font-poppins">
            {title}
          </h1>
        </div>

        {/* Formulario */}
        <form onSubmit={onSubmit} className="px-6 py-4">
          <div className="space-y-5 text-gray-700 font-inter">{children}</div>

          {/* Acciones */}
          <div className="mt-8 flex justify-end gap-3">
            <Button
              variant="white"
              onClick={onCancel}
              type="button"
              className="transform transition-transform duration-200 hover:-translate-y-0.5"
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="transform transition-transform duration-200 hover:-translate-y-0.5"
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
  onCancel: PropTypes.func.isRequired
};
