import { createContext, useState, useEffect, useContext } from 'react';
import { communityService } from '../services/communityService';
import { AuthContext } from '../../authentication/context/AuthContext';

// Contexto global SOLO para el listado general de hilos
export const ThreadContext = createContext();

export const ThreadProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Solo función global de traer todos los hilos
  const fetchThreads = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await communityService.getAllThreads();
      setThreads(response.data || []);
    } catch (e) {
      setError(e.message || 'Error al cargar los hilos');
      setThreads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchThreads();
  }, [isAuthenticated]);

  return (
    <ThreadContext.Provider value={{ threads, loading, error, fetchThreads }}>
      {children}
    </ThreadContext.Provider>
  );
};

export const useThreadsContext = () => {
  const context = useContext(ThreadContext);
  if (!context) throw new Error('useThreadsContext debe ser usado dentro de un ThreadProvider');
  return context;
};



// import { createContext, useState, useEffect, useContext } from 'react';
// import { communityService } from '../services/communityService';
// import { AuthContext } from '../../authentication/context/AuthContext';

// // Creamos el contexto para los hilos
// export const ThreadContext = createContext();

// /**
//  * Proveedor del contexto de hilos que encapsula la lógica y el estado.
//  */
// export const ThreadProvider = ({ children }) => {
//     const { isAuthenticated } = useContext(AuthContext); // Verificamos si el usuario está autenticado.

//     // Estados para manejar los hilos
//     const [threads, setThreads] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     /**
//      * Función para obtener todos los hilos desde la API.
//      */
//     const fetchThreads = async () => {
//         setLoading(true); // Indicamos que la carga está en progreso.
//         setError(null); // Reseteamos errores.
//         try {
//             const data = await communityService.getAllThreads(); // Llamamos al servicio de API.
//             setThreads(data); // Guardamos los hilos en el estado.
//         } catch (e) {
//             setError(e.message || 'Error al cargar los hilos'); // Capturamos errores.
//         } finally {
//             setLoading(false); // Finalizamos la carga.
//         }
//     };

//     // Efecto para cargar los hilos al iniciar si el usuario está autenticado.
//     useEffect(() => {
//         if (isAuthenticated) {
//             fetchThreads();
//         }
//     }, [isAuthenticated]);

//     return (
//         <ThreadContext.Provider value={{ threads, loading, error, fetchThreads }}>
//             {children}
//         </ThreadContext.Provider>
//     );
// };

// /**
//  * Hook personalizado para consumir el contexto de hilos.
//  */
// export const useThreads = () => {
//     const context = useContext(ThreadContext);
//     if (!context) {
//         throw new Error('useThreads debe ser usado dentro de un ThreadProvider');
//     }
//     return context;
// };