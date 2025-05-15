import { useState, useEffect } from 'react';
import { MessageCircle, Bell, ArrowLeft, Edit, Trash2, Plus } from 'lucide-react';
import { useThread } from '../hooks/useThread';

export const Threads = () => {
  const { 
    threads,
    loading,
    formData,
    formErrors,
    successMessage,
    fetchAllThreads,
    handleChange,
    handleCreateThread, // Esta función espera un evento como parámetro
    handleUpdateThread, // Esta función espera id y evento como parámetros
    handleDeleteThread,
    resetForm,
    canUpdateThread,
    canDeleteThread,
    canManageThreads
  } = useThread();

  // Estados para gestionar la interfaz
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingThreadId, setEditingThreadId] = useState(null);
  const [successNotice, setSuccessNotice] = useState('');

  // Cargar hilos al montar el componente
  useEffect(() => {
    fetchAllThreads();
  }, []);

  // Mostrar mensaje de éxito temporal
  useEffect(() => {
    if (successMessage) {
      setSuccessNotice(successMessage);
      const timer = setTimeout(() => {
        setSuccessNotice('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Iniciar creación de nuevo hilo
  const startCreating = () => {
    resetForm();
    setIsCreating(true);
    setIsEditing(false);
    setEditingThreadId(null);
  };

  // Iniciar edición de un hilo existente
  const startEditing = (thread) => {
    if (!canUpdateThread(thread)) return;
    
    // Configurar el formulario con los datos del hilo
    handleChange({ target: { name: 'title', value: thread.title } });
    handleChange({ target: { name: 'content', value: thread.content } });
    if (thread.groupId) {
      handleChange({ target: { name: 'groupId', value: thread.groupId } });
    }
    
    setIsEditing(true);
    setEditingThreadId(thread.id);
    setIsCreating(false);
  };

  // Cancelar la edición o creación
  const cancelForm = () => {
    resetForm();
    setIsCreating(false);
    setIsEditing(false);
    setEditingThreadId(null);
  };

  // Estado de carga
  if (loading && threads.length === 0) {
    return (
      <div className="max-w-md mx-auto min-h-screen p-4">
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-500 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Cargando hilos de discusión...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-gray-100 min-h-screen">
      {/* Header con título y botón de creación */}
      <div className="bg-white p-4 shadow-md sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Hilos de discusión</h1>
          {canManageThreads() && (
            <button 
              onClick={startCreating}
              className="bg-primary text-white px-3 py-2 rounded-md flex items-center text-sm"
            >
              <Plus size={16} className="mr-1" />
              Nuevo hilo
            </button>
          )}
        </div>
      </div>

      {/* Mensaje de éxito */}
      {successNotice && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 m-4 rounded shadow">
          {successNotice}
        </div>
      )}

      {/* Formulario para crear/editar */}
      {(isCreating || isEditing) && (
        <div className="bg-white p-4 m-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-3">
            {isCreating ? 'Crear nuevo hilo' : 'Editar hilo'}
          </h2>
          
          {/* IMPORTANTE: Pasamos el evento directamente a las funciones del hook */}
          <form onSubmit={isCreating ? handleCreateThread : (e) => handleUpdateThread(editingThreadId, e)}>
            <div className="mb-3">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Título
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Título del hilo"
                className="w-full p-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
                required
              />
              {formErrors.title && (
                <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
              )}
            </div>
            
            <div className="mb-3">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Contenido
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Describe el tema de discusión..."
                className="w-full p-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500 h-32"
                required
              />
              {formErrors.content && (
                <p className="mt-1 text-sm text-red-600">{formErrors.content}</p>
              )}
            </div>
            
            {/* Errores generales */}
            {formErrors.permission && (
              <div className="mb-3 p-2 bg-red-100 text-red-700 rounded">
                {formErrors.permission}
              </div>
            )}
            
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={cancelForm}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded hover:bg-green-700"
              >
                {isCreating ? 'Crear' : 'Guardar cambios'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de hilos */}
      <div className="p-4">
        {threads && threads.length > 0 ? (
          <div className="space-y-4">
            {threads.map((thread) => (
              <div key={thread.id} className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center mr-3 flex-shrink-0">
                      <MessageCircle size={20} className="text-gray-500" />
                    </div>
                    <div>
                      <h2 className="font-bold text-gray-800">{thread.title}</h2>
                      <p className="text-xs text-gray-500">
                        {thread.createdAt 
                          ? new Date(thread.createdAt).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })
                          : 'Fecha no disponible'
                        }
                      </p>
                    </div>
                  </div>
                  
                  {/* Acciones (editar/eliminar) con confirmación */}
                  <div className="flex space-x-2">
                    {canUpdateThread(thread) && (
                      <button
                        onClick={() => startEditing(thread)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                    )}
                    
                    {canDeleteThread(thread) && (
                      <button
                        onClick={() => {
                          if (window.confirm(`¿Estás seguro de eliminar el hilo "${thread.title}"?`)) {
                            handleDeleteThread(thread.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Contenido del hilo */}
                <div className="mt-3 text-gray-700 text-sm ml-12">
                  <p>{thread.content}</p>
                </div>
                
                {/* Acciones de participación */}
                <div className="mt-4 ml-12 flex items-center text-xs text-gray-500">
                  <div className="flex items-center mr-4">
                    <MessageCircle size={14} className="mr-1" />
                    <span>{thread.messageCount || 0} respuestas</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-500 mb-4">No hay hilos de discusión disponibles.</p>
            {canManageThreads() && (
              <button
                onClick={startCreating}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-green-700"
              >
                Crear el primer hilo
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};