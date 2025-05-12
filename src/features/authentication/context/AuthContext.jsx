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
  error: null,
  roles: []
});

// Proveedor de contexto que encapsula la lógica de autenticación
export const AuthProvider = ({ children }) => {
  // Estado del usuario autenticado
  const [user, setUser] = useState(null);
  // Estado de autenticación
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Estado de carga
  const [loading, setLoading] = useState(true);
  // Estado de error
  const [error, setError] = useState(null);
  // Estado para almacenar la lista de roles
  const [roles, setRoles] = useState([]);

  // Verificar autenticación al montar el componente
  const verifyAuthentication = useCallback(async () => {
    setLoading(true);
    try {
      // Verificar si está autenticado (valida la cookie en el backend)
      const isAuth = await authService.verifyAuth();
      
      if (isAuth) {
        // Obtener datos del usuario actual
        const userData = await authService.getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
        
        // Actualizar roles
        if (userData && userData.authorities) {
          setRoles(userData.authorities);
        }
      } else {
        // No está autenticado
        setUser(null);
        setIsAuthenticated(false);
        setRoles([]);
      }
    } catch (err) {
      console.error('Error verificando autenticación:', err);
      setError(err);
      setUser(null);
      setIsAuthenticated(false);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Verificar autenticación al montar el componente
  useEffect(() => {
    verifyAuthentication();
  }, [verifyAuthentication]);

  // Función para verificar si el usuario tiene un rol específico
  const hasRole = (role) => {
    if (!user || !user.authorities) return false;
    return user.authorities.includes(role);
  };

  // Funciones para determinar si el usuario es admin o moderador
  const isAdmin = user && hasRole('ADMINISTRADOR');
  const isModerator = user && hasRole('MODERADOR');

  // Funciones que llamarán a authService y actualizarán el contexto
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const userData = await authService.login(credentials);
      setUser(userData);
      setIsAuthenticated(true);
      
      // Actualizar roles
      if (userData && userData.authorities) {
        setRoles(userData.authorities);
      }
      
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
      
      // Actualizar roles
      if (newUser && newUser.authorities) {
        setRoles(newUser.authorities);
      }
      
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
      setRoles([]);
    } catch (err) {
      console.error('Error en logout:', err);
      setError(err);
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
        roles,
        login,
        register,
        registerAdmin,
        logout,
        loading,
        error,
        refreshAuth: verifyAuthentication
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};