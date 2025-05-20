import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * Custom hook para manejar la lógica del formulario de registro
 * con manejo mejorado de errores específicos del backend
 * 
 * @returns {Object} Propiedades y métodos para el formulario de registro
 */
export const useRegisterForm = () => {
  // Estado para almacenar todos los campos del formulario
  const [form, setForm] = useState({
    name: '',
    lastName: '',
    userName: '',
    email: '',
    password: '',
    confirmPass: ''
  });
  
  // Estado para manejar mensajes de error
  const [error, setError] = useState('');
  
  // Obtenemos la función register del contexto de autenticación
  const { register } = useContext(AuthContext);
  
  // Hook para manejar la navegación
  const navigate = useNavigate();

  /**
   * Maneja los cambios en los inputs del formulario
   * @param {Event} e - Evento de cambio del input
   */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Limpiar error cuando el usuario comienza a escribir de nuevo
    if (error) setError('');
  };

  /**
   * Valida el formulario antes de enviarlo
   * @returns {boolean} true si es válido, false si no
   */
  const validateForm = () => {
    // Verificar campos obligatorios
    if (!form.name.trim()) {
      setError('El nombre es obligatorio');
      return false;
    }
    
    if (!form.lastName.trim()) {
      setError('El apellido es obligatorio');
      return false;
    }
    
    if (!form.userName.trim()) {
      setError('El nombre de usuario es obligatorio');
      return false;
    }
    
    if (!form.email.trim()) {
      setError('El email es obligatorio');
      return false;
    }
    
    // Validación básica de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError('Por favor, introduce un email válido');
      return false;
    }
    
    // Validación de contraseña
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    
    // Verificamos que las contraseñas coincidan
    if (form.password !== form.confirmPass) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    
    return true;
  };

  /**
   * Maneja el envío del formulario
   * @param {Event} e - Evento de envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validamos el formulario antes de enviar
    if (!validateForm()) return;

    try {
      // Preparamos los datos según la estructura que espera el backend
      const userData = {
        firstName: form.name,
        lastName: form.lastName,
        username: form.userName,
        email: form.email,
        password: form.password
      };
      
      // Intentamos registrar al usuario
      await register(userData);
      
      // Si todo sale bien, redirigimos al usuario a la pestaña de comunidad
      navigate('/comunity');
    } catch (err) {
      console.error('Error en el registro:', err);
      
      // Registrar la respuesta completa para depuración
      console.log('Respuesta de error completa:', err.response?.data);

      // Estrategia mejorada para detectar errores específicos
      if (err.response) {
        const responseData = err.response.data;
        const errorMessage = 
          typeof responseData === 'string' 
            ? responseData 
            : responseData?.message || responseData?.error || JSON.stringify(responseData);
        
        // Detectar errores comunes por contenido del mensaje
        const errorLower = (errorMessage || '').toLowerCase();
        
        if (errorLower.includes('usuario') && errorLower.includes('existe') || 
            errorLower.includes('username') && errorLower.includes('exist') ||
            errorLower.includes('nombre de usuario') && errorLower.includes('registrado')) {
          setError('Este nombre de usuario ya está registrado');
        } 
        else if (errorLower.includes('email') && errorLower.includes('existe') || 
                errorLower.includes('email') && errorLower.includes('exist') ||
                errorLower.includes('correo') && errorLower.includes('registrado')) {
          setError('Este correo electrónico ya está registrado');
        }
        else if (errorLower.includes('constraint') && errorLower.includes('username')) {
          setError('Este nombre de usuario ya está registrado');
        }
        else if (errorLower.includes('constraint') && errorLower.includes('email')) {
          setError('Este correo electrónico ya está registrado');
        }
        else if (errorLower.includes('duplicate') || errorLower.includes('duplicado')) {
          // Si menciona duplicado pero no especifica qué campo
          if (errorLower.includes('username') || errorLower.includes('usuario')) {
            setError('Este nombre de usuario ya está registrado');
          } else if (errorLower.includes('email') || errorLower.includes('correo')) {
            setError('Este correo electrónico ya está registrado');
          } else {
            setError('Usuario o correo electrónico ya registrado');
          }
        }
        else {
          // Si no podemos identificar el tipo específico de error
          setError(errorMessage || 'No se pudo completar el registro');
        }
      } else if (err.request) {
        // La petición fue hecha pero no se recibió respuesta
        setError('No pudimos conectar con el servidor. Verifica tu conexión a internet');
      } else {
        // Error en configuración de la petición
        setError(err.message || 'Error en el registro');
      }
    }
  };

  // Retornamos todos los estados y funciones que necesita el componente
  return {
    form,
    error,
    handleChange,
    handleSubmit
  };
};