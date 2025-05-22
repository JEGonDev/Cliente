import { createContext, useState, useEffect, useContext } from "react";
import { communityService } from "../services/communityService";
import { AuthContext } from "../../authentication/context/AuthContext";

// Creamos el contexto para los grupos
export const GroupContext = createContext();

/**
 * Proveedor del contexto de grupos que encapsula la lógica y el estado.
 */
export const GroupProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext); // Verificamos si el usuario está autenticado.

  // Estados para manejar los grupos
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Función para obtener todos los grupos desde la API.
   */
  const fetchGroups = async () => {
    setLoading(true);
    setError(null);
    try {
        const data = await communityService.getAllGroups();
        setGroups(data); // <-- PROBLEMA AQUÍ
    } catch (e) {
        setError(e.message || 'Error al cargar los grupos');
    } finally {
        setLoading(false);
    }
};

  // Efecto para cargar los grupos al iniciar si el usuario está autenticado.
  useEffect(() => {
    if (isAuthenticated) {
      fetchGroups();
    }
  }, [isAuthenticated]);

  return (
    <GroupContext.Provider value={{ groups, loading, error, fetchGroups }}>
      {children}
    </GroupContext.Provider>
  );
};

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
