import React from 'react'
import { ItemsNavbar } from './ItemsNavbar'

import Storage from '../../storage/Storage'
import { FiMenu } from 'react-icons/fi'
import { useState } from 'react'

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    // const go = useNavigate();
    // const logout = async () => {
    //     Storage.remove('authToken');
    //     Storage.remove('authUser');
    //     
    //     go('/login');
    // }

    return (
        <nav className='flex space-x-6 p-4'>

            <ItemsNavbar link='/' style='text-white' text='Inicio' />
            <ItemsNavbar link='/community' style='text-white' text='Comunidad' />
            
            

        </nav>
    )
}

// import React, { useState } from 'react';
// import { ItemsNavbar } from './ItemsNavbar';
// import Storage from '../../storage/Storage';
// import { FiMenu } from 'react-icons/fi';

// export const Navbar = () => {
//     const [isOpen, setIsOpen] = useState(false);

//     const authToken = Storage.get('authToken');

//     return (
//         <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
//             {/* Links siempre visibles */}
//             <div className="flex space-x-6">
//                 <ItemsNavbar link="/" text="Inicio" />
//                 <ItemsNavbar link="/community" text="Comunidad" />
//             </div>

//             {/* Icono menú para mostrar rutas protegidas */}
//             {authToken && (
//                 <button
//                     className="p-2 text-white rounded-md hover:bg-gray-700 md:hidden"
//                     onClick={() => setIsOpen(!isOpen)}
//                     aria-expanded={isOpen}
//                     aria-controls="nav"
//                 >
//                     <FiMenu className="w-6 h-6" />
//                 </button>
//             )}

//             {/* Rutas protegidas (solo visibles si hay usuario autenticado) */}
//             <div className={`absolute top-16 right-4 bg-gray-900 p-4 rounded-lg shadow-lg md:static md:flex md:items-center md:space-x-6 ${isOpen ? 'block' : 'hidden'}`}>
//                 {authToken ? (
//                     <>
//                         <span className="block text-white font-semibold">{authUser.name}</span>
//                         <ItemsNavbar link="/create-password" text="Crear Contraseña" />
//                         <ItemsNavbar link="/edit-password" text="Editar Contraseña" />
//                     </>
//                 ) : (
//                     <>
//                         <ItemsNavbar link="/login" text="Login" />
//                         <ItemsNavbar link="/register" text="Register" />
//                     </>
//                 )}
//             </div>
//         </nav>
//     );
// };





