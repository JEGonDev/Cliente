import React, { useEffect } from "react";
import { usePost } from "../hooks/usePost";

export const EditPostForm = ({ post, onCancel, onSuccess }) => {
  const { 
    formData, 
    handleChange, 
    loadPostForEdit, 
    handleUpdatePost, 
    formErrors, 
    successMessage 
  } = usePost();
  
  // Cargar datos del post al montar el componente
  useEffect(() => {
    loadPostForEdit(post.id);
  }, [post.id, loadPostForEdit]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await handleUpdatePost(post.id, e);
    if (result) {
      onSuccess && onSuccess();
    }
  };
  
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Editar publicación</h3>
      
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
        
        {/* Tipo de post */}
        <div className="mb-3">
          <select
            name="postType"
            value={formData.postType}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md mb-3"
            required
          >
            <option value="">Selecciona un tipo</option>
            <option value="general">General</option>
            <option value="pregunta">Pregunta</option>
            <option value="tutorial">Tutorial</option>
            <option value="proyecto">Proyecto</option>
          </select>
          {formErrors.postType && (
            <p className="text-sm text-red-500">{formErrors.postType}</p>
          )}
        </div>
        
        {/* Contenido del post */}
        <div className="mb-3">
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows="4"
            required
          ></textarea>
          {formErrors.content && (
            <p className="text-sm text-red-500">{formErrors.content}</p>
          )}
        </div>
        
        {/* Archivo adjunto */}
        <div className="mb-3">
          <p className="text-sm text-gray-600 mb-1">Actualizar imagen (opcional)</p>
          <input
            type="file"
            name="file"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          
          {post.multimediaContent && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">Imagen actual:</p>
              <img
                src={post.multimediaContent}
                alt="Contenido actual"
                className="h-20 w-auto mt-1 rounded"
              />
            </div>
          )}
        </div>
        
        {/* Botones de acción */}
        <div className="flex justify-end gap-2">
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