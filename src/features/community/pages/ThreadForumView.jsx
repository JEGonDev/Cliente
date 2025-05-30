import React, { useState, useContext, useCallback, useRef } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import { MessageSquare, Users, Hash } from "lucide-react";
import { ThreadFormModal } from "../ui/ThreadFormModal";
import { AuthContext } from "../../authentication/context/AuthContext";
import { ThreadList } from "../ui/ThreadList";
import { MessageList } from "../ui/MessageList";
import { MessageForm } from "../ui/MessageForm";
import { useForumMessages } from "../hooks/useForumMessages";

export const ThreadForumView = () => {
  const { user } = useContext(AuthContext);
  const reloadThreadsRef = useRef(null);
  
  // Estados para la UI
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("messages"); // "messages" o "threads"

  // Hook para manejar mensajes del foro
  const {
    messages,
    loading: messagesLoading,
    error: messagesError,
    sendingMessage,
    sendForumMessage,
    deleteForumMessage,
    refreshMessages,
    clearError
  } = useForumMessages();

  // Callbacks optimizados
  const handleCloseModal = useCallback(() => setShowModal(false), []);
  
  // Handler que se ejecuta tras crear un hilo
  const handleThreadCreated = useCallback(() => {
    setShowModal(false);
    // Llama a la función de recarga si existe
    if (reloadThreadsRef.current) {
      reloadThreadsRef.current();
    }
  }, []);

  // Handler para enviar mensaje
  const handleSendMessage = useCallback(async (content) => {
    const result = await sendForumMessage(content);
    if (result) {
      // Mensaje enviado exitosamente
      console.log('Mensaje enviado:', result);
    }
  }, [sendForumMessage]);

  // Handler para eliminar mensaje
  const handleDeleteMessage = useCallback(async (messageId) => {
    return await deleteForumMessage(messageId);
  }, [deleteForumMessage]);

  // Cambiar entre pestañas
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (messagesError) {
      clearError();
    }
  };

  return (
    <div className="w-full px-0 sm:px-4 my-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-2 mb-6">
        <h1 className="text-2xl font-bold">Foro de Comunidad</h1>
        
        {/* Botón para crear hilo */}
        <button
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded font-semibold hover:bg-green-700 transition-colors"
          onClick={() => setShowModal(true)}
        >
          <FaPlus /> Crear hilo
        </button>
      </div>

      {/* Navegación por pestañas */}
      <div className="mb-6">
        <nav className="flex space-x-8 border-b border-gray-200">
          <button
            onClick={() => handleTabChange("messages")}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "messages"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Mensajes</span>
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                {messages.length}
              </span>
            </div>
          </button>
          
          <button
            onClick={() => handleTabChange("threads")}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "threads"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center space-x-2">
              <Hash className="w-4 h-4" />
              <span>Hilos de Discusión</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Barra de búsqueda (solo para hilos por ahora) */}
      {activeTab === "threads" && (
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
          <div className="flex-grow flex items-center gap-2">
            <input
              type="text"
              className="border rounded-full px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Buscar hilos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled
            />
            <button className="text-gray-600" tabIndex={-1} type="button" disabled>
              <FaSearch />
            </button>
          </div>
        </div>
      )}

      {/* Contenido de las pestañas */}
      <div className="space-y-6">
        {activeTab === "messages" ? (
          // Sección de Mensajes
          <div className="flex flex-col h-[calc(100vh-300px)] max-h-[600px]">
            {/* Lista de mensajes - Área scrolleable */}
            <div className="flex-1 overflow-y-auto mb-4">
              <MessageList
                messages={messages}
                isLoading={messagesLoading}
                error={messagesError}
                onDeleteMessage={handleDeleteMessage}
                onRefresh={refreshMessages}
                autoScroll={true}
              />
            </div>

            {/* Formulario para enviar mensaje - Fijo en la parte inferior */}
            <div className="flex-shrink-0 border-t border-gray-200 pt-4">
              <MessageForm 
                onSendMessage={handleSendMessage}
                isLoading={sendingMessage}
                placeholder="Comparte algo con la comunidad..."
              />
            </div>
          </div>
        ) : (
          // Sección de Hilos
          <div>
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Hash className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-blue-900">
                    Hilos de Discusión
                  </h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Los hilos son conversaciones organizadas sobre temas específicos. 
                    Crea un hilo para iniciar una discusión profunda sobre un tema particular.
                  </p>
                </div>
              </div>
            </div>

            {/* Lista de hilos */}
            <ThreadList 
              groupId={null}
              refetchRef={reloadThreadsRef}
            />
          </div>
        )}
      </div>

      {/* Modal para crear hilo */}
      {showModal && (
        <ThreadFormModal
          groupId={null}
          onClose={handleCloseModal}
          onThreadCreated={handleThreadCreated}
        />
      )}
    </div>
  );
};