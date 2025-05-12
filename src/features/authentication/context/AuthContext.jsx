import { createContext, useState, useEffect, useCallback } from 'react';
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
  error: null
});

// Proveedor de contexto que encapsula la lógica de autenticación
export const AuthProvider = ({ children }) => {
  // Estado del usuario autenticado
  const [user, setUser] = useState(null);
  // Estado de autenticación
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Estado de carga
  const [loading, setLoading] = useState(false);
  // Estado de error
  const [error, setError] = useState(null);

  // Verificar autenticación con una petición de prueba
  const checkSession = useCallback(async () => {
    setLoading(true);
    try {
      // Solo verificamos si hay sesión activa, sin obtener datos nuevos
      const isAuth = await authService.checkSession();
      setIsAuthenticated(isAuth);
      
      // Si no está autenticado, limpiamos el usuario
      if (!isAuth) {
        setUser(null);
      }
    } catch (err) {
      console.error('Error verificando sesión:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para verificar si el usuario tiene un rol específico
  const hasRole = useCallback((role) => {
    return user ? authService.hasRole(role, user) : false;
  }, [user]);

  // Propiedades derivadas del usuario
  const isAdmin = user ? authService.isAdmin(user) : false;
  const isModerator = user ? authService.isModerator(user) : false;

  // Funciones que llamarán a authService y actualizarán el contexto
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const userData = await authService.login(credentials);
      setUser(userData);
      setIsAuthenticated(true);
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
      const newUser = await authService.register(userData);
      setUser(newUser);
      setIsAuthenticated(true);
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
      return await authService.registerAdmin(userData);
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
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      console.error('Error en logout:', err);
      setError(err);
      // Incluso si falla el logout en el servidor, limpiamos la sesión local
      setUser(null);
      setIsAuthenticated(false);
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
        checkSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};