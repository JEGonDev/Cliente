import React from "react";
import { useContent } from "../hooks/useContent";
import { Header } from "../../../ui/layouts/Header";
import { BarIcons_layout } from "../layouts/BarIcons_layout";
import { Navbar_layout } from "../layouts/Navbar_layout";
import { Groups } from "../layouts/Groups";
import { Forum } from "../layouts/Forum";
import { HomeComunity } from "../layouts/HomeComunity";
import { Threads } from "../layouts/Threads";


export const ComunityPage = () => {
  const { activeContent, setActiveContent } = useContent();

  // Función para manejar el cambio de sección
  const handleSectionChange = (section) => {
    setActiveContent(section);
  };

  // Renderizado condicional basado en la sección activa
  const renderContent = () => {
    switch (activeContent) {
      
      
      case "groups":
        return <Groups />;
      
      case "forum":
        return <Forum />;

        case "threads":
          return <Threads />;
      
      
      default:
        return <HomeComunity />;
    }
  };

  return (
    <>
      <Header />
      <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen">
        <BarIcons_layout 
          activeSection={activeContent}
          onSectionChange={handleSectionChange}
        />
        <Navbar_layout />
        <div className="flex-1 p-4">{renderContent()}</div>
      </div>
    </>
  );
};


// import React, { useEffect, useContext } from "react";
// import { Header } from "../../../ui/layouts/Header";
// import { useContent } from "../hooks/useContent";
// import { BarIcons_layout } from "../layouts/BarIcons_layout";
// import { Navbar_layout } from "../layouts/Navbar_layout";
// import { HomeComunity } from "../layouts/HomeComunity";
// import { Groups } from "../layouts/Groups";
// import { GroupDetail } from "../layouts/GroupDetail";
// import { Threads } from "../layouts/Threads";
// import { useCommunity } from "../context/CommunityContext";
// import { AuthContext } from "../../authentication/context/AuthContext";

// export const ComunityPage = () => {
//   const { activeContent, setActiveContent } = useContent();
//   const { 
//     fetchAllPosts, 
//     fetchAllGroups, 
//     fetchAllThreads,
//     fetchAllMessages,
//     fetchAllReactions
//   } = useCommunity();
//   const { isAuthenticated } = useContext(AuthContext);

//   // Cargar datos iniciales cuando el componente se monta
//   useEffect(() => {
//     if (isAuthenticated) {
//       fetchAllPosts();
//       fetchAllGroups();
//       fetchAllThreads();
//       fetchAllMessages();
//       fetchAllReactions();
//     }
//   }, [isAuthenticated]);

//   const renderContent = () => {
//     switch (activeContent) {
//       case "content1":
//       case "home":
//         return <HomeComunity />;
//       case "groups":
//         return <Groups />;
//       case "group-detail":
//         return <GroupDetail />;
//       case "group-edit":
//         return <GroupDetail isEditing={true} />;
//       case "threads":
//         return <Threads />;
//       default:
//         return <HomeComunity />;
//     }
//   };

//   return (
//     <>
//       <Header />
//       <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen">
//         {/* Sección 1: Barra con íconos */}
//         <BarIcons_layout 
//           activeIcon={activeContent} 
//           onIconClick={(iconId) => setActiveContent(iconId)} 
//         />
        
//         {/* Sección 2: Navegación */}
//         <Navbar_layout />
        
//         {/* Sección 3: Contenido principal */}
//         <div className="flex-1 p-4 overflow-y-auto">
//           {renderContent()}
//         </div>
//       </div>
//     </>
//   );
// };