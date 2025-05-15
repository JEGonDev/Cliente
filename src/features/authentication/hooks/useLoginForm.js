import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * Custom hook para manejar la lógica del formulario de login
 * 
 * Este hook encapsula:
 * - Estados del formulario (credenciales)
 * - Estado de UI (mostrar/ocultar contraseña, errores)
 * - Handlers para cambios en inputs y envío de formulario
 * 
 * @returns {Object} Propiedades y métodos para el formulario de login
 */
export const useLoginForm = () => {
  // Estado para controlar la visibilidad de la contraseña
  const [showPassword, setShowPassword] = useState(false);
  
  // Estado para manejar mensajes de error
  const [error, setError] = useState('');
  
  // Estado para almacenar los datos del formulario
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  
  // Obtenemos la función login del contexto de autenticación
  const { login } = useContext(AuthContext);
  
  // Hook para manejar la navegación
  const navigate = useNavigate();

  /**
   * Maneja los cambios en los inputs del formulario
   * @param {Event} e - Evento de cambio del input
   */
  const handleChange = e => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  /**
   * Maneja el envío del formulario
   * @param {Event} e - Evento de envío del formulario
   */
  const handleSubmit = async e => {
    e.preventDefault();
    
    try {
      // Intentamos hacer login con las credenciales proporcionadas
      await login(credentials);
      
      // Si todo sale bien, redirigimos al usuario a la pestania de comunidad
      navigate('/comunity');
    } catch (err) {
      // En caso de error, mostramos el mensaje
      setError(err.response?.data?.message || 'Credenciales inválidas');
    }
  };

  // Retornamos todos los estados y funciones que necesita el componente
  return {
    credentials,
    showPassword,
    error,
    setShowPassword,
    handleChange,
    handleSubmit
  };
};