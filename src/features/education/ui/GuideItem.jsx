import { Link } from 'react-router-dom';

/**
 * Componente para mostrar una guía en la vista de detalle de módulo
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.guide - Datos de la guía
 * @param {number} props.index - Índice/número de la guía
 * @param {boolean} props.isAdmin - Indica si se muestra en modo administrador
 */
export const GuideItem = ({ guide, index, isAdmin = false }) => {
  return (
    <div className="border-b border-gray-200 py-4">
      <h3 className="font-medium mb-2">Guía paso {index}</h3>
      <p className="text-sm text-gray-600 mb-2">{guide.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum in nunc luctus, sodales justo vel, tincidunt mauris."}</p>
      
      {guide.image && (
        <img 
          src={guide.image} 
          alt={`Paso ${index}`}
          className="w-24 h-24 object-cover rounded-lg"
        />
      )}
      
      {isAdmin && (
        <div className="mt-2 flex gap-2">
          <button className="text-sm text-blue-600 hover:underline">Editar</button>
          <button className="text-sm text-red-600 hover:underline">Eliminar</button>
        </div>
      )}
    </div>
  );
};
