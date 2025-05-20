import { createContext, useState, useEffect, useContext } from 'react';
import { communityService } from '../services/communityService';
import { AuthContext } from '../../authentication/context/AuthContext';

// Creamos el contexto para los posts
export const PostContext = createContext();

/**
 * Proveedor del contexto de posts que encapsula la lógica y el estado.
 */
export const PostProvider = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext); // Verificamos si el usuario está autenticado.

    // Estados para manejar los posts
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Función para obtener todos los posts desde la API.
     */
    const fetchPosts = async () => {
        setLoading(true); // Indicamos que la carga está en progreso.
        setError(null); // Reseteamos errores.
        try {
            const data = await communityService.getAllPosts(); // Llamamos al servicio de API.
            setPosts(data); // Guardamos los posts en el estado.
        } catch (e) {
            setError(e.message || 'Error al cargar los posts'); // Capturamos errores.
        } finally {
            setLoading(false); // Finalizamos la carga.
        }
    };

    // Efecto para cargar los posts al iniciar si el usuario está autenticado.
    useEffect(() => {
        if (isAuthenticated) {
            fetchPosts();
        }
    }, [isAuthenticated]);

    return (
        <PostContext.Provider value={{ posts, loading, error, fetchPosts }}>
            {children}
        </PostContext.Provider>
    );
};

/**
 * Hook personalizado para consumir el contexto de posts.
 */
export const usePosts = () => {
    const context = useContext(PostContext);
    if (!context) {
        throw new Error('usePosts debe ser usado dentro de un PostProvider');
    }
    return context;
};