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
 * - Manejo detallado de errores para mejor feedback al usuario
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
    // Limpiar error cuando el usuario comienza a escribir de nuevo
    if (error) setError('');
  };

  /**
   * Maneja el envío del formulario
   * @param {Event} e - Evento de envío del formulario
   */
  const handleSubmit = async e => {
    e.preventDefault();
    
    // Validación básica antes de enviar
    if (!credentials.username.trim()) {
      setError('Por favor ingresa tu nombre de usuario');
      return;
    }
    
    if (!credentials.password) {
      setError('Por favor ingresa tu contraseña');
      return;
    }
    
    try {
      // Intentamos hacer login con las credenciales proporcionadas
      await login(credentials);
      
      // Si todo sale bien, redirigimos al usuario a la pestania de comunidad
      navigate('/comunity');
    } catch (err) {
      console.error('Error en login:', err);
      
      // Manejar tipos específicos de errores
      if (err.response) {
        // El servidor respondió con un código de error
        const statusCode = err.response.status;
        
        if (statusCode === 401) {
          setError('Usuario o contraseña incorrectos');
        } else if (statusCode === 404) {
          setError('El usuario no existe');
        } else if (statusCode === 403) {
          setError('Tu cuenta está bloqueada. Contacta con soporte');
        } else {
          // Obtener mensaje del servidor si está disponible
          setError(err.response.data?.message || 'Error al iniciar sesión');
        }
      } else if (err.request) {
        // La petición fue hecha pero no se recibió respuesta
        setError('No pudimos conectar con el servidor. Verifica tu conexión a internet');
      } else {
        // Error en configuración de la petición
        setError('Ocurrió un error inesperado. Inténtalo de nuevo más tarde');
      }
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