import { createContext, useState, useEffect, useContext } from 'react';
import { communityService } from '../services/communityService';
import { AuthContext } from '../../authentication/context/AuthContext';

// Creamos el contexto para la comunidad
export const CommunityContext = createContext({
  // Estado de posts
  posts: [],
  post: null,
  loadingPosts: false,
  postError: null,
  
  // Estado de mensajes
  messages: [],
  message: null,
  loadingMessages: false,
  messageError: null,
  
  // Estado de reacciones
  reactions: [],
  reaction: null,
  loadingReactions: false,
  reactionError: null,
  
  // Estado de grupos
  groups: [],
  group: null,
  loadingGroups: false,
  groupError: null,
  
  // Estado de hilos
  threads: [],
  thread: null,
  loadingThreads: false,
  threadError: null,
  
  // Funciones para posts
  fetchAllPosts: async () => {},
  fetchPostById: async (id) => {},
  createPost: async (postData) => {},
  updatePost: async (id, updateData) => {},
  deletePost: async (id) => {},
  
  // Funciones para mensajes
  fetchAllMessages: async () => {},
  fetchMessageById: async (id) => {},
  createMessage: async (messageData) => {},
  deleteMessage: async (id) => {},
  
  // Funciones para reacciones
  fetchAllReactions: async () => {},
  fetchReactionById: async (id) => {},
  createReaction: async (reactionData) => {},
  deleteReaction: async (id) => {},
  
  // Funciones para grupos
  fetchAllGroups: async () => {},
  fetchGroupById: async (id) => {},
  createGroup: async (groupData) => {},
  updateGroup: async (id, updateData) => {},
  deleteGroup: async (id) => {},
  joinGroup: async (groupId) => {},
  
  // Funciones para hilos
  fetchAllThreads: async () => {},
  fetchThreadById: async (id) => {},
  createThread: async (threadData) => {},
  updateThread: async (id, updateData) => {},
  deleteThread: async (id) => {},
  
  // Funciones de verificación de roles y permisos
  canEditPost: (postData) => false,
  canDeletePost: (postData) => false,
  canDeleteMessage: (messageData) => false,
  canCreateGroup: () => false,
  canEditGroup: () => false,
  canDeleteGroup: () => false,
  canCreateThread: () => false,
  canEditThread: (threadData) => false,
  canDeleteThread: (threadData) => false,
});

