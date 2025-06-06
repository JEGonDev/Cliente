import React, { useEffect } from "react";
import { GroupCard } from "../ui/GroupCard";
import { useGroup } from "../hooks/useGroup";
import { useNavigate } from "react-router-dom";

/**
 * Vista administrativa para mostrar todos los grupos sin opciones de búsqueda ni creación.
 * Reutiliza la modularidad de GroupCard y el contexto de grupos.
 */
export const AdminGroupsLayout = () => {
  const { groups, loading, error, fetchGroups } = useGroup();
  const navigate = useNavigate();

  useEffect(() => {
    // Opcional: asegura que los grupos estén actualizados al entrar al componente
    fetchGroups();
  }, [fetchGroups]);

  if (loading) {
    return <div>Cargando grupos...</div>;
  }

  if (error || !groups || groups.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600 mb-4">
          No hay grupos disponibles en este momento.
        </p>
      </div>
    );
  }

  return (
    <div className=" p-4">
      <div className="bg-gray-100 p-4">
        <h2 className="text-xl font-semibold mb-4">Grupos de la comunidad</h2>
        <div className="flex justify-end mt-4">
          <button
            onClick={() => navigate(`/comunity/groups`)}
            className="text-secondary underline text-sm"
          >
            Administrar grupos
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>
    </div>
  );
};
