import React from 'react'
import { useState } from "react";
import { MainLayout } from "../layouts/MainLayout";

const dummyGroups = [
  { id: 1, name: "Cultivo de tomate", joined: false },
  { id: 2, name: "Hidroponía para principiantes", joined: true },
];

export const Groups = () => {
    const [groups, setGroups] = useState(dummyGroups);

    const toggleJoin = (id) => {
      setGroups(groups.map(g => g.id === id ? { ...g, joined: !g.joined } : g));
    };
  
    return (
      <MainLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Grupos de Interés</h1>
          <div className="space-y-4">
            {groups.map(group => (
              <div key={group.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                <div>{group.name}</div>
                <button
                  onClick={() => toggleJoin(group.id)}
                  className={`px-4 py-1 rounded text-white ${group.joined ? 'bg-red-500' : 'bg-green-500'}`}
                >
                  {group.joined ? 'Salir' : 'Unirse'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }
