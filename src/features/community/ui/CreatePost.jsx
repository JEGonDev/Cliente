// src/features/community/ui/CreatePost.jsx
import React, { useState } from "react";
import { usePost } from "../hooks/usePost";

export const CreatePost = () => {
  const { formData, formErrors, handleChange, handleCreatePost, resetForm } = usePost();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await handleCreatePost(e);
    if (result) {
      setIsExpanded(false);
    }
  };
  
  const handleCancel = () => {
    resetForm();
    setIsExpanded(false);
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden mb-4 p-4">
      <form onSubmit={handleSubmit}>
        {isExpanded ? (
          <>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="¿Qué estás pensando?"
              className="w-full p-3 border rounded focus:outline-none focus:ring-1 focus:ring-green-500 min-h-[100px]"
            />
            
            {formErrors.content && (
              <p className="text-red-500 text-xs mt-1">{formErrors.content}</p>
            )}
            
            <div className="flex justify-between mt-3">
              <div>
                <label className="inline-flex items-center text-sm text-gray-700">
                  <input
                    type="checkbox"
                    name="hasImage"
                    className="mr-2"
                    onChange={() => {
                      // Lógica para manejar la subida de imágenes
                    }}
                  />
                  Adjuntar imagen
                </label>
              </div>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm border border-gray-300 rounded text-gray-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-green-600 text-white rounded"
                >
                  Publicar
                </button>
              </div>
            </div>
          </>
        ) : (
          <div
            onClick={() => setIsExpanded(true)}
            className="p-3 border rounded cursor-text text-gray-500"
          >
            ¿Qué estás pensando?
          </div>
        )}
      </form>
    </div>
  );
};