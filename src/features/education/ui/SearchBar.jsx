
import PropTypes from 'prop-types';
import { Search } from 'lucide-react';

/**
 * Componente que representa una barra de búsqueda.
 * Permite buscar contenido educativo.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.value - Valor actual del input
 * @param {Function} props.onChange - Función que se ejecuta al cambiar el valor
 * @param {string} props.placeholder - Texto de placeholder
 */
export const SearchBar = ({ 
  value = '', 
  onChange = () => {}, 
  placeholder = 'Buscar' 
}) => {
  return (
    <div className="relative w-full">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-full px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
      />
      <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
    </div>
  );
};

// Validación de propiedades
SearchBar.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string
};