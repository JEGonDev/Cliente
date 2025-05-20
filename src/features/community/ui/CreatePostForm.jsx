// import React, { useState, useEffect } from "react";
// import { usePost } from "../hooks/usePost";
// import { useGroup } from "../hooks/useGroup";
// import { useThread } from "../hooks/useThread";

// export const CreatePostForm = ({ onPostCreated, groupId = null }) => {
//   const { formData, handleChange, handleCreatePost, formErrors, successMessage } = usePost();
//   const { groups } = useGroup();
//   const { threads } = useThread();
//   const [showOptions, setShowOptions] = useState(false);
  
  
//   // Si se proporciona un groupId, actualizamos el formData
//   useEffect(() => {
//     if (groupId) {
//       setFormData(prevState => ({
//         ...prevState,
//         groupId
//       }));
//     }
//   }, [groupId]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const result = await handleCreatePost(e);
//     if (result) {
//       onPostCreated && onPostCreated();
//     }
//   };

//   return (
//     <div className="bg-white p-4 rounded-lg shadow-md">
//       <h3 className="text-lg font-semibold mb-3">Nueva publicación</h3>
      
//       <form onSubmit={handleSubmit}>
//         {/* Mensajes de error o éxito */}
//         {formErrors.general && (
//           <div className="mb-3 p-2 bg-red-100 text-red-700 rounded">
//             {formErrors.general}
//           </div>
//         )}
        
//         {successMessage && (
//           <div className="mb-3 p-2 bg-green-100 text-green-700 rounded">
//             {successMessage}
//           </div>
//         )}
        
//         {/* Tipo de post */}
//         <div className="mb-3">
//           <select
//             name="postType"
//             value={formData.postType}
//             onChange={handleChange}
//             className="w-full p-2 border border-gray-300 rounded-md mb-3"
//             required
//           >
//             <option value="">Selecciona un tipo</option>
//             <option value="general">General</option>
//             <option value="pregunta">Pregunta</option>
//             <option value="tutorial">Tutorial</option>
//             <option value="proyecto">Proyecto</option>
//           </select>
//           {formErrors.postType && (
//             <p className="text-sm text-red-500">{formErrors.postType}</p>
//           )}
//         </div>
        
//         {/* Contenido del post */}
//         <div className="mb-3">
//           <textarea
//             name="content"
//             value={formData.content}
//             onChange={handleChange}
//             placeholder="¿Qué estás pensando?"
//             className="w-full p-2 border border-gray-300 rounded-md"
//             rows="4"
//             required
//           ></textarea>
//           {formErrors.content && (
//             <p className="text-sm text-red-500">{formErrors.content}</p>
//           )}
//         </div>
        
//         {/* Archivo adjunto */}
//         <div className="mb-3">
//           <input
//             type="file"
//             name="file"
//             onChange={handleChange}
//             className="w-full p-2 border border-gray-300 rounded-md"
//           />
//         </div>
        
//         {/* Opciones adicionales (grupo, hilo) */}
//         <div className="mb-3">
//           <button
//             type="button"
//             className="text-primary hover:underline text-sm"
//             onClick={() => setShowOptions(!showOptions)}
//           >
//             {showOptions ? "Ocultar opciones avanzadas" : "Mostrar opciones avanzadas"}
//           </button>
          
//           {showOptions && (
//             <div className="mt-2 space-y-2">
//               {/* Selector de grupo */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Grupo (opcional)
//                 </label>
//                 <select
//                   name="groupId"
//                   value={formData.groupId || ""}
//                   onChange={handleChange}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                 >
//                   <option value="">Ninguno</option>
//                   {groups.map(group => (
//                     <option key={group.id} value={group.id}>
//                       {group.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
              
//               {/* Selector de hilo */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Tema (opcional)
//                 </label>
//                 <select
//                   name="threadId"
//                   value={formData.threadId || ""}
//                   onChange={handleChange}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                 >
//                   <option value="">Ninguno</option>
//                   {threads.map(thread => (
//                     <option key={thread.id} value={thread.id}>
//                       {thread.title}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           )}
//         </div>
        
//         {/* Botón de envío */}
//         <div className="flex justify-end">
//           <button
//             type="submit"
//             className="bg-primary text-white px-4 py-2 rounded-md hover:bg-green-700"
//           >
//             Publicar
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };