import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

/**
 * Custom hook para manejar la lógica del formulario de recuperación de contraseña
 * 
 * @returns {Object} Propiedades y métodos para el formulario
 */
export const useForgotPasswordForm = () => {
  // Estado para el email
  const [email, setEmail] = useState('');
  
  // Estado para manejar mensajes de éxito
  const [success, setSuccess] = useState('');
  
  // Estado para manejar mensajes de error
  const [error, setError] = useState('');
  
  // Hook para manejar la navegación
  const navigate = useNavigate();

  /**
   * Maneja los cambios en el input del email
   * @param {Event} e - Evento de cambio del input
   */
  const handleChange = e => {
    setEmail(e.target.value);
  };

  /**
   * Maneja el envío del formulario
   * @param {Event} e - Evento de envío del formulario
   */
  const handleSubmit = async e => {
    e.preventDefault();
    
    try {
      // Validación básica
      if (!email) {
        setError('Por favor, introduce tu dirección de email');
        return;
      }
      
      // Llamada al servicio
      const response = await authService.forgotPassword(email);
      
      // Mostrar mensaje de éxito
      setSuccess(response.message || 'Se ha enviado un email de recuperación. Por favor, revisa tu bandeja de entrada.');
      
      // Limpiar errores y formulario
      setError('');
      
    } catch (err) {
      // Mostrar error
      setError(err.response?.data?.message || 'No pudimos procesar tu solicitud. Por favor, intenta nuevamente.');
    }
  };

  // Retornamos todos los estados y funciones que necesita el componente
  return {
    email,
    success,
    error,
    handleChange,
    handleSubmit
  };
};