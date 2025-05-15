import { useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ModuleFormLayout } from '../layouts/ModuleFormLayout';
import { AuthContext } from '../../authentication/context/AuthContext';
import { useModules } from '../hooks/useModules';
import { useTags } from '../hooks/useTags';

export const ModuleFormPage = () => {
  const { moduleId } = useParams();
  const isEditing = !!moduleId;
  const { isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const { 
    formData, 
    formErrors, 
    loading: loadingModule,
    error: moduleError,
    handleChange, 
    handleTagsChange, 
    resetForm, 
    loadModuleForEdit, 
    handleCreateModule, 
    handleUpdateModule 
  } = useModules();
  
  const { tags, loading: loadingTags, fetchAllTags } = useTags();
  
  useEffect(() => {
    if (!isAdmin) {
      navigate('/education');
    }
    
    if (isEditing && moduleId) {
      loadModuleForEdit(moduleId);
    } else {
      resetForm();
    }
    
    fetchAllTags();
  }, [isEditing, moduleId, isAdmin, navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isEditing) {
        const success = await handleUpdateModule(moduleId, e);
        if (success) {
          navigate(`/education/module/${moduleId}`);
        }
      } else {
        const success = await handleCreateModule(e);
        if (success.moduleId) {
          const newModuleId = success.moduleId;
          navigate(`/education/module/${newModuleId}`);
        } else {
          navigate('/education');
        }
      }
    } catch (error) {
      console.error('Error guardando módulo:', error);
    }
  };
  
  const handleCancel = () => {
    navigate('/education');
  };
  
  const isLoading = loadingModule || loadingTags;
  
  return (
    <ModuleFormLayout
      title={isEditing ? "Editar Módulo Educativo" : "Crear Nuevo Módulo Educativo"}
      submitText={isEditing ? "Guardar Cambios" : "Crear Módulo"}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    >
      {isLoading ? (
        <div className="flex justify-center my-8">
          <p className="text-gray-500">Cargando...</p>
        </div>
      ) : moduleError ? (
        <div className="bg-red-100 text-red-800 p-4 rounded mb-4">
          <p>{moduleError}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Mostrar errores de formulario si existen */}
          {Object.keys(formErrors).length > 0 && (
            <div className="bg-red-100 text-red-800 p-4 rounded mb-4">
              <ul className="list-disc list-inside">
                {Object.entries(formErrors).map(([key, error], index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título del módulo
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Etiquetas
            </label>
            <div className="flex flex-wrap gap-2">
              {tags.length > 0 ? (
                tags.map((tag) => (
                  <div key={tag.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`tag-${tag.id}`}
                      value={tag.id}
                      checked={formData.tagIds && formData.tagIds.includes(tag.id)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        const value = parseInt(e.target.value, 10);
                        handleTagsChange(
                          checked 
                            ? [...(formData.tagIds || []), value]
                            : (formData.tagIds || []).filter(id => id !== value)
                        );
                      }}
                      className="h-4 w-4 border-gray-300 rounded text-green-600 focus:ring-green-500"
                    />
                    <label htmlFor={`tag-${tag.id}`} className="ml-2 text-sm text-gray-700">
                      {tag.name}
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No hay etiquetas disponibles</p>
              )}
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-600">
              {isEditing 
                ? "Modifica los campos necesarios y guarda los cambios." 
                : "Una vez creado el módulo, podrás agregar artículos, guías y videos desde la vista de detalle."}
            </p>
          </div>
        </div>
      )}
    </ModuleFormLayout>
  );
};