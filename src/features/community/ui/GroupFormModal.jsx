import React, { useState } from "react";
import { communityService } from "../services/communityService";

export const GroupFormModal = ({ onClose, onGroupCreated }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("El nombre es requerido.");
      return;
    }
    try {
      const createdGroup = await communityService.createGroup({ name, description });
      onGroupCreated(createdGroup);
      onClose();
    } catch {
      setError("Error al crear el grupo.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Crear Nuevo Grupo</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nombre del grupo</label>
            <input
              className="w-full border rounded-md p-2 mt-1 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              className="w-full border rounded-md p-2 mt-1 text-sm"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};