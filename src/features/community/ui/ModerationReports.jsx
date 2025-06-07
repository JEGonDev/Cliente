// import React from 'react';

// /**
//  * Componente que muestra los usuarios en moderación
//  * Incluye opciones para reintegrar o suspender usuarios
//  */
// export const ModerationReports = () => {
//   // Datos de muestra para usuarios en moderación
//   const moderationUsers = [
//     {
//       id: 1,
//       username: "GreenLover23",
//       status: "Advertido",
//       icon: "⚠️",
//       statusColor: "text-yellow-600"
//     },
//     {
//       id: 2,
//       username: "Hydrofan45",
//       status: "Expulsado",
//       icon: "🚫",
//       statusColor: "text-red-600"
//     }
//   ];

//   /**
//    * Maneja la reintegración de un usuario
//    * @param {number} userId - ID del usuario a reintegrar
//    */
//   const handleReintegrate = (userId) => {
//     // TODO: Implementar lógica de reintegración
//     console.log(`Reintegrar usuario con ID: ${userId}`);
//   };

//   /**
//    * Maneja la suspensión de un usuario
//    * @param {number} userId - ID del usuario a suspender
//    */
//   const handleSuspend = (userId) => {
//     // TODO: Implementar lógica de suspensión
//     console.log(`Suspender usuario con ID: ${userId}`);
//   };

//   return (
//     <div className="bg-white">
//       <h2 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
//         <span className="w-2 h-2 bg-red-500 rounded-full inline-block mr-2"></span>
//         Usuarios en Moderación
//       </h2>
      
//       <div className="space-y-3">
//         {moderationUsers.length > 0 ? (
//           moderationUsers.map((user) => (
//             <div key={user.id} className="flex justify-between items-center">
//               <div className="flex items-center gap-2">
//                 <span className="text-lg" role="img" aria-label={user.status}>
//                   {user.icon}
//                 </span>
//                 <span className="text-sm text-gray-800">{user.username}</span>
//                 <span className={`text-xs ${user.statusColor}`}>
//                   - {user.status}
//                 </span>
//               </div>
              
//               <div className="flex gap-2">
//                 <button 
//                   onClick={() => handleReintegrate(user.id)}
//                   className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
//                 >
//                   Reintegrar
//                 </button>
//                 <button 
//                   onClick={() => handleSuspend(user.id)}
//                   className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
//                 >
//                   Suspender
//                 </button>
//               </div>  
//             </div>
//           ))
//         ) : (
//           <div className="text-center py-8">
//             <p className="text-gray-500 text-sm">No hay usuarios en moderación</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };