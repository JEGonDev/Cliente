import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { profileService } from "../services/profileService";
import { ProfileEditForm } from "./ProfileEditForm";

export const ProfileView = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEdit, setShowEdit] = useState(false);

  React.useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    profileService
      .getUserById(id)
      .then((res) => setProfile(res))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [id]);

  // Refresca el perfil después de editar
  const handleProfileUpdated = (updatedProfile) => {
    setProfile(updatedProfile);
    setShowEdit(false);
  };

  if (loading) return <div>Cargando perfil...</div>;
  if (error) return <div>Error: {error.message || error.toString()}</div>;
  if (!profile || !profile.userId) return <div>No se encontró el perfil</div>;

  return (
    <div className="max-w-xl mx-auto bg-white shadow rounded-lg p-6 mt-8">
      <div className="flex items-center gap-6 mb-6">
        <div className="w-24 h-24 rounded-full overflow-hidden border bg-gray-100 flex items-center justify-center">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt={`${profile.firstName} ${profile.lastName}`}
              className="object-cover w-full h-full"
            />
          ) : (
            <span className="text-4xl text-gray-400">
              {profile.firstName?.[0] || ""}
              {profile.lastName?.[0] || ""}
            </span>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold">
            {profile.firstName} {profile.lastName}
          </h2>
          <div className="text-gray-600">@{profile.username}</div>
        </div>
      </div>
      <div className="mb-4">
        <span className="block text-gray-500 font-medium">Bio:</span>
        <p className="text-gray-800">{profile.description || "Sin descripción aún."}</p>
      </div>
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


// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { profileService } from "../services/profileService";

// export const ProfileView = () => {
//   const { id } = useParams();
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!id) return;
//     setLoading(true);
//     setError(null);
//     profileService
//       .getUserById(id)
//       .then((res) => {
//         console.log("Respuesta de la API:", res);
//         setProfile(res); // ¡Aquí ya es el objeto directamente!
//       })
//       .catch((err) => setError(err))
//       .finally(() => setLoading(false));
//   }, [id]);

//   if (loading) return <div>Cargando perfil...</div>;
//   if (error) return <div>Error: {error.message || error.toString()}</div>;
//   if (!profile || !profile.userId) return <div>No se encontró el perfil</div>;

//   return (
//     <div className="max-w-xl mx-auto bg-white shadow rounded-lg p-6 mt-8">
//       <div className="flex items-center gap-6 mb-6">
//         <div className="w-24 h-24 rounded-full overflow-hidden border bg-gray-100 flex items-center justify-center">
//           {profile.avatar ? (
//             <img
//               src={profile.avatar}
//               alt={`${profile.firstName} ${profile.lastName}`}
//               className="object-cover w-full h-full"
//             />
//           ) : (
//             <span className="text-4xl text-gray-400">
//               {profile.firstName?.[0] || ""}
//               {profile.lastName?.[0] || ""}
//             </span>
//           )}
//         </div>
//         <div>
//           <h2 className="text-2xl font-bold">
//             {profile.firstName} {profile.lastName}
//           </h2>
//           <div className="text-gray-600">@{profile.username}</div>
//         </div>
//       </div>
//       <div className="mb-4">
//         <span className="block text-gray-500 font-medium">Bio:</span>
//         <p className="text-gray-800">{profile.description || "Sin descripción aún."}</p>
//       </div>
//     </div>
//   );
// };

// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { profileService } from "../services/profileService";

// /**
//  * Vista de perfil que obtiene los datos directamente del service,
//  * usando el id recibido por parámetro en la URL.
//  */
// export const ProfileView = () => {
//   const { id } = useParams(); // Obtiene el ID de la URL
//   console.log("ID del perfil:", id);
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//  useEffect(() => {
//   if (!id) return;
//   setLoading(true);
//   setError(null);
//   profileService
//     .getUserById(id)
//     .then((res) => {
//       console.log("Respuesta de la API:", res); // <--- Aquí ves todo el objeto de respuesta
//       setProfile(res.data);
//     })
//     .catch((err) => {
//       console.error("Error al obtener el perfil:", err); // <--- Aquí ves el error si ocurre
//       setError(err);
//     })
//     .finally(() => setLoading(false));
// }, [id]);

