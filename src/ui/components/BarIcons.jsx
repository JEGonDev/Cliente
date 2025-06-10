import { useNavigate } from "react-router-dom";
import {
  MessageCircleMore,
  Users,
  HomeIcon,
} from "lucide-react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

/**
 * Barra lateral animada con íconos, glassmorphism y feedback visual.
 */
export const BarIcons = ({ activeSection, setActiveSection }) => {
  const navigate = useNavigate();

  const items = [
    {
      key: "forum",
      label: "Foro",
      icon: MessageCircleMore,
      route: "/comunity/ThreadForum",
    },
    {
      key: "groups",
      label: "Grupos",
      icon: Users,
      route: "/comunity/groups",
    },
    {
      key: "home",
      label: "Inicio",
      icon: HomeIcon,
      route: "/comunity",
    },
  ];

  return (
    <nav
      className="w-full md:w-40 bg-white/70 backdrop-blur-xl border-b md:border-b-0 md:border-r border-gray-200
                 flex md:flex-col items-center justify-around md:justify-start p-6 gap-8 md:gap-12 shadow-lg transition-all duration-300"
    >
      {items.map(({ key, label, icon: Icon, route }) => {
        const active = activeSection === key;
        return (
          <motion.button
            key={key}
            onClick={() => {
              setActiveSection(key);
              navigate(route);
            }}
            className="relative flex flex-col items-center gap-2 focus:outline-none"
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.96 }}
          >
            <motion.span
              className={`p-3 rounded-full group transition-colors duration-200 border
                ${active ? "bg-green-100 border-green-500 shadow-xl" : "bg-gray-200 border-transparent"}
              `}
              animate={active ? { scale: 1.12 } : { scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Icon
                className={`w-10 h-10 md:w-12 md:h-12 transition-colors duration-200
                  ${active ? "text-green-600" : "text-gray-700 group-hover:text-green-500"}
                `}
              />
            </motion.span>
            <span className={`text-sm mt-1 ${active ? "text-green-700" : "text-gray-700"}`}>
              {label}
            </span>
            {/* Glow o indicador animado debajo del activo */}
            {active && (
              <motion.span
                layoutId="active-pill"
                className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-4 h-1 rounded-full bg-green-500/80 shadow-lg"
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
              />
            )}
          </motion.button>
        );
      })}
    </nav>
  );
};

BarIcons.propTypes = {
  activeSection: PropTypes.oneOf(["forum", "groups", "home"]).isRequired,
  setActiveSection: PropTypes.func.isRequired,
};




// import { useNavigate } from "react-router-dom";
// import {
//   MessageCircleMore, // ícono redondeado para foro
//   Users,
//   HomeIcon,
// } from "lucide-react";
// import PropTypes from "prop-types";

// /**
//  * Barra lateral con íconos grandes, fondo gris claro y estilo mejorado.
//  */ 
// export const BarIcons = ({ activeSection }) => {
//   const navigate = useNavigate();

//   const baseIconStyle =
//     "p-3 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200";
//   const activeStyle = "text-green-600";
//   const inactiveStyle = "text-gray-700";

//   return (
//     <div className="w-full md:w-40 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200 flex md:flex-col items-center justify-around md:justify-start p-6 gap-8 md:gap-10">
      
//       {/* Foro - más redondeado */}
//       <button
//         className={`flex flex-col items-center gap-2 ${
//           activeSection === "forum" ? activeStyle : inactiveStyle
//         }`}
//         onClick={() => navigate("/comunity/ThreadForum")}
//       >
//         <MessageCircleMore className={`${baseIconStyle} w-12 h-12`} />
//         <span className="text-sm hidden md:block">Foro</span>
//       </button>

//       {/* Grupos */}
//       <button
//         className={`flex flex-col items-center gap-2 ${
//           activeSection === "groups" ? activeStyle : inactiveStyle
//         }`}
//         onClick={() => navigate("/comunity/groups")}
//       >
//         <Users className={`${baseIconStyle} w-12 h-12`} />
//         <span className="text-sm hidden md:block">Grupos</span>
//       </button>

//       {/* Inicio */}
//       <button
//         className={`flex flex-col items-center gap-2 ${
//           activeSection === "home" ? activeStyle : inactiveStyle
//         }`}
//         onClick={() => navigate("/comunity")}
//       >
//         <HomeIcon className={`${baseIconStyle} w-12 h-12`} />
//         <span className="text-sm hidden md:block">Inicio</span>
//       </button>
//     </div>
//   );
// };

// BarIcons.propTypes = {
//   activeSection: PropTypes.oneOf(["forum", "groups", "home"]).isRequired,
// };


// import { useNavigate } from "react-router-dom";
// import {
//   MessageCircleMore,
//   Users,
//   HomeIcon,
// } from "lucide-react";
// import PropTypes from "prop-types";
// import { motion } from "framer-motion";
// import { PlantGrow } from "../../features/community/ui/PlantGrow"; // Ajusta el path según tu estructura

// /**
//  * Barra lateral/inferior animada y responsiva.
//  * La animación de la planta se adapta dinámicamente al tamaño de la barra.
//  */
// export const BarIcons = ({ activeSection, setActiveSection }) => {
//   const navigate = useNavigate();

