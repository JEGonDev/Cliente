import { useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Agregar import
import { GroupContext } from '../context/GroupContext';
import { communityService } from '../services/communityService';

/**
 * Hook personalizado para manejar la lógica de grupos.
 * Optimizado para evitar ciclos infinitos y renders innecesarios.
 */
export const useGroup = (groupId = null) => {
  const { groups, loading, error } = useContext(GroupContext);
  const navigate = useNavigate(); // ✅ Agregar hook de navegación
  
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupLoading, setGroupLoading] = useState(false);
  const [groupError, setGroupError] = useState(null);
  const [hasLoadedGroups, setHasLoadedGroups] = useState(false);

  // ✅ Función memoizada para cargar grupos
  const loadGroups = useCallback(async () => {
    if (hasLoadedGroups) return;
    
    try {
      // Si el contexto no tiene grupos cargados, los cargamos
      if (!groups || groups.length === 0) {
        await communityService.getAllGroups();
        setHasLoadedGroups(true);
      }
    } catch (err) {
      console.error('Error cargando grupos:', err);
    }
  }, [groups, hasLoadedGroups]);

  // ✅ Efecto controlado para cargar grupos (solo una vez)
  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  // ✅ Efecto para cargar grupo específico
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

  // ✅ Funciones de validación y manejo de formulario
  const validateForm = useCallback(() => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'El nombre del grupo es obligatorio';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData.name]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({ name: '', description: '' });
    setFormErrors({});
  }, []);

  const handleCreateGroup = useCallback(async () => {
    setSuccessMessage('');
    if (!validateForm()) return null;
    
    try {
      const response = await communityService.createGroup(formData);
      setSuccessMessage('Grupo creado correctamente');
      resetForm();
      setHasLoadedGroups(false); // Forzar recarga de grupos
      return response;
    } catch (error) {
      setFormErrors({ general: error.message || 'Error al crear el grupo' });
      return null;
    }
  }, [formData, validateForm, resetForm]);

  /**
   * Handler optimizado para unirse a un grupo.
   */
  const handleJoinGroup = useCallback(async (targetGroupId) => {
    setSuccessMessage('');
    setFormErrors({});
    
    try {
      await communityService.joinGroup(targetGroupId);
      setSuccessMessage('¡Te has unido al grupo correctamente!');
      setHasLoadedGroups(false); // Forzar recarga para actualizar estado de membresía
    } catch (error) {
      setFormErrors({ 
        general: error?.response?.data?.message || 
                error?.message || 
                'No se pudo unir al grupo' 
      });
    }
  }, []);

  /**
   * Handler para eliminar un grupo
   * @param {number|string} targetGroupId - ID del grupo a eliminar
   * @returns {Promise<boolean>} true si se eliminó correctamente
   */
  const handleDeleteGroup = useCallback(async (targetGroupId) => {
    setSuccessMessage('');
    setFormErrors({});
    
    try {
      await communityService.deleteGroup(targetGroupId);
      setSuccessMessage('Grupo eliminado correctamente');
      
      // ✅ Forzar recarga de grupos usando el mecanismo existente
      setHasLoadedGroups(false);
      
      // ✅ Si estamos viendo el grupo que se eliminó, redirigir
      if (selectedGroup && selectedGroup.id === parseInt(targetGroupId)) {
        // Esperar un momento para mostrar el mensaje de éxito
        setTimeout(() => {
          navigate('/community'); // Redirigir a la página de comunidad
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
  }, [selectedGroup, navigate]); // ✅ Dependencias correctas

  return {
    // Estados de grupos generales
    groups,
    loading,
    error,
    
    // Estados de formulario
    formData,
    formErrors,
    successMessage,
    
    // Estados de grupo específico
    selectedGroup,
    groupLoading,
    groupError,
    
    // Funciones
    handleChange,
    resetForm,
    handleCreateGroup,
    handleJoinGroup,
    handleDeleteGroup, // ✅ Ya está incluida
    
    // Función para recargar grupos manualmente
    reloadGroups: useCallback(() => {
      setHasLoadedGroups(false);
    }, [])
  };
};

// import { useContext, useState, useEffect } from 'react';
// import { GroupContext } from '../context/GroupContext';
// import { communityService } from '../services/communityService';

// /**
//  * Hook personalizado para manejar la lógica de grupos.
//  * Este hook encapsula:
//  * - Estados de carga y errores relacionados con los grupos.
//  * - Handlers para crear, actualizar y eliminar grupos.
//  */
// export const useGroup = () => {
//   const { groups, loading, error, fetchGroups } = useContext(GroupContext);
//   const [formData, setFormData] = useState({ name: '', description: '' });
//   const [formErrors, setFormErrors] = useState({});
//   const [successMessage, setSuccessMessage] = useState('');

//   useEffect(() => {
//     if (fetchGroups) {
//       fetchGroups();
//     }
//     // Solo queremos que se ejecute una vez al montar
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [fetchGroups]);


//   const validateForm = () => {
//     const errors = {};
//     if (!formData.name.trim()) errors.name = 'El nombre del grupo es obligatorio';
//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const resetForm = () => {
//     setFormData({ name: '', description: '' });
//     setFormErrors({});
//   };

//   const handleCreateGroup = async () => {
//     setSuccessMessage('');
//     if (!validateForm()) return null;
//     try {
//       // Aquí llamaría a una función que interactúe con la API (communityService)
//       setSuccessMessage('Grupo creado correctamente');
//       resetForm();
//     } catch (error) {
//       setFormErrors({ general: error.message || 'Error al crear el grupo' });
//     }
//   };

//    /**
//    * Handler para unirse a un grupo.
//    * @param {number|string} groupId - ID del grupo al que se une el usuario.
//    * @returns {Promise<void>}
//    */
//   const handleJoinGroup = async (groupId) => {
//     setSuccessMessage('');
//     setFormErrors({});
//     try {
//       await communityService.joinGroup(groupId);
//       setSuccessMessage('¡Te has unido al grupo correctamente!');
//       // Opcional: Actualiza la lista de grupos si tiene sentido en tu UX
//       if (fetchGroups) {
//         await fetchGroups();
//       }
//     } catch (error) {
//       setFormErrors({ general: error.message || 'No se pudo unir al grupo' });
//     }
//   };

//   return {
//     groups,
//     loading,
//     error,
//     formData,
//     formErrors,
//     successMessage,
//     fetchGroups,
//     handleChange,
//     resetForm,
//     handleCreateGroup,
//     handleJoinGroup
//   };
// };