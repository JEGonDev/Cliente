import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * Custom hook para manejar la lógica del formulario de registro
 * 
 * Este hook encapsula:
 * - Estados del formulario (datos del usuario)
 * - Estado de UI (errores)
 * - Validaciones básicas
 * - Handlers para cambios en inputs y envío de formulario
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
  };

  /**
   * Valida el formulario antes de enviarlo
   * @returns {boolean} true si es válido, false si no
   */
  const validateForm = () => {
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
      
      // Si todo sale bien, redirigimos al usuario a la pestania de comunidad
      navigate('/community');
    } catch (err) {
      console.error('Error en el registro:', err);

      // Extraemos el mensaje de error de diferentes posibles ubicaciones
      const backendMessage =
        typeof err?.response?.data === 'string'
          ? err.response.data
          : err?.response?.data?.message ||
            err?.response?.data?.error ||
            err?.message ||
            'Error en el registro';

      setError(backendMessage);
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