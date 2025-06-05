import { useProfileContext } from '../context/ProfileContext';

export const useProfileAdmin = () => {
  const {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser
  } = useProfileContext();

  // Aquí puedes agregar lógica adicional si lo deseas (paginación, filtrado, etc)

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser
  };
};