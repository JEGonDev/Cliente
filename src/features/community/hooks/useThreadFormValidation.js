import { useState } from "react";

export function useThreadFormValidation() {
  const [errors, setErrors] = useState({});

  const validate = ({ title, content, groupId }) => {
    const newErrors = {};
    if (!title || !title.trim()) newErrors.title = "El título es obligatorio.";
    if (!content || !content.trim()) newErrors.content = "El contenido es obligatorio.";
    // Si el grupo es obligatorio, descomenta la siguiente línea:
    // if (!groupId) newErrors.groupId = "Debes seleccionar un grupo.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetErrors = () => setErrors({});

  return { errors, validate, resetErrors };
}