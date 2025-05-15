import React, { useState, useContext } from "react";
import { useGroup } from "../hooks/useGroup";
import { AuthContext } from "../../authentication/context/AuthContext";
import { useContent } from "../hooks/useContent";
import { PlusCircle, Edit, Trash2, Users, Eye } from "lucide-react";
import { CreateGroupForm } from "../ui/CreateGroupForm";
import { ConfirmationDialog } from "../ui/ConfirmationDialog";
import { SearchBar } from "../ui/SearchBar";

export const Groups = () => {
  const { 
    groups, 
    loading, 
    canCreateGroup, 
    joinGroup, 
    deleteGroup,
    setSelectedGroupId
  } = useGroup();
  const { user } = useContext(AuthContext);
  const { setActiveContent } = useContent();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [groupToDelete, setGroupToDelete] = useState(null);
  
  // Filtrar grupos por término de búsqueda
const filteredGroups = (groups || []).filter(group => 
  group.name && group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  group.description && group.description.toLowerCase().includes(searchTerm.toLowerCase())
);
  
  // Manejar la actualización del término de búsqueda
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Navegar al detalle de un grupo
  const handleViewGroup = (groupId) => {
    setSelectedGroupId(groupId);
    setActiveContent("group-detail");
  };
  
  // Manejar la eliminación de un grupo
  const handleDeleteConfirm = async () => {
    if (groupToDelete) {
      await deleteGroup(groupToDelete);
      setGroupToDelete(null);
    }
  };
  
  // Manejar la creación exitosa de un grupo
  const handleGroupCreated = () => {
    setShowCreateForm(false);
  };
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Grupos de la Comunidad</h1>
      
      {/* Barra de búsqueda */}
      <div className="mb-4">
        <SearchBar 
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Buscar grupos"
        />
      </div>
      
      {/* Botón para mostrar/ocultar formulario de creación de grupo */}
      {canCreateGroup() && (
        <div className="mb-6">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center justify-center bg-primary text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            <span>{showCreateForm ? "Cancelar" : "Crear nuevo grupo"}</span>
          </button>
        </div>
      )}
      
      {/* Formulario de creación de grupo (condicional) */}
      {showCreateForm && (
        <div className="mb-6">
          <CreateGroupForm onGroupCreated={handleGroupCreated} />
        </div>
      )}
      
      {/* Lista de grupos */}
      <div>
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-2 text-gray-600">Cargando grupos...</p>
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-gray-600">
              {searchTerm
                ? `No se encontraron grupos con "${searchTerm}"`
                : "No hay grupos disponibles"}
            </p>
            {canCreateGroup() && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="mt-4 inline-flex items-center text-primary hover:underline"
              >
                <PlusCircle className="mr-1 h-4 w-4" />
                {searchTerm ? "Crear nuevo grupo" : "Crea el primer grupo"}
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGroups.map(group => {
              const isMember = group.members?.some(member => member.id === user?.id);
              const canManage = user && (user.isAdmin || group.userId === user.id);
              
              return (
                <div key={group.id} className="bg-white p-4 rounded-lg shadow-md">
                  <div className="flex justify-between">
                    <h3 className="font-bold text-lg mb-2 flex-grow">{group.name}</h3>
                    
                    {/* Botones de administración y visualización */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewGroup(group.id)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Ver grupo"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      
                      {canManage && (
                        <button
                          onClick={() => {
                            setSelectedGroupId(group.id);
                            setActiveContent("group-edit");
                          }}
                          className="text-green-600 hover:text-green-800"
                          title="Editar grupo"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                      )}
                      
                      {canManage && (
                        <button
                          onClick={() => setGroupToDelete(group.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Eliminar grupo"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3">
                    {group.description?.length > 120
                      ? `${group.description.substring(0, 120)}...`
                      : group.description}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{group.members?.length || 0} miembros</span>
                    </div>
                    
                    <button
                      onClick={() => joinGroup(group.id)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        isMember 
                          ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                          : 'bg-green-100 text-green-600 hover:bg-green-200'
                      }`}
                    >
                      {isMember ? 'Abandonar' : 'Unirse'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Diálogo de confirmación para eliminar */}
      {groupToDelete && (
        <ConfirmationDialog
          title="Eliminar grupo"
          message="¿Estás seguro de que deseas eliminar este grupo? Esta acción eliminará todas las publicaciones y mensajes asociados."
          confirmText="Eliminar"
          cancelText="Cancelar"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setGroupToDelete(null)}
        />
      )}
    </div>
  );
};