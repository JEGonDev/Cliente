/**
 * Layout base para la sección educativa
 * Proporciona una estructura común para todas las páginas del módulo
 * Layout responsivo que se adapta a todos los tamaños de pantalla
 * 
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido de la página
 * @param {string} props.title - Título de la página
 * @param {React.ReactNode} props.actions - Acciones adicionales (botones, controles)
 */
export const EducationLayout = ({ children, title, actions }) => {
    return (
      <div className="max-w-full sm:max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h1>
          {actions && (
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {actions}
            </div>
          )}
        </div>
        
        <div>
          {children}
        </div>
      </div>
    );
  };
  