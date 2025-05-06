import PropTypes from "prop-types";
import { ActionButton } from "../ui/ActionButton";

/**
 * Sección de videos del módulo
 *
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.videos - Lista de videos
 * @param {boolean} props.isAdmin - Si es administrador se muestran botones de acción
 */
export const VideosSection = ({ videos = [], isAdmin = false }) => {
  // Descripción general de los videos
  const description =
    "Explora nuestros videos educativos sobre hidroponía, una técnica innovadora de cultivo sin suelo. Aprende sobre diferentes sistemas de cultivo, el manejo adecuado de nutrientes, el control del ambiente y cómo maximizar el rendimiento de tus cultivos de manera eficiente y sostenible. Ideal para quienes desean iniciarse en la hidroponía o mejorar sus conocimientos en este método de agricultura del futuro.";

  // Datos de los videos (si no hay, se muestran videos demo)
  const demoVideos =
    videos.length > 0
      ? videos
      : [
          {
            id: 1,
            title: "Video tutorial 1",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // URL del video
          },
          {
            id: 2,
            title: "Video tutorial 2",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
          },
          {
            id: 3,
            title: "Video tutorial 3",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
          },
        ];

  return (
    <section className="p-4 bg-white border border-gray-200 rounded-md">
      <p className="text-sm text-gray-700 mb-6">{description}</p>

      {/* Lista de videos */}
      <div className="mb-6">
        {demoVideos.map((video) => (
          <div key={video.id} className="mb-4">
            <video
              src={video.videoUrl}
              controls
              className="w-full max-w-xs h-40 object-cover rounded-md" // Ajuste del tamaño
            />
            <h3 className="mt-2 text-lg font-semibold">{video.title}</h3>
          </div>
        ))}
      </div>

      {/* Botones de acción (solo para administradores) */}
      {isAdmin && (
        <div className="flex flex-wrap gap-4 mt-8 justify-center">
          <ActionButton text="Agregar video" variant="add" />

          <ActionButton text="Eliminar video" variant="delete" />
        </div>
      )}
    </section>
  );
};

VideosSection.propTypes = {
  videos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string,
      videoUrl: PropTypes.string,
    })
  ),
  isAdmin: PropTypes.bool,
};
