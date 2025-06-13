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
                 flex md:flex-col items-center justify-around md:justify-start p-6 gap-8 md:gap-12 shadow-sm transition-all duration-300"
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
              className={`p-2 rounded-full group transition-colors duration-200 border
                ${active ? "bg-green-100 border-green-500 shadow-md" : "bg-gray-200 border-transparent"}
              `}
              animate={active ? { scale: 1.12 } : { scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Icon
                className={`w-6 h-6 md:w-8 md:h-8 transition-colors duration-200
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
                className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-4 h-1 rounded-full bg-green-500/80 shadow-sm"
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