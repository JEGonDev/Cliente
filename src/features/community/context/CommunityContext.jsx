

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
  
  // ==================== FUNCIONES PARA POSTS ====================
  
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
  
  // ==================== FUNCIONES PARA GRUPOS ====================
  
  const fetchAllGroups = async () => {
    if (!isAuthenticated) return;

    setLoadingGroups(true);
    setGroupError(null);

    try {
      const response = await communityService.getAllGroups();
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
      setGroupError(error.message || 'Error al cargar los grupos');
    } finally {
      setLoadingGroups(false);
    }
  };

  const createGroup = async (groupData) => {
    if (!isAuthenticated) return;

    try {
      const response = await communityService.createGroup(groupData);
      setGroups((prevGroups) => [...prevGroups, response.data]);
      return response.data;
    } catch (error) {
      console.error('Error al crear grupo:', error);
      throw error;
    }
  };

  // ==================== FUNCIONES PARA HILOS ====================
  
  const fetchAllThreads = async () => {
    if (!isAuthenticated) return;

    setLoadingThreads(true);
    setThreadError(null);

    try {
      const response = await communityService.getAllThreads();
      setThreads(response.data);
    } catch (error) {
      console.error('Error fetching threads:', error);
      setThreadError(error.message || 'Error al cargar los hilos');
    } finally {
      setLoadingThreads(false);
    }
  };

  // ==================== FUNCIONES DE PERMISOS ====================
  
  const canEditPost = (postData) => {
    if (isAdmin) return true;
    return postData && user && postData.userId === user.id;
  };

  const canDeletePost = (postData) => {
    if (isAdmin) return true;
    return postData && user && postData.userId === user.id;
  };

  const canCreateGroup = () => {
    return isAdmin || isModerator;
  };

  // ==================== EFECTO PARA CARGAR DATOS INICIALES ====================
  
  useEffect(() => {
    if (isAuthenticated) {
      fetchAllPosts();
      fetchAllGroups();
      fetchAllThreads();
    }
  }, [isAuthenticated]);
  
  // ==================== VALOR DEL CONTEXTO ====================
  
  const value = {
    posts,
    post,
    loadingPosts,
    postError,
    fetchAllPosts,
    
    messages,
    message,
    loadingMessages,
    messageError,
    
    reactions,
    reaction,
    loadingReactions,
    reactionError,
    
    groups,
    group,
    loadingGroups,
    groupError,
    fetchAllGroups,
    createGroup,
    
    threads,
    thread,
    loadingThreads,
    threadError,
    fetchAllThreads,
    
    canEditPost,
    canDeletePost,
    canCreateGroup,
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

