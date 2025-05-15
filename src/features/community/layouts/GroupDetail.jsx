import React, { useState, useEffect, useContext } from "react";
import { useGroup } from "../hooks/useGroup";
import { usePost } from "../hooks/usePost";
import { useContent } from "../hooks/useContent";
import { AuthContext } from "../../authentication/context/AuthContext";
import { ArrowLeft, Edit, Trash2, MessageCircle, Users } from "lucide-react";
import { EditGroupForm } from "../ui/EditGroupForm";
import { ConfirmationDialog } from "../ui/ConfirmationDialog";
import { PostList } from "../ui/PostList";
import { CreatePostForm } from "../ui/CreatePostForm";

export const GroupDetail = ({ isEditing: startEditing = false }) => {
  const { 
    selectedGroupId, 
    group, 
    loading, 
    fetchGroupById, 
    deleteGroup, 
    canEditGroup, 
    joinGroup 
  } = useGroup();
  const { posts, loading: postsLoading, fetchPostsByGroupId } = usePost();
  const { user } = useContext(AuthContext);
  const { setActiveContent } = useContent();
  
  const [isEditing, setIsEditing] = useState(startEditing);
  const [showCreatePostForm, setShowCreatePostForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);
  const [groupPosts, setGroupPosts] = useState([]);
  
  // Obtener datos del grupo y sus posts al montar
  useEffect(() => {
    if (selectedGroupId) {
      const loadData = async () => {
        await fetchGroupById(selectedGroupId);
        const posts = await fetchPostsByGroupId(selectedGroupId);
        setGroupPosts(posts);
      };
      loadData();
    }
  }, [selectedGroupId]);
  
  // Si startEditing cambia, actualizar el estado local
  useEffect(() => {
    setIsEditing(startEditing);
  }, [startEditing]);
  
  // Efecto para ocultar el mensaje de éxito después de un tiempo
  useEffect(() => {
    if (editSuccess) {
      const timer = setTimeout(() => {
        setEditSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [editSuccess]);
  
  // Verificar si el usuario es miembro
  const isMember = group && user && group.members?.some(member => member.id === user.id);
  // Verificar si el usuario puede editar
  const canEdit = group && canEditGroup(group);
  
  // Manejar la edición exitosa
  const handleEditSuccess = () => {
    setIsEditing(false);
    setEditSuccess(true);
    fetchGroupById(selectedGroupId); // Recargar el grupo para obtener datos actualizados
  };
  
  // Manejar la eliminación del grupo
  const handleDeleteGroup = async () => {
    const success = await deleteGroup(selectedGroupId);
    if (success) {
      setActiveContent("groups"); // Volver a la lista de grupos
    }
  };
  
  // Manejar la creación exitosa de un post
  const handlePostCreated = async () => {
    setShowCreatePostForm(false);
    const posts = await fetchPostsByGroupId(selectedGroupId); // Recargar los posts
    setGroupPosts(posts);
  };
  
  if (loading && !group) {
    return (
      <div className="p-6 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
        <p className="mt-2 text-gray-600">Cargando grupo...</p>
      </div>
    );
  }
  
  if (!group) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">No se encontró el grupo solicitado.</p>
        <button
          onClick={() => setActiveContent("groups")}
          className="mt-4 inline-flex items-center text-primary hover:underline"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Volver a grupos
        </button>
      </div>
    );
  }
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Botón de volver */}
      <button
        onClick={() => setActiveContent("groups")}
        className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-4"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Volver a grupos
      </button>
      
      {/* Mensaje de éxito para edición */}
      {editSuccess && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 mb-4">
          El grupo ha sido actualizado exitosamente.
        </div>
      )}
      
      {/* Detalles del grupo o formulario de edición */}
      {isEditing ? (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <EditGroupForm 
            group={group} 
            onCancel={() => setIsEditing(false)}
            onSuccess={handleEditSuccess}
          />
        </div>
      ) : (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold mb-2">{group.name}</h1>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Users className="h-4 w-4 mr-1" />
                <span>{group.members?.length || 0} miembros</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              {/* Botones de administración si el usuario puede gestionar */}
              {canEdit && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Editar grupo"
                >
                  <Edit className="h-5 w-5" />
                </button>
              )}
              
              {canEdit && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-red-600 hover:text-red-800"
                  title="Eliminar grupo"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
              
              {/* Botón de unirse/abandonar */}
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
          
          <p className="text-gray-700 mb-4">{group.description}</p>
          
          {group.avatar && (
            <div className="mb-4">
              <img 
                src={group.avatar} 
                alt={`Avatar de ${group.name}`} 
                className="w-20 h-20 rounded-full"
              />
            </div>
          )}
        </div>
      )}
      
      {/* Sección de publicaciones */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Publicaciones del grupo</h2>
          
          {isMember && (
            <button
              onClick={() => setShowCreatePostForm(!showCreatePostForm)}
              className="inline-flex items-center text-primary hover:underline"
            >
              <MessageCircle className="mr-1 h-4 w-4" />
              {showCreatePostForm ? "Cancelar" : "Nueva publicación"}
            </button>
          )}
        </div>
        
        {/* Formulario para crear publicación en el grupo */}
        {showCreatePostForm && (
          <div className="mb-4">
            <CreatePostForm 
              groupId={selectedGroupId} 
              onPostCreated={handlePostCreated} 
            />
          </div>
        )}
        
        {/* Lista de publicaciones del grupo */}
        <PostList 
          posts={groupPosts} 
          isLoading={postsLoading} 
          emptyMessage="Este grupo aún no tiene publicaciones." 
          onCreatePost={() => setShowCreatePostForm(true)} 
        />
      </div>
      
      {/* Diálogo de confirmación para eliminar */}
      {showDeleteConfirm && (
        <ConfirmationDialog
          title="Eliminar grupo"
          message="¿Estás seguro de que deseas eliminar este grupo? Esta acción eliminará todas las publicaciones y mensajes asociados."
          confirmText="Eliminar"
          cancelText="Cancelar"
          onConfirm={handleDeleteGroup}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
};