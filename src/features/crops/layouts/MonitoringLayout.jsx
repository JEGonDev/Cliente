import PropTypes from 'prop-types';
// import { Header } from '../../../ui/layouts/Header';
import { MonitoringSidebar } from './MonitoringSidebar';

/**
 * Layout principal para las páginas del módulo de monitoreo
 * Integra el header principal y la barra lateral de navegación
 * 
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido principal de la página
 * @param {string} props.activeSection - Sección activa en la barra lateral
 */
export const MonitoringLayout = ({ 
  children,
  activeSection = 'monitoreo'
}) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* <Header /> */}
      
      <div className="flex flex-1">
        {/* Barra lateral de navegación */}
        <MonitoringSidebar activeSection={activeSection} />
        
        {/* Contenido principal */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

MonitoringLayout.propTypes = {
  children: PropTypes.node.isRequired,
  activeSection: PropTypes.string}