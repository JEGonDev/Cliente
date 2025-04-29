import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

// Creamos el contexto para la autenticación
export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  login: async () => {},
  register: async () => {},
  registerAdmin: async () => {},
  logout: () => {}
});

// Proveedor de contexto que encapsula la lógica de autenticación
export const AuthProvider = ({ children }) => {
  // Estado del usuario autenticado
  const [user, setUser] = useState(() => authService.getCurrentUser());
  // Estado de autenticación (si hay token)
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  // Estado de rol administrador como booleano
  const [isAdmin, setIsAdmin] = useState(authService.isAdmin());

  // Al montar, sincronizamos el estado si ya existía sesión
  useEffect(() => {
    if (authService.isAuthenticated()) {
      setUser(authService.getCurrentUser());
      setIsAuthenticated(true);
      setIsAdmin(authService.isAdmin());
    }
  }, []);

  // Funciones que llamarán a authService y actualizarán el contexto
  const login = async (credentials) => {
    const { user: loggedUser } = await authService.login(credentials);
    setUser(loggedUser);
    setIsAuthenticated(true);
    setIsAdmin(authService.isAdmin());
    return loggedUser;
  };

  const register = async (userData) => {
    const { user: newUser } = await authService.register(userData);
    setUser(newUser);
    setIsAuthenticated(true);
    setIsAdmin(authService.isAdmin());
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
  };

  // Lo que exponemos a componentes consumidores
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
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