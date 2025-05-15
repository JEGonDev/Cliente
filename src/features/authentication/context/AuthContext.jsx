import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { Storage } from '../../../storage/Storage'

// Creamos el contexto para la autenticación
export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  isModerator: false,
  hasRole: (role) => false,
  login: async () => {},
  register: async () => {},
  registerAdmin: async () => {},
  logout: async () => {},
  loading: false,
  error: null,
  refreshAuth: () => {}
});

// Proveedor de contexto que encapsula la lógica de autenticación
export const AuthProvider = ({ children }) => {

  // Intentamos cargar el usuario desde Storage al iniciar
  const savedUser = Storage.get('authUser');

  // Estado del usuario autenticado (inicializado con datos guardados si existen)
  const [user, setUser] = useState(savedUser);
  
  // Estado de autenticación (inicializado como true si hay usuario guardado)
  const [isAuthenticated, setIsAuthenticated] = useState(!!savedUser);
  
  // Estado de carga
  const [loading, setLoading] = useState(true);
  
  // Estado de error
  const [error, setError] = useState(null);

  // Función para guardar el usuario en localStorage (como respaldo local)
  const saveUser = (userData) => {
    if (userData) {
      try {
        Storage.set('authUser', userData);
      } catch (e) {
        console.error("Error saving to Storage:", e);
      }
    } else {
      Storage.remove('authUser');
    }
  };

  // Efecto para verificar la autenticación al iniciar la aplicación
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const isSessionValid = await refreshAuth();
        if (!isSessionValid && !isAuthenticated) {
          // Limpiar el estado y localStorage si no hay sesión válida
          setUser(null);
          setIsAuthenticated(false);
          saveUser(null);
        }
      } catch (err) {
        console.error("Error checking authentication status:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

    // Verifica la sesión con una solicitud al backend
  const refreshAuth = async () => {
    try {
      // Verificar con el backend
      const response = await authService.checkSession();
      
      // Si la verificación fue exitosa
      if (response && response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
        saveUser(response.data);
        return true;
      }
      
      // Si hay usuario almacenado pero no hay datos nuevos del backend
      // mantenemos la sesión si es posible
      if (response === true && user) {
        setIsAuthenticated(true);
        return true;
      }
      
      // Si no hay respuesta positiva ni usuario existente
      if (!user) {
        setIsAuthenticated(false);
        saveUser(null);
        return false;
      }
      
      // En caso de duda, mantener el estado actual
      return isAuthenticated;
    } catch (err) {
      console.error('Error verificando autenticación:', err);
      
      // Si hay error 401 (no autenticado), limpia el estado
      if (err.response && err.response.status === 401 || err.response.status === 403) {
        setUser(null);
        setIsAuthenticated(false);
        saveUser(null);
        return false;
      }
      
      // Para otros errores, mantener el estado actual si ya hay usuario
      return !!user;
    }
  };

  // Función para verificar si el usuario tiene un rol específico
  const hasRole = (role) => {
    if (!user) return false;
    
    // Verifica si el rol está en user.role (formato string)
    if (user.role) {
      return user.role === role;
    }
    
    // O en user.authorities (formato array)
    if (user.authorities && Array.isArray(user.authorities)) {
      return user.authorities.includes(role);
    }
    
    return false;
  };

  // Propiedades derivadas del usuario
  const isAdmin = user ? hasRole('ADMINISTRADOR') : false;
  const isModerator = user ? hasRole('MODERADOR') : false;

  // Funciones que llamarán a authService y actualizarán el contexto
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(credentials);
      // Después del login exitoso, obtener los datos del usuario
      const userData = response;
      console.log('Usuario autenticado:', userData);
      
      setUser(userData);
      setIsAuthenticated(true);
      saveUser(userData);
      
      return userData;
    } catch (err) {
      console.error('Error en login:', err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.register(userData);
      // Extrae los datos del usuario de la respuesta
      const newUser = response;
      
      setUser(newUser);
      setIsAuthenticated(true);
      saveUser(newUser);
      
      return newUser;
    } catch (err) {
      console.error('Error en registro:', err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registerAdmin = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Requiere que ya exista sesión y sea admin
      const response = await authService.registerAdmin(userData);
      return response;
    } catch (err) {
      console.error('Error en registro de admin:', err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      
      // Limpiamos el estado local
      setUser(null);
      setIsAuthenticated(false);
      saveUser(null);
    } catch (err) {
      console.error('Error en logout:', err);
      setError(err);
      
      // Incluso con error, limpiamos el estado local
      setUser(null);
      setIsAuthenticated(false);
      saveUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Lo que exponemos a componentes consumidores
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        isModerator,
        hasRole,
        login,
        register,
        registerAdmin,
        logout,
        loading,
        error,
        refreshAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};