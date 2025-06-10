import React, { useState } from "react";
import { profileService } from "../services/profileService";

export const ProfileEditForm = ({ initialData, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    userId: initialData.userId,
    username: initialData.username || "",
    avatar: initialData.avatar || "",
    firstName: initialData.firstName || "",
    lastName: initialData.lastName || "",
    description: initialData.description || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Llama al service, asegurando que el método y DTO coincidan con el backend
      const updatedProfile = await profileService.updateUserInfo(
        form.userId,
        form
      );
      onSuccess(updatedProfile);
    } catch (err) {
      setError(err.message || "Error al actualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow-lg w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto sm:w-full">
        {/* Header */}
        <div className="relative flex items-center justify-between px-4 py-4 sm:px-6 bg-primary text-white border-b rounded-t-lg">
          <h2 className="text-lg sm:text-xl font-bold">Editar perfil</h2>
          <button
            className="absolute top-3 right-3 text-2xl sm:text-xl hover:text-gray-300 transition"
            onClick={onClose}
            aria-label="Cerrar"
            type="button"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          <input name="userId" type="hidden" value={form.userId} />

          <div>
            <label className="block text-gray-700 mb-1" htmlFor="firstName">
              Nombre
            </label>
            <input
              id="firstName"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1" htmlFor="lastName">
              Apellido
            </label>
            <input
              id="lastName"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1" htmlFor="username">
              Nombre de usuario
            </label>
            <input
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1" htmlFor="avatar">
              Avatar (URL)
            </label>
            <input
              id="avatar"
              name="avatar"
              value={form.avatar}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1" htmlFor="description">
              Bio
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary resize-none min-h-[80px]"
            />
          </div>
          {error && <div className="text-red-600">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-green-700 transition w-full font-semibold"
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>
      </div>
    </div>
  );
};
