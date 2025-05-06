import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileContext } from '../context/ProfileContext';

/**
 * Custom hook para manejar la lógica del formulario de perfil
 * 
 * Este hook encapsula:
 * - Estados del formulario
 * - Validaciones básicas
 * - Handlers para cambios en inputs y envío de formulario
 * 
 * @returns {Object} Propiedades y métodos para el formulario de perfil
 */
export const useProfileForm = () => {
  // Obtenemos el contexto de perfil
  const { profile, loading, error, updateUserProfile } = useContext(ProfileContext);
  
  // Estado para almacenar todos los campos del formulario
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    bio: '',
    location: '',
    profileImage: ''
  });
  
  // Estado para errores específicos del formulario
  const [formErrors, setFormErrors] = useState({});
  
  // Estado para mensajes de éxito
  const [successMessage, setSuccessMessage] = useState('');
  
  // Hook para manejar la navegación
  const navigate = useNavigate();
  
  // Efecto para cargar los datos del perfil en el formulario cuando estén disponibles
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        username: profile.username || '',
        email: profile.email || '',
        bio: profile.bio || '',
        location: profile.location || '',
        profileImage: profile.profileImage || ''
      });
    }
  }, [profile]);
  
  /**
   * Maneja los cambios en los inputs del formulario
   * @param {Event} e - Evento de cambio del input
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  /**
   * Valida el formulario antes de enviarlo
   * @returns {boolean} true si es válido, false si no
   */
  const validateForm = () => {
    const errors = {};
    
    // Validaciones básicas
    if (!formData.firstName.trim()) {
      errors.firstName = 'El nombre es obligatorio';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'El apellido es obligatorio';
    }
    
    if (!formData.username.trim()) {
      errors.username = 'El nombre de usuario es obligatorio';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'El email no es válido';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  /**
   * Maneja el envío del formulario
   * @param {Event} e - Evento de envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Limpiamos mensajes previos
    setSuccessMessage('');
    
    // Validamos el formulario
    if (!validateForm()) return;
    
    try {
      // Actualizamos el perfil
      const result = await updateUserProfile(formData);
      
      if (result) {
        setSuccessMessage('Perfil actualizado correctamente');
        
        // Redirección opcional después de actualizar
        // setTimeout(() => {
        //   navigate('/profile');
        // }, 2000);
      }
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
      
      // Si hay errores específicos del backend, los agregamos a formErrors
      if (err.response?.data?.errors) {
        const backendErrors = {};
        err.response.data.errors.forEach(error => {
          // Asumiendo que el backend envía errores en formato {field: string, message: string}
          backendErrors[error.field] = error.message;
        });
        setFormErrors({...formErrors, ...backendErrors});
      }
    }
  };
  
  /**
   * Resetea el formulario a los valores originales del perfil
   */
  const resetForm = () => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        username: profile.username || '',
        email: profile.email || '',
        bio: profile.bio || '',
        location: profile.location || '',
        profileImage: profile.profileImage || ''
      });
    }
    
    setFormErrors({});
    setSuccessMessage('');
  };
  
  // Retornamos todos los estados y funciones que necesita el componente
  return {
    formData,
    formErrors,
    loading,
    error,
    successMessage,
    handleChange,
    handleSubmit,
    resetForm
  };
};