//   const items = [
//     {
//       key: "forum",
//       label: "Foro",
//       icon: MessageCircleMore,
//       route: "/comunity/ThreadForum",
//     },
//     {
//       key: "groups",
//       label: "Grupos",
//       icon: Users,
//       route: "/comunity/groups",
//     },
//     {
//       key: "home",
//       label: "Inicio",
//       icon: HomeIcon,
//       route: "/comunity",
//     },
//   ];

//   return (
//     <div
//       className={`
//         w-full
//         flex flex-row items-center justify-around
//         md:flex-col md:justify-start md:items-center
//         gap-2 md:gap-10
//         h-full
//       `}
//       style={{ minHeight: 0 }} // para que crezca bien en barra vertical
//     >
//       {/* Íconos */}
//       {items.map(({ key, label, icon: Icon, route }) => {
//         const active = activeSection === key;
//         return (
//           <motion.button
//             key={key}
//             onClick={() => {
//               setActiveSection(key);
//               navigate(route);
//             }}
//             className="relative flex flex-col items-center group focus:outline-none"
//             whileHover={{ scale: 1.12 }}
//             whileTap={{ scale: 0.96 }}
//           >
//             <motion.span
//               className={`
//                 p-2 md:p-3 rounded-full border
//                 ${active ? "bg-green-100 border-green-500 shadow-xl" : "bg-gray-200 border-transparent"}
//                 transition-all duration-200
//               `}
//               animate={active ? { scale: 1.12 } : { scale: 1 }}
//               transition={{ type: "spring", stiffness: 300 }}
//             >
//               <Icon
//                 className={`
//                   w-7 h-7 md:w-10 md:h-10
//                   transition-colors duration-200
//                   ${active ? "text-green-600" : "text-gray-700 group-hover:text-green-500"}
//                 `}
//               />
//             </motion.span>
//             <span
//               className={`
//                 text-xs md:text-sm mt-0.5 md:mt-1
//                 ${active ? "text-green-700 font-semibold" : "text-gray-700 font-normal"}
//                 ${active ? "block" : "hidden md:block"}
//               `}
//             >
//               {label}
//             </span>
//             {active && (
//               <motion.span
//                 layoutId="active-pill"
//                 className="absolute left-1/2 -bottom-1 md:-bottom-2 -translate-x-1/2 w-3 md:w-4 h-1 rounded-full bg-green-500/80 shadow-lg"
//                 transition={{ type: "spring", stiffness: 500, damping: 25 }}
//               />
//             )}
//           </motion.button>
//         );
//       })}
//       {/* Planta al final, ocupa el espacio disponible dinámicamente */}
//       <div
//         className={`
//           flex-1 flex items-end justify-center
//           md:mt-auto md:mb-0 mt-0 mb-0
//           min-h-[48px] md:min-h-[120px]
//           w-full
//         `}
//       >
//         {/* 
//           - En móvil: altura limitada para no tapar el contenido.
//           - En escritorio: ocupa bien la parte baja de la barra.
//           - Usa max-w-xs para que nunca sea excesivo.
//         */}
//         <PlantGrow className="w-2/3 max-w-[90px] md:w-4/5 md:max-w-[120px] h-full" />
//       </div>
//     </div>
//   );
// };

// BarIcons.propTypes = {
//   activeSection: PropTypes.oneOf(["forum", "groups", "home"]).isRequired,
//   setActiveSection: PropTypes.func.isRequired,
// };

// import { useNavigate } from "react-router-dom";
// import {
//   MessageCircleMore,
//   Users,
//   HomeIcon,
// } from "lucide-react";
// import PropTypes from "prop-types";
// import { motion } from "framer-motion";
// // Importa la animación de la planta
// import { PlantGrow } from "../../features/community/ui/PlantGrow"; // Ajusta el path según tu estructura

// /**
//  * Barra lateral/inferior animada y responsiva.
//  * La animación de la planta aparece al final de los íconos (abajo en desktop, a la derecha en mobile).
//  */
// export const BarIcons = ({ activeSection, setActiveSection }) => {
//   const navigate = useNavigate();

//   const items = [
//     {
//       key: "forum",
//       label: "Foro",
//       icon: MessageCircleMore,
//       route: "/comunity/ThreadForum",
//     },
//     {
//       key: "groups",
//       label: "Grupos",
//       icon: Users,
//       route: "/comunity/groups",
//     },
//     {
//       key: "home",
//       label: "Inicio",
//       icon: HomeIcon,
//       route: "/comunity",
//     },
//   ];

