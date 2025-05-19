import { useState, useEffect } from 'react';
import { Button } from '../../../ui/components/Button';

/**
 * Formulario para crear o actualizar una etiqueta
 * 
 * Controla su propio estado y validaciones básicas.
 * 
 * @param {Object} props
 * @param {{id: string|number|null, name: string}} props.initialData - Valores iniciales del formulario
 * @param {Function} props.onSubmit - Callback con los datos validados al enviar
 * @param {boolean} props.isSubmitting - Indicador de envío en curso
 */
export const TagForm = ({ 
  initialData = { id: null, name: '' }, 
  onSubmit, 
  isSubmitting 
}) => {
  const [formData, setFormData] = useState({ ...initialData });
  const [errors, setErrors] = useState({});
  
  // Actualizar solo al montar o cuando cambia initialData.id
  useEffect(() => {
    setFormData({ ...initialData });
  }, [initialData.id]);
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre de la etiqueta es obligatorio';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formData);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre de la etiqueta
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-primary`}
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-500">{errors.name}</p>
        )}
      </div>
      
      <div className="flex justify-end gap-2">
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Guardando...' : (initialData.id ? 'Actualizar' : 'Crear')}
        </Button>
      </div>
    </form>
  );
};