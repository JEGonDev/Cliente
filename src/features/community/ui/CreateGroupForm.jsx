import React, { useState, useContext } from 'react';
import { useGroup } from '../hooks/useGroup'; // Asegúrate de importar el hook

export const CreateGroupForm = ({ onSuccess, onCancel }) => {
  // Usa el hook useGroup que contiene la función correcta
  const { 
    formData, 
    formErrors, 
    successMessage, 
    handleChange, 
    handleCreateGroup, // Esta es la función que deberías usar, no createGroup
    resetForm 
  } = useGroup();

  const handleSubmit = async (e) => {
    console.log(e)
    e.preventDefault();
    // Llamamos a la función correcta del hook
    const newGroup = await handleCreateGroup(e);
    if (newGroup) {
      // Si hay una función onSuccess, la llamamos con el nuevo grupo
      if (onSuccess) onSuccess(newGroup);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nombre del grupo
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
        {formErrors.name && (
          <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Descripción
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          rows="3"
        />
      </div>
      
      {formErrors.general && (
        <div className="text-red-500 text-sm">{formErrors.general}</div>
      )}
      
      {successMessage && (
        <div className="text-green-500 text-sm">{successMessage}</div>
      )}
      
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onCancel || resetForm}
          className="mr-2 py-2 px-4 border border-gray-300 rounded-md text-sm"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="py-2 px-4 bg-primary text-white rounded-md text-sm hover:bg-green-700"
        >
          Crear Grupo
        </button>
      </div>
    </form>
  );
};

// import React, { useState } from "react";
// import { useGroup } from "../hooks/useGroup";

// export const CreateGroupForm = ({ onGroupCreated }) => {
//   const { formData, handleChange, createGroup, formErrors, successMessage } = useGroup();
//   const [filePreview, setFilePreview] = useState(null);
  
//   // Manejar cambio de archivo con previsualización
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Crear URL de previsualización
//       const previewUrl = URL.createObjectURL(file);
//       setFilePreview(previewUrl);
      
//       // Llamar al manejador de cambios normal
//       handleChange(e);
//     }
//   };
  
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const result = await createGroup(e);
//     if (result) {
//       // Limpiar previsualización
//       if (filePreview) {
//         URL.revokeObjectURL(filePreview);
//         setFilePreview(null);
//       }
      
//       onGroupCreated && onGroupCreated();
//     }
//   };
  
//   return (
//     <div className="bg-white p-4 rounded-lg shadow-md">
//       <h3 className="text-lg font-semibold mb-3">Crear nuevo grupo</h3>
      
//       <form onSubmit={handleSubmit}>
//         {/* Mensajes de error o éxito */}
//         {formErrors.general && (
//           <div className="mb-3 p-2 bg-red-100 text-red-700 rounded">
//             {formErrors.general}
//           </div>
//         )}
        
//         {formErrors.permission && (
//           <div className="mb-3 p-2 bg-red-100 text-red-700 rounded">
//             {formErrors.permission}
//           </div>
//         )}
        
//         {successMessage && (
//           <div className="mb-3 p-2 bg-green-100 text-green-700 rounded">
//             {successMessage}
//           </div>
//         )}
        
//         {/* Nombre del grupo */}
//         <div className="mb-3">
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Nombre del grupo
//           </label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             className="w-full p-2 border border-gray-300 rounded-md"
//             required
//           />
//           {formErrors.name && (
//             <p className="text-sm text-red-500 mt-1">{formErrors.name}</p>
//           )}
//         </div>
        
//         {/* Descripción del grupo */}
//         <div className="mb-3">
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Descripción
//           </label>
//           <textarea
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             className="w-full p-2 border border-gray-300 rounded-md"
//             rows="4"
//             required
//           ></textarea>
//           {formErrors.description && (
//             <p className="text-sm text-red-500 mt-1">{formErrors.description}</p>
//           )}
//         </div>
        
//         {/* Avatar del grupo (opcional) */}
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Avatar del grupo (opcional)
//           </label>
//           <input
//             type="file"
//             name="avatar"
//             accept="image/*"
//             onChange={handleFileChange}
//             className="w-full p-2 border border-gray-300 rounded-md"
//           />
          
//           {/* Previsualización de avatar */}
//           {filePreview && (
//             <div className="mt-2">
//               <p className="text-sm text-gray-600 mb-1">Vista previa:</p>
//               <img 
//                 src={filePreview}
//                 alt="Vista previa del avatar"
//                 className="h-20 w-20 rounded-full object-cover"
//               />
//             </div>
//           )}
//         </div>
        
//         {/* Botón de envío */}
//         <div className="flex justify-end">
//           <button
//             type="submit"
//             className="bg-primary text-white px-4 py-2 rounded-md hover:bg-green-700"
//           >
//             Crear grupo
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };