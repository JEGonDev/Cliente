import { useState, useContext } from 'react';
import { CommunityContext } from '../context/CommunityContext';
import { AuthContext } from '../../authentication/context/AuthContext';

/**
 * Hook personalizado para manejar la lógica de grupos
 * 
 * Este hook encapsula:
 * - Estados del formulario de creación y actualización de grupos
 * - Estado de la UI (errores, carga)
 * - Handlers para interacción con grupos (crear, actualizar, eliminar, unirse)
 * 
 * @returns {Object} Propiedades y métodos para trabajar con grupos
 */
export const useGroup = () => {
  // Contexto de comunidad
  const { 
    groups,
    group,
    posts,
    loadingGroups,
    groupError,
    fetchAllGroups,
    fetchGroupById,
    createGroup: contextCreateGroup,
    updateGroup: contextUpdateGroup,
    deleteGroup: contextDeleteGroup,
    joinGroup: contextJoinGroup,
    canCreateGroup,
    canEditGroup,
    canDeleteGroup
  } = useContext(CommunityContext);
  
  // Contexto de autenticación
  const { user, isAdmin, isModerator } = useContext(AuthContext);
  
  // Estados locales para el formulario
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  
  // Estado para errores del formulario
  const [formErrors, setFormErrors] = useState({});
  
  // Estado para mostrar mensaje de éxito
  const [successMessage, setSuccessMessage] = useState('');
  
  // Estado para rastrear grupos a los que el usuario se ha unido
  const [joinedGroups, setJoinedGroups] = useState([]);
  
  /**
   * Valida el formulario antes de enviarlo
   * @returns {boolean} true si es válido, false si no
   */
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'El nombre del grupo es obligatorio';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  /**
   * Maneja los cambios en los inputs del formulario
   * @param {Event} e - Evento de cambio del input
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  /**
   * Limpia el formulario después de una operación
   */
  const resetForm = () => {
    setFormData({
      name: '',
      description: ''
    });
    setFormErrors({});
  };
  
  /**
   * Maneja el envío del formulario para crear un grupo
   * @param {Event} e - Evento de envío del formulario
   */
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    
    // Verificar permisos
    if (!canCreateGroup()) {
      setFormErrors({
        permission: 'No tienes permisos para crear grupos. Se requiere ser administrador o moderador.'
      });
      return null;
    }
    
    // Reset mensajes
    setSuccessMessage('');
    
    // Validar formulario
    if (!validateForm()) return null;
    
    try {
      const newGroup = await contextCreateGroup(formData);
      if (newGroup) {
        setSuccessMessage('Grupo creado correctamente');
        resetForm();
        return newGroup;
      }
      return null;
    } catch (error) {
      console.error('Error al crear grupo:', error);
      setFormErrors({ general: error.message || 'Error al crear el grupo' });
      return null;
    }
  };
  
  /**
   * Carga los datos de un grupo para editarlo
   * @param {number} id - ID del grupo a editar
   */
  const loadGroupForEdit = async (id) => {
    try {
      const groupData = await fetchGroupById(id);
      if (groupData) {
        // Verificar permisos
        if (!canEditGroup()) {
          setFormErrors({
            permission: 'No tienes permisos para editar grupos. Se requiere ser administrador o moderador.'
          });
          return null;
        }
        
        setFormData({
          name: groupData.name || '',
          description: groupData.description || ''
        });
        
        return groupData;
      }
      return null;
    } catch (error) {
      console.error(`Error al cargar grupo ${id} para editar:`, error);
      setFormErrors({ general: error.message || `Error al cargar el grupo ${id}` });
      return null;
    }
  };
  
  /**
   * Maneja el envío del formulario para actualizar un grupo
   * @param {number} id - ID del grupo a actualizar
   * @param {Event} e - Evento de envío del formulario
   */
  const handleUpdateGroup = async (id, e) => {
    e.preventDefault();
    
    // Verificar permisos
    if (!canEditGroup()) {
      setFormErrors({
        permission: 'No tienes permisos para editar grupos. Se requiere ser administrador o moderador.'
      });
      return null;
    }
    
    // Reset mensajes
    setSuccessMessage('');
    
    // Validar formulario
    if (!validateForm()) return null;
    
    try {
      const updatedGroup = await contextUpdateGroup(id, formData);
      if (updatedGroup) {
        setSuccessMessage('Grupo actualizado correctamente');
        return updatedGroup;
      }
      return null;
    } catch (error) {
      console.error(`Error al actualizar grupo ${id}:`, error);
      setFormErrors({ general: error.message || `Error al actualizar el grupo ${id}` });
      return null;
    }
  };
  
  /**
   * Maneja la eliminación de un grupo
   * @param {number} id - ID del grupo a eliminar
   */
  const handleDeleteGroup = async (id) => {
    // Verificar permisos
    if (!canDeleteGroup()) {
      setFormErrors({
        permission: 'No tienes permisos para eliminar grupos. Se requiere ser administrador.'
      });
      return false;
    }
    
    if (window.confirm('¿Estás seguro de que deseas eliminar este grupo?')) {
      try {
        const success = await contextDeleteGroup(id);
        if (success) {
          setSuccessMessage('Grupo eliminado correctamente');
          return true;
        }
        return false;
      } catch (error) {
        console.error(`Error al eliminar grupo ${id}:`, error);
        setFormErrors({ general: error.message || `Error al eliminar el grupo ${id}` });
        return false;
      }
    }
    return false;
  };
  
  /**
   * Maneja la acción de unirse/abandonar un grupo
   * @param {number} groupId - ID del grupo
   */
  const handleToggleJoinGroup = async (groupId) => {
    try {
      // Verificar si el usuario ya está unido al grupo
      const isJoined = joinedGroups.includes(groupId);
      
      if (isJoined) {
        // Lógica para abandonar el grupo 
        // (Nota: Se asume que el backend tiene un endpoint para esto)
        // await communityService.leaveGroup(groupId);
        
        // Actualizar estado local
        setJoinedGroups(prevGroups => prevGroups.filter(id => id !== groupId));
        setSuccessMessage('Has abandonado el grupo correctamente');
      } else {
        // Unirse al grupo
        await contextJoinGroup(groupId);
        
        // Actualizar estado local
        setJoinedGroups(prevGroups => [...prevGroups, groupId]);
        setSuccessMessage('Te has unido al grupo correctamente');
      }
      
      // Refrescar lista de grupos
      await fetchAllGroups();
      return true;
    } catch (error) {
      console.error(`Error al ${joinedGroups.includes(groupId) ? 'abandonar' : 'unirse al'} grupo ${groupId}:`, error);
      setFormErrors({ general: error.message || `Error al procesar la acción en el grupo ${groupId}` });
      return false;
    }
  };
  
  /**
   * Obtiene posts asociados con un grupo específico
   * @param {number} groupId - ID del grupo
   * @returns {Array} Lista de posts filtrados
   */
  const getPostsByGroupId = (groupId) => {
    return posts.filter(post => post.groupId === groupId);
  };
  
  /**
   * Comprueba si el usuario está unido a un grupo
   * @param {number} groupId - ID del grupo
   * @returns {boolean} true si está unido, false si no
   */
  const isUserJoined = (groupId) => {
    return joinedGroups.includes(groupId);
  };
  
  // Retornamos todos los estados y funciones que necesita el componente
  return {
    // Estados
    groups,
    group,
    loading: loadingGroups,
    error: groupError,
    formData,
    formErrors,
    successMessage,
    joinedGroups,
    
    // Funciones para obtener datos
    fetchAllGroups,
    fetchGroupById,
    getPostsByGroupId,
    isUserJoined,
    
    // Funciones de formulario
    handleChange,
    resetForm,
    
    // Funciones de CRUD
    handleCreateGroup,
    loadGroupForEdit,
    handleUpdateGroup,
    handleDeleteGroup,
    handleToggleJoinGroup,
    
    // Helpers
    canCreateGroup,
    canEditGroup,
    canDeleteGroup
  };
};