import { useContext, useEffect } from "react";
import { Menu } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { ProfileContext } from '../../features/profile/context/ProfileContext';
import { AuthContext } from '../../features/authentication/context/AuthContext';

export const AuthNav = () => {
  const navigate = useNavigate();
  
  // Obtener datos del perfil
  const { profile, loading: profileLoading } = useContext(ProfileContext);
  
  // Obtener datos de autenticación
  const { user, isAuthenticated, isAdmin, isModerator, logout } = useContext(AuthContext);
  
  // Log para depuración
  useEffect(() => {
    console.log("Datos de perfil:", { profile, profileLoading });
    console.log("Datos de autenticación:", { user, isAuthenticated, isAdmin, isModerator });
  }, [profile, profileLoading, user, isAuthenticated, isAdmin, isModerator]);

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    if (typeof logout === 'function') {
      logout();
      navigate('/');
    }
  };

  // Determinar el rol para mostrar
  const getUserRole = () => {
    if (isAdmin) return 'Administrador';
    if (isModerator) return 'Moderador';
    return user?.authorities?.[0] || profile?.role || 'Usuario';
  };

  // Determinar el nombre de usuario a mostrar
  const getDisplayName = () => {
    if (profile?.firstName && profile?.lastName) {
      return `${profile.firstName} ${profile.lastName}`;
    }
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return profile?.username || user?.username || user?.email || 'Usuario';
  };

  // Generar avatar por defecto con las iniciales del usuario
  const getDefaultAvatar = () => {
    const name = getDisplayName();
    const initials = name
      .split(' ')
      .map(part => part?.[0] || '')
      .join('')
      .toUpperCase()
      .substring(0, 2);
    
    return `https://ui-avatars.com/api/?name=${initials || 'U'}&background=random&color=fff`;
  };

  // Obtener URL del avatar
  const getAvatarUrl = () => {
    if (profile?.avatar) return profile.avatar;
    if (user?.avatar) return user.avatar;
    return getDefaultAvatar();
  };

  const isLoading = profileLoading;

  return (
    <div className="flex items-center space-x-4">
      {/* Icono de notificaciones */}
      <button
        type="button"
        className="relative flex items-center justify-center rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
      >
        <span className="absolute -inset-1.5"></span>
        <span className="sr-only">Ver notificaciones</span>
        <BellIcon aria-hidden="true" className="size-6" />
      </button>

      {/* Menú de usuario */}
      <Menu as="div" className="relative">
        <Menu.Button className="relative flex items-center justify-center rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
          <span className="absolute -inset-1.5"></span>
          <span className="sr-only">Abrir menú de usuario</span>
          {isLoading ? (
            <div className="size-8 rounded-full bg-gray-600 animate-pulse"></div>
          ) : (
            <img
              alt={`Avatar de ${getDisplayName()}`}
              src={getAvatarUrl()}
              className="size-8 rounded-full"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = getDefaultAvatar();
              }}
            />
          )}
        </Menu.Button>
        
        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden">
          <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
            {isLoading ? (
              <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <>
                <div className="font-semibold">{getDisplayName()}</div>
                <div className="text-xs text-gray-500">{getUserRole()}</div>
              </>
            )}
          </div>
          
          <Menu.Item>
            {({ active }) => (
              <a
                href="/profile"
                className={`block px-4 py-2 text-sm text-gray-700 ${active ? 'bg-gray-100' : ''} flex items-center`}
              >
                Mi Perfil
              </a>
            )}
          </Menu.Item>
          
          <Menu.Item>
            {({ active }) => (
              <a
                href="/settings"
                className={`block px-4 py-2 text-sm text-gray-700 ${active ? 'bg-gray-100' : ''} flex items-center`}
              >
                Configuración
              </a>
            )}
          </Menu.Item>
          
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={handleLogout}
                className={`w-full text-left px-4 py-2 text-sm text-gray-700 ${active ? 'bg-gray-100' : ''} flex items-center`}
              >
                Cerrar sesión
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>
    </div>
  );
};

// import { useContext, useEffect } from "react";
// import { Menu } from "@headlessui/react";
// import { BellIcon } from "@heroicons/react/24/outline";
// import { useNavigate } from "react-router-dom";
// import { ProfileContext } from "../../features/profile/context/ProfileContext";
// import { AuthContext } from "../../features/authentication/context/AuthContext";

