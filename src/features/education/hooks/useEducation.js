import { useContext } from 'react';
import { EducationContext } from '../context/EducationContext';

/**
 * Hook personalizado para acceder al contexto de educación
 * Proporciona acceso a toda la funcionalidad relacionada con educación:
 * - Estados de módulos, artículos, guías, videos y tags
 * - Funciones CRUD para cada entidad
 * - Estados de carga y errores
 * 
 * @returns {Object} Contexto completo de educación
 */
export const useEducation = () => {
  const context = useContext(EducationContext);
  
  if (!context) {
    throw new Error(
      'useEducation debe ser utilizado dentro de un EducationProvider'
    );
  }
  
  return context;
};