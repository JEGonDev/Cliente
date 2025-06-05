import { createContext, useState, useEffect, useContext } from 'react';
import { profileService } from '../services/profileService';
import { AuthContext } from '../../authentication/context/AuthContext';

export const ProfileContext = createContext({
  users: [],
  profile: null, // <--- perfil individual
  loading: false,
  error: null,
  fetchUsers: async () => {},
  createUser: async (userData) => {},
  updateUser: async (id, data) => {},
  updateUserProfile: async (data) => {}, // <--- updater de perfil propio
  deleteUser: async (id) => {},
});

export const ProfileProvider = ({ children }) => {
   console.log("ProfileProvider se está montando");
  const [users, setUsers] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtén el usuario autenticado del contexto de Auth (ajusta según tu AuthContext)
  const { user: authUser } = useContext(AuthContext);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await profileService.getAllUsers();
      setUsers(res.data || []);
    } catch (err) {
      setError(err.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Trae el perfil individual del usuario autenticado
  const fetchProfile = async () => {
    console.log("Fetching profile for user:", authUser);
    if (!authUser) return;
    setLoading(true);
    setError(null);
    try {
      const res = await profileService.getUserById(authUser.id);
      setProfile(res.data || null);
    } catch (err) {
      setError(err.message);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData) => { /* igual que antes */ };
  const updateUser = async (id, data) => { /* igual que antes */ };
  const deleteUser = async (id) => { /* igual que antes */ };

  // Nueva función para actualizar el perfil propio
  const updateUserProfile = async (data) => {
    if (!authUser) throw new Error("No hay usuario autenticado");
    setLoading(true);
    setError(null);
    try {
      const res = await profileService.updateUserInfo(authUser.id, data);
      setProfile(res.data || null);
      await fetchUsers(); // Si quieres refrescar la lista global
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("AuthUser en ProfileProvider:", authUser);
    fetchUsers();
    fetchProfile();
    // eslint-disable-next-line
  }, [authUser]);

  const value = {
    users,
    profile,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    updateUserProfile,
    deleteUser,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
      
    </ProfileContext.Provider>
  );
};

export const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (!context) throw new Error('useProfileContext debe ser usado dentro de un ProfileProvider');
  return context;
};

// import { createContext, useState, useEffect, useContext } from 'react';
// import { profileService } from '../services/profileService';
// import { AuthContext } from '../../authentication/context/AuthContext';

// export const ProfileContext = createContext({
//   users: [],
//   loading: false,
//   error: null,
//   fetchUsers: async () => {},
//   createUser: async (userData) => {},
//   updateUser: async (id, data) => {},
//   deleteUser: async (id) => {},
//   // ...otros métodos de perfil individual
// });

// export const ProfileProvider = ({ children }) => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const fetchUsers = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await profileService.getAllUsers();
//       setUsers(res.data || []);
//     } catch (err) {
//       setError(err.message);
//       setUsers([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const createUser = async (userData) => {
//     setLoading(true);
//     setError(null);
//     try {
//       await profileService.createUser(userData);
//       await fetchUsers();
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateUser = async (id, data) => {
//     setLoading(true);
//     setError(null);
//     try {
//       await profileService.updateUserInfo(id, data);
//       await fetchUsers();
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteUser = async (id) => {
//     setLoading(true);
//     setError(null);
//     try {
//       await profileService.deleteUser(id);
//       await fetchUsers();
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const value = {
//     users,
//     loading,
//     error,
//     fetchUsers,
//     createUser,
//     updateUser,
//     deleteUser
//   };

//   return (
//     <ProfileContext.Provider value={value}>
//       {children}
//     </ProfileContext.Provider>
//   );
// };

// export const useProfileContext = () => {
//   const context = useContext(ProfileContext);
//   if (!context) throw new Error('useProfileContext debe ser usado dentro de un ProfileProvider');
//   return context;
// };

// import { createContext, useState, useEffect, useContext } from 'react';
// import { profileService } from '../services/profileService';
// import { AuthContext } from '../../authentication/context/AuthContext';

// // Creamos el contexto para el perfil
// export const ProfileContext = createContext({
//   // Estado del perfil
//   profile: null,
//   loading: false,
//   error: null,
  
//   // Funciones para gestionar el perfil
//   getUserProfile: async (username) => {},
//   updateUserProfile: async (updateData) => {},
//   deleteUserAccount: async () => {},
  
//   // Función de utilidad
//   resetProfileState: () => {}
// });

// // Proveedor de contexto que encapsula la lógica del perfil
// export const ProfileProvider = ({ children }) => {
//   // Accedemos al contexto de autenticación para obtener datos del usuario autenticado
//   const { user, isAuthenticated, logout } = useContext(AuthContext);
  
//   // Estado para el perfil
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
  
//   // Efecto para cargar los datos del perfil al montar el componente si el usuario está autenticado
//   useEffect(() => {
//     if (isAuthenticated && user) {
//       getUserProfile(user.username);
//     }
//   }, [isAuthenticated, user]);
  
//   /**
//    * Obtiene el perfil de un usuario por su nombre de usuario
//    * @param {string} username - Nombre de usuario a buscar
//    */
//   const getUserProfile = async (username) => {
//     if (!isAuthenticated) return;
    
//     setLoading(true);
//     setError(null);
    
//     try {
//       const response = await profileService.getUserByUsername(username);
//       setProfile(response.data);
//       return response.data;
//     } catch (error) {
//       console.error(`Error obteniendo perfil de ${username}:`, error);
//       setError(error.message || `Error al cargar el perfil de ${username}`);
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   /**
//    * Actualiza el perfil del usuario actual
//    * @param {Object} updateData - Datos a actualizar
//    */
//   const updateUserProfile = async (updateData) => {
//     if (!isAuthenticated || !user) {
//       setError('Necesitas iniciar sesión para actualizar tu perfil');
//       return null;
//     }
    
//     setLoading(true);
//     setError(null);
    
//     try {
//       const response = await profileService.updateUserInfo(user.id, updateData);
//       // Actualizamos el perfil en el estado
//       setProfile(response.data);
//       return response.data;
//     } catch (error) {
//       console.error('Error actualizando perfil:', error);
//       setError(error.message || 'Error al actualizar el perfil');
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   /**
//    * Elimina la cuenta del usuario actual
//    */
//   const deleteUserAccount = async () => {
//     if (!isAuthenticated || !user) {
//       setError('Necesitas iniciar sesión para eliminar tu cuenta');
//       return false;
//     }
    
//     setLoading(true);
//     setError(null);
    
//     try {
//       await profileService.deleteUser(user.id);
//       // Al eliminar el usuario, cerramos su sesión
//       logout();
//       return true;
//     } catch (error) {
//       console.error('Error eliminando cuenta:', error);
//       setError(error.message || 'Error al eliminar la cuenta');
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   /**
//    * Resetea el estado del perfil
//    */
//   const resetProfileState = () => {
//     setProfile(null);
//     setError(null);
//   };
  
//   // Valor del contexto que exponemos a componentes consumidores
//   const value = {
//     // Estado del perfil
//     profile,
//     loading,
//     error,
    
//     // Funciones para gestionar el perfil
//     getUserProfile,
//     updateUserProfile,
//     deleteUserAccount,
    
//     // Función de utilidad
//     resetProfileState
//   };
  
//   return (
//     <ProfileContext.Provider value={value}>
//       {children}
//     </ProfileContext.Provider>
//   );
// };

// // Hook personalizado para acceder al contexto del perfil
// export const useProfileContext = () => {
//   const context = useContext(ProfileContext);
//   if (!context) {
//     throw new Error('useProfileContext debe ser usado dentro de un ProfileProvider');
//   }
//   return context;
// };