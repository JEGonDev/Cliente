import { useState, useContext, useCallback } from 'react';
import { EducationContext } from '../context/EducationContext';
import { AuthContext } from '../../authentication/context/AuthContext';

/**
 * Hook personalizado para manejar la lógica de artículos educativos
 * 
 * @returns {Object} Propiedades y métodos para trabajar con artículos
 */
export const useArticles = () => {
  // Contexto de educación
  const {
    articles,
    article,
    loadingArticles,
    articleError,
    fetchArticlesByModuleId,
    fetchArticleById,
    createArticle: contextCreateArticle,
    updateArticle: contextUpdateArticle,
    deleteArticle: contextDeleteArticle
  } = useContext(EducationContext);

  // Contexto de autenticación para validar permisos
  const { isAdmin, isAuthenticated } = useContext(AuthContext);

  // Estado para formularios y UI
  const [formData, setFormData] = useState({
    moduleId: null,
    title: '',
    articleUrl: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  /**
   * Valida el formulario de artículo
   * @returns {boolean} true si es válido, false si no
   */
  const validateForm = () => {
    const errors = {};

    if (!formData.moduleId) {
      errors.moduleId = 'El módulo es obligatorio';
    }

    if (!formData.title.trim()) {
      errors.title = 'El título es obligatorio';
    }

    if (!formData.articleUrl.trim()) {
      errors.articleUrl = 'La URL del artículo es obligatoria';
    } else if (!isValidUrl(formData.articleUrl)) {
      errors.articleUrl = 'La URL no es válida';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Valida si una cadena es una URL válida
   * @param {string} url - URL a validar
   * @returns {boolean} true si es válida, false si no
   */
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  /**
   * Maneja cambios en los campos del formulario
   * @param {Event} e - Evento de cambio
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'moduleId') {
      // Convertir a número o null si está vacío
      const numValue = value ? parseInt(value, 10) : null;
      setFormData({ ...formData, [name]: numValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  /**
   * Establecer directamente el moduleId
   * @param {number} moduleId - ID del módulo
   */
  const setModuleId = (moduleId) => {
    setFormData(prev => ({ ...prev, moduleId }));
  };

  /**
   * Resetea el formulario
   */
  const resetForm = () => {
    setFormData({
      moduleId: null,
      title: '',
      articleUrl: ''
    });
    setFormErrors({});
    setSuccessMessage('');
  };

  /**
   * Carga datos de un artículo existente en el formulario
   * @param {number} id - ID del artículo
   */
  const loadArticleForEdit = useCallback(async (id) => {
    try {
      const articleData = await fetchArticleById(id);

      if (articleData) {
        setFormData({
          moduleId: articleData.moduleId || null,
          title: articleData.title || '',
          articleUrl: articleData.articleUrl || ''
        });
        return articleData;
      }
      return null;
    } catch (error) {
      console.error(`Error cargando artículo ${id} para editar:`, error);
      return null;
    }
  }, [fetchArticleById]);

  /**
   * Crea un nuevo artículo
   * @param {Event} e - Evento de envío del formulario
   */
  const handleCreateArticle = async (e) => {
    e.preventDefault();

    // Verificar autenticación y permisos
    if (!isAuthenticated) {
      setFormErrors({ auth: 'Debes iniciar sesión para realizar esta acción' });
      return null;
    }

    // Sólo los administradores pueden crear artículos
    if (!isAdmin) {
      setFormErrors({ permission: 'No tienes permisos para crear artículos' });
      return null;
    }

    // Limpiar mensajes previos
    setSuccessMessage('');

    // Validar formulario
    if (!validateForm()) return null;

    try {
      const newArticle = await contextCreateArticle(formData);

      if (newArticle) {
        setSuccessMessage('Artículo creado correctamente');
        resetForm();
        return newArticle;
      }
      return null;
    } catch (error) {
      console.error('Error creando artículo:', error);
      return null;
    }
  };

  /**
   * Actualiza un artículo existente
   * @param {number} id - ID del artículo
   * @param {Event} e - Evento de envío del formulario
   */
  const handleUpdateArticle = async (id, e) => {
    e.preventDefault();

    // Verificar autenticación y permisos
    if (!isAuthenticated) {
      setFormErrors({ auth: 'Debes iniciar sesión para realizar esta acción' });
      return null;
    }

    // Sólo los administradores pueden actualizar artículos
    if (!isAdmin) {
      setFormErrors({ permission: 'No tienes permisos para actualizar artículos' });
      return null;
    }

    // Limpiar mensajes previos
    setSuccessMessage('');

    // Validar formulario
    if (!validateForm()) return null;

    try {
      const updatedArticle = await contextUpdateArticle(id, formData);

      if (updatedArticle) {
        setSuccessMessage('Artículo actualizado correctamente');
        return updatedArticle;
      }
      return null;
    } catch (error) {
      console.error(`Error actualizando artículo ${id}:`, error);
      return null;
    }
  };

  /**
   * Elimina un artículo
   * @param {number} id - ID del artículo
   */
  const handleDeleteArticle = async (id) => {
    // Verificar autenticación y permisos
    if (!isAuthenticated) {
      setFormErrors({ auth: 'Debes iniciar sesión para realizar esta acción' });
      return false;
    }

    // Sólo los administradores pueden eliminar artículos
    if (!isAdmin) {
      setFormErrors({ permission: 'No tienes permisos para eliminar artículos' });
      return false;
    }

    try {
      const success = await contextDeleteArticle(id);

      if (success) {
        setSuccessMessage('Artículo eliminado correctamente');
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error eliminando artículo ${id}:`, error);
      return false;
    }
  };

  // Retornamos los estados y funciones que necesita el componente
  return {
    // Estados
    articles,
    article,
    loading: loadingArticles,
    error: articleError,
    formData,
    formErrors,
    successMessage,

    // Funciones de obtención de datos
    fetchArticlesByModuleId,
    fetchArticleById,

    // Funciones de formulario
    handleChange,
    setModuleId,
    resetForm,
    loadArticleForEdit,

    // Funciones CRUD
    handleCreateArticle,
    handleUpdateArticle,
    handleDeleteArticle,

    // Helper para permisos
    canManageArticles: isAdmin
  };
};