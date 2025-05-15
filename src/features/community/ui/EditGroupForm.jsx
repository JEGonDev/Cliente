import React, { useState, useEffect } from "react";
import { useGroup } from "../hooks/useGroup";

export const EditGroupForm = ({ group, onCancel, onSuccess }) => {
  const { 
    formData, 
    handleChange, 
    updateGroup, 
    formErrors, 
    successMessage,
    setFormData 
  } = useGroup();
  
  const [filePreview, setFilePreview] = useState(null);
  
  // Cargar datos del grupo al montar el componente
  useEffect(() => {
    if (group) {
      setFormData({
        name: group.name || '',
        description: group.description || '',
        avatar: null // No podemos cargar el archivo
      });
    }
  }, [group, setFormData]);
  
  // Manejar cambio de archivo con previsualización
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Crear URL de previsualización
      const previewUrl = URL.createObjectURL(file);
      setFilePreview(previewUrl);
      
      // Llamar al manejador de cambios normal
      handleChange(e);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateGroup(group.id, e);
    if (result) {
      // Limpiar previsualización
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
        setFilePreview(null);
      }
      
      // Llamar al callback de éxito
      onSuccess && onSuccess();
    }
  };
  
  // Si no hay datos cargados aún, mostrar un indicador de carga
  if (!formData.name && !formData.description) {
    return (
      <div className="text-center py-4">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
        <p className="mt-2 text-sm text-gray-600">Cargando datos...</p>
      </div>
    );
  }
  
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Editar grupo</h3>
      
      <form onSubmit={handleSubmit}>
        {/* Mensajes de error o éxito */}
        {formErrors.general && (
          <div className="mb-3 p-2 bg-red-100 text-red-700 rounded">
            {formErrors.general}
          </div>
        )}
        
        {formErrors.permission && (
          <div className="mb-3 p-2 bg-red-100 text-red-700 rounded">
            {formErrors.permission}
          </div>
        )}
        
        {successMessage && (
          <div className="mb-3 p-2 bg-green-100 text-green-700 rounded">
            {successMessage}
          </div>
        )}
        
        {/* Nombre del grupo */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del grupo
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
          {formErrors.name && (
            <p className="text-sm text-red-500 mt-1">{formErrors.name}</p>
          )}
        </div>
        
        {/* Descripción del grupo */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows="4"
            required
          ></textarea>
          {formErrors.description && (
            <p className="text-sm text-red-500 mt-1">{formErrors.description}</p>
          )}
        </div>
        
        {/* Avatar del grupo */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Actualizar avatar (opcional)
          </label>
          <input
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          
          {/* Previsualización de nueva imagen */}
          {filePreview && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-1">Nueva imagen:</p>
              <img
                src={filePreview}
                alt="Nuevo avatar"
                className="h-20 w-20 rounded-full object-cover"
              />
            </div>
          )}
          
          {/* Imagen actual */}
          {!filePreview && group.avatar && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-1">Avatar actual:</p>
              <img
                src={group.avatar}
                alt="Avatar actual"
                className="h-20 w-20 rounded-full object-cover"
              />
            </div>
          )}
        </div>
        
        {/* Botones de acción */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Guardar cambios
          </button>
        </div>
      </form>
    </div>
  );
};