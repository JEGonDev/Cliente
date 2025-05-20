import React, { useState, useEffect } from "react";
import { usePosts } from "../hooks/usePost"; // Usar el hook centralizado
import { communityService } from "../services/communityService";

export const PostFormModal = ({ onClose, onPostCreated }) => {
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState("general");
  const [imageFile, setImageFile] = useState(null);
  const [groupId, setGroupId] = useState(null);
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState("");

   

  // Hook customizado para lógica de posts
  const { handleCreatePost, formErrors } = usePosts();

   // Cargar grupos disponibles al montar el componente
  useEffect(() => {
  const fetchGroups = async () => {
    try {
      const result = await communityService.getAllGroups();
      // Si la respuesta es { data: [...] }
      if (Array.isArray(result)) {
        setGroups(result);
      } else if (result?.data && Array.isArray(result.data)) {
        setGroups(result.data);
      } else {
        setGroups([]); // fallback a array vacío
      }
    } catch (error) {
      console.error("Error al cargar los grupos:", error);
      setGroups([]);
    }
  };
  fetchGroups();
}, []);  

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Verificar que el archivo sea una imagen/video y no supere 1 MB
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        setError("El archivo debe ser una imagen o un video.");
        setImageFile(null);
        return;
      }
      if (file.size > 1024 * 1024) {
        setError("El archivo no debe pesar más de 1 MB.");
        setImageFile(null);
        return;
      }

      setError(""); // Limpiar errores previos
      setImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Limpiar errores previos

    // Crear un FormData para manejar imagen/video y otros datos
    const formData = new FormData();
    formData.append("content", content);
    formData.append("postType", postType);
    formData.append("groupId", groupId || ""); // Si no hay grupo, enviar vacío
    if (imageFile) {
      formData.append("multimediaContent", imageFile);
    }

    // Imprimir datos enviados al servidor para depuración
    // console.log("Datos enviados al servidor:", Object.fromEntries(formData.entries()));

    try {
      const createdPost = await handleCreatePost(formData);
      if (onPostCreated) onPostCreated(createdPost?.data || createdPost);
      onClose();
    } catch (error) {
      console.error("Error al crear el post:", error?.response?.data || error?.message);

      if (error?.response?.data?.message) {
        setError(error.response.data.message);
      } else if (formErrors?.general) {
        setError(formErrors.general);
      } else {
        setError("Hubo un problema al crear el post. Intenta nuevamente.");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Crear Nuevo Post</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Contenido
            </label>
            <textarea
              className="w-full border rounded-md p-2 mt-1 text-sm"
              rows="4"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Tipo de Post
            </label>
            <select
              className="w-full border rounded-md p-2 mt-1 text-sm"
              value={postType}
              onChange={(e) => setPostType(e.target.value)}
            >
              <option value="general">General</option>
              <option value="thread">Hilo</option>
            </select>
          </div>

          <div className="mb-4">
           <label className="block text-sm font-medium text-gray-700">
            Grupo (opcional)
           </label>
            <select
            className="w-full border rounded-md p-2 mt-1 text-sm"
            value={groupId || ""}
            onChange={(e) => setGroupId(e.target.value || null)}
          >
             <option value="">Seleccionar grupo</option>
             {groups.map((group) => (
               <option key={group.id} value={group.id}>
                 {group.name}
               </option>
            ))}
          </select>
         </div>

          {/* <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Grupo (opcional)
            </label>
            <select
              className="w-full border rounded-md p-2 mt-1 text-sm"
              value={groupId || ""}
              onChange={(e) => setGroupId(e.target.value || null)}
            >
              <option value="">Seleccionar grupo</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div> */}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Archivo Multimedia (opcional, máximo 1 MB)
            </label>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleImageChange}
              className="w-full mt-1 text-sm"
            />
            {(error || formErrors?.general) && (
              <p className="text-red-500 text-xs mt-1">
                {error || formErrors.general}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              disabled={!!error || !!formErrors?.general}
            >
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// import React, { useState, useEffect } from "react";
// import { communityService } from "../services/communityService";

// export const PostFormModal = ({ onClose, onPostCreated }) => {
//   const [content, setContent] = useState("");
//   const [postType, setPostType] = useState("general");
//   const [imageFile, setImageFile] = useState(null);
//   const [groupId, setGroupId] = useState(null); // Nuevo estado para el ID del grupo
//   const [groups, setGroups] = useState([]); // Lista de grupos disponibles
//   const [error, setError] = useState("");

//   // Cargar grupos disponibles al montar el componente
//   useEffect(() => {
//     const fetchGroups = async () => {
//       try {
//         const data = await communityService.getGroups(); // Cambiar al endpoint correcto
//         setGroups(data);
//       } catch (error) {
//         console.error("Error al cargar los grupos:", error);
//       }
//     };

//     fetchGroups();
//   }, []);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];

//     if (file) {
//       // Verificar que el archivo sea una imagen/video y no supere 1 MB
//       if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
//         setError("El archivo debe ser una imagen o un video.");
//         setImageFile(null);
//         return;
//       }
//       if (file.size > 1024 * 1024) {
//         setError("El archivo no debe pesar más de 1 MB.");
//         setImageFile(null);
//         return;
//       }

//       setError(""); // Limpiar errores previos
//       setImageFile(file);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Crear un FormData para manejar la imagen/video y otros datos
//     const formData = new FormData();
//     formData.append("content", content);
//     formData.append("postType", postType);
//     formData.append("groupId", groupId || ""); // Si no hay grupo, enviar vacío
//     if (imageFile) {
//       formData.append("multimediaContent", imageFile);
//     }

//     // Imprimir datos enviados al servidor para depuración
//     console.log("Datos enviados al servidor:", Object.fromEntries(formData.entries()));

//     try {
//       const createdPost = await communityService.createPost(formData);
//       onPostCreated(createdPost);
//       onClose();
//     } catch (error) {
//       console.error("Error al crear el post:", error.response?.data || error.message);

//       if (error.response?.data?.message) {
//         setError(error.response.data.message); // Mensaje del servidor
//       } else {
//         setError("Hubo un problema al crear el post. Intenta nuevamente.");
//       }
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//       <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
//         <h2 className="text-lg font-semibold mb-4">Crear Nuevo Post</h2>
//         <form onSubmit={handleSubmit} encType="multipart/form-data">
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">
//               Contenido
//             </label>
//             <textarea
//               className="w-full border rounded-md p-2 mt-1 text-sm"
//               rows="4"
//               value={content}
//               onChange={(e) => setContent(e.target.value)}
//               required
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">
//               Tipo de Post
//             </label>
//             <select
//               className="w-full border rounded-md p-2 mt-1 text-sm"
//               value={postType}
//               onChange={(e) => setPostType(e.target.value)}
//             >
//               <option value="general">General</option>
//               <option value="thread">Hilo</option>
//             </select>
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">
//               Grupo (opcional)
//             </label>
//             <select
//               className="w-full border rounded-md p-2 mt-1 text-sm"
//               value={groupId || ""}
//               onChange={(e) => setGroupId(e.target.value || null)}
//             >
//               <option value="">Seleccionar grupo</option>
//               {groups.map((group) => (
//                 <option key={group.id} value={group.id}>
//                   {group.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">
//               Archivo Multimedia (opcional, máximo 1 MB)
//             </label>
//             <input
//               type="file"
//               accept="image/*,video/*"
//               onChange={handleImageChange}
//               className="w-full mt-1 text-sm"
//             />
//             {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
//           </div>

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
//               className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
//               disabled={!!error} // Deshabilitar si hay un error
//             >
//               Crear
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };
