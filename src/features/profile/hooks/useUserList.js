import { useEffect, useState, useCallback } from "react";
import { profileService } from "../services/profileService";

/**
 * Hook para obtener la lista de usuarios desde la API.
 */
export function useUserList() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Definir la función de recarga
  const fetchUsers = useCallback(() => {
    setLoading(true);
    setError(null);
    profileService.getAllUsers()
      .then(res => setUsers(res))
      .catch(err => setError(err.message ?? "Error cargando usuarios"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);

    profileService.getAllUsers()
      .then(res => { if (!ignore) setUsers(res); })
      .catch(err => { if (!ignore) setError(err.message ?? "Error cargando usuarios"); })
      .finally(() => { if (!ignore) setLoading(false); });

    return () => { ignore = true; };
  }, [fetchUsers]);

  // Exponer refetch
  return { users, loading, error, refetch: fetchUsers };
  
}

// const [users, setUsers] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // useEffect(() => {
  //   let ignore = false;
  //   setLoading(true);

  //   profileService.getAllUsers()
  //     .then(res => {
  //       if (!ignore) setUsers(res);
  //     })
  //     .catch(err => {
  //       if (!ignore) setError(err.message ?? "Error cargando usuarios");
  //     })
  //     .finally(() => {
  //       if (!ignore) setLoading(false);
  //     });

  //   return () => { ignore = true; };
  // }, []);

  // return { users, loading, error };