import { useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { GroupContext } from '../context/GroupContext';
import { communityService } from '../services/communityService';

/**
 * Hook personalizado para manejar la lógica de grupos en Germogli.
 * Modular, sin lógica redundante ni estados locales de recarga.
 * Explica cada sección con comentarios claros para mantener la arquitectura limpia y desacoplada.
 */
export const useGroup = (groupId = null) => {
  // Trae el estado global de grupos y la función para refrescar desde el contexto
  const { groups, loading, error, fetchGroups } = useContext(GroupContext);

  // Navegación para redireccionar si es necesario (por ejemplo, tras borrar un grupo)
  const navigate = useNavigate();

  // Estados locales para formularios de creación/edición de grupo
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Estados para manejar grupo individual (por ejemplo, vista de detalle/edición)
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupLoading, setGroupLoading] = useState(false);
  const [groupError, setGroupError] = useState(null);

  // Estados para edición
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  /**
   * Efecto para cargar un grupo específico por ID (detalle o edición).
   * Si no hay groupId, limpia el seleccionado.
   */
  useEffect(() => {
    if (!groupId) {
      setSelectedGroup(null);
      setGroupError(null);
      setGroupLoading(false);
      return;
    }

    const loadSpecificGroup = async () => {
      setGroupLoading(true);
      setGroupError(null);
      try {
        const response = await communityService.getGroupById(groupId);
        setSelectedGroup(response?.data || null);
      } catch (err) {
        setSelectedGroup(null);
        setGroupError(err?.message || 'No se pudo obtener el grupo');
      } finally {
        setGroupLoading(false);
      }
    };

    loadSpecificGroup();
  }, [groupId]);

  /**
   * Validación del formulario para crear/editar grupo.
   * Recibe los datos a validar y retorna true/false según validez.
   * Deja los errores listos para mostrar en la UI.
   */
  const validateForm = useCallback((data) => {
    const errors = {};
    if (!data.name.trim()) {
      errors.name = 'El nombre del grupo es obligatorio';
    }
    if (data.name.trim().length < 3) {
      errors.name = 'El nombre del grupo debe tener al menos 3 caracteres';
    }
    if (data.name.trim().length > 100) {
      errors.name = 'El nombre del grupo no puede exceder 100 caracteres';
    }
    if (data.description.length > 500) {
      errors.description = 'La descripción no puede exceder 500 caracteres';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, []);

  /**
   * Manejo del cambio de inputs en el formulario.
   * Actualiza el estado local y limpia errores de ese input si existían.
   */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Limpia solo el error del campo editado
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [formErrors]);

  /**
   * Limpia el formulario y los estados asociados.
   */
  const resetForm = useCallback(() => {
    setFormData({ name: '', description: '' });
    setFormErrors({});
    setSuccessMessage('');
    setIsEditing(false);
  }, []);

  /**
   * Carga los datos de un grupo en el formulario para editar.
   */
  const loadGroupForEdit = useCallback((group) => {
    if (!group) return;
    setFormData({
      name: group.name || '',
      description: group.description || ''
    });
    setFormErrors({});
    setSuccessMessage('');
    setIsEditing(true);
  }, []);

  /**
   * Cancela el modo edición y limpia los estados de formulario.
   */
  const cancelEdit = useCallback(() => {
    setIsEditing(false);
    setFormData({ name: '', description: '' });
    setFormErrors({});
    setSuccessMessage('');
  }, []);

  /**
   * Crear un grupo nuevo.
   * Valida, llama al servicio y muestra feedback.
   * ¡IMPORTANTE! No refresca la lista aquí, eso lo hace el componente padre tras crearlo (para mantener modularidad).
   */
  const handleCreateGroup = useCallback(
    async (data) => {
      setSuccessMessage('');
      if (!validateForm(data)) return null;
      try {
        const response = await communityService.createGroup(data);
        setSuccessMessage('Grupo creado correctamente');
        resetForm();
        // No se refresca aquí, lo hace el padre llamando a fetchGroups
        return response;
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          'Error al crear el grupo';
        setFormErrors({ general: errorMessage });
        return null;
      }
    },
    [validateForm, resetForm]
  );

  /**
   * Actualiza los datos de un grupo existente.
   * Valida y llama al servicio. El componente padre debe refrescar la lista tras éxito.
   */
  const handleUpdateGroup = useCallback(async (groupId, data) => {
    if (!groupId) {
      setFormErrors({ general: 'ID de grupo no válido' });
      return null;
    }
    setSuccessMessage('');
    setUpdateLoading(true);

    if (!validateForm(data)) {
      setUpdateLoading(false);
      return null;
    }
    try {
      const response = await communityService.updateGroup(groupId, data);
      if (response?.data) {
        setSelectedGroup(response.data);
      }
      setSuccessMessage('Grupo actualizado correctamente');
      setIsEditing(false);
      return response;
    } catch (error) {
      const errorMessage = error?.response?.data?.message ||
        error?.message ||
        'Error al actualizar el grupo';
      setFormErrors({ general: errorMessage });
      return null;
    } finally {
      setUpdateLoading(false);
    }
  }, [validateForm]);

  /**
   * Unirse a un grupo.
   */
  const handleJoinGroup = useCallback(async (targetGroupId) => {
    setSuccessMessage('');
    setFormErrors({});
    try {
      await communityService.joinGroup(targetGroupId);
      setSuccessMessage('¡Te has unido al grupo correctamente!');
    } catch (error) {
      setFormErrors({
        general: error?.response?.data?.message ||
          error?.message ||
          'No se pudo unir al grupo'
      });
    }
  }, []);

  /**
   * Elimina un grupo.
   * El componente padre debe refrescar la lista tras éxito.
   */
  const handleDeleteGroup = useCallback(async (targetGroupId) => {
    setSuccessMessage('');
    setFormErrors({});
    try {
      await communityService.deleteGroup(targetGroupId);
      setSuccessMessage('Grupo eliminado correctamente');
      // Si el usuario está viendo el grupo eliminado, lo redirige al listado
      if (selectedGroup && selectedGroup.id === parseInt(targetGroupId)) {
        setTimeout(() => {
          navigate('/groups');
        }, 1500);
      }
      return true;
    } catch (error) {
      const errorMessage = error?.response?.data?.message ||
        error?.message ||
        'No se pudo eliminar el grupo';
      setFormErrors({ general: errorMessage });
      return false;
    }
  }, [selectedGroup, navigate]);

  /**
   * Limpia los mensajes de éxito y error.
   */
  const clearMessages = useCallback(() => {
    setSuccessMessage('');
    setFormErrors({});
  }, []);

  // Retorna todos los estados y funciones útiles para los componentes UI
  // La función fetchGroups es la ÚNICA responsable de refrescar la lista global de grupos
  return {
    // Estado global de grupos
    groups,
    loading,
    error,

    // Formulario
    formData,
    formErrors,
    successMessage,

    // Grupo individual
    selectedGroup,
    groupLoading,
    groupError,

    // Edición
    isEditing,
    updateLoading,

    // Funciones de formulario
    handleChange,
    resetForm,
    clearMessages,

    // CRUD
    handleCreateGroup,
    handleUpdateGroup,
    handleJoinGroup,
    handleDeleteGroup,

    // Edición
    loadGroupForEdit,
    cancelEdit,

    // Refresca la lista global de grupos (pedir SIEMPRE aquí tras crear/editar/eliminar)
    fetchGroups,
  };
};


// import { useContext, useState, useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { GroupContext } from '../context/GroupContext';
// import { communityService } from '../services/communityService';

// /**
//  * Hook personalizado para manejar la lógica de grupos.
//  * Optimizado para evitar ciclos infinitos y renders innecesarios.
//  * Incluye funcionalidades de creación, edición, eliminación y unirse a grupos.
//  */
// export const useGroup = (groupId = null) => {
//   const { groups, loading, error, fetchGroups } = useContext(GroupContext);
//   const navigate = useNavigate();
  
//   const [formData, setFormData] = useState({ name: '', description: '' });
//   const [formErrors, setFormErrors] = useState({});
//   const [successMessage, setSuccessMessage] = useState('');
//   const [selectedGroup, setSelectedGroup] = useState(null);
//   const [groupLoading, setGroupLoading] = useState(false);
//   const [groupError, setGroupError] = useState(null);
//   const [hasLoadedGroups, setHasLoadedGroups] = useState(false);
//   const reloadGroups = fetchGroups;
//   // ✅ Estados adicionales para edición
//   const [isEditing, setIsEditing] = useState(false);
//   const [updateLoading, setUpdateLoading] = useState(false);

//   // ✅ Función memoizada para cargar grupos
//   const loadGroups = useCallback(async () => {
//     if (hasLoadedGroups) return;
    
//     try {
//       if (!groups || groups.length === 0) {
//         await communityService.getAllGroups();
//         setHasLoadedGroups(true);
//       }
//     } catch (err) {
//       console.error('Error cargando grupos:', err);
//     }
//   }, [groups, hasLoadedGroups]);

//   // ✅ Efecto controlado para cargar grupos (solo una vez)
//   useEffect(() => {
//     loadGroups();
//   }, [loadGroups]);

//   // ✅ Efecto para cargar grupo específico
//   useEffect(() => {
//     if (!groupId) {
//       setSelectedGroup(null);
//       setGroupError(null);
//       setGroupLoading(false);
//       return;
//     }

//     const loadSpecificGroup = async () => {
//       setGroupLoading(true);
//       setGroupError(null);
      
//       try {
//         const response = await communityService.getGroupById(groupId);
//         setSelectedGroup(response?.data || null);
//       } catch (err) {
//         setSelectedGroup(null);
//         setGroupError(err?.message || 'No se pudo obtener el grupo');
//       } finally {
//         setGroupLoading(false);
//       }
//     };

//     loadSpecificGroup();
//   }, [groupId]);

//   const validateForm = useCallback((data) => {
//   const errors = {};
//   if (!data.name.trim()) {
//     errors.name = 'El nombre del grupo es obligatorio';
//   }
//   if (data.name.trim().length < 3) {
//     errors.name = 'El nombre del grupo debe tener al menos 3 caracteres';
//   }
//   if (data.name.trim().length > 100) {
//     errors.name = 'El nombre del grupo no puede exceder 100 caracteres';
//   }
//   if (data.description.length > 500) {
//     errors.description = 'La descripción no puede exceder 500 caracteres';
//   }
//   setFormErrors(errors);
//   return Object.keys(errors).length === 0;
// }, []);

//   // // ✅ Funciones de validación y manejo de formulario
//   // const validateForm = useCallback(() => {
//   //   const errors = {};
//   //   if (!formData.name.trim()) {
//   //     errors.name = 'El nombre del grupo es obligatorio';
//   //   }
//   //   if (formData.name.trim().length < 3) {
//   //     errors.name = 'El nombre del grupo debe tener al menos 3 caracteres';
//   //   }
//   //   if (formData.name.trim().length > 100) {
//   //     errors.name = 'El nombre del grupo no puede exceder 100 caracteres';
//   //   }
//   //   if (formData.description.length > 500) {
//   //     errors.description = 'La descripción no puede exceder 500 caracteres';
//   //   }
//   //   setFormErrors(errors);
//   //   return Object.keys(errors).length === 0;
//   // }, [formData]);

//   const handleChange = useCallback((e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
    
//     // Limpiar errores específicos al cambiar los campos
//     if (formErrors[name]) {
//       setFormErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   }, [formErrors]);

//   const resetForm = useCallback(() => {
//     setFormData({ name: '', description: '' });
//     setFormErrors({});
//     setSuccessMessage('');
//     setIsEditing(false);
//   }, []);

//   // ✅ Función para cargar datos del grupo en el formulario de edición
//   const loadGroupForEdit = useCallback((group) => {
//     if (!group) return;
    
//     setFormData({
//       name: group.name || '',
//       description: group.description || ''
//     });
//     setFormErrors({});
//     setSuccessMessage('');
//     setIsEditing(true);
//   }, []);

//   // ✅ Función para cancelar la edición
//   const cancelEdit = useCallback(() => {
//     setIsEditing(false);
//     setFormData({ name: '', description: '' });
//     setFormErrors({});
//     setSuccessMessage('');
//   }, []);

//   const handleCreateGroup = useCallback(
//   async (formData) => {
//     setSuccessMessage('');
//     if (!validateForm(formData)) return null;
//     try {
//       const response = await communityService.createGroup(formData);
//       setSuccessMessage('Grupo creado correctamente');
//       resetForm();
//       setHasLoadedGroups(false);
//       return response;
//     } catch (error) {
//       const errorMessage =
//         error?.response?.data?.message ||
//         error?.message ||
//         'Error al crear el grupo';
//       setFormErrors({ general: errorMessage });
//       console.log("Error real al crear grupo:", error);
//       return null;
//     }
//   },
//   [validateForm, resetForm]
// );
// //   const handleCreateGroup = useCallback(
// //   async (formData) => {
// //     console.log("Datos del formulario al crear grupo:", formData);
// //     setSuccessMessage('');
// //     // Usa formData recibido, no el del estado interno
// //     if (!validateForm(formData)) return null;

// //     try {
// //       const response = await communityService.createGroup(formData);
// //       console.log("Respuesta al crear este grupo:", response);
// //       setSuccessMessage('Grupo creado correctamente');
// //       resetForm();
// //       setHasLoadedGroups(false); // Forzar recarga de grupos
// //       return response;
// //     } catch (error) {
// //       const errorMessage =
// //         error?.response?.data?.message ||
// //         error?.message ||
// //         'Error al crear el grupo';
// //       setFormErrors({ general: errorMessage });
// //       console.log("Error real al crear grupo:", error);
// //       return null;
// //     }
// //   },
// //   [validateForm, resetForm]
// // );

//   // const handleCreateGroup = useCallback(async () => {
//   //   setSuccessMessage('');
//   //   if (!validateForm()) return null;
    
//   //   try {
//   //     const response = await communityService.createGroup(formData);
//   //     setSuccessMessage('Grupo creado correctamente');
//   //     resetForm();
//   //     setHasLoadedGroups(false); // Forzar recarga de grupos
//   //     return response;
//   //   } catch (error) {
//   //     const errorMessage = error?.response?.data?.message || 
//   //                         error?.message || 
//   //                         'Error al crear el grupo';
//   //     setFormErrors({ general: errorMessage });
//   //     console.log("Error real al crear grupo:", error);
//   //     return null;
//   //   }
//   // }, [formData, validateForm, resetForm]);

//   // ✅ Función para actualizar grupo
//   const handleUpdateGroup = useCallback(async (groupId) => {
//     if (!groupId) {
//       setFormErrors({ general: 'ID de grupo no válido' });
//       return null;
//     }

//     setSuccessMessage('');
//     setUpdateLoading(true);
    
//     if (!validateForm()) {
//       setUpdateLoading(false);
//       return null;
//     }
    
//     try {
//       const response = await communityService.updateGroup(groupId, formData);
      
//       // Actualizar el grupo seleccionado con los nuevos datos
//       if (response?.data) {
//         setSelectedGroup(response.data);
//       }
      
//       setSuccessMessage('Grupo actualizado correctamente');
//       setIsEditing(false);
//       setHasLoadedGroups(false); // Forzar recarga de grupos para reflejar cambios
      
//       return response;
//     } catch (error) {
//       const errorMessage = error?.response?.data?.message || 
//                           error?.message || 
//                           'Error al actualizar el grupo';
//       setFormErrors({ general: errorMessage });
//       return null;
//     } finally {
//       setUpdateLoading(false);
//     }
//   }, [formData, validateForm]);

//   const handleJoinGroup = useCallback(async (targetGroupId) => {
//     setSuccessMessage('');
//     setFormErrors({});
    
//     try {
//       await communityService.joinGroup(targetGroupId);
//       setSuccessMessage('¡Te has unido al grupo correctamente!');
//       setHasLoadedGroups(false);
//     } catch (error) {
//       setFormErrors({ 
//         general: error?.response?.data?.message || 
//                 error?.message || 
//                 'No se pudo unir al grupo' 
//       });
//     }
//   }, []);

//   const handleDeleteGroup = useCallback(async (targetGroupId) => {
//     setSuccessMessage('');
//     setFormErrors({});
    
//     try {
//       await communityService.deleteGroup(targetGroupId);
//       setSuccessMessage('Grupo eliminado correctamente');
      
//       setHasLoadedGroups(false);
      
//       if (selectedGroup && selectedGroup.id === parseInt(targetGroupId)) {
//         setTimeout(() => {
//           navigate('/community');
//         }, 1500);
//       }
      
//       return true;
//     } catch (error) {
//       const errorMessage = error?.response?.data?.message || 
//                           error?.message || 
//                           'No se pudo eliminar el grupo';
//       setFormErrors({ general: errorMessage });
//       return false;
//     }
//   }, [selectedGroup, navigate]);

//   // ✅ Función para limpiar mensajes
//   const clearMessages = useCallback(() => {
//     setSuccessMessage('');
//     setFormErrors({});
//   }, []);

//   return {
//     // Estados de grupos generales
//     groups,
//     loading,
//     error,
    
//     // Estados de formulario
//     formData,
//     formErrors,
//     successMessage,
    
//     // Estados de grupo específico
//     selectedGroup,
//     groupLoading,
//     groupError,
//     reloadGroups,
    
//     // ✅ Estados de edición
//     isEditing,
//     updateLoading,
    
//     // Funciones básicas
//     handleChange,
//     resetForm,
//     clearMessages,
    
//     // Funciones CRUD
//     handleCreateGroup,
//     handleUpdateGroup, // ✅ Nueva función
//     handleJoinGroup,
//     handleDeleteGroup,
    
//     // ✅ Funciones de edición
//     loadGroupForEdit,
//     cancelEdit,
    
//     // Función para recargar grupos manualmente
//     reloadGroups: useCallback(() => {
//       setHasLoadedGroups(false);
//     }, [])
//   };
// };


// import { useContext, useState, useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom'; // ✅ Agregar import
// import { GroupContext } from '../context/GroupContext';
// import { communityService } from '../services/communityService';

// /**
//  * Hook personalizado para manejar la lógica de grupos.
//  * Optimizado para evitar ciclos infinitos y renders innecesarios.
//  */
// export const useGroup = (groupId = null) => {
//   const { groups, loading, error } = useContext(GroupContext);
//   const navigate = useNavigate(); // ✅ Agregar hook de navegación
  
//   const [formData, setFormData] = useState({ name: '', description: '' });
//   const [formErrors, setFormErrors] = useState({});
//   const [successMessage, setSuccessMessage] = useState('');
//   const [selectedGroup, setSelectedGroup] = useState(null);
//   const [groupLoading, setGroupLoading] = useState(false);
//   const [groupError, setGroupError] = useState(null);
//   const [hasLoadedGroups, setHasLoadedGroups] = useState(false);

//   // ✅ Función memoizada para cargar grupos
//   const loadGroups = useCallback(async () => {
//     if (hasLoadedGroups) return;
    
//     try {
//       // Si el contexto no tiene grupos cargados, los cargamos
//       if (!groups || groups.length === 0) {
//         await communityService.getAllGroups();
//         setHasLoadedGroups(true);
//       }
//     } catch (err) {
//       console.error('Error cargando grupos:', err);
//     }
//   }, [groups, hasLoadedGroups]);

//   // ✅ Efecto controlado para cargar grupos (solo una vez)
//   useEffect(() => {
//     loadGroups();
//   }, [loadGroups]);

//   // ✅ Efecto para cargar grupo específico
//   useEffect(() => {
//     if (!groupId) {
//       setSelectedGroup(null);
//       setGroupError(null);
//       setGroupLoading(false);
//       return;
//     }

//     const loadSpecificGroup = async () => {
//       setGroupLoading(true);
//       setGroupError(null);
      
//       try {
//         const response = await communityService.getGroupById(groupId);
//         setSelectedGroup(response?.data || null);
//       } catch (err) {
//         setSelectedGroup(null);
//         setGroupError(err?.message || 'No se pudo obtener el grupo');
//       } finally {
//         setGroupLoading(false);
//       }
//     };

//     loadSpecificGroup();
//   }, [groupId]);

//   // ✅ Funciones de validación y manejo de formulario
//   const validateForm = useCallback(() => {
//     const errors = {};
//     if (!formData.name.trim()) {
//       errors.name = 'El nombre del grupo es obligatorio';
//     }
//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   }, [formData.name]);

//   const handleChange = useCallback((e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   }, []);

//   const resetForm = useCallback(() => {
//     setFormData({ name: '', description: '' });
//     setFormErrors({});
//   }, []);

//   const handleCreateGroup = useCallback(async () => {
//     setSuccessMessage('');
//     if (!validateForm()) return null;
    
//     try {
//       const response = await communityService.createGroup(formData);
//       setSuccessMessage('Grupo creado correctamente');
//       resetForm();
//       setHasLoadedGroups(false); // Forzar recarga de grupos
//       return response;
//     } catch (error) {
//       setFormErrors({ general: error.message || 'Error al crear el grupo' });
//       return null;
//     }
//   }, [formData, validateForm, resetForm]);

//   /**
//    * Handler optimizado para unirse a un grupo.
//    */
//   const handleJoinGroup = useCallback(async (targetGroupId) => {
//     setSuccessMessage('');
//     setFormErrors({});
    
//     try {
//       await communityService.joinGroup(targetGroupId);
//       setSuccessMessage('¡Te has unido al grupo correctamente!');
//       setHasLoadedGroups(false); // Forzar recarga para actualizar estado de membresía
//     } catch (error) {
//       setFormErrors({ 
//         general: error?.response?.data?.message || 
//                 error?.message || 
//                 'No se pudo unir al grupo' 
//       });
//     }
//   }, []);

//   /**
//    * Handler para eliminar un grupo
//    * @param {number|string} targetGroupId - ID del grupo a eliminar
//    * @returns {Promise<boolean>} true si se eliminó correctamente
//    */
//   const handleDeleteGroup = useCallback(async (targetGroupId) => {
//     setSuccessMessage('');
//     setFormErrors({});
    
//     try {
//       await communityService.deleteGroup(targetGroupId);
//       setSuccessMessage('Grupo eliminado correctamente');
      
//       // ✅ Forzar recarga de grupos usando el mecanismo existente
//       setHasLoadedGroups(false);
      
//       // ✅ Si estamos viendo el grupo que se eliminó, redirigir
//       if (selectedGroup && selectedGroup.id === parseInt(targetGroupId)) {
//         // Esperar un momento para mostrar el mensaje de éxito
//         setTimeout(() => {
//           navigate('/community'); // Redirigir a la página de comunidad
//         }, 1500);
//       }
      
//       return true;
//     } catch (error) {
//       const errorMessage = error?.response?.data?.message || 
//                           error?.message || 
//                           'No se pudo eliminar el grupo';
//       setFormErrors({ general: errorMessage });
//       return false;
//     }
//   }, [selectedGroup, navigate]); // ✅ Dependencias correctas

//   return {
//     // Estados de grupos generales
//     groups,
//     loading,
//     error,
    
//     // Estados de formulario
//     formData,
//     formErrors,
//     successMessage,
    
//     // Estados de grupo específico
//     selectedGroup,
//     groupLoading,
//     groupError,
    
//     // Funciones
//     handleChange,
//     resetForm,
//     handleCreateGroup,
//     handleJoinGroup,
//     handleDeleteGroup, // ✅ Ya está incluida
    
//     // Función para recargar grupos manualmente
//     reloadGroups: useCallback(() => {
//       setHasLoadedGroups(false);
//     }, [])
//   };
// };
