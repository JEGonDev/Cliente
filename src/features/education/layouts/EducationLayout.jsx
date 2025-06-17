import PropTypes from 'prop-types';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchFilterBar } from '../ui/SearchFilterBar';
import { BarIcons } from '../../../ui/components/BarIcons';

export const EducationLayout = ({
  children,
  tags = [],
  activeTags = [],
  onTagClick = () => {},
  isAdmin = false,
  searchValue = '',
  onSearchChange = () => {}
}) => {
  const [activeSection, setActiveSection] = useState("educacion");
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-tr from-gray-50 to-gray-100">
      <div className="flex flex-1">
        {/* Barra lateral izquierda (escritorio) */}
        <aside className="hidden md:flex flex-col items-center py-8 px-2 gap-4
     bg-white/70 backdrop-blur-md shadow-lg
     transition-all duration-300"
>

          <BarIcons
            title="Educacion"
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            animate
          />
        </aside>

        {/* Contenido principal con animación */}
        <main className="flex-1 px-6 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -32 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="h-full"
            >
              <div className="max-w-7xl mx-auto mb-6">
                <div>
                  <h1
                    className="text-4xl font-extrabold tracking-tight font-poppins mb-4"
                    style={{
                      background: 'linear-gradient(135deg, #23582a 0%, #059669 50%, #10b981 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    Contenido Educativo
                  </h1>
                  <p className="text-gray-600 text-lg font-inter mb-4">
                    Descubre y gestiona tu biblioteca de aprendizaje
                  </p>
                </div>

                {/* Búsqueda y filtros */}
                <SearchFilterBar
                  searchValue={searchValue}
                  onSearchChange={onSearchChange}
                  tags={tags}
                  activeTags={activeTags}
                  onTagClick={onTagClick}
                />
              </div>

              {/* Contenido dinámico */}
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Barra inferior móvil (opcional) */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 flex md:hidden
                   bg-white/90 backdrop-blur-md shadow-t
                   border-t border-gray-200 py-2"
      >
        <BarIcons
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
      </nav>
    </div>
  );
};

EducationLayout.propTypes = {
  children: PropTypes.node.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string),
  activeTags: PropTypes.arrayOf(PropTypes.string),
  onTagClick: PropTypes.func,
  isAdmin: PropTypes.bool,
  searchValue: PropTypes.string,
  onSearchChange: PropTypes.func
};
