import { useState, useContext } from "react";
import { AuthContext } from "../../authentication/context/AuthContext";
import { communityService } from "../services/communityService";

/**
 * Hook personalizado para manejar la lógica de hilos.
 * Este hook encapsula:
 * - Estados de carga y errores relacionados con los hilos.
 * - Handlers para crear, actualizar y eliminar hilos.
 */
export const useThread = () => {
  // Estado para los hilos
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estado para el formulario
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    groupId: null,
  });

  // Estado para errores de formulario
  const [formErrors, setFormErrors] = useState({});

  // Estado para mensajes de éxito
  const [successMessage, setSuccessMessage] = useState("");

  // Estado para hilos seleccionados (para operaciones por lotes)
  const [selectedThreadIds, setSelectedThreadIds] = useState([]);

  // Contexto de autenticación
  const { user, isAdmin, isModerator } = useContext(AuthContext);

  // Función para validar el formulario
  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = "El título es obligatorio";
    }

    if (!formData.content.trim()) {
      errors.content = "El contenido es obligatorio";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Función para manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Convertir groupId a número si es necesario
    if (name === "groupId") {
      setFormData({
        ...formData,
        [name]: value ? parseInt(value, 10) : null,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Función para resetear el formulario
  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      groupId: null,
    });
    setFormErrors({});
  };

  // Función para obtener hilos de un usuario específico
  const fetchThreadsByUser = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await communityService.getThreadsByUser(userId);
      // Puede que la data venga como response.data o directamente como array, ajústalo según la respuesta real
      if (response && Array.isArray(response)) {
        setThreads(response);
      } else if (response && response.data && Array.isArray(response.data)) {
        setThreads(response.data);
      } else {
        setThreads([]);
      }
    } catch (err) {
      setError(err.message || "Error al obtener los hilos del usuario");
      setThreads([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener UN hilo por id
  const fetchThreadById = async (threadId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await communityService.getThreadById(threadId);
      if (response) {
        setThreads([response]); // Lo envolvemos en array para reutilizar el render del listado
      } else {
        setThreads([]);
      }
    } catch (err) {
      setError(err.message || "Error al obtener el hilo");
      setThreads([]);
    } finally {
      setLoading(false);
    }
  };

// Función para obtener hilos de un grupo específico
const fetchThreadsByGroup = async (groupId) => {
  // Validación: no llamar al backend si el groupId es inválido
  if (
    groupId === undefined ||
    groupId === null ||
    groupId === "" ||
    groupId === "undefined" ||
    groupId === "null" ||
    Number.isNaN(groupId)
  ) {
    setError("ID de grupo inválido.");
    setThreads([]);
    return;
  }

  setLoading(true);
  setError(null);

  try {
    const response = await communityService.getThreadsByGroup(groupId);
    setThreads(response.data || []);
  } catch (err) {
    setError(err.message || "Error al obtener los hilos del grupo");
    setThreads([]);
  } finally {
    setLoading(false);
  }
};

  // Función para obtener todos los hilos
  const fetchAllThreads = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await communityService.getAllThreads();

      if (response && response.data) {
        setThreads(response.data);
      } else {
        setThreads([]);
      }
    } catch (err) {
      console.error("Error al obtener hilos:", err);
      setError(err.message || "Error al obtener los hilos");
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener hilos del foro general
  const fetchForumThreads = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await communityService.getForumThreads();

      if (response && response.data) {
        setThreads(response.data);
      } else {
        setThreads([]);
      }
    } catch (err) {
      console.error("Error al obtener hilos del foro:", err);
      setError(err.message || "Error al obtener los hilos del foro");
    } finally {
      setLoading(false);
    }
  };

  // Función para crear un nuevo hilo
  const handleCreateThread = async (e) => {
    if (e) e.preventDefault();

    setSuccessMessage("");

    if (!validateForm()) return null;
    console.log("Datos que se enviarán al crear hilo:", formData);

    setLoading(true);

    try {
      const response = await communityService.createThread(formData);
      console.log("Datos que se enviarán al crear hilo try:", formData);

      if (response && response.data) {
        setSuccessMessage("Hilo creado correctamente");
        resetForm();
        await fetchAllThreads(); // Refrescar la lista
        return response.data;
      }

      return null;
    } catch (err) {
      console.error("Error al crear hilo:", err);
      setFormErrors({
        ...formErrors,
        general: err.message || "Error al crear el hilo",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar un hilo
  const handleUpdateThread = async (threadId, e) => {
    if (e) e.preventDefault();

    setSuccessMessage("");

    if (!validateForm()) return null;

    setLoading(true);

    try {
      const response = await communityService.updateThread(threadId, {
        title: formData.title,
        content: formData.content,
      });

      if (response && response.data) {
        setSuccessMessage("Hilo actualizado correctamente");
        resetForm();
        await fetchAllThreads(); // Refrescar la lista
        return response.data;
      }

      return null;
    } catch (err) {
      console.error(`Error al actualizar hilo ${threadId}:`, err);
      setFormErrors({
        ...formErrors,
        general: err.message || "Error al actualizar el hilo",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar un hilo
  const handleDeleteThread = async (threadId) => {
    setLoading(true);
    setError(null);

    try {
      await communityService.deleteThread(threadId);
      setSuccessMessage("Hilo eliminado correctamente");
      await fetchAllThreads(); // Refrescar la lista
      return true;
    } catch (err) {
      console.error(`Error al eliminar hilo ${threadId}:`, err);
      setError(err.message || "Error al eliminar el hilo");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Verificar si el usuario puede actualizar un hilo
  const canUpdateThread = (thread) => {
    if (!user || !thread) return false;

    // El propietario puede actualizar
    if (thread.userId === user.id) return true;

    // Administradores y moderadores también pueden actualizar
    return isAdmin || isModerator;
  };

  // Verificar si el usuario puede eliminar un hilo
  const canDeleteThread = (thread) => {
    if (!user || !thread) return false;

    // El propietario puede eliminar
    if (thread.userId === user.id) return true;

    // Solo administradores pueden eliminar hilos ajenos
    return isAdmin;
  };

  // Verificar si el usuario puede gestionar hilos en general
  const canManageThreads = () => {
    // Cualquier usuario autenticado puede crear un hilo
    return !!user;
  };

  return {
    // Estados
    threads,
    loading,
    error,
    formData,
    formErrors,
    successMessage,
    selectedThreadIds,

    // Funciones para formulario
    handleChange,
    resetForm,
    validateForm,

    // Funciones para obtener datos
    fetchThreadsByGroup,
    fetchAllThreads,
    fetchForumThreads,

    // Funciones CRUD
    handleCreateThread,
    handleUpdateThread,
    handleDeleteThread,

    // Funciones de autorización
    canUpdateThread,
    canDeleteThread,
    canManageThreads,

    // Funciones para selección
    setSelectedThreadIds,
  };
};
