import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Globe,
  X,
  Save,
  ImageIcon,
  ShieldCheck,
} from "lucide-react";

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
          Edicción de Perfil : {user?.firstName} {user?.lastName}
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
          
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              {/* Campo Nombre */}
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
                  className={`w-full p-2 border rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 ${
                    errors.firstName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Nombre"
                  required
                />
                {errors.firstName && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>

              {/* Campo Apellido */}
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
                  className={`w-full p-2 border rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 ${
                    errors.lastName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Apellido"
                  required
                />
                {errors.lastName && (
                  <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>
                )}
              </div>

              {/* Campo Nombre de usuario */}
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
                    className={`pl-10 w-full p-2 border rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 ${
                      errors.username ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Nombre de usuario"
                    required
                  />
                  {errors.username && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.username}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Nombre y Apellido 
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
            {/* Username 
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
          </div> /*}
            
            {/* Email 
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
            </div>*/}
          

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
          {/* <div className="mb-4">
            <label
              htmlFor="avatar"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Avatar
            </label>
            <div className="flex items-center gap-4">
              {/* File input 
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
              {/* Preview 
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
          </div> */}
        </div>
        {/* Sección de rol, estado (solo admin) 
        {isAdmin && (
          <div className="mb-6 border-b pb-6">
            <h3 className="text-lg font-medium mb-4">
              Configuración del Usuario
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {/* Rol 
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
              {/* Estado 
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
        )}*/}

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
