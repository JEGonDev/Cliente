import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaHashtag } from "react-icons/fa";
import { communityService } from "../services/communityService";
import { ThreadList } from "../ui/ThreadList";
import { useGroup } from "../hooks/useGroup";

export const GroupDetailsView = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const { handleJoinGroup, successMessage, formErrors } = useGroup();

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const data = await communityService.getGroupById(groupId);
        setGroup(data.data); // Ajusta según la respuesta real de tu API
      } catch (error) {
        setGroup(null);
      }
    };
    fetchGroupDetails();
  }, [groupId]);

  if (!group)
    return <p className="text-gray-500">Cargando detalles del grupo...</p>;

  return (
    <div className="max-w-5xl mx-auto my-8 p-4 bg-white rounded shadow">
      {/* Header con icono numeral y nombre */}
      <div className="flex items-center gap-2 mb-6 bg-gray-300 rounded px-2 py-2 sm:py-2 md:py-2 min-h-[40px] sm:min-h-[60px] md:min-h-[80px]">
        <FaHashtag className="text-3xl text-gray-700" />
        <h1 className="text-3xl font-bold">{group.name}</h1>
      </div>

      {/* Mensaje de bienvenida */}
      <div className="mb-6">
        <h2 className="text-4xl font-bold">
          ¡Te damos la bienvenida a{" "}
          <span className="text-primary"># {group.name}!</span>
        </h2>
        <p className="text-lg font-bold mt-2">
          Un espacio para aprender, compartir experiencias sobre hidroponía.
        </p>
      </div>

      {/* Descripción y fecha */}
      <div className="mb-6">
        <div className="text-gray-700 mb-1">
          <strong>Descripción:</strong> {group.description}
        </div>
        <div className="text-gray-500 text-sm">
          <strong>Fecha de creación:</strong>{" "}
          {group.creationDate
            ? new Date(group.creationDate).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "Sin fecha"}
        </div>
      </div>

      {/* Botón para unirse */}
      <div className="mb-8">
        <button
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-green-600"
          onClick={() => handleJoinGroup(group.id)}
        >
          Unirse al grupo
        </button>
        {successMessage && <p className="text-green-600">{successMessage}</p>}
        {formErrors.general && (
          <p className="text-red-600">{formErrors.general}</p>
        )}
      </div>

      {/* Sección de hilos */}
      <div>
        <ThreadList groupId={groupId} />
      </div>
    </div>
  );
};

// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { FaHashtag } from "react-icons/fa";
// import { communityService } from "../services/communityService";
// import { ThreadList } from "../ui/ThreadList";
// import { useGroup } from "../hooks/useGroup";
// import { useThread } from "../hooks/useThread";

// export const GroupDetailsView = () => {
//   const { groupId } = useParams();
//   const [group, setGroup] = useState(null);
//   const { handleJoinGroup, successMessage, formErrors } = useGroup();
//   //  hook obtener hilos grupo
//   const { threads, loading, error, fetchThreadsByGroup } = useThread();

 

//   useEffect(() => {
//     const fetchGroupDetails = async () => {
//       try {
//         const data = await communityService.getGroupById(groupId);
//         setGroup(data.data); // Ajusta según la respuesta real de tu API
//       } catch (error) {
//         setGroup(null);
//       }
//     };
//     fetchGroupDetails();
//   }, [groupId]);

//   // Carga los hilos del grupo cada vez que el groupId cambie
//   useEffect(() => {
//     if (groupId) {
//       fetchThreadsByGroup(groupId);
//     }
//   }, [groupId]);

//   if (!group)
//     return <p className="text-gray-500">Cargando detalles del grupo...</p>;

//   return (
//     <div className="max-w-5xl mx-auto my-8 p-4 bg-white rounded shadow">
//       {/* Header con icono numeral y nombre */}
//       <div className="flex items-center gap-2 mb-6 bg-gray-300 rounded px-2 py-2 sm:py-2 md:py-2 min-h-[40px] sm:min-h-[60px] md:min-h-[80px]">
//         <FaHashtag className="text-3xl text-gray-700" />
//         <h1 className="text-3xl font-bold">{group.name}</h1>
//       </div>

