import React, { useState, useEffect, useContext } from "react";
import { FaUserCircle, FaSearch, FaPlus, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { ThreadFormModal } from "../ui/ThreadFormModal";
import { communityService } from "../services/communityService";
import { isThreadValid } from "../utils/threadHelpers";
import { AuthContext } from "../../authentication/context/AuthContext"; // Ajusta la ruta según tu estructura

const exampleThreads = [
  {
    thread_id: 1,
    authorName: "Santiago Ramirez",
    creation_date: "2024-04-27T13:09:00",
    title: "¿Qué sistema de hidroponía es mejor?",
    content:
      "¡Hola a todos! Estoy comenzando con hidroponía y quiero saber qué tipo de sistema es mejor para cultivos de lechuga. ¿Alguna recomendación?",
    group_id: 1,
    user_id: 1,
  },
];

export const ThreadForumView = () => {
  const { user } = useContext(AuthContext); // Ajusta si tu contexto usa otro nombre o estructura
  const userId = user?.id || user?.userId;   // Ajusta si tu contexto es diferente
  const [threads, setThreads] = useState([]);
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("recent");
  const [showModal, setShowModal] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [dropdownFilter, setDropdownFilter] = useState("all"); // "all", "user", "group"
  const [selectedGroup, setSelectedGroup] = useState(""); // Para opción de grupo en el dropdown

  // Fetch grupos del usuario
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const allGroups = await communityService.getAllGroups();
        let userGroups = Array.isArray(allGroups)
          ? allGroups
          : Array.isArray(allGroups?.data)
          ? allGroups.data
          : [];

        // Si cada grupo tiene un campo miembros, filtra solo los grupos donde el userId esté presente
        userGroups = userGroups.filter(
          (group) =>
            !group.members ||
            group.members.includes(userId) ||
            group.user_id === userId ||
            (group.users && group.users.some((u) => u.id === userId))
        );

        setGroups(userGroups);
      } catch (err) {
        setGroups([]);
      }
    };
    if (userId) fetchGroups();
  }, [userId]);

  // Fetch threads
  const fetchThreads = async () => {
    try {
      const response = await communityService.getAllThreads();
      let threadsData = [];
      if (Array.isArray(response.data)) {
        threadsData = response.data;
      } else if (Array.isArray(response)) {
        threadsData = response;
      } else if (Array.isArray(response.data?.data)) {
        threadsData = response.data.data;
      }
      setThreads(threadsData.length ? threadsData : exampleThreads);
    } catch (err) {
      setThreads(exampleThreads);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, []);

  // Refresca después de crear un hilo
  const handleThreadCreated = () => {
    fetchThreads();
    setShowModal(false);
  };

  // Filtro y ordenamiento
  let filteredThreads = threads
    .filter(isThreadValid)
    .filter((thread) => {
      // Filtro por texto
      const matchesText =
        thread.content.toLowerCase().includes(search.toLowerCase()) ||
        thread.title.toLowerCase().includes(search.toLowerCase());
      // Filtro de dropdown
      let matchesDropdown = true;
      if (dropdownFilter === "user" && userId) {
        matchesDropdown =
          thread.user_id === userId ||
          thread.userId === userId; // Por compatibilidad con ambos keys
      } else if (dropdownFilter === "group" && selectedGroup) {
        matchesDropdown =
          String(thread.group_id) === String(selectedGroup) ||
          String(thread.groupId) === String(selectedGroup); // Por compatibilidad con ambos keys
      }
      return matchesText && matchesDropdown;
    })
    .sort((a, b) => {
      if (sortOption === "recent") {
        return new Date(b.creation_date || b.creationDate) - new Date(a.creation_date || a.creationDate);
      } else {
        return new Date(a.creation_date || a.creationDate) - new Date(b.creation_date || b.creationDate);
      }
    });

  return (
    <div className="w-full px-0 sm:px-4 my-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-2 mb-5">
        <h1 className="text-2xl font-bold">Foro de discusion</h1>
        <button
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded font-semibold hover:bg-green-700"
          onClick={() => setShowModal(true)}
        >
          <FaPlus /> Crear hilo
        </button>
      </div>
      {/* Filtros y búsqueda */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
        {/* Dropdown de ordenamiento y filtro */}
        <div className="relative min-w-[220px]">
          <div
            className="border rounded p-2 font-semibold text-gray-700 flex items-center justify-between cursor-pointer select-none"
            onClick={() => setShowSortOptions((prev) => !prev)}
          >
            Ordenar y ver
            <span className="ml-2">
              {showSortOptions ? <FaChevronUp /> : <FaChevronDown />}
            </span>
          </div>
          {showSortOptions && (
            <div className="absolute z-10 w-full bg-white border rounded mt-1 shadow-lg">
              <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-100">
                <input
                  type="radio"
                  name="dropdown-filter"
                  checked={dropdownFilter === "all"}
                  onChange={() => setDropdownFilter("all")}
                />
                <span className="text-sm">Ver todos los hilos</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-100">
                <input
                  type="radio"
                  name="dropdown-filter"
                  checked={dropdownFilter === "user"}
                  onChange={() => setDropdownFilter("user")}
                />
                <span className="text-sm">Mis hilos</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-100">
                <input
                  type="radio"
                  name="dropdown-filter"
                  checked={dropdownFilter === "group"}
                  onChange={() => setDropdownFilter("group")}
                />
                <span className="text-sm">Filtrar por grupo</span>
              </label>
              {dropdownFilter === "group" && (
                <div className="p-2">
                  <select
                    className="w-full border rounded px-3 py-2"
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                  >
                    <option value="">Todos los grupos</option>
                    {groups.length === 0 ? (
                      <option value="">No hay grupos disponibles</option>
                    ) : (
                      groups.map((group) => (
                        <option key={group.group_id || group.id} value={group.group_id || group.id}>
                          {group.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              )}
              <div className="border-t my-1"></div>
              <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-100">
                <input
                  type="radio"
                  name="sort"
                  checked={sortOption === "recent"}
                  onChange={() => setSortOption("recent")}
                />
                <span className="text-sm">Activo recientemente</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-100">
                <input
                  type="radio"
                  name="sort"
                  checked={sortOption === "date"}
                  onChange={() => setSortOption("date")}
                />
                <span className="text-sm">Fecha de publicación</span>
              </label>
            </div>
          )}
        </div>
        {/* Buscar */}
        <div className="flex-grow flex items-center gap-2">
          <input
            type="text"
            className="border rounded-full px-4 py-2 w-full focus:outline-none"
            placeholder="Buscar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="text-gray-600" tabIndex={-1} type="button">
            <FaSearch />
          </button>
        </div>
      </div>
      {/* Lista de hilos */}
      <div>
        {filteredThreads.length === 0 ? (
          <div className="text-gray-400 text-center py-10">
            No hay hilos disponibles.
          </div>
        ) : (
          filteredThreads.map((thread) => (
            <div key={thread.thread_id || thread.id} className="mb-7">
              <div className="flex items-start gap-3">
                <FaUserCircle className="text-3xl text-gray-400 mt-1" />
                <div className="flex-1">
                  <div className="font-semibold">
                    {thread.authorName || thread.userName || "Usuario"}{" "}
                    <span className="text-xs font-normal text-gray-600">
                      —{" "}
                      {new Date(thread.creation_date || thread.creationDate).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                      })}
                      ,{" "}
                      {new Date(thread.creation_date || thread.creationDate).toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="font-bold text-lg">{thread.title}</div>
                  <div className="mt-1 text-gray-800">{thread.content}</div>
                </div>
              </div>
              <div className="text-xs text-gray-400 mt-2 mb-2 flex items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="mx-2">
                  {new Date(thread.creation_date || thread.creationDate).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>
            </div>
          ))
        )}
      </div>
      {showModal && (
        <ThreadFormModal
          onClose={() => setShowModal(false)}
          onThreadCreated={handleThreadCreated}
        />
      )}
    </div>
  );
};