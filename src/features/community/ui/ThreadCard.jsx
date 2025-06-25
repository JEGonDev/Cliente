import React from "react";
import { useNavigate } from "react-router-dom";

export const ThreadCard = ({ thread, selected, onSelect, disabled }) => {
  const navigate = useNavigate();

  const baseClasses = `
    flex-1 bg-gray-100 border rounded-lg p-0 shadow transition-all duration-200
    ${disabled ? 'opacity-50 pointer-events-none select-none' : 'cursor-pointer'}
  `;
  const hoverClasses = disabled
    ? ''
    : 'hover:scale-[1.025] hover:shadow-lg hover:border-primary';
  const selectedClasses = selected && !disabled
    ? 'ring-2 ring-primary scale-[1.03] border-primary shadow-xl z-10'
    : 'border-gray-200';

  return (
    <div
      className="flex gap-3 items-start"
      onClick={disabled ? undefined : onSelect}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={disabled
        ? undefined
        : e => { if (e.key === "Enter" || e.key === " ") onSelect(); }
      }
      role="button"
      aria-pressed={selected && !disabled}
      aria-disabled={disabled}
    >
      <article
        className={[
          baseClasses,
          hoverClasses,
          selectedClasses,
        ].join(' ')}
        style={{ willChange: "transform, box-shadow" }}
      >
        {/* Cabecera con degradado */}
        <div className="relative h-20 overflow-hidden rounded-t-xl mb-2">
          <div className="absolute inset-0 bg-gradient-to-r from-[#23582a] to-[#3a8741]" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center h-full px-6 py-2 gap-2">
            <h2 className="text-lg font-bold text-white truncate">
              {thread.title}
            </h2>
            <time className="text-sm text-gray-100 sm:ml-4">
              {new Date(
                thread.creation_date ||
                thread.creationDate ||
                thread.createdAt
              ).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </time>
          </div>
        </div>
        {/* Contenido del thread */}
        <div className="px-6 pb-6 pt-2">
          <p className="text-gray-700 line-clamp-3">{thread.content}</p>
          <div className="flex justify-end mt-4">
            <button
              onClick={e => {
                e.stopPropagation();
                if (!disabled) navigate(`/comunity/thread/${thread.id}`);
              }}
              className="text-secondary underline text-sm"
              disabled={disabled}
              tabIndex={disabled ? -1 : 0}
            >
              Ver detalles
            </button>
          </div>
        </div>
      </article>
    </div>
  );
};


// import React from "react";
// import { useNavigate } from "react-router-dom";

// export const ThreadCard = ({ thread, selected, onSelect, disabled }) => {
//   const navigate = useNavigate();

//   const baseClasses = `
//     flex-1 bg-gray-100 border rounded-lg p-6 shadow transition-all duration-200
//     ${disabled ? 'opacity-50 pointer-events-none select-none' : 'cursor-pointer'}
//   `;
//   const hoverClasses = disabled
//     ? ''
//     : 'hover:scale-[1.025] hover:shadow-lg hover:border-primary';
//   const selectedClasses = selected && !disabled
//     ? 'ring-2 ring-primary scale-[1.03] border-primary shadow-xl z-10'
//     : 'border-gray-200';

//   return (
//     <div
//       className="flex gap-3 items-start"
//       onClick={disabled ? undefined : onSelect}
//       tabIndex={disabled ? -1 : 0}
//       onKeyDown={disabled
//         ? undefined
//         : e => { if (e.key === "Enter" || e.key === " ") onSelect(); }
//       }
//       role="button"
//       aria-pressed={selected && !disabled}
//       aria-disabled={disabled}
//     >
//       <article
//         className={[
//           baseClasses,
//           hoverClasses,
//           selectedClasses,
//         ].join(' ')}
//         style={{ willChange: "transform, box-shadow" }}
//       >
//         <div className="flex items-start gap-4">
//           <div className="flex-1 min-w-0">
//             <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
//               <h2 className="text-lg font-bold text-gray-900 truncate">
//                 {thread.title}
//               </h2>
//               <time className="text-sm text-gray-500">
//                 {new Date(
//                   thread.creation_date ||
//                   thread.creationDate ||
//                   thread.createdAt
//                 ).toLocaleDateString("es-ES", {
//                   year: "numeric",
//                   month: "short",
//                   day: "numeric",
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 })}
//               </time>
//             </div>
//             <p className="text-gray-700 line-clamp-3">{thread.content}</p>
//           </div>
//         </div>
//         <div className="flex justify-end mt-4">
//           <button
//             onClick={e => {
//               e.stopPropagation();
//               if (!disabled) navigate(`/comunity/thread/${thread.id}`);
//             }}
//             className="text-secondary underline text-sm"
//             disabled={disabled}
//             tabIndex={disabled ? -1 : 0}
//           >
//             Ver detalles
//           </button>
//         </div>
//       </article>
//     </div>
//   );
// };


// import React from "react";
// import { FaUserCircle } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// export const ThreadCard = ({ thread }) => {
//   console.log("ThreadCard thread:", thread);
//   const navigate = useNavigate();

//   return (
//     <div className="flex gap-3 items-start border rounded-lg p-4 shadow bg-white">      
//       <article
//         key={thread.thread_id || thread.id}
//         className="flex-1 bg-gray-100 border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
//       >
//         <div className="flex items-start gap-4">
//           {/* <div className="flex-shrink-0">
//             <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
//               <span className="text-gray-600 font-medium">
//                 {(thread.authorName || thread.userName || "U")
//                   .charAt(0)
//                   .toUpperCase()}
//               </span>
//             </div>
//           </div> */}

//           <div className="flex-1 min-w-0">
//             <div className="flex items-center gap-2 mb-2">
//               {/* <h3 className="font-semibold text-gray-900 truncate">
//                 {thread.authorName || thread.userName || "Usuario"}
//               </h3>
//               <span className="text-gray-400">•</span> */}

//               <h2 className="text-lg font-bold text-gray-900 truncate">
//               {thread.title}
//             </h2>
//               <time className="text-sm text-gray-500">
//                 {new Date(
//                   thread.creation_date ||
//                     thread.creationDate ||
//                     thread.createdAt
//                 ).toLocaleDateString("es-ES", {
//                   year: "numeric",
//                   month: "short",
//                   day: "numeric",
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 })}
//               </time>
//             </div>

            

//             <p className="text-gray-700 line-clamp-3">{thread.content}</p>
//           </div>
//         </div>
//         <div className="flex justify-end mt-4">
//         <button
//           onClick={() => navigate(`/comunity/thread/${thread.id}`)}
//           className="text-secondary underline text-sm"
//         >
//           Ver detalles
//         </button>
//       </div>
//       </article>     
//     </div>
//   );
// };
