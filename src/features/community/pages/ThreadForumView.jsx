import React, {
  useState,
  useContext,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { useAuthRoles } from "../../authentication/hooks/useAuthRoles";
import { FaPlus, FaSearch } from "react-icons/fa";
import { MessageSquare, Hash, Wifi, WifiOff, User } from "lucide-react";
import { ThreadFormModal } from "../ui/ThreadFormModal";
import { AuthContext } from "../../authentication/context/AuthContext";
import { ThreadList } from "../ui/ThreadList";
import { MessageList } from "../ui/MessageList";
import { MessageForm } from "../ui/MessageForm";
import { useForumMessages } from "../hooks/useForumMessages";
import { websocketService } from "../../../common/services/webSocketService";

export const ThreadForumView = () => {
  const { user } = useContext(AuthContext);
  const { isAdmin } = useAuthRoles();
  const reloadThreadsRef = useRef(null);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("messages");
  const [wsConnected, setWsConnected] = useState(false);
  const [showOnlyUserThreads, setShowOnlyUserThreads] = useState(false);
  const [selectedThreadId, setSelectedThreadId] = useState(null);

  const {
    messages,
    loading: messagesLoading,
    error: messagesError,
    sendingMessage,
    sendForumMessage,
    deleteForumMessage,
    refreshMessages,
    clearError,
  } = useForumMessages();

  useEffect(() => {
    const checkConnection = () =>
      setWsConnected(websocketService.isConnected());
    checkConnection();
    const interval = setInterval(checkConnection, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleThreadCreated = useCallback(async () => {
    setShowModal(false);
    if (reloadThreadsRef.current) {
      await reloadThreadsRef.current(); // recarga la lista de hilos desde el hijo
    }
  }, []);

  const handleToggleUserThreads = () => {
    setShowOnlyUserThreads((v) => !v);
    setSelectedThreadId(null);
  };

  const handleSearch = (e) => setSearch(e.target.value);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedThreadId(null);
    if (messagesError) clearError();
  };

  const handleSendMessage = useCallback(
    async (content) => {
      const result = await sendForumMessage(content);
      if (result) {
        /* ... */
      }
    },
    [sendForumMessage]
  );

  const handleDeleteMessage = useCallback(
    async (messageId) => {
      return await deleteForumMessage(messageId);
    },
    [deleteForumMessage]
  );

  return (
    <div className="w-full px-0 sm:px-4 my-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-2 mb-6 gap-2">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight font-poppins mb-4 bg-gradient-to-r from-[#23582a] via-[#059669] to-[#10b981] bg-clip-text text-transparent">
            Foro de la Comunidad{" "}
          </h1>

          {/* Indicador de conexión WebSocket */}
          <div
            className={`flex items-center gap-1 text-sm ${
              wsConnected ? "text-green-600" : "text-red-600"
            }`}
          >
            {wsConnected ? (
              <>
                <Wifi className="w-4 h-4" />
                <span className="hidden sm:inline">Conectado</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4" />
                <span className="hidden sm:inline">Desconectado</span>
              </>
            )}
          </div>
        </div>
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
      {/* Barra de búsqueda y filtro de usuario (solo para hilos) */}
      {activeTab === "threads" && (
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
          <div className="flex-grow flex items-center gap-2 w-full">
            <input
              type="text"
              className="border rounded-full px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Buscar hilos por título o contenido..."
              value={search}
              onChange={handleSearch}
              autoFocus
            />
            <button
              className="text-gray-600"
              tabIndex={-1}
              type="button"
              disabled
            >
              <FaSearch />
            </button>
          </div>
          {user && isAdmin && (
            <button
              onClick={handleToggleUserThreads}
              className={`flex items-center gap-2 px-3 py-2 rounded-full border font-medium text-sm transition-colors
                ${
                  showOnlyUserThreads
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              title={
                showOnlyUserThreads
                  ? "Mostrar todos los hilos"
                  : "Mostrar solo mis hilos"
              }
            >
              <User className="w-4 h-4" />
              {showOnlyUserThreads ? "Mis hilos" : "Filtrar mis hilos"}
            </button>
          )}
        </div>
      )}
      {/* Contenido de las pestañas */}
      <div className="space-y-6">
        {activeTab === "messages" ? (
          <div className="flex flex-col h-[calc(100vh-300px)] max-h-[600px]">
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
            <div className="flex-shrink-0 border-t border-gray-200 pt-4">
              <MessageForm
                onSendMessage={handleSendMessage}
                isLoading={sendingMessage}
                placeholder="Comparte algo con la comunidad..."
                disabled={!wsConnected}
              />
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Hash className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-blue-900">
                    Hilos de Discusión
                  </h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Los hilos son conversaciones organizadas sobre temas
                    específicos. Crea un hilo para iniciar una discusión
                    profunda sobre un tema particular.
                  </p>
                </div>
              </div>
            </div>
            <ThreadList
              refetchRef={reloadThreadsRef}
              userId={showOnlyUserThreads && user ? user.id : undefined}
              search={search}
              showCards={true}
              selectedThreadId={selectedThreadId}
              onSelectThread={setSelectedThreadId}
              modalOpen={showModal}
            />
          </div>
        )}
      </div>
      {/* Modal para crear hilo */}
      {showModal && (
        <ThreadFormModal
          groupId={null}
          onClose={() => setShowModal(false)}
          onThreadCreated={handleThreadCreated}
        />
      )}
    </div>
  );
};