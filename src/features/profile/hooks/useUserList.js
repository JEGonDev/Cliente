import { useEffect, useState } from "react";
import { profileService } from "../services/profileService";

/**
 * Hook para obtener la lista de usuarios desde la API.
 */
export function useUserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);

    profileService.getAllUsers()
      .then(res => {
        if (!ignore) setUsers(res);
      })
      .catch(err => {
        if (!ignore) setError(err.message ?? "Error cargando usuarios");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => { ignore = true; };
  }, []);

  return { users, loading, error };
}