import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarIcons } from "../../../ui/components/BarIcons";
import {
  FaSearch,
  FaUser,
  FaFileAlt,
  FaLayerGroup,
  FaForumbee,
} from "react-icons/fa";
import { AdminPostLayout } from "../layouts/AdminPostLayout";
import { AdminGroupsLayout } from "../layouts/AdminGroupsLayout";
import { AdminThreadsLayout } from "../layouts/AdminThreadsLayout";
import { PlantGrow } from "../../../features/community/ui/PlantGrow";

export function AdminCommunityView() {
  const [activeSection, setActiveSection] = useState("forum");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-tr from-gray-50 to-gray-100">
      {/* Aside barra lateral (escritorio) */}
      <aside
        className="hidden md:flex flex-col items-center py-8 px-2 gap-4
                bg-white/70 backdrop-blur-md shadow-lg rounded-r-2xl
                transition-all duration-300"
      >
        <BarIcons
          title="Comunidad"
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
      </aside>

      {/* Main container */}
      <div className="w-full max-w-4xl bg-white min-h-screen border rounded-md shadow-md p-0 mx-auto pb-20 md:pb-0">
        {/* Header */}
        
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6 gap-2 md:gap-0">
          <div className="w-full md:w-auto flex justify-center md:justify-start">
            <h1 className="text-xl md:text-2xl font-bold mb-2 md:mb-0 text-center md:text-left">
              Administración de la comunidad
            </h1>
          </div>
          <div className="flex justify-center md:justify-end gap-2 flex-wrap w-full md:w-auto">
            <PlantGrow className="w-12 h-12 md:w-16 md:h-16 mb-2 md:mb-0" />
            <PlantGrow className="w-12 h-12 md:w-16 md:h-16 mb-2 md:mb-0" />
            <PlantGrow className="w-12 h-12 md:w-16 md:h-16 mb-2 md:mb-0" />
            <PlantGrow className="w-12 h-12 md:w-16 md:h-16 mb-2 md:mb-0" />
          </div>
        </div>

        {/* Buscador */}
        <div className="flex justify-center py-3 sm:py-4">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              className="w-full border border-gray-300 rounded-full py-2 px-4 pl-10 text-gray-700 focus:outline-none"
              placeholder="Buscar post, grupo o hilo"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 justify-center py-1 border-b">
          <div className="flex justify-end mt-4">
            <button
              onClick={() => navigate(`/comunity/posts`)}
              className="text-secondary underline text-sm"
            >
              <span className="flex items-center gap-1 text-sky-900 font-medium cursor-pointer">
                <FaFileAlt /> Publicaciones
              </span>
            </button>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={() => navigate(`/comunity/ThreadForum`)}
              className="text-secondary underline text-sm"
            >
              <span className="flex items-center gap-1 text-amber-500 font-medium cursor-pointer">
                <FaForumbee /> Foro
              </span>
            </button>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={() => navigate(`/comunity/groups`)}
              className="text-secondary underline text-sm"
            >
              <span className="flex items-center gap-1 text-green font-medium cursor-pointer">
                <FaLayerGroup /> Grupos
              </span>
            </button>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={() => navigate(`/profile/admin`)}
              className="text-secondary underline text-sm"
            >
              <span className="flex items-center gap-1 text-gray-700 font-medium cursor-pointer">
                <FaUser /> Usuarios
              </span>
            </button>
          </div>
        </div>

        <div className="px-2 sm:px-5 py-2">
          {/* Publicaciones recientes */}
          <AdminPostLayout searchTerm={searchTerm} />
          <hr />

          <AdminGroupsLayout searchTerm={searchTerm} />
          <hr />

          <AdminThreadsLayout searchTerm={searchTerm} />
          <hr />
        </div>
      </div>

      {/* Barra de iconos móvil (abajo) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/90 backdrop-blur-md border-t shadow-xl flex justify-around items-center py-2">
        <BarIcons
          title="Comunidad"
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
      </nav>
    </div>
  );
}

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { BarIcons } from "../../../ui/components/BarIcons";
// import {
//   FaSearch,
//   FaUser,
//   FaFileAlt,
//   FaLayerGroup,
//   FaForumbee,
// } from "react-icons/fa";
// import { AdminPostLayout } from "../layouts/AdminPostLayout";
// import { AdminGroupsLayout } from "../layouts/AdminGroupsLayout";
// import { AdminThreadsLayout } from "../layouts/AdminThreadsLayout";
// import { PlantGrow } from "../../../features/community/ui/PlantGrow";

// export function AdminCommunityView() {
//   const [activeSection, setActiveSection] = useState("forum");
//   const [searchTerm, setSearchTerm] = useState(""); // Estado para la barra de búsqueda
//   const navigate = useNavigate();

//   return (
//     <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-tr from-gray-50 to-gray-100">
//       {/* Aside barra lateral (escritorio) */}
//       <aside
//         className="hidden md:flex flex-col items-center py-8 px-2 gap-4
//                 bg-white/70 backdrop-blur-md shadow-lg rounded-r-2xl
//                 transition-all duration-300"
//       >
//         <BarIcons
//           title="Comunidad"
//           activeSection={activeSection}
//           setActiveSection={setActiveSection}
//           animate
//         />
//       </aside>

//       {/* Main container. Añadir pb-20 para que el contenido no quede tapado por la barra móvil */}
//       <div className="w-full max-w-4xl bg-white min-h-screen border rounded-md shadow-md p-0 mx-auto pb-20 md:pb-0">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-2 md:gap-0">
//           <h1 className="text-xl md:text-2xl font-bold mb-2 md:mb-6">
//             Publicaciones de la comunidad
//           </h1>
//           <div className="flex justify-center gap-2 flex-wrap">
//             <PlantGrow className="w-12 h-12 md:w-16 md:h-16 mb-2 md:mb-4" />
//             <PlantGrow className="w-12 h-12 md:w-16 md:h-16 mb-2 md:mb-4" />
//             <PlantGrow className="w-12 h-12 md:w-16 md:h-16 mb-2 md:mb-4" />
//             <PlantGrow className="w-12 h-12 md:w-16 md:h-16 mb-2 md:mb-4" />
//           </div>
//         </div>

//         {/* Buscador */}
//         <div className="flex justify-center py-3 sm:py-4">
//           <div className="relative w-full max-w-md">
//             <input
//               type="text"
//               className="w-full border border-gray-300 rounded-full py-2 px-4 pl-10 text-gray-700 focus:outline-none"
//               placeholder="Buscar post, grupo o hilo"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="flex flex-wrap items-center gap-2 sm:gap-4 justify-center py-1 border-b">
//           <div className="flex justify-end mt-4">
//             <button
//               onClick={() => navigate(`/comunity/posts`)}
//               className="text-secondary underline text-sm"
//             >
//               <span className="flex items-center gap-1 text-sky-900 font-medium cursor-pointer">
//                 <FaFileAlt /> Publicaciones
//               </span>
//             </button>
//           </div>

//           <div className="flex justify-end mt-4">
//             <button
//               onClick={() => navigate(`/comunity/ThreadForum`)}
//               className="text-secondary underline text-sm"
//             >
//               <span className="flex items-center gap-1 text-amber-500 font-medium cursor-pointer">
//                 <FaForumbee /> Foro
//               </span>
//             </button>
//           </div>

//           <div className="flex justify-end mt-4">
//             <button
//               onClick={() => navigate(`/comunity/groups`)}
//               className="text-secondary underline text-sm"
//             >
//               <span className="flex items-center gap-1 text-green font-medium cursor-pointer">
//                 <FaLayerGroup /> Grupos
//               </span>
//             </button>
//           </div>

//           <div className="flex justify-end mt-4">
//             <button
//               onClick={() => navigate(`/profile/admin`)}
//               className="text-secondary underline text-sm"
//             >
//               <span className="flex items-center gap-1 text-gray-700 font-medium cursor-pointer">
//                 <FaUser /> Usuarios
//               </span>
//             </button>
//           </div>
//         </div>

//         <div className="px-2 sm:px-5 py-2">
//           {/* Publicaciones recientes */}
//           <AdminPostLayout searchTerm={searchTerm} />
//           <hr />

//           <AdminGroupsLayout searchTerm={searchTerm} />
//           <hr />

//           <AdminThreadsLayout searchTerm={searchTerm} />
//           <hr />
//         </div>
//       </div>

//       {/* Barra de iconos móvil (abajo) */}
//       <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/90 backdrop-blur-md border-t shadow-xl flex justify-around items-center py-2">
//         <BarIcons
//           title="Comunidad"
//           activeSection={activeSection}
//           setActiveSection={setActiveSection}
//           animate
//         />
//       </nav>
//     </div>
//   );
// }

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { BarIcons } from "../../../ui/components/BarIcons";
// import {
//   FaSearch,
//   FaUser,
//   FaFileAlt,
//   FaLayerGroup,
//   FaForumbee,
// } from "react-icons/fa";
// import { AdminPostLayout } from "../layouts/AdminPostLayout";
// import { AdminGroupsLayout } from "../layouts/AdminGroupsLayout";
// import { AdminThreadsLayout } from "../layouts/AdminThreadsLayout";
// import { PlantGrow } from "../../../features/community/ui/PlantGrow";

// export function AdminCommunityView() {
//   const [activeSection, setActiveSection] = useState("forum");
//   const [searchTerm, setSearchTerm] = useState(""); // Estado para la barra de búsqueda
//   const navigate = useNavigate();

//   return (
//     <div className="flex md:flex-row min-h-screen bg-gradient-to-tr from-gray-50 to-gray-100">
//       {/* Aside barra lateral (escritorio) */}
//       <aside
//         className="hidden md:flex flex-col items-center py-8 px-2 gap-4
//                 bg-white/70 backdrop-blur-md shadow-lg rounded-r-2xl
//                 transition-all duration-300"
//       >
//         <BarIcons
//           title="Comunidad"
//           activeSection={activeSection}
//           setActiveSection={setActiveSection}
//           animate
//         />
//       </aside>

//       <div className="w-full max-w-4xl bg-white min-h-screen border rounded-md shadow-md p-0 mx-auto">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-2 md:gap-0">
//           <h1 className="text-xl md:text-2xl font-bold mb-2 md:mb-6">
//             Publicaciones de la comunidad
//           </h1>
//           <div className="flex justify-center gap-2 flex-wrap">
//             <PlantGrow className="w-12 h-12 md:w-16 md:h-16 mb-2 md:mb-4" />
//             <PlantGrow className="w-12 h-12 md:w-16 md:h-16 mb-2 md:mb-4" />
//             <PlantGrow className="w-12 h-12 md:w-16 md:h-16 mb-2 md:mb-4" />
//             <PlantGrow className="w-12 h-12 md:w-16 md:h-16 mb-2 md:mb-4" />
//           </div>
//         </div>

//         {/* Buscador */}
//         <div className="flex justify-center py-3 sm:py-4">
//           <div className="relative w-full max-w-md">
//             <input
//               type="text"
//               className="w-full border border-gray-300 rounded-full py-2 px-4 pl-10 text-gray-700 focus:outline-none"
//               placeholder="Buscar post, grupo o hilo"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="flex flex-wrap items-center gap-2 sm:gap-4 justify-center py-1 border-b">
//           <div className="flex justify-end mt-4">
//             <button
//               onClick={() => navigate(`/comunity/posts`)}
//               className="text-secondary underline text-sm"
//             >
//               <span className="flex items-center gap-1 text-sky-900 font-medium cursor-pointer">
//                 <FaFileAlt /> Publicaciones
//               </span>
//             </button>
//           </div>

//           <div className="flex justify-end mt-4">
//             <button
//               onClick={() => navigate(`/comunity/ThreadForum`)}
//               className="text-secondary underline text-sm"
//             >
//               <span className="flex items-center gap-1 text-amber-500 font-medium cursor-pointer">
//                 <FaForumbee /> Foro
//               </span>
//             </button>
//           </div>

//           <div className="flex justify-end mt-4">
//             <button
//               onClick={() => navigate(`/comunity/groups`)}
//               className="text-secondary underline text-sm"
//             >
//               <span className="flex items-center gap-1 text-green font-medium cursor-pointer">
//                 <FaLayerGroup /> Grupos
//               </span>
//             </button>
//           </div>

//           <div className="flex justify-end mt-4">
//             <button
//               onClick={() => navigate(`/profile/admin`)}
//               className="text-secondary underline text-sm"
//             >
//               <span className="flex items-center gap-1 text-gray-700 font-medium cursor-pointer">
//                 <FaUser /> Usuarios
//               </span>
//             </button>
//           </div>
//         </div>

//         <div className="px-2 sm:px-5 py-2">
//           {/* Publicaciones recientes */}
//           <AdminPostLayout searchTerm={searchTerm} />
//           <hr />

//           <AdminGroupsLayout searchTerm={searchTerm} />
//           <hr />

//           <AdminThreadsLayout searchTerm={searchTerm} />
//           <hr />
//         </div>
//       </div>
//     </div>
//   );
// }
