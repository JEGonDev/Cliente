import { useState, useEffect } from "react";
import { profileService } from "../services/profileService";

export function useFetchProfile(userId) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError(null);

    profileService.getUserById(userId)
      .then(res => setProfile(res.data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, [userId]);

  return { profile, loading, error };
}