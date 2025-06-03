import React, { useState, useEffect } from "react";
import { useGroup } from "../hooks/useGroup";

export const GroupFormModal = ({ onClose, onGroupCreated }) => {
  console.log('GroupFormModal renderizado');

  const { handleCreateGroup, formErrors, clearMessages, resetForm } = useGroup();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [localErrors, setLocalErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    console.log('Modal montado');
    document.body.style.overflow = 'hidden';
    return () => {
      console.log('Modal desmontado');
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Validación en tiempo real para el nombre
  const validateName = (value) => {
    if (!value.trim()) {
      return 'El nombre del grupo es obligatorio';
    }
    if (value.trim().length < 3) {
      return 'El nombre del grupo debe tener al menos 3 caracteres';
    }
    if (value.trim().length > 100) {
      return 'El nombre del grupo no puede exceder 100 caracteres';
    }
    return '';
  };

  // Validación en tiempo real para la descripción
  const validateDescription = (value) => {
    if (value.length > 500) {
      return 'La descripción no puede exceder 500 caracteres';
    }
    return '';
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    const error = validateName(value);
    setLocalErrors(prev => ({
      ...prev,
      name: error
    }));
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setDescription(value);
    const error = validateDescription(value);
    setLocalErrors(prev => ({
      ...prev,
      description: error
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Intentando crear grupo:', { name, description });

    // Validar todos los campos antes de enviar
    const nameError = validateName(name);
    const descriptionError = validateDescription(description);

    setLocalErrors({
      name: nameError,
      description: descriptionError
    });

    if (nameError || descriptionError) {
      return;
    }

    setIsSubmitting(true);
    clearMessages();

    try {
      const result = await handleCreateGroup({ name, description });
      console.log("Resultado de crear grupo:", result);
      if (result) {
        console.log('Grupo creado exitosamente');
        if (onGroupCreated) onGroupCreated();
        resetForm();
        onClose();
      } else {
        console.log('Error al crear grupo:', formErrors);
        setError(formErrors?.general || "Error al crear el grupo.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    console.log('Cerrando modal manualmente');
    clearMessages();
    setName("");
    setDescription("");
    setError("");
    setLocalErrors({});
    onClose();
  };

  const hasErrors = Object.values(localErrors).some(error => error) || error;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        className="bg-white p-6 rounded-md shadow-md w-full max-w-md relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
        <h2 className="text-lg font-semibold mb-4">Crear Nuevo Grupo</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Nombre del grupo <span className="text-red-500">*</span>
            </label>
            <input
              className={`w-full border rounded-md p-2 mt-1 text-sm ${localErrors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              value={name}
              onChange={handleNameChange}
              required
              disabled={isSubmitting}
            />
            {localErrors.name && (
              <p className="text-red-500 text-xs mt-1">{localErrors.name}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {name.length}/100 caracteres
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              className={`w-full border rounded-md p-2 mt-1 text-sm ${localErrors.description ? 'border-red-500' : 'border-gray-300'
                }`}
              rows="3"
              value={description}
              onChange={handleDescriptionChange}
              disabled={isSubmitting}
            />
            {localErrors.description && (
              <p className="text-red-500 text-xs mt-1">{localErrors.description}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {description.length}/500 caracteres
            </p>
          </div>
          {error && (
            <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-2 hover:bg-gray-300"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-md ${hasErrors || isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-green-600'
                }`}
              disabled={hasErrors || isSubmitting}
            >
              {isSubmitting ? 'Creando...' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// import React, { useState } from "react";
// import { communityService } from "../services/communityService";

// export const GroupFormModal = ({ onClose, onGroupCreated }) => {
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!name.trim()) {
//       setError("El nombre es requerido.");
//       return;
//     }
//     try {
//       const createdGroup = await communityService.createGroup({ name, description });
//       onGroupCreated(createdGroup);
//       onClose();
//     } catch {
//       setError("Error al crear el grupo.");
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
//       <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
//         <h2 className="text-lg font-semibold mb-4">Crear Nuevo Grupo</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">Nombre del grupo</label>
//             <input
//               className="w-full border rounded-md p-2 mt-1 text-sm"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">Descripción</label>
//             <textarea
//               className="w-full border rounded-md p-2 mt-1 text-sm"
//               rows="3"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//             />
//           </div>
//           {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
//           <div className="flex justify-end">
//             <button
//               type="button"
//               onClick={onClose}
//               className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-2"
//             >
//               Cancelar
//             </button>
//             <button
//               type="submit"
//               className="bg-primary text-white px-4 py-2 rounded-md hover:bg-green-600"
//             >
//               Crear
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };