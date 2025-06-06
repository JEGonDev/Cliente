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
      const updatedProfile = await profileService.updateUserInfo(form.userId, form);
      onSuccess(updatedProfile);
    } catch (err) {
      setError(err.message || "Error al actualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-20">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-md relative">
        <button className="absolute top-2 right-2" onClick={onClose}>✕</button>
        <h2 className="text-xl font-bold mb-4">Editar perfil</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="userId" type="hidden" value={form.userId} />

          <div>
            <label className="block text-gray-700">Nombre</label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Apellido</label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Nombre de usuario</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Avatar (URL)</label>
            <input
              name="avatar"
              value={form.avatar}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          
          <div>
            <label className="block text-gray-700">Bio</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          {error && <div className="text-red-600">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-green-700 transition w-full"
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>
      </div>
    </div>
  );
};