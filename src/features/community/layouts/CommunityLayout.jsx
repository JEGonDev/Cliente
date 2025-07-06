import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BarIcons } from "../../../ui/components/BarIcons";

export const CommunityLayout = () => {
  const [activeSection, setActiveSection] = useState("forum");
  const location = useLocation();

  return (
    <div className=" flex md:flex-row min-h-screen bg-white from-gray-50 to-gray-100">
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
          animate
        />
      </aside>
      {/* Contenido principal */}
      <main className="flex-1 p-2 sm:p-4 md:p-8 pb-20 md:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -32 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      {/* Barra inferior (móvil) */}
      <nav
        className="
          fixed bottom-0 left-0 right-0 z-40
          flex md:hidden
          bg-white/90 backdrop-blur-md shadow-t
          border-t border-gray-200
          py-2
        "
      >
        <BarIcons
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
      </nav>
    </div>
  );
};
