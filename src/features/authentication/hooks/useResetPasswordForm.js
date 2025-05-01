import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';

/**
 * Custom hook para manejar la lógica del formulario de reinicio de contraseña
 * 
 * @returns {Object} Propiedades y métodos para el formulario
 */
export const useResetPasswordForm = () => {
  // Obtener el token de los parámetros de búsqueda en la URL
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tokenFromUrl = queryParams.get('token');
  
  // Estado para los campos del formulario
  const [form, setForm] = useState({
    token: tokenFromUrl || '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Estado para manejar mensajes de éxito
  const [success, setSuccess] = useState('');
  
  // Estado para manejar mensajes de error
  const [error, setError] = useState('');
  
  // Hook para manejar la navegación
  const navigate = useNavigate();

  /**
   * Maneja los cambios en los inputs del formulario
   * @param {Event} e - Evento de cambio del input
   */
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /**
   * Valida el formulario antes de enviarlo
   * @returns {boolean} true si es válido, false si no
   */
  const validateForm = () => {
    // Verificar que se proporcionó un token
    if (!form.token) {
      setError('Token de recuperación no válido');
      return false;
    }
    
    // Verificar que las contraseñas coincidan
    if (form.newPassword !== form.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    
    // Verificar que la contraseña tenga una longitud mínima
    if (form.newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    
    return true;
  };

  /**
   * Maneja el envío del formulario
   * @param {Event} e - Evento de envío del formulario
   */
  const handleSubmit = async e => {
    e.preventDefault();
    
    // Validar formulario
    if (!validateForm()) return;
    
    try {
      // Preparar datos para la petición
      const resetData = {
        token: form.token,
        newPassword: form.newPassword
      };
      
      // Llamada al servicio
      const response = await authService.resetPassword(resetData);
      
      // Mostrar mensaje de éxito
      setSuccess('Tu contraseña ha sido actualizada correctamente');
      
      // Limpiar errores
      setError('');
      
      // Redirigir al login después de unos segundos
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      // Mostrar error
      setError(err.response?.data?.message || 'No pudimos reiniciar tu contraseña. Por favor, intenta nuevamente.');
    }
  };

  // Retornamos todos los estados y funciones que necesita el componente
  return {
    form,
    success,
    error,
    handleChange,
    handleSubmit
  };
};