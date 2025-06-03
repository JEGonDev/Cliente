import React, { useState, useEffect } from "react";
import { useGroup } from "../hooks/useGroup";

export const GroupFormModal = ({ onClose, onGroupCreated }) => {
  console.log('GroupFormModal renderizado');

  const { handleCreateGroup, formErrors, clearMessages, resetForm } = useGroup();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    console.log('Modal montado');
    // Prevenir scroll del body cuando el modal está abierto
    document.body.style.overflow = 'hidden';
    return () => {
      console.log('Modal desmontado');
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Intentando crear grupo:', { name, description });
    clearMessages();
    const result = await handleCreateGroup({ name, description });
    console.log("Resultado de crear grupo:", result);
    if (result) {
      console.log('Grupo creado exitosamente');
      if (onGroupCreated) onGroupCreated(); // notifica al padre para el refresh
      resetForm();
      onClose();
    } else {
      console.log('Error al crear grupo:', formErrors);
      setError(formErrors?.general || "Error al crear el grupo.");
    }
  };

  const handleClose = () => {
    console.log('Cerrando modal manualmente');
    clearMessages();
    setName("");
    setDescription("");
    setError("");
    onClose();
  };

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
            <label className="block text-sm font-medium text-gray-700">Nombre del grupo</label>
            <input
              className="w-full border rounded-md p-2 mt-1 text-sm"
              value={name}
              onChange={(e) => {
                console.log('Nombre cambiado:', e.target.value);
                setName(e.target.value);
              }}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              className="w-full border rounded-md p-2 mt-1 text-sm"
              rows="3"
              value={description}
              onChange={(e) => {
                console.log('Descripción cambiada:', e.target.value);
                setDescription(e.target.value);
              }}
            />
          </div>
          {(error || formErrors?.general) && (
            <p className="text-red-500 text-xs mt-1">{error || formErrors.general}</p>
          )}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              Crear
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