//   return (
//     <div
//       className={`
//         w-full
//         flex flex-row items-center justify-around
//         md:flex-col md:justify-start md:items-center
//         gap-2 md:gap-10
//       `}
//     >
//       {/* Íconos */}
//       {items.map(({ key, label, icon: Icon, route }) => {
//         const active = activeSection === key;
//         return (
//           <motion.button
//             key={key}
//             onClick={() => {
//               setActiveSection(key);
//               navigate(route);
//             }}
//             className="relative flex flex-col items-center group focus:outline-none"
//             whileHover={{ scale: 1.12 }}
//             whileTap={{ scale: 0.96 }}
//           >
//             <motion.span
//               className={`
//                 p-2 md:p-3 rounded-full border
//                 ${active ? "bg-green-100 border-green-500 shadow-xl" : "bg-gray-200 border-transparent"}
//                 transition-all duration-200
//               `}
//               animate={active ? { scale: 1.12 } : { scale: 1 }}
//               transition={{ type: "spring", stiffness: 300 }}
//             >
//               <Icon
//                 className={`
//                   w-7 h-7 md:w-10 md:h-10
//                   transition-colors duration-200
//                   ${active ? "text-green-600" : "text-gray-700 group-hover:text-green-500"}
//                 `}
//               />
//             </motion.span>
//             <span
//               className={`
//                 text-xs md:text-sm mt-0.5 md:mt-1
//                 ${active ? "text-green-700 font-semibold" : "text-gray-700 font-normal"}
//                 ${active ? "block" : "hidden md:block"}
//               `}
//             >
//               {label}
//             </span>
//             {active && (
//               <motion.span
//                 layoutId="active-pill"
//                 className="absolute left-1/2 -bottom-1 md:-bottom-2 -translate-x-1/2 w-3 md:w-4 h-1 rounded-full bg-green-500/80 shadow-lg"
//                 transition={{ type: "spring", stiffness: 500, damping: 25 }}
//               />
//             )}
//           </motion.button>
//         );
//       })}
//       {/* Planta al final */}
//       <div className="hidden md:flex mt-8">
//         <PlantGrow className="w-10 h-14" />
//       </div>
//       {/* En móvil, al final (a la derecha) */}
//       <div className="flex md:hidden ml-4">
//         <PlantGrow className="w-8 h-10" />
//       </div>
//     </div>
//   );
// };

// BarIcons.propTypes = {
//   activeSection: PropTypes.oneOf(["forum", "groups", "home"]).isRequired,
//   setActiveSection: PropTypes.func.isRequired,
// };


// import { useNavigate } from "react-router-dom";
// import {
//   MessageCircleMore,
//   Users,
//   HomeIcon,
// } from "lucide-react";
// import PropTypes from "prop-types";
// import { motion } from "framer-motion";

// /**
//  * Barra lateral/inferior animada y responsiva.
//  */
// export const BarIcons = ({ activeSection, setActiveSection }) => {
//   const navigate = useNavigate();

//   const items = [
//     {
//       key: "forum",
//       label: "Foro",
//       icon: MessageCircleMore,
//       route: "/comunity/ThreadForum",
//     },
//     {
//       key: "groups",
//       label: "Grupos",
//       icon: Users,
//       route: "/comunity/groups",
//     },
//     {
//       key: "home",
//       label: "Inicio",
//       icon: HomeIcon,
//       route: "/comunity",
//     },
//   ];

//   return (
//     <div
//       className={`
//         w-full
//         flex flex-row items-center justify-around
//         md:flex-col md:justify-start md:items-center
//         gap-2 md:gap-10
//       `}
//     >
//       {items.map(({ key, label, icon: Icon, route }) => {
//         const active = activeSection === key;
//         return (
//           <motion.button
//             key={key}
//             onClick={() => {
//               setActiveSection(key);
//               navigate(route);
//             }}
//             className="relative flex flex-col items-center group focus:outline-none"
//             whileHover={{ scale: 1.12 }}
//             whileTap={{ scale: 0.96 }}
//           >
//             <motion.span
//               className={`
//                 p-2 md:p-3 rounded-full border
//                 ${active ? "bg-green-100 border-green-500 shadow-xl" : "bg-gray-200 border-transparent"}
//                 transition-all duration-200
//               `}
//               animate={active ? { scale: 1.12 } : { scale: 1 }}
//               transition={{ type: "spring", stiffness: 300 }}
//             >
//               <Icon
//                 className={`
//                   w-7 h-7 md:w-10 md:h-10
//                   transition-colors duration-200
//                   ${active ? "text-green-600" : "text-gray-700 group-hover:text-green-500"}
//                 `}
//               />
//             </motion.span>
//             <span
//               className={`
//                 text-xs md:text-sm mt-0.5 md:mt-1
//                 ${active ? "text-green-700 font-semibold" : "text-gray-700 font-normal"}
//                 ${active ? "block" : "hidden md:block"}
//               `}
//             >
//               {label}
//             </span>
//             {active && (
//               <motion.span
//                 layoutId="active-pill"
//                 className="absolute left-1/2 -bottom-1 md:-bottom-2 -translate-x-1/2 w-3 md:w-4 h-1 rounded-full bg-green-500/80 shadow-lg"
//                 transition={{ type: "spring", stiffness: 500, damping: 25 }}
//               />
//             )}
//           </motion.button>
//         );
//       })}
//     </div>
//   );
// };

// BarIcons.propTypes = {
//   activeSection: PropTypes.oneOf(["forum", "groups", "home"]).isRequired,
//   setActiveSection: PropTypes.func.isRequired,
// };


