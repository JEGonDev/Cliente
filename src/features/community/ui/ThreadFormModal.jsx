

import React, { useState, useEffect, useContext } from "react";
import { communityService } from "../services/communityService";
import { AuthContext } from "../../authentication/context/AuthContext";
import { useThreadFormValidation } from "../hooks/useThreadFormValidation";

export const ThreadFormModal = ({ onClose, onThreadCreated }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [groups, setGroups] = useState([]);
  const [groupId, setGroupId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const { errors, validate, resetErrors } = useThreadFormValidation();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await communityService.getAllGroups();
        const groupsArr = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : [];
        setGroups(groupsArr);
      } catch {
        setGroups([]);
      }
    };
    fetchGroups();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    resetErrors();

    // Validar autenticación
    if (!isAuthenticated) {
      setSubmitError("Debes iniciar sesión para crear un hilo.");
      return;
    }

    // Validar campos
    const isValid = validate({ title, content, groupId });
    if (!isValid) return;

    setLoading(true);
    try {
      const threadPayload = {
        title,
        content,
        group_id: groupId ? parseInt(groupId) : null,
      };
      const createdThread = await communityService.createThread(threadPayload);
      onThreadCreated(createdThread);
      onClose();
    } catch (err) {
      if (err.response?.status === 403) {
        setSubmitError("No tienes permisos para crear un hilo. Verifica tu sesión o tus permisos.");
      } else {
        setSubmitError("Error al crear el hilo. Intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg relative"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-4 text-xl text-gray-400 hover:text-gray-700"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Crear nuevo hilo</h2>
        {submitError && <div className="text-red-600 mb-2">{submitError}</div>}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Título</label>
          <input
            type="text"
            required
            className={`w-full border rounded px-3 py-2 ${errors.title ? "border-red-500" : ""}`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
          />
          {errors.title && <div className="text-red-600 text-sm">{errors.title}</div>}
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Contenido</label>
          <textarea
            required
            className={`w-full border rounded px-3 py-2 ${errors.content ? "border-red-500" : ""}`}
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
          />
          {errors.content && <div className="text-red-600 text-sm">{errors.content}</div>}
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Grupo</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            disabled={loading}
          >
            <option value="">Selecciona un grupo (opcional)</option>
            {groups.length === 0 ? (
              <option value="">No hay grupos disponibles</option>
            ) : (
              groups.map((group) => (
                <option key={group.group_id || group.id} value={group.group_id || group.id}>
                  {group.name}
                </option>
              ))
            )}
          </select>
          {errors.groupId && <div className="text-red-600 text-sm">{errors.groupId}</div>}
        </div>
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded font-semibold hover:bg-green-700 w-full"
          disabled={loading}
        >
          {loading ? "Guardando..." : "Crear hilo"}
        </button>
      </form>
    </div>
  );
};