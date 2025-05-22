import { usePost } from '../hooks/usePost';

export const EditPostForm = ({ post, onClose }) => {
  const { 
    formData, 
    handleChange, 
    handleUpdatePost,
    handleFileChange // Asegúrate de tener este método en tu hook
  } = usePost();

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdatePost(post.id);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Campos de edición existentes */}
      <input 
        type="text" 
        name="postType" 
        value={formData.postType}
        onChange={handleChange}
      />
      <textarea 
        name="content" 
        value={formData.content}
        onChange={handleChange}
      />

      {/* Sección de manejo de archivo multimedia */}
      <div className="space-y-2">
        {/* Previsualización de archivo actual si existe */}
        {post.multimediaContent && (
          <div className="mb-4">
            <img 
              src={post.multimediaContent} 
              alt="Contenido multimedia actual" 
              className="max-w-full h-auto"
            />
          </div>
        )}

        {/* Input para nuevo archivo */}
        <input 
          type="file" 
          onChange={(e) => handleChange(e)}
          accept="image/*,video/*"
        />

        {/* Botón para eliminar archivo multimedia existente */}
        {post.multimediaContent && (
          <button 
            type="button" 
            onClick={() => handleChange({ 
              target: { 
                name: 'multimediaContent', 
                value: '' 
              } 
            })}
            className="text-red-600 hover:text-red-800 bg-red-100 px-3 py-2 rounded-md"
          >
            Eliminar archivo multimedia
          </button>
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end space-x-2">
        <button 
          type="button" 
          onClick={onClose}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md"
        >
          Cancelar
        </button>
        <button 
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-md"
        >
          Guardar cambios
        </button>
      </div>
    </form>
  );
};