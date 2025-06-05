import { useState, useEffect } from "react";
import { User, Mail, Globe, X, Save, ImageIcon,  ShieldCheck } from "lucide-react";

/**
 * Componente reutilizable para editar perfiles de usuario (admin)
 *
 * @param {Object} props
 * @param {Object} props.user - Datos del usuario a editar
 * @param {Function} props.onSave - Función para guardar cambios
 * @param {Function} props.onCancel - Función para cancelar edición
 * @param {boolean} props.isAdmin - Indica si quien edita es admin (para mostrar campos adicionales)
 */
export const ProfileEditView = ({
  user,
  onSave,
  onCancel,
  isAdmin = false,
}) => {
  const [form, setForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    country: user?.country || "",
    avatar: user?.avatar || "",
    description: user?.description || "",
    isActive: typeof user?.isActive === "boolean" ? user.isActive : true,
    roleType: user?.roleType || "USUARIO",
  });

  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm({
      username: user?.username || "",
      email: user?.email || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      country: user?.country || "",
      avatar: user?.avatar || "",
      description: user?.description || "",
      isActive: typeof user?.isActive === "boolean" ? user.isActive : true,
      roleType: user?.roleType || "USUARIO",
    });
    setAvatarPreview(user?.avatar || "");
    setAvatarFile(null);
    setErrors({});
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (name === "avatar") {
      setAvatarPreview(value);
      setAvatarFile(null); // Si el usuario pone una URL, descartamos el archivo anterior
    }
  };

  // Cambios en archivo avatar
  const handleAvatarFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
      setForm((prev) => ({
        ...prev,
        avatar: "", // Limpiar campo url si se sube archivo
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.username.trim())
      newErrors.username = "El nombre de usuario es obligatorio";
    if (!form.email.trim()) newErrors.email = "El correo es obligatorio";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Formato de correo inválido";
    if (!form.firstName.trim())
      newErrors.firstName = "El nombre es obligatorio";
    if (!form.lastName.trim())
      newErrors.lastName = "El apellido es obligatorio";
    
    return newErrors;
  };

  // Guardado de cambios (envía objeto usuario y archivo si lo hay)
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Si hay archivo, adjuntarlo; si no, avatar es url
    const dataToSend = {
      ...user,
      ...form,
      avatar: avatarFile ? avatarFile : form.avatar, // El handler decide cómo subir el archivo
    };
    onSave(dataToSend);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 sm:p-6 border-b flex justify-between items-center bg-primary text-white">
        <h2 className="text-xl font-bold">
          Editar Usuario: {user?.firstName} {user?.lastName}
        </h2>
        <button
          onClick={onCancel}
          className="text-white hover:text-gray-200"
          aria-label="Cerrar"
        >
          <X size={20} />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="p-4 sm:p-6">
        <div className="mb-6 border-b pb-6">
          <h3 className="text-lg font-medium mb-4">Información del Usuario</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nombre de usuario
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={16} className="text-gray-400" />
                </span>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  className={`pl-10 w-full py-2 border rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 ${
                    errors.username ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Nombre de usuario"
                  required
                />
                {errors.username && (
                  <p className="text-xs text-red-600 mt-1">{errors.username}</p>
                )}
              </div>
            </div>
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Correo electrónico
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={16} className="text-gray-400" />
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`pl-10 w-full py-2 border rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="correo@ejemplo.com"
                  required
                />
                {errors.email && (
                  <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                )}
              </div>
            </div>
          </div>
          {/* Nombre y Apellido */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nombre
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className={`w-full py-2 border rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 ${
                  errors.firstName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Nombre"
                required
              />
              {errors.firstName && (
                <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Apellido
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className={`w-full py-2 border rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 ${
                  errors.lastName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Apellido"
                required
              />
              {errors.lastName && (
                <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>
          {/* País */}
          {/* <div className="mb-4">
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              País
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Globe size={16} className="text-gray-400" />
              </span>
              <input
                type="text"
                id="country"
                name="country"
                value={form.country}
                onChange={handleChange}
                className={`pl-10 w-full py-2 border rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 ${
                  errors.country ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="País"
                required
              />
              {errors.country && (
                <p className="text-xs text-red-600 mt-1">{errors.country}</p>
              )}
            </div>
          </div> */}
          {/* Descripción */}
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Descripción/Bio
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="Descripción breve"
              rows={3}
            />
          </div>
          {/* Avatar */}
          <div className="mb-4">
            <label
              htmlFor="avatar"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Avatar
            </label>
            <div className="flex items-center gap-4">
              {/* File input */}
              <label className="flex items-center gap-2 cursor-pointer px-2 py-1 bg-gray-100 rounded-md border border-gray-300 hover:bg-gray-200">
                <ImageIcon size={18} className="text-gray-600" />
                <span className="text-sm text-gray-700">
                  Seleccionar archivo
                </span>
                <input
                  type="file"
                  accept="image/*"
                  id="avatar"
                  name="avatar-file"
                  className="hidden"
                  onChange={handleAvatarFileChange}
                />
              </label>
              {/* Preview */}
              {avatarPreview && (
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="w-16 h-16 rounded-full object-cover border"
                />
              )}
            </div>
            <input
              type="text"
              id="avatar-url"
              name="avatar"
              value={form.avatar}
              onChange={handleChange}
              className="mt-2 w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="O pega la URL de imagen aquí"
            />
          </div>
        </div>
        {/* Sección de rol, estado (solo admin) */}
        {isAdmin && (
          <div className="mb-6 border-b pb-6">
            <h3 className="text-lg font-medium mb-4">
              Configuración del Usuario
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {/* Rol */}
              <div>
                <label
                  htmlFor="roleType"
                  className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"
                >
                  <ShieldCheck size={14} /> Rol
                </label>
                <select
                  id="roleType"
                  name="roleType"
                  value={form.roleType}
                  onChange={handleChange}
                  className="w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  <option value="ADMINISTRADOR">Administrador</option>
                  <option value="MODERADOR">Moderador</option>
                  <option value="USUARIO">Usuario</option>
                </select>
              </div>
              {/* Estado */}
              <div>
                <label
                  htmlFor="isActive"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Estado
                </label>
                <select
                  id="isActive"
                  name="isActive"
                  value={form.isActive ? "activo" : "inactivo"}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      isActive: e.target.value === "activo",
                    }))
                  }
                  className="w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-red-300 rounded-md text-red-700 hover:bg-red-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-800 flex items-center"
          >
            <Save size={16} className="mr-2" />
            Guardar Cambios
          </button>
        </div>
      </form>
      ;
    </div>
  );
};

// import { useState, useEffect } from "react";
// import { User, Mail, Globe, X, Save, ShieldCheck } from "lucide-react";

// /**
//  * Componente reutilizable para editar perfiles de usuario (admin)
//  *
//  * @param {Object} props
//  * @param {Object} props.user - Datos del usuario a editar
//  * @param {Function} props.onSave - Función para guardar cambios
//  * @param {Function} props.onCancel - Función para cancelar edición
//  * @param {boolean} props.isAdmin - Indica si quien edita es admin (para mostrar campos adicionales)
//  */
// export const ProfileEditView = ({
//   user,
//   onSave,
//   onCancel,
//   isAdmin = false,
// }) => {
//   const [form, setForm] = useState({
//     username: user?.username || "",
//     email: user?.email || "",
//     firstName: user?.firstName || "",
//     lastName: user?.lastName || "",
//     country: user?.country || "",
//     avatar: user?.avatar || "",
//     description: user?.description || "",
//     isActive: typeof user?.isActive === "boolean" ? user.isActive : true,
//     roleType: user?.roleType || "USUARIO",
//   });

//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     setForm({
//       username: user?.username || "",
//       email: user?.email || "",
//       firstName: user?.firstName || "",
//       lastName: user?.lastName || "",
//       country: user?.country || "",
//       avatar: user?.avatar || "",
//       description: user?.description || "",
//       isActive: typeof user?.isActive === "boolean" ? user.isActive : true,
//       roleType: user?.roleType || "USUARIO",
//     });
//     setErrors({});
//   }, [user]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const validate = () => {
//     const newErrors = {};
//     if (!form.username.trim())
//       newErrors.username = "El nombre de usuario es obligatorio";
//     if (!form.email.trim()) newErrors.email = "El correo es obligatorio";
//     else if (!/\S+@\S+\.\S+/.test(form.email))
//       newErrors.email = "Formato de correo inválido";
//     if (!form.firstName.trim())
//       newErrors.firstName = "El nombre es obligatorio";
//     if (!form.lastName.trim())
//       newErrors.lastName = "El apellido es obligatorio";
//     if (!form.country.trim()) newErrors.country = "El país es obligatorio";
//     return newErrors;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const newErrors = validate();
//     setErrors(newErrors);
//     if (Object.keys(newErrors).length > 0) return;
//     // Se envía el objeto completo, incluyendo el id:
//     onSave({ ...user, ...form });
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//       <div className="p-4 sm:p-6 border-b flex justify-between items-center bg-green-700 text-white">
//         <h2 className="text-xl font-bold">
//           Editar Usuario: {user?.firstName} {user?.lastName}
//         </h2>
//         <button
//           onClick={onCancel}
//           className="text-white hover:text-gray-200"
//           aria-label="Cerrar"
//         >
//           <X size={20} />
//         </button>
//       </div>
//       <form onSubmit={handleSubmit} className="p-4 sm:p-6">
//         <div className="mb-6 border-b pb-6">
//           <h3 className="text-lg font-medium mb-4">Información del Usuario</h3>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
//             {/* Username */}
//             <div>
//               <label
//                 htmlFor="username"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Nombre de usuario
//               </label>
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <User size={16} className="text-gray-400" />
//                 </span>
//                 <input
//                   type="text"
//                   id="username"
//                   name="username"
//                   value={form.username}
//                   onChange={handleChange}
//                   className={`pl-10 w-full py-2 border rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 ${
//                     errors.username ? "border-red-500" : "border-gray-300"
//                   }`}
//                   placeholder="Nombre de usuario"
//                   required
//                 />
//                 {errors.username && (
//                   <p className="text-xs text-red-600 mt-1">{errors.username}</p>
//                 )}
//               </div>
//             </div>
//             {/* Email */}
//             <div>
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Correo electrónico
//               </label>
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Mail size={16} className="text-gray-400" />
//                 </span>
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   value={form.email}
//                   onChange={handleChange}
//                   className={`pl-10 w-full py-2 border rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 ${
//                     errors.email ? "border-red-500" : "border-gray-300"
//                   }`}
//                   placeholder="correo@ejemplo.com"
//                   required
//                 />
//                 {errors.email && (
//                   <p className="text-xs text-red-600 mt-1">{errors.email}</p>
//                 )}
//               </div>
//             </div>
//           </div>
//           {/* Nombre y Apellido */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
//             <div>
//               <label
//                 htmlFor="firstName"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Nombre
//               </label>
//               <input
//                 type="text"
//                 id="firstName"
//                 name="firstName"
//                 value={form.firstName}
//                 onChange={handleChange}
//                 className={`w-full py-2 border rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 ${
//                   errors.firstName ? "border-red-500" : "border-gray-300"
//                 }`}
//                 placeholder="Nombre"
//                 required
//               />
//               {errors.firstName && (
//                 <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>
//               )}
//             </div>
//             <div>
//               <label
//                 htmlFor="lastName"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Apellido
//               </label>
//               <input
//                 type="text"
//                 id="lastName"
//                 name="lastName"
//                 value={form.lastName}
//                 onChange={handleChange}
//                 className={`w-full py-2 border rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 ${
//                   errors.lastName ? "border-red-500" : "border-gray-300"
//                 }`}
//                 placeholder="Apellido"
//                 required
//               />
//               {errors.lastName && (
//                 <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>
//               )}
//             </div>
//           </div>
//           {/* País */}
//           <div className="mb-4">
//             <label
//               htmlFor="country"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               País
//             </label>
//             <div className="relative">
//               <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Globe size={16} className="text-gray-400" />
//               </span>
//               <input
//                 type="text"
//                 id="country"
//                 name="country"
//                 value={form.country}
//                 onChange={handleChange}
//                 className={`pl-10 w-full py-2 border rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 ${
//                   errors.country ? "border-red-500" : "border-gray-300"
//                 }`}
//                 placeholder="País"
//                 required
//               />
//               {errors.country && (
//                 <p className="text-xs text-red-600 mt-1">{errors.country}</p>
//               )}
//             </div>
//           </div>
//           {/* Descripción */}
//           <div className="mb-4">
//             <label
//               htmlFor="description"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Descripción/Bio
//             </label>
//             <textarea
//               id="description"
//               name="description"
//               value={form.description}
//               onChange={handleChange}
//               className="w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
//               placeholder="Descripción breve"
//               rows={3}
//             />
//           </div>
//           {/* Avatar */}
//           <div className="mb-4">
//             <label
//               htmlFor="avatar"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               URL del Avatar
//             </label>
//             <input
//               type="text"
//               id="avatar"
//               name="avatar"
//               value={form.avatar}
//               onChange={handleChange}
//               className="w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
//               placeholder="https://..."
//             />
//             {form.avatar && (
//               <img
//                 src={form.avatar}
//                 alt="Avatar preview"
//                 className="mt-2 w-16 h-16 rounded-full object-cover border"
//               />
//             )}
//           </div>
//         </div>
//         {/* Sección de rol, estado (solo admin) */}
//         {isAdmin && (
//           <div className="mb-6 border-b pb-6">
//             <h3 className="text-lg font-medium mb-4">
//               Configuración del Usuario
//             </h3>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
//               {/* Rol */}
//               <div>
//                 <label
//                   htmlFor="roleType"
//                   className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"
//                 >
//                   <ShieldCheck size={14} /> Rol
//                 </label>
//                 <select
//                   id="roleType"
//                   name="roleType"
//                   value={form.roleType}
//                   onChange={handleChange}
//                   className="w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
//                 >
//                   <option value="ADMINISTRADOR">Administrador</option>
//                   <option value="MODERADOR">Moderador</option>
//                   <option value="USUARIO">Usuario</option>
//                 </select>
//               </div>
//               {/* Estado */}
//               <div>
//                 <label
//                   htmlFor="isActive"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   Estado
//                 </label>
//                 <select
//                   id="isActive"
//                   name="isActive"
//                   value={form.isActive ? "activo" : "inactivo"}
//                   onChange={(e) =>
//                     setForm((prev) => ({
//                       ...prev,
//                       isActive: e.target.value === "activo",
//                     }))
//                   }
//                   className="w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
//                 >
//                   <option value="activo">Activo</option>
//                   <option value="inactivo">Inactivo</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="flex justify-end space-x-3">
//           <button
//             type="button"
//             onClick={onCancel}
//             className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//           >
//             Cancelar
//           </button>
//           <button
//             type="submit"
//             className="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-800 flex items-center"
//           >
//             <Save size={16} className="mr-2" />
//             Guardar Cambios
//           </button>
//         </div>
//       </form>
//       ;
//     </div>
//   );
// };

// import { useState, useEffect } from 'react';
// import { User, Mail, Phone, Home, Calendar, Lock, X, Save, Eye, EyeOff } from 'lucide-react';
// import { ProfileRoleSelector } from './ProfileRoleSelector';

// /**
//  * Componente reutilizable para editar perfiles
//  * Se usa tanto para que un usuario edite su propio perfil como para que admin edite otros perfiles
//  *
//  * @param {Object} props - Propiedades del componente
//  * @param {Object} props.user - Datos del usuario a editar
//  * @param {Function} props.onSave - Función para guardar cambios
//  * @param {Function} props.onCancel - Función para cancelar edición
//  * @param {boolean} props.isAdmin - Indica si quien edita es admin (para mostrar campos adicionales)
//  */
// export const ProfileEditView = ({ user, onSave, onCancel, isAdmin = false }) => {
//   console.log('ProfileEditView', { user, isAdmin });
//   // Estado para almacenar los datos del formulario
//   const [form, setForm] = useState({
//     firstName: user?.firstName || '',
//     lastName: user?.lastName || '',
//     email: user?.email || '',
//     phone: user?.phone || '',
//     address: user?.address || '',
//     birthDate: user?.birthDate || '',
//     password: '',
//     confirmPassword: '',
//     roleType: user?.roleType || 'USUARIO',
//     isActive: typeof user?.isActive === 'boolean' ? user.isActive : true
//   });

//   // Estado para mostrar/ocultar contraseña
//   const [showPassword, setShowPassword] = useState(false);
//   // Estado para determinar si se está cambiando la contraseña
//   const [changingPassword, setChangingPassword] = useState(false);
//   // Estado para errores simples
//   const [errors, setErrors] = useState({});

//   // Si cambia el usuario seleccionado, resetea el formulario
//   useEffect(() => {
//     setForm({
//       firstName: user?.firstName || '',
//       lastName: user?.lastName || '',
//       email: user?.email || '',
//       phone: user?.phone || '',
//       address: user?.address || '',
//       birthDate: user?.birthDate || '',
//       password: '',
//       confirmPassword: '',
//       roleType: user?.roleType || 'USUARIO',
//       isActive: typeof user?.isActive === 'boolean' ? user.isActive : true
//     });
//     setErrors({});
//     setChangingPassword(false);
//   }, [user]);

//   // Manejar cambios en los campos del formulario
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   // Validar el formulario antes de enviar
//   const validate = () => {
//     const newErrors = {};
//     if (!form.firstName.trim()) newErrors.firstName = 'El nombre es obligatorio';
//     if (!form.lastName.trim()) newErrors.lastName = 'El apellido es obligatorio';
//     if (!form.email.trim()) newErrors.email = 'El correo es obligatorio';
//     else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Formato de correo inválido';
//     if (changingPassword) {
//       if (form.password.length < 8)
//         newErrors.password = 'Mínimo 8 caracteres';
//       if (form.password !== form.confirmPassword)
//         newErrors.confirmPassword = 'Las contraseñas no coinciden';
//     }
//     return newErrors;
//   };

//   // Manejar envío del formulario
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const newErrors = validate();
//     setErrors(newErrors);
//     if (Object.keys(newErrors).length > 0) return;

//     // Prepara los datos a guardar
//     const dataToSave = {
//       ...user,
//       ...form,
//     };
//     // Elimina campos de password si no se cambió
//     if (!changingPassword) {
//       delete dataToSave.password;
//       delete dataToSave.confirmPassword;
//     }
//     // Normaliza el rol y estado si es admin
//     if (isAdmin) {
//       dataToSave.roleType = form.roleType || 'USUARIO';
//       dataToSave.isActive = !!form.isActive;
//     }
//     onSave(dataToSave);
//   };

//   // Alterna visibilidad de contraseña
//   const togglePasswordVisibility = () => setShowPassword((v) => !v);

//   return (
//     <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//       <div className="p-4 sm:p-6 border-b flex justify-between items-center bg-green-700 text-white">
//         <h2 className="text-xl font-bold">
//           {isAdmin
//             ? `Editar Usuario: ${user?.firstName} ${user?.lastName}`
//             : 'Editar Perfil'
//           }
//         </h2>
//         <button
//           onClick={onCancel}
//           className="text-white hover:text-gray-200"
//           aria-label="Cerrar"
//         >
//           <X size={20} />
//         </button>
//       </div>

//       <form onSubmit={handleSubmit} className="p-4 sm:p-6">
//         {/* Sección de información personal */}
//         <div className="mb-6 border-b pb-6">
//           <h3 className="text-lg font-medium mb-4">Información Personal</h3>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
//             {/* Nombre */}
//             <div>
//               <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
//                 Nombre
//               </label>
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <User size={16} className="text-gray-400" />
//                 </span>
//                 <input
//                   type="text"
//                   id="firstName"
//                   name="firstName"
//                   value={form.firstName}
//                   onChange={handleChange}
//                   className={`pl-10 w-full py-2 border rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
//                   placeholder="Nombre"
//                   required
//                 />
//                 {errors.firstName && <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>}
//               </div>
//             </div>

//             {/* Apellido */}
//             <div>
//               <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
//                 Apellido
//               </label>
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <User size={16} className="text-gray-400" />
//                 </span>
//                 <input
//                   type="text"
//                   id="lastName"
//                   name="lastName"
//                   value={form.lastName}
//                   onChange={handleChange}
//                   className={`pl-10 w-full py-2 border rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
//                   placeholder="Apellido"
//                   required
//                 />
//                 {errors.lastName && <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>}
//               </div>
//             </div>
//           </div>

//           {/* Email */}
//           <div className="mb-4">
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//               Correo Electrónico
//             </label>
//             <div className="relative">
//               <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Mail size={16} className="text-gray-400" />
//               </span>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={form.email}
//                 onChange={handleChange}
//                 className={`pl-10 w-full py-2 border rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
//                 placeholder="correo@ejemplo.com"
//                 required
//               />
//               {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
//             </div>
//           </div>

//           {/* Teléfono */}
//           <div className="mb-4">
//             <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
//               Teléfono
//             </label>
//             <div className="relative">
//               <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Phone size={16} className="text-gray-400" />
//               </span>
//               <input
//                 type="tel"
//                 id="phone"
//                 name="phone"
//                 value={form.phone}
//                 onChange={handleChange}
//                 className="pl-10 w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
//                 placeholder="+57 300 123 4567"
//               />
//             </div>
//           </div>

//           {/* Dirección */}
//           <div className="mb-4">
//             <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
//               Dirección
//             </label>
//             <div className="relative">
//               <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Home size={16} className="text-gray-400" />
//               </span>
//               <input
//                 type="text"
//                 id="address"
//                 name="address"
//                 value={form.address}
//                 onChange={handleChange}
//                 className="pl-10 w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
//                 placeholder="Dirección completa"
//               />
//             </div>
//           </div>

//           {/* Fecha de nacimiento */}
//           <div>
//             <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
//               Fecha de Nacimiento
//             </label>
//             <div className="relative">
//               <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Calendar size={16} className="text-gray-400" />
//               </span>
//               <input
//                 type="date"
//                 id="birthDate"
//                 name="birthDate"
//                 value={form.birthDate}
//                 onChange={handleChange}
//                 className="pl-10 w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Sección de cambio de contraseña */}
//         <div className="mb-6 border-b pb-6">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-lg font-medium">Contraseña</h3>
//             <button
//               type="button"
//               onClick={() => setChangingPassword(!changingPassword)}
//               className="text-sm text-green-700 hover:text-green-800"
//             >
//               {changingPassword ? 'Cancelar cambio' : 'Cambiar contraseña'}
//             </button>
//           </div>

//           {changingPassword && (
//             <div className="space-y-4">
//               <div>
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//                   Nueva Contraseña
//                 </label>
//                 <div className="relative">
//                   <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Lock size={16} className="text-gray-400" />
//                   </span>
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     id="password"
//                     name="password"
//                     value={form.password}
//                     onChange={handleChange}
//                     className={`pl-10 pr-10 w-full py-2 border rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
//                     placeholder="••••••••"
//                   />
//                   <button
//                     type="button"
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                     onClick={togglePasswordVisibility}
//                   >
//                     {showPassword ? (
//                       <EyeOff size={16} className="text-gray-400" />
//                     ) : (
//                       <Eye size={16} className="text-gray-400" />
//                     )}
//                   </button>
//                 </div>
//                 {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
//               </div>

//               <div>
//                 <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
//                   Confirmar Contraseña
//                 </label>
//                 <div className="relative">
//                   <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Lock size={16} className="text-gray-400" />
//                   </span>
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     id="confirmPassword"
//                     name="confirmPassword"
//                     value={form.confirmPassword}
//                     onChange={handleChange}
//                     className={`pl-10 pr-10 w-full py-2 border rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
//                     placeholder="••••••••"
//                   />
//                 </div>
//                 {errors.confirmPassword && <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>}
//                 <p className="mt-1 text-xs text-gray-500">
//                   La contraseña debe tener al menos 8 caracteres y contener letras, números y caracteres especiales.
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Sección de rol (solo para admin) */}
//         {isAdmin && (
//           <div className="mb-6 border-b pb-6">
//             <h3 className="text-lg font-medium mb-4">Configuración del Usuario</h3>
//             <ProfileRoleSelector
//               selectedRole={form.roleType}
//               selectedStatus={form.isActive ? "Activo" : "Inactivo"}
//               onRoleChange={roleType => setForm({...form, roleType})}
//               onStatusChange={status => setForm({...form, isActive: status === "Activo"})}
//             />
//           </div>
//         )}

//         {/* Botones de acción */}
//         <div className="flex justify-end space-x-3">
//           <button
//             type="button"
//             onClick={onCancel}
//             className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//           >
//             Cancelar
//           </button>
//           <button
//             type="submit"
//             className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 flex items-center"
//           >
//             <Save size={16} className="mr-2" />
//             Guardar Cambios
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// // src/features/profile/ui/ProfileEditView.jsx

// import { useState } from 'react';
// import { User, Mail, Phone, Home, Calendar, Lock, X, Save, Eye, EyeOff } from 'lucide-react';
// import { ProfileRoleSelector } from './ProfileRoleSelector';

// /**
//  * Componente reutilizable para editar perfiles
//  * Se usa tanto para que un usuario edite su propio perfil como para que admin edite otros perfiles
//  *
//  * @param {Object} props - Propiedades del componente
//  * @param {Object} props.user - Datos del usuario a editar
//  * @param {Function} props.onSave - Función para guardar cambios
//  * @param {Function} props.onCancel - Función para cancelar edición
//  * @param {boolean} props.isAdmin - Indica si quien edita es admin (para mostrar campos adicionales)
//  */
// export const ProfileEditView = ({ user, onSave, onCancel, isAdmin = false }) => {
//   // Estado para almacenar los datos del formulario
//   const [form, setForm] = useState({
//     firstName: user?.firstName || '',
//     lastName: user?.lastName || '',
//     email: user?.email || '',
//     phone: user?.phone || '',
//     address: user?.address || '',
//     birthDate: user?.birthDate || '',
//     password: '',
//     confirmPassword: '',
//     role: user?.role || 'Usuario',
//     status: user?.status || 'Activo'
//   });

//   // Estado para mostrar/ocultar contraseña
//   const [showPassword, setShowPassword] = useState({
//     current: false,
//     new: false
//   });

//   // Estado para determinar si se está cambiando la contraseña
//   const [changingPassword, setChangingPassword] = useState(false);

//   // Manejar cambios en los campos del formulario
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   // Manejar envío del formulario
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSave(form);
//   };

//   // Función para alternar visibilidad de contraseña
//   const togglePasswordVisibility = (field) => {
//     setShowPassword(prev => ({
//       ...prev,
//       [field]: !prev[field]
//     }));
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//       <div className="p-4 sm:p-6 border-b flex justify-between items-center bg-green-700 text-white">
//         <h2 className="text-xl font-bold">
//           {isAdmin
//             ? `Editar Usuario: ${user?.firstName} ${user?.lastName}`
//             : 'Editar Perfil'
//           }
//         </h2>
//         <button
//           onClick={onCancel}
//           className="text-white hover:text-gray-200"
//           aria-label="Cerrar"
//         >
//           <X size={20} />
//         </button>
//       </div>

//       <form onSubmit={handleSubmit} className="p-4 sm:p-6">
//         {/* Sección de información personal */}
//         <div className="mb-6 border-b pb-6">
//           <h3 className="text-lg font-medium mb-4">Información Personal</h3>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
//             {/* Nombre */}
//             <div>
//               <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
//                 Nombre
//               </label>
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <User size={16} className="text-gray-400" />
//                 </span>
//                 <input
//                   type="text"
//                   id="firstName"
//                   name="firstName"
//                   value={form.firstName}
//                   onChange={handleChange}
//                   className="pl-10 w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
//                   placeholder="Nombre"
//                   required
//                 />
//               </div>
//             </div>

//             {/* Apellido */}
//             <div>
//               <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
//                 Apellido
//               </label>
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <User size={16} className="text-gray-400" />
//                 </span>
//                 <input
//                   type="text"
//                   id="lastName"
//                   name="lastName"
//                   value={form.lastName}
//                   onChange={handleChange}
//                   className="pl-10 w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
//                   placeholder="Apellido"
//                   required
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Email */}
//           <div className="mb-4">
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//               Correo Electrónico
//             </label>
//             <div className="relative">
//               <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Mail size={16} className="text-gray-400" />
//               </span>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={form.email}
//                 onChange={handleChange}
//                 className="pl-10 w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
//                 placeholder="correo@ejemplo.com"
//                 required
//               />
//             </div>
//           </div>

//           {/* Teléfono */}
//           <div className="mb-4">
//             <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
//               Teléfono
//             </label>
//             <div className="relative">
//               <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Phone size={16} className="text-gray-400" />
//               </span>
//               <input
//                 type="tel"
//                 id="phone"
//                 name="phone"
//                 value={form.phone}
//                 onChange={handleChange}
//                 className="pl-10 w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
//                 placeholder="+57 300 123 4567"
//               />
//             </div>
//           </div>

//           {/* Dirección */}
//           <div className="mb-4">
//             <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
//               Dirección
//             </label>
//             <div className="relative">
//               <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Home size={16} className="text-gray-400" />
//               </span>
//               <input
//                 type="text"
//                 id="address"
//                 name="address"
//                 value={form.address}
//                 onChange={handleChange}
//                 className="pl-10 w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
//                 placeholder="Dirección completa"
//               />
//             </div>
//           </div>

//           {/* Fecha de nacimiento */}
//           <div>
//             <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
//               Fecha de Nacimiento
//             </label>
//             <div className="relative">
//               <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Calendar size={16} className="text-gray-400" />
//               </span>
//               <input
//                 type="date"
//                 id="birthDate"
//                 name="birthDate"
//                 value={form.birthDate}
//                 onChange={handleChange}
//                 className="pl-10 w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Sección de cambio de contraseña */}
//         <div className="mb-6 border-b pb-6">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-lg font-medium">Contraseña</h3>
//             <button
//               type="button"
//               onClick={() => setChangingPassword(!changingPassword)}
//               className="text-sm text-green-700 hover:text-green-800"
//             >
//               {changingPassword ? 'Cancelar cambio' : 'Cambiar contraseña'}
//             </button>
//           </div>

//           {changingPassword && (
//             <div className="space-y-4">
//               <div>
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//                   Nueva Contraseña
//                 </label>
//                 <div className="relative">
//                   <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Lock size={16} className="text-gray-400" />
//                   </span>
//                   <input
//                     type={showPassword.new ? "text" : "password"}
//                     id="password"
//                     name="password"
//                     value={form.password}
//                     onChange={handleChange}
//                     className="pl-10 pr-10 w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
//                     placeholder="••••••••"
//                   />
//                   <button
//                     type="button"
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                     onClick={() => togglePasswordVisibility('new')}
//                   >
//                     {showPassword.new ? (
//                       <EyeOff size={16} className="text-gray-400" />
//                     ) : (
//                       <Eye size={16} className="text-gray-400" />
//                     )}
//                   </button>
//                 </div>
//               </div>

//               <div>
//                 <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
//                   Confirmar Contraseña
//                 </label>
//                 <div className="relative">
//                   <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Lock size={16} className="text-gray-400" />
//                   </span>
//                   <input
//                     type={showPassword.new ? "text" : "password"}
//                     id="confirmPassword"
//                     name="confirmPassword"
//                     value={form.confirmPassword}
//                     onChange={handleChange}
//                     className="pl-10 pr-10 w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
//                     placeholder="••••••••"
//                   />
//                 </div>
//                 <p className="mt-1 text-xs text-gray-500">
//                   La contraseña debe tener al menos 8 caracteres y contener letras, números y caracteres especiales.
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Sección de rol (solo para admin) */}
//         {isAdmin && (
//           <div className="mb-6 border-b pb-6">
//             <h3 className="text-lg font-medium mb-4">Configuración del Usuario</h3>
//             <ProfileRoleSelector
//               selectedRole={form.role}
//               selectedStatus={form.status}
//               onRoleChange={(role) => setForm({...form, role})}
//               onStatusChange={(status) => setForm({...form, status})}
//             />
//           </div>
//         )}

//         {/* Botones de acción */}
//         <div className="flex justify-end space-x-3">
//           <button
//             type="button"
//             onClick={onCancel}
//             className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//           >
//             Cancelar
//           </button>
//           <button
//             type="submit"
//             className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 flex items-center"
//           >
//             <Save size={16} className="mr-2" />
//             Guardar Cambios
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };
