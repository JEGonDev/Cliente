import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileContext } from '../context/ProfileContext';

/**
 * Custom hook para manejar la lógica de eliminación de cuenta
 * 
 * @returns {Object} Propiedades y métodos para eliminar cuenta
 */
export const useDeleteAccount = () => {
  // Obtenemos el contexto de perfil
  const { loading, error, deleteUserAccount } = useContext(ProfileContext);
  
  // Estado para confirmación de eliminación
  const [confirmText, setConfirmText] = useState('');
  const [confirmError, setConfirmError] = useState('');
  
  // Hook para manejar la navegación
  const navigate = useNavigate();
  
  /**
   * Maneja los cambios en el input de confirmación
   * @param {Event} e - Evento de cambio del input
   */
  const handleConfirmChange = (e) => {
    setConfirmText(e.target.value);
    setConfirmError('');
  };
  
  /**
   * Maneja el proceso de eliminación de cuenta
   * @param {string} confirmationPhrase - Frase que el usuario debe escribir para confirmar
   * @returns {Promise<boolean>} true si la cuenta fue eliminada, false si no
   */
  const handleDeleteAccount = async (confirmationPhrase = 'ELIMINAR') => {
    // Verificar que el usuario haya escrito la frase de confirmación
    if (confirmText !== confirmationPhrase) {
      setConfirmError(`Por favor escribe "${confirmationPhrase}" para confirmar`);
      return false;
    }
    
    try {
      // Intentar eliminar la cuenta
      const result = await deleteUserAccount();
      
      if (result) {
        // Si se eliminó correctamente, redirigir al home
        navigate('/');
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error al eliminar cuenta:', err);
      return false;
    }
  };
  
  // Retornamos todos los estados y funciones que necesita el componente
  return {
    confirmText,
    confirmError,
    loading,
    error,
    handleConfirmChange,
    handleDeleteAccount
  };
};