//   if (loading) return <div>Cargando perfil...</div>;
//   if (error) return <div>Error: {error.message || error.toString()}</div>;
//   if (!profile) return <div>No se encontró el perfil</div>;

//   return (
//     <div className="max-w-xl mx-auto bg-white shadow rounded-lg p-6 mt-8">
//       <div className="flex items-center gap-6 mb-6">
//         <div className="w-24 h-24 rounded-full overflow-hidden border bg-gray-100 flex items-center justify-center">
//           {profile.profileImage ? (
//             <img
//               src={profile.profileImage}
//               alt={`${profile.firstName} ${profile.lastName}`}
//               className="object-cover w-full h-full"
//             />
//           ) : (
//             <span className="text-4xl text-gray-400">
//               {profile.firstName?.[0] || ""}
//               {profile.lastName?.[0] || ""}
//             </span>
//           )}
//         </div>
//         <div>
//           <h2 className="text-2xl font-bold">
//             {profile.firstName} {profile.lastName}
//           </h2>
//           <div className="text-gray-600">@{profile.username}</div>
//           <div className="text-gray-500 text-sm">{profile.email}</div>
//         </div>
//       </div>
//       <div className="mb-4">
//         <span className="block text-gray-500 font-medium">Bio:</span>
//         <p className="text-gray-800">{profile.bio || "Sin descripción aún."}</p>
//       </div>
//       <div className="mb-4">
//         <span className="block text-gray-500 font-medium">Ubicación:</span>
//         <p className="text-gray-800">{profile.location || "No especificada"}</p>
//       </div>
//     </div>
//   );
// };

// import React, { useState } from "react";
// import { useProfileForm } from "../hooks/useProfileForm";

// /**
//  * Vista de perfil de usuario Germogli.
//  * Muestra los datos del perfil y permite editar el perfil propio usando el hook useProfileForm.
//  */
// export const ProfileView = () => {
//   const {
//     formData,
//     formErrors,
//     loading,
//     error,
//     successMessage,
//     handleChange,
//     handleSubmit,
//     resetForm,
//   } = useProfileForm();

//   console.log("Datos del usuario en ProfileView:", formData);

//   // Estado para alternar entre modo vista y edición
//   const [isEditing, setIsEditing] = useState(false);

//   // Si está cargando, muestra loader
//   if (loading) return <div className="text-center py-8">Cargando perfil...</div>;
//   if (error) return <div className="text-center text-red-600 py-8">Error: {error.message || error}</div>;

