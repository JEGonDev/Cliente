import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { UserFilters } from "./UserFilters";
import { UserTable } from "./UserTable";
import { PaginationControls } from "./PaginationControls";
import { UserDetailsModal } from "./UserDetailsModal";
import { DeleteUserModal } from "./DeleteUserModal";
import { EditUserModal } from "./EditUserModal";
import { useUserList } from "../hooks/useUserList";
import { profileService } from "../services/profileService";

export const ProfileAdminList = () => {
  const navigate = useNavigate();
  // Estados principales
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showUserEdit, setShowUserEdit] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Filtros de UI
  const [searchValue, setSearchValue] = useState("");
  const [roleValue, setRoleValue] = useState("");
  const [statusValue, setStatusValue] = useState("");

  // Hook para obtener usuarios desde la API Germogli
  const { users, loading, error, refetch } = useUserList();

  // Lógica de acciones
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowUserEdit(true);
  };
  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };
  const handleToggleStatus = (user) => {
    alert(`Cambiando estado de ${user.firstName} ${user.lastName}`);
  };
  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        await profileService.deleteUser(userToDelete.id);
        setShowDeleteModal(false);
        setUserToDelete(null);
        refetch(); // Refresca la lista tras eliminar
      } catch (err) {
        alert("No se pudo eliminar el usuario.");
      }
    }
  };

  // ===============================
  // LÓGICA DE EDICIÓN DE USUARIO
  // ===============================
  const handleUserEditSave = async (updatedUser) => {
    console.log("Guardando cambios para el usuario:", updatedUser);
    try {
      await profileService.updateUserInfo(updatedUser.id, updatedUser);
      setShowUserEdit(false);
      refetch(); // recarga la lista para mostrar los cambios
    } catch (e) {
      alert("Error al actualizar usuario");
    }
  };
  // ===============================

  // Paginación ficticia para el ejemplo (ajusta según tu backend si implementas server-side)
  const totalItems = users?.length || 0;
  const itemsPerPage = 5;

  // Adaptar roles y estado para filtros
  const normalizeRole = (roleType) =>
    roleType === "ADMINISTRADOR"
      ? "Administrador"
      : roleType === "MODERADOR"
      ? "Moderador"
      : "Usuario";
  const normalizeStatus = (isActive) => (isActive ? "Activo" : "Inactivo");

  // Filtrado simple en frontend
  const filteredUsers = users
    ? users.filter(user => {
        const matchesSearch =
          searchValue === "" ||
          (`${user.firstName || ""} ${user.lastName || ""}`)
            .toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          (user.email && user.email.toLowerCase().includes(searchValue.toLowerCase()));
        const matchesRole =
          roleValue === "" || normalizeRole(user.roleType) === roleValue;
        const matchesStatus =
          statusValue === "" || normalizeStatus(user.isActive) === statusValue;
        return matchesSearch && matchesRole && matchesStatus;
      })
    : [];

  // Paginación simple frontend
  const pagedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Usuarios del Sistema</h2>
        <button
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-green-800"
          onClick={() => navigate("/admin/register")}
        >
          <UserPlus size={16} className="mr-2" />
          Nuevo Usuario Administrador
        </button>
      </div>

      <UserFilters
        searchValue={searchValue}
        roleValue={roleValue}
        statusValue={statusValue}
        onSearchChange={setSearchValue}
        onRoleChange={setRoleValue}
        onStatusChange={setStatusValue}
        onRefresh={refetch}
      />

      {loading && (
        <div className="text-center py-6">Cargando usuarios...</div>
      )}
      {error && (
        <div className="text-center py-6 text-red-500">{error}</div>
      )}

      {!loading && !error && (
        <>
          <UserTable
            users={pagedUsers}
            onEdit={handleEditUser}
            onView={handleViewUser}
            onDelete={handleDeleteUser}
          />

          <PaginationControls
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalItems={filteredUsers.length}
            itemsPerPage={itemsPerPage}
          />
        </>
      )}

      {showUserDetails && selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setShowUserDetails(false)}
          onEdit={() => {
            setShowUserDetails(false);
            handleEditUser(selectedUser);
          }}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDeleteUser}
        />
      )}

      {showUserEdit && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onSave={handleUserEditSave} // <-- aquí va la lógica real de edición
          onCancel={() => setShowUserEdit(false)}
        />
      )}

      {showDeleteModal && userToDelete && (
        <DeleteUserModal
          user={userToDelete}
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setUserToDelete(null);
          }}
        />
      )}
    </div>
  );
};

