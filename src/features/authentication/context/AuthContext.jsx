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
  logout: () => {},
  roles: [] // Nuevo: lista de roles del usuario
});

// Proveedor de contexto que encapsula la lógica de autenticación
export const AuthProvider = ({ children }) => {
  // Estado del usuario autenticado
  const [user, setUser] = useState(() => authService.getCurrentUser());
  // Estado de autenticación (si hay token)
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  // Estado de rol administrador como booleano
  const [isAdmin, setIsAdmin] = useState(authService.isAdmin());
  // Estado de rol moderador como booleano
  const [isModerator, setIsModerator] = useState(authService.isModerator());
  // Estado para almacenar la lista de roles
  const [roles, setRoles] = useState([]);

  // Al montar, sincronizamos el estado si ya existía sesión
  useEffect(() => {
    if (authService.isAuthenticated()) {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      setIsAuthenticated(true);
      setIsAdmin(authService.isAdmin());
      setIsModerator(authService.isModerator());
      
      // Actualizar roles
      if (currentUser && currentUser.authorities) {
        setRoles(currentUser.authorities);
      }
    }
  }, []);

  // Función para verificar si el usuario tiene un rol específico
  const hasRole = (role) => {
    if (!user || !user.authorities) return false;
    return user.authorities.includes(role);
  };

  // Funciones que llamarán a authService y actualizarán el contexto
  const login = async (credentials) => {
    const result = await authService.login(credentials);
    const { user: loggedUser } = result;
    setUser(loggedUser);
    setIsAuthenticated(true);
    setIsAdmin(authService.isAdmin());
    setIsModerator(authService.isModerator());
    
    // Actualizar roles
    if (loggedUser && loggedUser.authorities) {
      setRoles(loggedUser.authorities);
    }
    
    return loggedUser;
  };

  const register = async (userData) => {
    const result = await authService.register(userData);
    const { user: newUser } = result;
    setUser(newUser);
    setIsAuthenticated(true);
    setIsAdmin(authService.isAdmin());
    setIsModerator(authService.isModerator());
    
    // Actualizar roles
    if (newUser && newUser.authorities) {
      setRoles(newUser.authorities);
    }
    
    return newUser;
  };

  const registerAdmin = async (userData) => {
    // Requiere que ya exista sesión y sea admin
    const result = await authService.registerAdmin(userData);
    return result;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    setIsModerator(false);
    setRoles([]);
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
        roles, // Exponemos los roles
        login,
        register,
        registerAdmin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};