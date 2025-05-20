// import React, { useState } from "react";
// import { X } from "lucide-react";
// import { useThread } from "../hooks/useThread";
// import { useGroup } from "../hooks/useGroup";

// export const CreateThreadModal = ({ onClose }) => {
//   const { 
//     formData, 
//     handleChange, 
//     handleCreateThread, 
//     formErrors, 
//     successMessage 
//   } = useThread();
//   const { groups } = useGroup();
  
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const result = await handleCreateThread(e);
//     if (result) {
//       setTimeout(() => {
//         onClose();
//       }, 1500);
//     }
//   };
  
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
//         <div className="flex justify-between items-center border-b p-4">
//           <h2 className="text-xl font-semibold">Crear nuevo tema</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700"
//           >
//             <X className="h-6 w-6" />
//           </button>
//         </div>
        
//         <form onSubmit={handleSubmit} className="p-4">
//           {/* Mostrar mensajes de éxito o error */}
//           {successMessage && (
//             <div className="mb-4 bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded">
//               {successMessage}
//             </div>
//           )}
          
//           {formErrors.general && (
//             <div className="mb-4 bg-red-100 border border-red-200 text-red-800 px-4 py-3 rounded">
//               {formErrors.general}
//             </div>
//           )}
          
//           {formErrors.permission && (
//             <div className="mb-4 bg-red-100 border border-red-200 text-red-800 px-4 py-3 rounded">
//               {formErrors.permission}
//             </div>
//           )}
          
//           {/* Grupo */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Grupo (opcional)
//             </label>
//             <select
//               name="groupId"
//               value={formData.groupId || ""}
//               onChange={handleChange}
//               className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
//             >
//               <option value="">Seleccionar grupo</option>
//               {groups.map(group => (
//                 <option key={group.id} value={group.id}>
//                   {group.name}
//                 </option>
//               ))}
//             </select>
//           </div>
          
//           {/* Título */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Título
//             </label>
//             <input
//               type="text"
//               name="title"
//               value={formData.title}
//               onChange={handleChange}
//               className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
//               required
//             />
//             {formErrors.title && (
//               <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
//             )}
//           </div>
          
//           {/* Contenido */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Contenido
//             </label>
//             <textarea
//               name="content"
//               value={formData.content}
//               onChange={handleChange}
//               rows="4"
//               className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
//               placeholder="Describe el tema de discusión"
//               required
//             ></textarea>
//             {formErrors.content && (
//               <p className="mt-1 text-sm text-red-600">{formErrors.content}</p>
//             )}
//           </div>
          
//           <div className="flex justify-end gap-2 mt-6">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//             >
//               Cancelar
//             </button>
            
//             <button
//               type="submit"
//               className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
//             >
//               Crear tema
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };