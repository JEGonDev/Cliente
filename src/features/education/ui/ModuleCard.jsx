import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { educationService } from '../services/educationService';
import { VideoIcon, BookOpenIcon, FileTextIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

/**
 * @param {Object} props
 * @param {number|string} props.id
 * @param {string} props.title
 * @param {Array} props.tags
 * @param {boolean} props.isAdmin
 * @param {boolean} props.isSelectable
 * @param {boolean} props.isSelected
 * @param {Function} props.onSelect
 * @param {string} [props.className]
 */
export const ModuleCard = ({
  id,
  title,
  tags = [],
  isAdmin = false,
  isSelectable = false,
  isSelected = false,
  onSelect = () => { },
  className = '',
}) => {
  const [counters, setCounters] = useState({ videos: 0, articles: 0, guides: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCounters = async () => {
      try {
        const [articles, guides, videos] = await Promise.all([
          educationService.getArticlesByModuleId(id).catch(() => ({ data: [] })),
          educationService.getGuidesByModuleId(id).catch(() => ({ data: [] })),
          educationService.getVideosByModuleId(id).catch(() => ({ data: [] })),
        ]);
        setCounters({
          videos: Array.isArray(videos.data) ? videos.data.length : 0,
          articles: Array.isArray(articles.data) ? articles.data.length : 0,
          guides: Array.isArray(guides.data) ? guides.data.length : 0,
        });
      } catch (error) {
        console.error(`Error obteniendo contadores módulo ${id}:`, error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      fetchCounters();
    }
  }, [id]);

  // Clases base de la tarjeta
  const baseClasses = clsx(
    'flex flex-col rounded-xl shadow-lg bg-white overflow-hidden',
    'hover:shadow-2xl transition-all duration-300',
    'border border-gray-100',
    {
      'bg-green-50 border-green-100': isAdmin,
      'ring-2 ring-[#23582a] ring-offset-2': isSelected,
    },
    className, // aquí recibimos "h-full" desde el padre
  );

  // Contenido de la tarjeta
  const content = (
    <div className="flex flex-col h-full">
      {/* Título con degradado y altura fija */}
      <div className="relative h-20 overflow-hidden rounded-t-xl">
        {/* Capa de degradado que cubre todo el encabezado */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#23582a] to-[#3a8741]" />

        {/* Título del módulo con texto blanco, fuente personalizada y límite de 2 líneas */}
        <h3 className="relative font-Poppins font-bold px-4 pt-3 text-white text-lg line-clamp-2">
          {title}
        </h3>
      </div>

      {/* Contenido principal: p-4, flex-col, con spacer */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Etiquetas con diseño mejorado */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tags.map((tag, idx) => (
            <span
              key={tag.id ?? idx}
              className="text-xs bg-gray-50 text-gray-700 px-2.5 py-1 rounded-full
                         border border-gray-100 hover:bg-gray-100 transition-colors"
            >
              #{typeof tag === 'object' ? tag.name : tag}
            </span>
          ))}
        </div>

        {/* Spacer para empujar los contadores al final */}
        <div className="flex-grow" />

        {/* Contadores con diseño mejorado */}
        <div className="text-sm text-gray-600 flex justify-start mt-4 pt-3 border-t border-gray-100">
          {isLoading ? (
            <span className="text-gray-400">Cargando...</span>
          ) : (
            <div className="flex items-center gap-x-2">
              <div className="flex items-center gap-x-1 group">
                <VideoIcon className="w-4 h-4 text-[#23582a] group-hover:scale-110 transition-transform" />
                <span className="font-medium">{counters.videos}</span>
              </div>
              <div className="flex items-center gap-x-1 group">
                <BookOpenIcon className="w-4 h-4 text-[#23582a] group-hover:scale-110 transition-transform" />
                <span className="font-medium">{counters.articles}</span>
              </div>
              <div className="flex items-center gap-x-1 group">
                <FileTextIcon className="w-4 h-4 text-[#23582a] group-hover:scale-110 transition-transform" />
                <span className="font-medium">{counters.guides}</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );

  // Animaciones con Framer Motion
  const MotionWrapper = motion.div;
  const motionProps = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    whileHover: { y: -5 },
    transition: {
      duration: 0.4,
      ease: "easeOut"
    },
  };

  if (isSelectable) {
    return (
      <MotionWrapper
        {...motionProps}
        onClick={() => onSelect(id)}
        className={baseClasses + ' cursor-pointer'}
        aria-label={`Seleccionar módulo ${title}`}
      >
        {content}
      </MotionWrapper>
    );
  }

  return (
    // El Link ocupa toda la altura de la celda (debe venir className="h-full" desde ModulesList)
    <Link to={`/education/module/${id}`} className="block h-full">
      <MotionWrapper {...motionProps} className={baseClasses}>
        {content}
      </MotionWrapper>
    </Link>
  );
};
