import PropTypes from 'prop-types';
import { Button } from '../../../ui/components/Button';
import { motion } from 'framer-motion';

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
  const motionProps = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    whileHover: { y: -4, boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)' },
    whileTap: { scale: 0.95 },
    transition: { type: 'spring', stiffness: 200, damping: 15 }
  };

  return (
    <div className="flex flex-wrap gap-4 mt-8 justify-center">
      <motion.div {...motionProps}>
        <Button 
          variant="primary"
          size="lg"
          onClick={onCreateClick}
        >
          Crear módulo
        </Button>
      </motion.div>

      <motion.div {...motionProps}>
        <Button 
          variant="primary"
          size="lg"
          onClick={onEditClick}
        >
          Modificar módulo
        </Button>
      </motion.div>

      <motion.div {...motionProps}>
        <Button 
          variant="primary"
          size="lg"
          onClick={onDeleteClick}
        >
          Eliminar módulo
        </Button>
      </motion.div>
    </div>
  );
};

AdminControlPanel.propTypes = {
  onCreateClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired
};
