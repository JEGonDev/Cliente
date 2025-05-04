import PropTypes from 'prop-types';
import { Book, Video, FileText } from 'lucide-react';

/**
 * Componente que muestra un encabezado con título, etiquetas, descripción y estadísticas del módulo
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título del módulo
 * @param {string} props.description - Descripción del módulo
 * @param {Array} props.tags - Etiquetas del módulo
 * @param {number} props.videoCount - Número de videos
 * @param {number} props.articleCount - Número de artículos
 * @param {number} props.guideCount - Número de guías
 */
export const ModuleContentStats = ({
  title = 'Introducción al módulo',
  description = 'Bienvenido a Germogli, tu espacio educativo para descubrir el fascinante mundo de la hidroponía. En este módulo introductorio aprenderás cómo cultivar plantas sin necesidad de suelo, utilizando soluciones nutritivas y sistemas sostenibles que puedes implementar tanto en casa como a mayor escala. Exploraremos juntos los conceptos clave como el control del pH, la oxigenación del agua, los tipos de sistemas hidropónicos y los beneficios ambientales de esta técnica. A través de videos, artículos y guías, te acompañaremos paso a paso para que adquieras los conocimientos necesarios y puedas iniciar tu propio huerto hidropónico con confianza y entusiasmo.',
  tags = ['Principiantes', 'PrimerosPasos', 'General'],
  videoCount = 0,
  articleCount = 0,
  guideCount = 0
}) => {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>

      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, idx) => (
          <span 
            key={idx} 
            className="text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>

      <p className="text-gray-700 mb-6">{description}</p>

      <div className="flex flex-wrap gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Video className="h-4 w-4 text-green-700" />
          <span>{videoCount} Videos</span>
        </div>

        <div className="flex items-center gap-1">
          <FileText className="h-4 w-4 text-blue-600" />
          <span>{articleCount} Artículos</span>
        </div>

        <div className="flex items-center gap-1">
          <Book className="h-4 w-4 text-orange-500" />
          <span>{guideCount} Guías</span>
        </div>
      </div>
    </div>
  );
};

ModuleContentStats.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  videoCount: PropTypes.number,
  articleCount: PropTypes.number,
  guideCount: PropTypes.number
};