// Proveedor de contexto que encapsula la lógica de comunidad
export const CommunityProvider = ({ children }) => {
  // Accedemos al contexto de autenticación para verificar que el usuario esté autenticado
  const { 
    isAuthenticated, 
    isAdmin, 
    isModerator, 
    user,
    hasRole 
  } = useContext(AuthContext);
  
  // Estado para posts
  const [posts, setPosts] = useState([]);
  const [post, setPost] = useState(null);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [postError, setPostError] = useState(null);
  
  // Estado para mensajes
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messageError, setMessageError] = useState(null);
  
  // Estado para reacciones
  const [reactions, setReactions] = useState([]);
  const [reaction, setReaction] = useState(null);
  const [loadingReactions, setLoadingReactions] = useState(false);
  const [reactionError, setReactionError] = useState(null);
  
  // Estado para grupos
  const [groups, setGroups] = useState([]);
  const [group, setGroup] = useState(null);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [groupError, setGroupError] = useState(null);
  
  // Estado para hilos
  const [threads, setThreads] = useState([]);
  const [thread, setThread] = useState(null);
  const [loadingThreads, setLoadingThreads] = useState(false);
  const [threadError, setThreadError] = useState(null);
  
  // Efecto para cargar datos iniciales al montar el componente si el usuario está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      fetchAllPosts();
      fetchAllGroups();
      fetchAllThreads();
    }
  }, [isAuthenticated]);
  
  // ==================== FUNCIONES DE VERIFICACIÓN DE ROLES Y PERMISOS ====================
  
  /**
   * Verifica si el usuario puede editar un post
   * @param {Object} postData - Datos del post
   * @returns {boolean} true si puede editar, false si no
   */
  const canEditPost = (postData) => {
    // Los administradores pueden editar cualquier post
    if (isAdmin) return true;
    
    // El creador del post puede editar su propio post
    return postData && user && postData.userId === user.id;
  };
  
  /**
   * Verifica si el usuario puede eliminar un post
   * @param {Object} postData - Datos del post
   * @returns {boolean} true si puede eliminar, false si no
   */
  const canDeletePost = (postData) => {
    // Los administradores pueden eliminar cualquier post
    if (isAdmin) return true;
    
    // El creador del post puede eliminar su propio post
    return postData && user && postData.userId === user.id;
  };
  
  /**
   * Verifica si el usuario puede eliminar un mensaje
   * @param {Object} messageData - Datos del mensaje
   * @returns {boolean} true si puede eliminar, false si no
   */
  const canDeleteMessage = (messageData) => {
    // Los administradores y moderadores pueden eliminar cualquier mensaje
    if (isAdmin || isModerator) return true;
    
    // El creador del mensaje puede eliminar su propio mensaje
    return messageData && user && messageData.userId === user.id;
  };
  
  /**
   * Verifica si el usuario puede crear un grupo
   * @returns {boolean} true si puede crear, false si no
   */
  const canCreateGroup = () => {
    // Solo los administradores y moderadores pueden crear grupos
    return isAdmin || isModerator;
  };
  
  /**
   * Verifica si el usuario puede editar la información de un grupo
   * @returns {boolean} true si puede editar, false si no
   */
  const canEditGroup = () => {
    // Solo los administradores y moderadores pueden editar la información de un grupo
    return isAdmin || isModerator;
  };
  
  /**
   * Verifica si el usuario puede eliminar un grupo
   * @returns {boolean} true si puede eliminar, false si no
   */
  const canDeleteGroup = () => {
    // Solo los administradores pueden eliminar grupos
    return isAdmin;
  };
  
  /**
   * Verifica si el usuario puede crear un hilo
   * @returns {boolean} true si puede crear, false si no
   */
  const canCreateThread = () => {
    // Solo los administradores y moderadores pueden crear hilos
    return isAdmin || isModerator;
  };
  
  /**
   * Verifica si el usuario puede editar un hilo
   * @param {Object} threadData - Datos del hilo
   * @returns {boolean} true si puede editar, false si no
   */
  const canEditThread = (threadData) => {
    // El creador del hilo puede editarlo
    return threadData && user && threadData.userId === user.id;
  };
  
  /**
   * Verifica si el usuario puede eliminar un hilo
   * @param {Object} threadData - Datos del hilo
   * @returns {boolean} true si puede eliminar, false si no
   */
  const canDeleteThread = (threadData) => {
    // Los administradores pueden eliminar cualquier hilo
    if (isAdmin) return true;
    
    // El creador del hilo puede eliminar su propio hilo
    return threadData && user && threadData.userId === user.id;
  };
  
  // ==================== Funcioens para posts ====================
  
  /**
   * Obtiene todos los posts
   */
  const fetchAllPosts = async () => {
    if (!isAuthenticated) return;
    
    setLoadingPosts(true);
    setPostError(null);
    
    try {
      const response = await communityService.getAllPosts();
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPostError(error.message || 'Error al cargar los posts');
    } finally {
      setLoadingPosts(false);
    }
  };
  
  /**
   * Obtiene un post por su ID
   * @param {number} id - ID del post
   */
  const fetchPostById = async (id) => {
    if (!isAuthenticated) return;
    
    setLoadingPosts(true);
    setPostError(null);
    
    try {
      const response = await communityService.getPostById(id);
      setPost(response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching post ${id}:`, error);
      setPostError(error.message || `Error al cargar el post ${id}`);
      return null;
    } finally {
      setLoadingPosts(false);
    }
  };
  
  /**
   * Crea un nuevo post
   * @param {Object} postData - Datos del post
   */
  const createPost = async (postData) => {
    if (!isAuthenticated) return;
    
    setLoadingPosts(true);
    setPostError(null);
    
    try {
      const response = await communityService.createPost(postData);
      // Actualizamos la lista de posts
      setPosts(prevPosts => [response.data, ...prevPosts]);
      return response.data;
    } catch (error) {
      console.error('Error creating post:', error);
      setPostError(error.message || 'Error al crear el post');
      return null;
    } finally {
      setLoadingPosts(false);
    }
  };
  
  /**
   * Actualiza un post existente
   * @param {number} id - ID del post
   * @param {Object} updateData - Datos a actualizar
   */
  const updatePost = async (id, updateData) => {
    if (!isAuthenticated) return;
    
    setLoadingPosts(true);
    setPostError(null);
    
    try {
      // Primero verificamos si el usuario puede editar este post
      const postData = await fetchPostById(id);
      if (!postData) {
        throw new Error('No se pudo encontrar el post');
      }
      
      if (!canEditPost(postData)) {
        throw new Error('No tienes permisos para editar este post');
      }
      
      const response = await communityService.updatePost(id, updateData);
      // Actualizamos el post en la lista
      setPosts(prevPosts => 
        prevPosts.map(post => post.id === id ? response.data : post)
      );
      // Si el post actual es el que se actualizó, actualizamos también el estado
      if (post && post.id === id) {
        setPost(response.data);
      }
      return response.data;
    } catch (error) {
      console.error(`Error updating post ${id}:`, error);
      setPostError(error.message || `Error al actualizar el post ${id}`);
      return null;
    } finally {
      setLoadingPosts(false);
    }
  };
  
  /**
   * Elimina un post
   * @param {number} id - ID del post
   */
  const deletePost = async (id) => {
    if (!isAuthenticated) return;
    
    setLoadingPosts(true);
    setPostError(null);
    
    try {
      // Primero verificamos si el usuario puede eliminar este post
      const postData = await fetchPostById(id);
      if (!postData) {
        throw new Error('No se pudo encontrar el post');
      }
      
      if (!canDeletePost(postData)) {
        throw new Error('No tienes permisos para eliminar este post');
      }
      
      await communityService.deletePost(id);
      // Eliminamos el post de la lista
      setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
      // Si el post actual es el que se eliminó, limpiamos el estado
      if (post && post.id === id) {
        setPost(null);
      }
      return true;
    } catch (error) {
      console.error(`Error deleting post ${id}:`, error);
      setPostError(error.message || `Error al eliminar el post ${id}`);
      return false;
    } finally {
      setLoadingPosts(false);
    }
  };
  
  // ==================== Funciones para mensajes ====================
  
  /**
   * Obtiene todos los mensajes
   */
  const fetchAllMessages = async () => {
    if (!isAuthenticated) return;
    
    setLoadingMessages(true);
    setMessageError(null);
    
    try {
      const response = await communityService.getAllMessages();
      setMessages(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessageError(error.message || 'Error al cargar los mensajes');
      return null;
    } finally {
      setLoadingMessages(false);
    }
  };
  
  /**
   * Obtiene un mensaje por su ID
   * @param {number} id - ID del mensaje
   */
  const fetchMessageById = async (id) => {
    if (!isAuthenticated) return;
    
    setLoadingMessages(true);
    setMessageError(null);
    
    try {
      const response = await communityService.getMessageById(id);
      setMessage(response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching message ${id}:`, error);
      setMessageError(error.message || `Error al cargar el mensaje ${id}`);
      return null;
    } finally {
      setLoadingMessages(false);
    }
  };
  
  /**
   * Crea un nuevo mensaje
   * @param {Object} messageData - Datos del mensaje
   */
  const createMessage = async (messageData) => {
    if (!isAuthenticated) return;
    
    setLoadingMessages(true);
    setMessageError(null);
    
    try {
      const response = await communityService.createMessage(messageData);
      // Actualizamos la lista de mensajes
      setMessages(prevMessages => [response.data, ...prevMessages]);
      return response.data;
    } catch (error) {
      console.error('Error creating message:', error);
      setMessageError(error.message || 'Error al crear el mensaje');
      return null;
    } finally {
      setLoadingMessages(false);
    }
  };
  
  /**
   * Elimina un mensaje
   * @param {number} id - ID del mensaje
   */
  const deleteMessage = async (id) => {
    if (!isAuthenticated) return;
    
    setLoadingMessages(true);
    setMessageError(null);
    
    try {
      // Primero verificamos si el usuario puede eliminar este mensaje
      const messageData = await fetchMessageById(id);
      if (!messageData) {
        throw new Error('No se pudo encontrar el mensaje');
      }
      
      if (!canDeleteMessage(messageData)) {
        throw new Error('No tienes permisos para eliminar este mensaje');
      }
      
      await communityService.deleteMessage(id);
      // Eliminamos el mensaje de la lista
      setMessages(prevMessages => prevMessages.filter(message => message.id !== id));
      // Si el mensaje actual es el que se eliminó, limpiamos el estado
      if (message && message.id === id) {
        setMessage(null);
      }
      return true;
    } catch (error) {
      console.error(`Error deleting message ${id}:`, error);
      setMessageError(error.message || `Error al eliminar el mensaje ${id}`);
      return false;
    } finally {
      setLoadingMessages(false);
    }
  };
  
  // ==================== Funciones para reacciones ====================
  
  /**
   * Obtiene todas las reacciones
   */
  const fetchAllReactions = async () => {
    if (!isAuthenticated) return;
    
    setLoadingReactions(true);
    setReactionError(null);
    
    try {
      const response = await communityService.getAllReactions();
      setReactions(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching reactions:', error);
      setReactionError(error.message || 'Error al cargar las reacciones');
      return null;
    } finally {
      setLoadingReactions(false);
    }
  };
  
  /**
   * Obtiene una reacción por su ID
   * @param {number} id - ID de la reacción
   */
  const fetchReactionById = async (id) => {
    if (!isAuthenticated) return;
    
    setLoadingReactions(true);
    setReactionError(null);
    
    try {
      const response = await communityService.getReactionById(id);
      setReaction(response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching reaction ${id}:`, error);
      setReactionError(error.message || `Error al cargar la reacción ${id}`);
      return null;
    } finally {
      setLoadingReactions(false);
    }
  };
  
  /**
   * Crea una nueva reacción
   * @param {Object} reactionData - Datos de la reacción
   */
  const createReaction = async (reactionData) => {
    if (!isAuthenticated) return;
    
    setLoadingReactions(true);
    setReactionError(null);
    
    try {
      const response = await communityService.createReaction(reactionData);
      // Actualizamos la lista de reacciones
      setReactions(prevReactions => [response.data, ...prevReactions]);
      return response.data;
    } catch (error) {
      console.error('Error creating reaction:', error);
      setReactionError(error.message || 'Error al crear la reacción');
      return null;
    } finally {
      setLoadingReactions(false);
    }
  };
  
  /**
   * Elimina una reacción
   * @param {number} id - ID de la reacción
   */
  const deleteReaction = async (id) => {
    if (!isAuthenticated) return;
    
    setLoadingReactions(true);
    setReactionError(null);
    
    try {
      await communityService.deleteReaction(id);
      // Eliminamos la reacción de la lista
      setReactions(prevReactions => prevReactions.filter(reaction => reaction.id !== id));
      // Si la reacción actual es la que se eliminó, limpiamos el estado
      if (reaction && reaction.id === id) {
        setReaction(null);
      }
      return true;
    } catch (error) {
      console.error(`Error deleting reaction ${id}:`, error);
      setReactionError(error.message || `Error al eliminar la reacción ${id}`);
      return false;
    } finally {
      setLoadingReactions(false);
    }
  };
  
  // ==================== Funciones para grupos ====================
  
  /**
   * Obtiene todos los grupos
   */
  const fetchAllGroups = async () => {
    if (!isAuthenticated) return;
    
    setLoadingGroups(true);
    setGroupError(null);
    
    try {
      const response = await communityService.getAllGroups();
      setGroups(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching groups:', error);
      setGroupError(error.message || 'Error al cargar los grupos');
      return null;
    } finally {
      setLoadingGroups(false);
    }
  };
  
  /**
   * Obtiene un grupo por su ID
   * @param {number} id - ID del grupo
   */
  const fetchGroupById = async (id) => {
    if (!isAuthenticated) return;
    
    setLoadingGroups(true);
    setGroupError(null);
    
    try {
      const response = await communityService.getGroupById(id);
      setGroup(response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching group ${id}:`, error);
      setGroupError(error.message || `Error al cargar el grupo ${id}`);
      return null;
    } finally {
      setLoadingGroups(false);
    }
  };
  
  /**
   * Crea un nuevo grupo
   * @param {Object} groupData - Datos del grupo
   */
  const createGroup = async (groupData) => {
    if (!isAuthenticated) return;
    
    // Verificamos que el usuario tenga permisos para crear grupos
    if (!canCreateGroup()) {
      setGroupError('No tienes permisos para crear grupos');
      return null;
    }
    
    setLoadingGroups(true);
    setGroupError(null);
    
    try {
      const response = await communityService.createGroup(groupData);
      // Actualizamos la lista de grupos
      setGroups(prevGroups => [response.data, ...prevGroups]);
      return response.data;
    } catch (error) {
      console.error('Error creating group:', error);
      setGroupError(error.message || 'Error al crear el grupo');
      return null;
    } finally {
      setLoadingGroups(false);
    }
  };
  
  /**
   * Actualiza un grupo existente
   * @param {number} id - ID del grupo
   * @param {Object} updateData - Datos a actualizar
   */
  const updateGroup = async (id, updateData) => {
    if (!isAuthenticated) return;
    
    // Verificamos que el usuario tenga permisos para editar grupos
    if (!canEditGroup()) {
      setGroupError('No tienes permisos para editar grupos');
      return null;
    }
    
    setLoadingGroups(true);
    setGroupError(null);
    
    try {
      const response = await communityService.updateGroup(id, updateData);
      // Actualizamos el grupo en la lista
      setGroups(prevGroups => 
        prevGroups.map(group => group.id === id ? response.data : group)
      );
      // Si el grupo actual es el que se actualizó, actualizamos también el estado
      if (group && group.id === id) {
        setGroup(response.data);
      }
      return response.data;
    } catch (error) {
      console.error(`Error updating group ${id}:`, error);
      setGroupError(error.message || `Error al actualizar el grupo ${id}`);
      return null;
    } finally {
      setLoadingGroups(false);
    }
  };
  
  /**
   * Elimina un grupo
   * @param {number} id - ID del grupo
   */
  const deleteGroup = async (id) => {
    if (!isAuthenticated) return;
    
    // Verificamos que el usuario tenga permisos para eliminar grupos
    if (!canDeleteGroup()) {
      setGroupError('No tienes permisos para eliminar grupos');
      return false;
    }
    
    setLoadingGroups(true);
    setGroupError(null);
    
    try {
      await communityService.deleteGroup(id);
      // Eliminamos el grupo de la lista
      setGroups(prevGroups => prevGroups.filter(group => group.id !== id));
      // Si el grupo actual es el que se eliminó, limpiamos el estado
      if (group && group.id === id) {
        setGroup(null);
      }
      return true;
    } catch (error) {
      console.error(`Error deleting group ${id}:`, error);
      setGroupError(error.message || `Error al eliminar el grupo ${id}`);
      return false;
    } finally {
      setLoadingGroups(false);
    }
  };
  
  /**
   * Permite al usuario unirse a un grupo
   * @param {number} groupId - ID del grupo al que unirse
   */
  const joinGroup = async (groupId) => {
    if (!isAuthenticated) return;
    
    setLoadingGroups(true);
    setGroupError(null);
    
    try {
      const response = await communityService.joinGroup(groupId);
      // Actualizamos el estado según la respuesta si es necesario
      await fetchAllGroups(); // Refrescamos la lista de grupos
      return response;
    } catch (error) {
      console.error(`Error joining group ${groupId}:`, error);
      setGroupError(error.message || `Error al unirse al grupo ${groupId}`);
      return null;
    } finally {
      setLoadingGroups(false);
    }
  };
  
  // ==================== Funciones para hilos ====================
  
  /**
   * Obtiene todos los hilos
   */
  const fetchAllThreads = async () => {
    if (!isAuthenticated) return;
    
    setLoadingThreads(true);
    setThreadError(null);
    
    try {
      const response = await communityService.getAllThreads();
      setThreads(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching threads:', error);
      setThreadError(error.message || 'Error al cargar los hilos');
      return null;
    } finally {
      setLoadingThreads(false);
    }
  };
  
  /**
   * Obtiene un hilo por su ID
   * @param {number} id - ID del hilo
   */
  const fetchThreadById = async (id) => {
    if (!isAuthenticated) return;
    
    setLoadingThreads(true);
    setThreadError(null);
    
    try {
      const response = await communityService.getThreadById(id);
      setThread(response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching thread ${id}:`, error);
      setThreadError(error.message || `Error al cargar el hilo ${id}`);
      return null;
    } finally {
      setLoadingThreads(false);
    }
  };
  
  /**
   * Crea un nuevo hilo
   * @param {Object} threadData - Datos del hilo
   */
  const createThread = async (threadData) => {
    if (!isAuthenticated) return;
    
    // Verificamos que el usuario tenga permisos para crear hilos
    if (!canCreateThread()) {
      setThreadError('No tienes permisos para crear hilos');
      return null;
    }
    
    setLoadingThreads(true);
    setThreadError(null);
    
    try {
      const response = await communityService.createThread(threadData);
      // Actualizamos la lista de hilos
      setThreads(prevThreads => [response.data, ...prevThreads]);
      return response.data;
    } catch (error) {
      console.error('Error creating thread:', error);
      setThreadError(error.message || 'Error al crear el hilo');
      return null;
    } finally {
      setLoadingThreads(false);
    }
  };
  
  /**
   * Actualiza un hilo existente
   * @param {number} id - ID del hilo
   * @param {Object} updateData - Datos a actualizar
   */
  const updateThread = async (id, updateData) => {
    if (!isAuthenticated) return;
    
    setLoadingThreads(true);
    setThreadError(null);
    
    try {
      // Primero verificamos si el usuario puede editar este hilo
      const threadData = await fetchThreadById(id);
      if (!threadData) {
        throw new Error('No se pudo encontrar el hilo');
      }
      
      if (!canEditThread(threadData)) {
        throw new Error('No tienes permisos para editar este hilo');
      }
      
      const response = await communityService.updateThread(id, updateData);
      // Actualizamos el hilo en la lista
      setThreads(prevThreads => 
        prevThreads.map(thread => thread.id === id ? response.data : thread)
      );
      // Si el hilo actual es el que se actualizó, actualizamos también el estado
      if (thread && thread.id === id) {
        setThread(response.data);
      }
      return response.data;
    } catch (error) {
      console.error(`Error updating thread ${id}:`, error);
      setThreadError(error.message || `Error al actualizar el hilo ${id}`);
      return null;
    } finally {
      setLoadingThreads(false);
    }
  };
  
  /**
   * Elimina un hilo
   * @param {number} id - ID del hilo
   */
  const deleteThread = async (id) => {
    if (!isAuthenticated) return;
    
    setLoadingThreads(true);
    setThreadError(null);
    
    try {
      // Primero verificamos si el usuario puede eliminar este hilo
      const threadData = await fetchThreadById(id);
      if (!threadData) {
        throw new Error('No se pudo encontrar el hilo');
      }
      
      if (!canDeleteThread(threadData)) {
        throw new Error('No tienes permisos para eliminar este hilo');
      }
      
      await communityService.deleteThread(id);
      // Eliminamos el hilo de la lista
      setThreads(prevThreads => prevThreads.filter(thread => thread.id !== id));
      // Si el hilo actual es el que se eliminó, limpiamos el estado
      if (thread && thread.id === id) {
        setThread(null);
      }
      return true;
    } catch (error) {
      console.error(`Error deleting thread ${id}:`, error);
      setThreadError(error.message || `Error al eliminar el hilo ${id}`);
      return false;
    } finally {
      setLoadingThreads(false);
    }
  };
  
  // Valor del contexto que exponemos a componentes consumidores
  const value = {
    // Estado de posts
    posts,
    post,
    loadingPosts,
    postError,
    
    // Estado de mensajes
    messages,
    message,
    loadingMessages,
    messageError,
    
    // Estado de reacciones
    reactions,
    reaction,
    loadingReactions,
    reactionError,
    
    // Estado de grupos
    groups,
    group,
    loadingGroups,
    groupError,
    
    // Estado de hilos
    threads,
    thread,
    loadingThreads,
    threadError,
    
    // Funciones para posts
    fetchAllPosts,
    fetchPostById,
    createPost,
    updatePost,
    deletePost,
    
    // Funciones para mensajes
    fetchAllMessages,
    fetchMessageById,
    createMessage,
    deleteMessage,
    
    // Funciones para reacciones
    fetchAllReactions,
    fetchReactionById,
    createReaction,
    deleteReaction,
    
    // Funciones para grupos
    fetchAllGroups,
    fetchGroupById,
    createGroup,
    updateGroup,
    deleteGroup,
    joinGroup,
    
    // Funciones para hilos
    fetchAllThreads,
    fetchThreadById,
    createThread,
    updateThread,
    deleteThread,
    
    // Funciones de verificación de roles y permisos
    canEditPost,
    canDeletePost,
    canDeleteMessage,
    canCreateGroup,
    canEditGroup,
    canDeleteGroup,
    canCreateThread,
    canEditThread,
    canDeleteThread,
  };
  
  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  );
};

// Hook personalizado para acceder al contexto de comunidad
export const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error('useCommunity debe ser usado dentro de un CommunityProvider');
  }
  return context;
};