//   return (
//     <div className="max-w-xl mx-auto bg-white shadow rounded-lg p-6 mt-8">
//       {!isEditing ? (
//         // Vista SOLO LECTURA
//         <>
//           <div className="flex items-center gap-6 mb-6">
//             <div className="w-24 h-24 rounded-full overflow-hidden border bg-gray-100 flex items-center justify-center">
//               {formData.profileImage ? (
//                 console.log("Profile image URL:", formData),
//                 <img
//                   src={formData.profileImage}
//                   alt={`${formData.firstName} ${formData.lastName}`}
//                   className="object-cover w-full h-full"
//                 />
//               ) : (
//                 <span className="text-4xl text-gray-400">
//                   {formData.firstName?.[0] || ""}
//                   {formData.lastName?.[0] || ""}
//                 </span>
//               )}
//             </div>
//             <div>
//               <h2 className="text-2xl font-bold">
//                 {formData.firstName} {formData.lastName}
//               </h2>
//               <div className="text-gray-600">@{formData.username}</div>
//               <div className="text-gray-500 text-sm">{formData.email}</div>
//             </div>
//           </div>
//           <div className="mb-4">
//             <span className="block text-gray-500 font-medium">Bio:</span>
//             <p className="text-gray-800">{formData.bio || "Sin descripción aún."}</p>
//           </div>
//           <div className="mb-4">
//             <span className="block text-gray-500 font-medium">Ubicación:</span>
//             <p className="text-gray-800">{formData.location || "No especificada"}</p>
//           </div>
//           <button
//             type="button"
//             className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 mt-4"
//             onClick={() => setIsEditing(true)}
//           >
//             Editar perfil
//           </button>
//         </>
//       ) : (
//         // Vista EDICIÓN
//         <form onSubmit={handleSubmit}>
//           <div className="flex items-center gap-6 mb-6">
//             <div className="w-24 h-24 rounded-full overflow-hidden border bg-gray-100 flex items-center justify-center">
//               {formData.profileImage ? (
//                 <img
//                   src={formData.profileImage}
//                   alt={`${formData.firstName} ${formData.lastName}`}
//                   className="object-cover w-full h-full"
//                 />
//               ) : (
//                 <span className="text-4xl text-gray-400">
//                   {formData.firstName?.[0] || ""}
//                   {formData.lastName?.[0] || ""}
//                 </span>
//               )}
//             </div>
//             {/* Campo para cambiar la URL de imagen, puedes adaptarlo a file input si lo necesitas */}
//             <div className="flex-1">
//               <label className="block text-gray-700 mb-1">URL de Foto de Perfil</label>
//               <input
//                 name="profileImage"
//                 type="text"
//                 value={formData.profileImage}
//                 onChange={handleChange}
//                 className="border rounded w-full p-2"
//                 placeholder="Pega la URL de tu imagen"
//               />
//             </div>
//           </div>
//           {/* Campos de edición */}
//           <div className="mb-3">
//             <label className="block font-medium">Nombre</label>
//             <input
//               name="firstName"
//               value={formData.firstName}
//               onChange={handleChange}
//               className="border rounded w-full p-2"
//             />
//             {formErrors.firstName && <span className="text-red-500 text-xs">{formErrors.firstName}</span>}
//           </div>
//           <div className="mb-3">
//             <label className="block font-medium">Apellido</label>
//             <input
//               name="lastName"
//               value={formData.lastName}
//               onChange={handleChange}
//               className="border rounded w-full p-2"
//             />
//             {formErrors.lastName && <span className="text-red-500 text-xs">{formErrors.lastName}</span>}
//           </div>
//           <div className="mb-3">
//             <label className="block font-medium">Usuario</label>
//             <input
//               name="username"
//               value={formData.username}
//               onChange={handleChange}
//               className="border rounded w-full p-2"
//             />
//             {formErrors.username && <span className="text-red-500 text-xs">{formErrors.username}</span>}
//           </div>
//           <div className="mb-3">
//             <label className="block font-medium">Email</label>
//             <input
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               className="border rounded w-full p-2"
//             />
//             {formErrors.email && <span className="text-red-500 text-xs">{formErrors.email}</span>}
//           </div>
//           <div className="mb-3">
//             <label className="block font-medium">Bio</label>
//             <textarea
//               name="bio"
//               value={formData.bio}
//               onChange={handleChange}
//               className="border rounded w-full p-2"
//               rows={2}
//             />
//           </div>
//           <div className="mb-3">
//             <label className="block font-medium">Ubicación</label>
//             <input
//               name="location"
//               value={formData.location}
//               onChange={handleChange}
//               className="border rounded w-full p-2"
//             />
//           </div>
//           <div className="flex gap-2 mt-4">
//             <button
//               type="submit"
//               className="bg-green-700 text-white rounded px-4 py-2 hover:bg-green-800"
//               disabled={loading}
//             >
//               {loading ? "Guardando..." : "Guardar cambios"}
//             </button>
//             <button
//               type="button"
//               onClick={() => {
//                 resetForm();
//                 setIsEditing(false);
//               }}
//               className="border border-gray-300 rounded px-4 py-2"
//             >
//               Cancelar
//             </button>
//           </div>
//           {successMessage && <div className="mt-2 text-green-600">{successMessage}</div>}
//           {error && <div className="mt-2 text-red-600">{error.message || error}</div>}
//         </form>
//       )}
//     </div>
//   );
// };