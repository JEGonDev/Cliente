import { useNavigate } from "react-router-dom";
import { MessageCircleMore, Users, HomeIcon } from "lucide-react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

export const BarIcons = ({ title, activeSection, setActiveSection }) => {
  const navigate = useNavigate();

  const items = [
    {
      key: "home",
      label: "Inicio",
      icon: HomeIcon,
      route: "/comunity",
    },
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
    }
  ];

  return (
    <div
      className={`
        flex flex-row fixed bottom-0 left-0 right-0 z-40 w-full h-16
        bg-white border-t border-gray-200 items-center justify-around
        md:static md:flex-col md:w-64 md:min-h-screen md:py-4
        md:border-r md:border-t-0 md:bg-white md:items-stretch md:justify-start md:z-auto
      `}
    >
      {/* Título solo en desktop */}
      <div className="hidden md:block px-4 mb-2">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <hr className="mt-2 border-gray-300" />
      </div>

      <nav className="flex flex-row md:flex-col w-full md:w-auto items-center md:items-stretch justify-around md:justify-start">
        {items.map(({ key, label, icon: Icon, route }) => {
          const active = activeSection === key;
          return (
            <motion.button
              key={key}
              onClick={() => {
                setActiveSection(key);
                navigate(route);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                flex items-center justify-center md:justify-start
                h-full md:h-auto md:px-4 md:py-3
                rounded-md text-sm transition-all duration-200
                ${
                  active
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              <Icon
                className={`w-4 h-4 md:mr-3 ${
                  active ? "text-green-600" : "text-gray-500"
                }`}
              />
              <span className="hidden md:inline">{label}</span>
              {active && (
                <motion.span
                  layoutId="active-indicator"
                  className="hidden md:inline ml-auto w-2 h-2 bg-green-500 rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
};

BarIcons.propTypes = {
  title: PropTypes.string.isRequired,
  activeSection: PropTypes.oneOf(["forum", "groups", "home"]).isRequired,
  setActiveSection: PropTypes.func.isRequired,
};
