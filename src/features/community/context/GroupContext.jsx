import React, { createContext, useState, useCallback, useMemo, useEffect, useContext } from 'react';
import { communityService } from '../services/communityService';
import { AuthContext } from '../../authentication/context/AuthContext';

/**
 * Contexto global para manejar los grupos en Germogli.
 * Expone el estado de los grupos, loading, error y las funciones fetchGroups, fetchGroupsByUser y fetchGroupById.
 */
export const GroupContext = createContext();

export const GroupProvider = ({ children }) => {
  const { isAuthenticated, loading: authLoading, user } = useContext(AuthContext);

  // Estado global de grupos
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Función para pedir TODOS los grupos desde el backend.
   */
  const fetchGroups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await communityService.getAllGroups();
      setGroups(response?.data || []);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Error al cargar grupos'
      );
      setGroups([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Función para pedir SOLO los grupos del usuario autenticado (o de un userId específico).
   */
  const fetchGroupsByUser = useCallback(async (userId = null) => {
    setLoading(true);
    setError(null);
    try {
      const idToUse = userId ?? user?.id ?? null;
      const response = await communityService.getGroupsByUser(idToUse);
      setGroups(response || []);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Error al cargar tus grupos'
      );
      setGroups([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  /**
   * Función para pedir UN grupo por ID (detalle del grupo).
   * Es útil para refrescar el detalle tras unirse/retirarse.
   */
  const fetchGroupById = useCallback(async (groupId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await communityService.getGroupById(groupId);
      setLoading(false);
      return response?.data || response || null;
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Error al cargar el grupo'
      );
      setLoading(false);
      return null;
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      fetchGroups();
    } else if (!isAuthenticated && !authLoading) {
      setGroups([]);
    }
  }, [isAuthenticated, authLoading, fetchGroups]);

  const contextValue = useMemo(() => ({
    groups,
    loading,
    error,
    fetchGroups,
    fetchGroupsByUser,
    fetchGroupById, // <--- ¡Ahora está disponible!
  }), [groups, loading, error, fetchGroups, fetchGroupsByUser, fetchGroupById]);

  return (
    <GroupContext.Provider value={contextValue}>
      {children}
    </GroupContext.Provider>
  );
};


// import React, { createContext, useState, useCallback, useMemo, useEffect, useContext } from 'react';
// import { communityService } from '../services/communityService';
// import { AuthContext } from '../../authentication/context/AuthContext';

// /**
//  * Contexto global para manejar los grupos en Germogli.
//  * Expone el estado de los grupos, loading, error y las funciones fetchGroups y fetchGroupsByUser para recargar la lista.
//  * Usa el AuthContext para cargar grupos solo si el usuario está autenticado.
//  */
// export const GroupContext = createContext();

// export const GroupProvider = ({ children }) => {
//   // Trae el estado de autenticación y usuario actual
//   const { isAuthenticated, loading: authLoading, user } = useContext(AuthContext);

//   // Estado global de grupos
//   const [groups, setGroups] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   /**
//    * Función para pedir TODOS los grupos desde el backend.
//    */
//   const fetchGroups = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await communityService.getAllGroups();
//       setGroups(response?.data || []);
//     } catch (err) {
//       setError(
//         err?.response?.data?.message ||
//         err?.message ||
//         'Error al cargar grupos'
//       );
//       setGroups([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   /**
//    * Función para pedir SOLO los grupos del usuario autenticado (o de un userId específico).
//    * Si no se pasa userId, usa el usuario autenticado del contexto.
//    */
//   const fetchGroupsByUser = useCallback(async (userId = null) => {
//     setLoading(true);
//     setError(null);
//     try {
//       // Usa el userId dado o el usuario del contexto
//       const idToUse = userId ?? user?.id ?? null;
//       const response = await communityService.getGroupsByUser(idToUse);
//       setGroups(response || []);
//     } catch (err) {
//       setError(
//         err?.response?.data?.message ||
//         err?.message ||
//         'Error al cargar tus grupos'
//       );
//       setGroups([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [user?.id]);

//   /**
//    * Efecto para cargar los grupos automáticamente al loguearse.
//    * Si el usuario se desloguea, limpia la lista.
//    */
//   useEffect(() => {
//     if (isAuthenticated && !authLoading) {
//       fetchGroups();
//     } else if (!isAuthenticated && !authLoading) {
//       setGroups([]);
//     }
//   }, [isAuthenticated, authLoading, fetchGroups]);

//   // Memoiza el value para evitar renders innecesarios en los consumidores
//   const contextValue = useMemo(() => ({
//     groups,
//     loading,
//     error,
//     fetchGroups,        // Refresca todos los grupos
//     fetchGroupsByUser,  // Refresca solo los grupos del usuario
//   }), [groups, loading, error, fetchGroups, fetchGroupsByUser]);

//   return (
//     <GroupContext.Provider value={contextValue}>
//       {children}
//     </GroupContext.Provider>
//   );
// };


// import React, { createContext, useState, useCallback, useMemo, useEffect, useContext } from 'react';
// import { communityService } from '../services/communityService';
// import { AuthContext } from '../../authentication/context/AuthContext';

// /**
//  * Contexto global para manejar los grupos en Germogli.
//  * Expone el estado de los grupos, loading, error y la función fetchGroups para recargar la lista.
//  * Usa el AuthContext para cargar grupos solo si el usuario está autenticado.
//  */
// export const GroupContext = createContext();

// export const GroupProvider = ({ children }) => {
//   // Trae el estado de autenticación
//   const { isAuthenticated, loading: authLoading } = useContext(AuthContext);

//   // Estado global de grupos
//   const [groups, setGroups] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   /**
//    * Función para pedir los grupos desde el backend.
//    * Se memoiza para evitar recreaciones innecesarias.
//    * Cualquier componente puede llamarla (por ejemplo, tras crear/editar/eliminar un grupo)
//    */
//   const fetchGroups = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await communityService.getAllGroups();
//       setGroups(response?.data || []);
//     } catch (err) {
//       setError(
//         err?.response?.data?.message ||
//         err?.message ||
//         'Error al cargar grupos'
//       );
//       setGroups([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   /**
//    * Efecto para cargar los grupos automáticamente al loguearse.
//    * Si el usuario se desloguea, limpia la lista.
//    */
//   useEffect(() => {
//     if (isAuthenticated && !authLoading) {
//       fetchGroups();
//     } else if (!isAuthenticated && !authLoading) {
//       setGroups([]);
//     }
//   }, [isAuthenticated, authLoading, fetchGroups]);

//   // Memoiza el value para evitar renders innecesarios en los consumidores
//   const contextValue = useMemo(() => ({
//     groups,
//     loading,
//     error,
//     fetchGroups, // Esta es la función que refresca la lista global
//   }), [groups, loading, error, fetchGroups]);

//   return (
//     <GroupContext.Provider value={contextValue}>
//       {children}
//     </GroupContext.Provider>
//   );
// };


// import { createContext, useState, useCallback, useMemo, useEffect, useContext } from 'react';
// import { communityService } from '../services/communityService';
// import { AuthContext } from '../../authentication/context/AuthContext'; // Importante: importar aquí

// export const GroupContext = createContext();

// export const GroupProvider = ({ children }) => {
//   // Importa el contexto de autenticación
//   const { isAuthenticated, loading: authLoading } = useContext(AuthContext);

//   const [groups, setGroups] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Memoizar fetchGroups para evitar recreaciones
//   const fetchGroups = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await communityService.getAllGroups();
//       setGroups(response?.data || []);
//     } catch (err) {
//       setError(err?.response?.data?.message || err.message || 'Error al cargar grupos');
//       setGroups([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Solo cargar grupos automáticamente cuando el usuario esté autenticado y authLoading sea false
//   useEffect(() => {
//     if (isAuthenticated && !authLoading) {
//       fetchGroups();
//     } else if (!isAuthenticated && !authLoading) {
//       setGroups([]);
//     }
//   }, [isAuthenticated, authLoading, fetchGroups]);

//   const contextValue = useMemo(() => ({
//     groups,
//     loading,
//     error,
//     fetchGroups
//   }), [groups, loading, error, fetchGroups]);

//   return (
//     <GroupContext.Provider value={contextValue}>
//       {children}
//     </GroupContext.Provider>
//   );
// };


// import { createContext, useState, useEffect, useContext } from "react";
// import { communityService } from "../services/communityService";
// import { AuthContext } from "../../authentication/context/AuthContext";

// // Creamos el contexto para los grupos
// export const GroupContext = createContext();

// /**
//  * Proveedor del contexto de grupos que encapsula la lógica y el estado.
//  */
// export const GroupProvider = ({ children }) => {
//   const { isAuthenticated } = useContext(AuthContext); // Verificamos si el usuario está autenticado.

//   // Estados para manejar los grupos
//   const [groups, setGroups] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   /**
//    * Función para obtener todos los grupos desde la API.
//    */
//   const fetchGroups = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//         const data = await communityService.getAllGroups();
//         setGroups(data); // <-- PROBLEMA AQUÍ
//     } catch (e) {
//         setError(e.message || 'Error al cargar los grupos');
//     } finally {
//         setLoading(false);
//     }
// };

//   // Efecto para cargar los grupos al iniciar si el usuario está autenticado.
//   useEffect(() => {
//     if (isAuthenticated) {
//       fetchGroups();
//     }
//   }, [isAuthenticated]);

//   return (
//     <GroupContext.Provider value={{ groups, loading, error, fetchGroups }}>
//       {children}
//     </GroupContext.Provider>
//   );
// };

// /**
//  * Hook personalizado para consumir el contexto de grupos.
//  */
// export const useGroups = () => {
//     const context = useContext(GroupContext);
//     if (!context) {
//         throw new Error('useGroups debe ser usado dentro de un GroupProvider');
//     }
//     return context;
// };
