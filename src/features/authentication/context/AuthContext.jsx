// src/context/AuthContext.jsx
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

  // Al montar, sincronizamos el estado si ya existía sesión
  useEffect(() => {
    if (authService.isAuthenticated()) {
      setUser(authService.getCurrentUser());
      setIsAuthenticated(true);
    }
  }, []);

  // Funciones que llamarán a authService y actualizarán el contexto
  const login = async (credentials) => {
    const { user: loggedUser } = await authService.login(credentials);
    setUser(loggedUser);
    setIsAuthenticated(true);
    return loggedUser;
  };

  const register = async (userData) => {
    const { user: newUser } = await authService.register(userData);
    setUser(newUser);
    setIsAuthenticated(true);
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
  };

  const isAdmin = () => authService.isAdmin();

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
