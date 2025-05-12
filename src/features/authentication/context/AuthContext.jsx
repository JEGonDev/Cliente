import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

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
  // Estado del usuario autenticado (inicializado como null)
  const [user, setUser] = useState(null);
  
  // Estado de autenticación (inicializado como false)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Estado de carga
  const [loading, setLoading] = useState(true);
  
  // Estado de error
  const [error, setError] = useState(null);

  // Función para guardar el usuario en sessionStorage (como respaldo local)
  const saveUser = (userData) => {
    if (userData) {
      try {
        sessionStorage.setItem('auth_user', JSON.stringify(userData));
      } catch (e) {
        console.error("Error saving to sessionStorage:", e);
      }
    } else {
      sessionStorage.removeItem('auth_user');
    }
  };

  // Efecto para verificar la autenticación al iniciar la aplicación
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const isSessionValid = await refreshAuth();
        if (!isSessionValid && !isAuthenticated) {
          // Limpiar el estado y sessionStorage si no hay sesión válida
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

  // Verifica la sesión con una solicitud al backend
  const refreshAuth = async () => {
    try {
      // No requiere usuario previo, verifica directamente con el backend
      const response = await authService.checkSession();
      
      // Si la verificación fue exitosa y hay datos de usuario
      if (response && response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
        saveUser(response.data);
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error verificando autenticación:', err);
      
      // Si hay error 401 (no autenticado), limpia el estado
      if (err.response && err.response.status === 401) {
        setUser(null);
        setIsAuthenticated(false);
        saveUser(null);
        return false;
      }
      
      // Para otros errores, mantén el estado actual
      return isAuthenticated;
    }
  };

  // Funciones que llamarán a authService y actualizarán el contexto
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(credentials);
      // Después del login exitoso, obtener los datos del usuario
      const userData = response;
      
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