//       {/* Mensaje de bienvenida */}
//       <div className="mb-6">
//         <h2 className="text-4xl font-bold">
//           ¡Te damos la bienvenida a{" "}
//           <span className="text-primary"># {group.name}!</span>
//         </h2>
//         <p className="text-lg font-bold mt-2">
//           Un espacio para aprender, compartir experiencias sobre hidroponía.
//         </p>
//       </div>

//       {/* Descripción y fecha */}
//       <div className="mb-6">
//         <div className="text-gray-700 mb-1">
//           <strong>Descripción:</strong> {group.description}
//         </div>
//         <div className="text-gray-500 text-sm">
//           <strong>Fecha de creación:</strong>{" "}
//           {group.creationDate
//             ? new Date(group.creationDate).toLocaleDateString("es-ES", {
//                 year: "numeric",
//                 month: "long",
//                 day: "numeric",
//               })
//             : "Sin fecha"}
//         </div>
//       </div>

//       {/* Botón para unirse */}
//       <div className="mb-8">
//         <button
//           className="bg-primary text-white px-4 py-2 rounded-md hover:bg-green-600"
//           onClick={() => handleJoinGroup(group.id)}
//         >
//           Unirse al grupo
//         </button>
//         {successMessage && <p className="text-green-600">{successMessage}</p>}
//         {formErrors.general && (
//           <p className="text-red-600">{formErrors.general}</p>
//         )}
//       </div>

//       {/* Sección de hilos */}
//       <div>
//         {loading ? (
//           <p className="text-gray-500">Cargando hilos...</p>
//         ) : error ? (
//           <p className="text-red-500">{error}</p>
//         ) : (
//           <ThreadList threads={threads} />
//         )}
//       </div>
//     </div>
//   );
// };

// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { communityService } from "../services/communityService";

// export const GroupDetailsView = () => {
//   const { groupId } = useParams();
//   const [group, setGroup] = useState(null);
//   const [threadsCount, setThreadsCount] = useState(0);
//   const [postsCount, setPostsCount] = useState(0);

//   useEffect(() => {
//     const fetchGroupDetails = async () => {
//       try {
//         const data = await communityService.getGroupById(groupId);
//         console.log("Detalle del grupo recibido de la API:", data);
//         setGroup(data.data); // <-- ¡AQUÍ ESTÁ LA CLAVE!
//         // Si tienes los métodos para threads/posts, agrégalos aquí:
//         // const threadsRes = await communityService.getThreadsByGroupId(groupId);
//         // setThreadsCount(Array.isArray(threadsRes.data) ? threadsRes.data.length : 0);
//         // const postsRes = await communityService.getPostsByGroupId(groupId);
//         // setPostsCount(Array.isArray(postsRes.data) ? postsRes.data.length : 0);
//       } catch (error) {
//         setGroup(null);
//       }
//     };

//     fetchGroupDetails();
//   }, [groupId]);

//   if (!group)
//     return <p className="text-gray-500">Cargando detalles del grupo...</p>;

//   return (
//     <div className="p-4 max-w-xl mx-auto">
//       <h2 className="text-2xl font-semibold mb-2">{group.name}</h2>
//       <p className="text-gray-600 mb-2">{group.description}</p>
//       <p className="text-sm text-gray-500 mb-2">
//         Fecha de creación:{" "}
//         {group.creationDate
//           ? new Date(group.creationDate).toLocaleDateString()
//           : "Sin fecha"}
//       </p>
//       <div className="flex gap-4 mb-4">
//         <span className="text-sm text-gray-700">
//           Hilos: <strong>{threadsCount}</strong>
//         </span>
//         <span className="text-sm text-gray-700">
//           Posts: <strong>{postsCount}</strong>
//         </span>
//       </div>
//       <div className="flex gap-2 mt-4">
//         <button
//           onClick={() => alert("Crear hilo (implementa aquí la lógica o el modal)")}
//           className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
//         >
//           Crear Hilo
//         </button>
//         <button
//           onClick={() => alert("Crear post (implementa aquí la lógica o el modal)")}
//           className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
//         >
//           Crear Post
//         </button>
//       </div>
//     </div>
//   );
// };
