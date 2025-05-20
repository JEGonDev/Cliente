import React, { useEffect, useState } from "react";
import { GroupCard } from "../ui/GroupCard";
import { GroupFormModal } from "../ui/GroupFormModal";
import { SearchBar } from "../ui/SearchBar";
import { communityService } from "../services/communityService";

export const GroupListView = () => {
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await communityService.getAllGroups();
        const groupsArray = Array.isArray(response.data) ? response.data : [];
        setGroups(groupsArray);
        setFilteredGroups(groupsArray);
      } catch (error) {
        setGroups([]);
        setFilteredGroups([]);
      }
    };
    fetchGroups();
  }, []);

  const handleSearch = (query) => {
    const filtered = groups.filter((group) =>
      group.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredGroups(filtered);
  };

  const handleGroupCreated = (newGroup) => {
    setGroups([newGroup, ...groups]);
    setFilteredGroups([newGroup, ...filteredGroups]);
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <SearchBar onSearch={handleSearch} className="w-full" />
      </div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Crear Grupo
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.length > 0 ? (
          filteredGroups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))
        ) : (
          <p className="text-gray-500 text-center">No hay grupos disponibles.</p>
        )}
      </div>
      {isModalOpen && (
        <GroupFormModal
          onClose={() => setIsModalOpen(false)}
          onGroupCreated={handleGroupCreated}
        />
      )}
    </div>
  );
};


//  import React, { useEffect, useState } from "react";
// import { GroupCard } from "../ui/GroupCard";
// import { GroupFormModal } from "../ui/GroupFormModal";
// import { SearchBar } from "../ui/SearchBar";
// import { communityService } from "../services/communityService";

// export const GroupListView = () => {
//   const [groups, setGroups] = useState([]);
//   const [filteredGroups, setFilteredGroups] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     const fetchGroups = async () => {
//       try {
//         const response = await communityService.getAllGroups();
//         const groupsArray = Array.isArray(response.data) ? response.data : [];
//         setGroups(groupsArray);
//         setFilteredGroups(groupsArray);
//       } catch (error) {
//         setGroups([]);
//         setFilteredGroups([]);
//       }
//     };
//     fetchGroups();
//   }, []);

//   const handleSearch = (query) => {
//     const filtered = groups.filter((group) =>
//       group.name.toLowerCase().includes(query.toLowerCase())
//     );
//     setFilteredGroups(filtered);
//   };

//   const handleGroupCreated = (newGroup) => {
//     setGroups([newGroup, ...groups]);
//     setFilteredGroups([newGroup, ...filteredGroups]);
//   };

//   const handleJoinGroup = (group) => {
//     alert(`Unido al grupo "${group.name}" (simulado)`);
//   };

//   return (
//     <div className="p-4">
//       <div className="mb-4">
//         <SearchBar onSearch={handleSearch} className="w-full" />
//       </div>
//       <div className="flex justify-end mb-4">
//         <button
//           onClick={() => setIsModalOpen(true)}
//           className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
//         >
//           Crear Grupo
//         </button>
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredGroups.length > 0 ? (
//           filteredGroups.map((group) => (
//             <GroupCard key={group.id} group={group} onJoin={handleJoinGroup} />
//           ))
//         ) : (
//           <p className="text-gray-500 text-center">No hay grupos disponibles.</p>
//         )}
//       </div>
//       {isModalOpen && (
//         <GroupFormModal
//           onClose={() => setIsModalOpen(false)}
//           onGroupCreated={handleGroupCreated}
//         />
//       )}
//     </div>
//   );
// };
