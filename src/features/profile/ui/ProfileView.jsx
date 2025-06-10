import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { profileService } from "../services/profileService";
import { ProfileEditForm } from "./ProfileEditForm";

export const ProfileView = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEdit, setShowEdit] = useState(false);

  React.useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    profileService
      .getUserById(userId)
      .then((res) => setProfile(res))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [userId]);

  console.log("profile recibido en profileview:", profile);

  // Refresca el perfil después de editar
  const handleProfileUpdated = (updatedProfile) => {
    setProfile(updatedProfile);
    setShowEdit(false);
  };

  if (loading) return <div>Cargando perfil...</div>;
  if (error) return <div>Error: {error.message || error.toString()}</div>;
  if (!profile || !profile.userId) return <div>No se encontró el perfil</div>;

  console.log("Perfil obtenido en profileview:", profile);

  // Normaliza campos para visualización
  const statusLabel = profile.isActive ? "Activo" : "Inactivo";
  const statusClass = profile.isActive
    ? "bg-green-100 text-green-800"
    : "bg-red-100 text-red-800";

  // Normaliza rol para visualización
  const roleMap = {
    ADMINISTRADOR: "Administrador",
    MODERADOR: "Moderador",
    USUARIO: "Usuario",
  };
  const roleLabel = roleMap[profile.roleType] || profile.roleType || "Usuario";

  // Descripción extendida por rol
  const roleDesc = {
    ADMINISTRADOR:
      "Acceso completo a todas las funciones, incluyendo gestión de usuarios y contenido.",
    MODERADOR: "Puede moderar contenido y comentarios de la comunidad.",
    USUARIO:
      "Acceso básico a la plataforma, puede participar en la comunidad y ver contenido educativo.",
  };

  // Fecha de registro formateada
  const createdDate = profile.creationDate
    ? new Date(profile.creationDate).toLocaleDateString()
    : "-";

  return (
    <div className="max-w-xl mx-auto bg-white shadow rounded-lg p-6 mt-8">
      {/* nuevo estilo detalles perfil */}
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl max-h-screen flex flex-col overflow-y-auto">
        <div className="p-4 sm:p-6 border-b flex justify-between items-center bg-primary text-white">
          <h2 className="text-xl font-bold">Detalles del Usuario</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-gray-300 rounded-full overflow-hidden mr-4">
              {/* Si no hay avatar, muestra iniciales o icono genérico */}
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.firstName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-500 bg-gray-200">
                  {profile.firstName?.charAt(0) || ""}
                  {profile.lastName?.charAt(0) || ""}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold">
                {profile.firstName} {profile.lastName}
              </h3>
              <p className="text-gray-600">{profile.username}</p>
              {/* Puedes agregar aquí el status si tienes esa información */}
              {/* <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${statusClass}`}>
          {statusLabel}
        </span> */}
            </div>
          </div>
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Información Personal</h4>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <dt className="text-sm text-gray-500">Nombre</dt>
                <dd>{profile.firstName}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Apellido</dt>
                <dd>{profile.lastName}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Nombre de Usuario</dt>
                <dd>{profile.username}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Descripción</dt>
                <dd>{profile.description || "-"}</dd>
              </div>
            </dl>
          </div>
          {/* <div className="border-t mt-4 pt-4">
            <h4 className="font-medium mb-2">Rol</h4>
            <div className="p-3 rounded-md bg-gray-50 text-gray-800 border border-gray-200">
              {/* Si tienes roleType, puedes mejorar esto 
              <p className="font-medium">{profile.roleType || "USUARIO"}</p>
              {/* Si tienes descripciones por rol, puedes ponerlas aquí 
              <p className="text-sm mt-1">
                {profile.roleType === "ADMINISTRADOR"
                  ? "Administrador con permisos completos."
                  : profile.roleType === "MODERADOR"
                  ? "Moderador con permisos de gestión."
                  : "Usuario estándar de la plataforma."}
              </p>
            </div>
          </div> */}
        </div>
      </div>
      {/* fin detalles perfil */}
      
      <button
        className="bg-primary text-white px-4 py-2 rounded hover:bg-green-700 transition"
        onClick={() => setShowEdit(true)}
      >
        Editar perfil
      </button>

      {showEdit && (
        <ProfileEditForm
          initialData={profile}
          onClose={() => setShowEdit(false)}
          onSuccess={handleProfileUpdated}
        />
      )}
    </div>
  );
};
