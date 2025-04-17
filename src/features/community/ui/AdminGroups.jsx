import { useState } from "react";
import { MainLayout } from "../layouts/MainLayout";

const initialGroups = [
  { id: 1, name: "Cultivo orgánico" },
  { id: 2, name: "Fertilizantes naturales" },
];

export const AdminGroups = () => {
    const [groups, setGroups] = useState(initialGroups);
    const [groupName, setGroupName] = useState("");
  
    const addGroup = () => {
      if (!groupName) return;
      setGroups([...groups, { id: Date.now(), name: groupName }]);
      setGroupName("");
    };
  
    const deleteGroup = (id) => {
      setGroups(groups.filter(g => g.id !== id));
    };
  
    return (
      <MainLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Administrar Grupos</h1>
          <div className="mb-4 flex gap-2">
            <input
              type="text"
              className="p-2 border rounded flex-1"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Nombre del grupo"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={addGroup}>Agregar</button>
          </div>
          <ul className="space-y-2">
            {groups.map(g => (
              <li key={g.id} className="bg-white p-3 rounded shadow flex justify-between">
                <span>{g.name}</span>
                <button className="text-red-600" onClick={() => deleteGroup(g.id)}>Eliminar</button>
              </li>
            ))}
          </ul>
        </div>
      </MainLayout>
    );
  }