// export const AuthNav = () => {
//   const navigate = useNavigate();

//   // Obtener datos del perfil
//   const { profile, loading: profileLoading } = useContext(ProfileContext);

//   // Obtener datos de autenticación
//   const { user, isAuthenticated, isAdmin, isModerator, logout } =
//     useContext(AuthContext);

//   // Log para depuración
//   useEffect(() => {
//     console.log("Datos de perfil:", { profile, profileLoading });
//     console.log("Datos de autenticación:", {
//       user,
//       isAuthenticated,
//       isAdmin,
//       isModerator,
//     });
//   }, [profile, profileLoading, user, isAuthenticated, isAdmin, isModerator]);

//   // Función para manejar el cierre de sesión
//   const handleLogout = () => {
//     if (typeof logout === "function") {
//       logout();
//       navigate("/");
//     }
//   };

//   // Determinar el rol para mostrar
//   const getUserRole = () => {
//     if (isAdmin) return "Administrador";
//     if (isModerator) return "Moderador";
//     return user?.authorities?.[0] || profile?.role || "Usuario";
//   };

//   // Determinar el nombre de usuario a mostrar
//   const getDisplayName = () => {
//     if (profile?.firstName && profile?.lastName) {
//       return `${profile.firstName} ${profile.lastName}`;
//     }
//     if (user?.firstName && user?.lastName) {
//       return `${user.firstName} ${user.lastName}`;
//     }
//     return profile?.username || user?.username || user?.email || "Usuario";
//   };

//   // Generar avatar por defecto con las iniciales del usuario
//   const getDefaultAvatar = () => {
//     const name = getDisplayName();
//     const initials = name
//       .split(" ")
//       .map((part) => part[0])
//       .join("")
//       .toUpperCase()
//       .substring(0, 2);

//     return `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff`;
//   };

//   // Obtener URL del avatar
//   const getAvatarUrl = () => {
//     if (profile?.avatar) return profile.avatar;
//     if (user?.avatar) return user.avatar;
//     return getDefaultAvatar();
//   };

//   const isLoading = profileLoading;

//   return (
//     <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
//       {/* Icono de notificaciones */}
//       <button
//         type="button"
//         className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none"
//       >
//         <span className="sr-only">Ver notificaciones</span>
//         <BellIcon aria-hidden="true" className="h-6 w-6" />
//       </button>

//       {/* Menú de usuario */}
//       <Menu as="div" className="relative ml-3">
//         <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none">
//           <span className="sr-only">Abrir menú de usuario</span>
//           {isLoading ? (
//             <div className="h-8 w-8 rounded-full bg-gray-600 animate-pulse"></div>
//           ) : (
//             <img
//               alt={`Avatar de ${getDisplayName()}`}
//               src={getAvatarUrl()}
//               className="h-8 w-8 rounded-full"
//               onError={(e) => {
//                 e.target.onerror = null;
//                 e.target.src = getDefaultAvatar();
//               }}
//             />
//           )}
//         </MenuButton>

//         <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 transition focus:outline-none">
//           <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
//             {isLoading ? (
//               <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
//             ) : (
//               <>
//                 <div className="font-semibold">{getDisplayName()}</div>
//                 <div className="text-xs text-gray-500">{getUserRole()}</div>
//               </>
//             )}
//           </div>

//           <MenuItem>
//             {({ active }) => (
//               <a
//                 href="/profile"
//                 className={`block px-4 py-2 text-sm text-gray-700 ${
//                   active ? "bg-gray-100" : ""
//                 }`}
//               >
//                 Mi Perfil
//               </a>
//             )}
//           </MenuItem>

//           <MenuItem>
//             {({ active }) => (
//               <a
//                 href="/settings"
//                 className={`block px-4 py-2 text-sm text-gray-700 ${
//                   active ? "bg-gray-100" : ""
//                 }`}
//               >
//                 Configuración
//               </a>
//             )}
//           </MenuItem>

//           <MenuItem>
//             {({ active }) => (
//               <button
//                 onClick={handleLogout}
//                 className={`w-full text-left px-4 py-2 text-sm text-gray-700 ${
//                   active ? "bg-gray-100" : ""
//                 }`}
//               >
//                 Cerrar sesión
//               </button>
//             )}
//           </MenuItem>
//         </MenuItems>
//       </Menu>
//     </div>
//   );
// };