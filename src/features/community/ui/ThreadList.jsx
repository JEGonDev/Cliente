import React from "react";
import { FaUserCircle } from "react-icons/fa";

// Recibe threads = [{ id, authorName, createdAt, content }]
export const ThreadList = ({ threads }) => {
  if (!threads || threads.length === 0)
    return (
      <div className="text-gray-500 text-center mt-8">
        No hay hilos en este grupo todavía.
      </div>
    );

  return (
    <div className="space-y-6">
      {threads.map((thread) => (
        <div key={thread.id} className="flex gap-3 items-start border-b pb-4">
          <FaUserCircle className="text-3xl text-gray-400 mt-1" />
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="font-semibold">{thread.authorName}</span>
              <span className="text-xs text-gray-500">
                {new Date(thread.createdAt).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                })}
                {", "}
                {new Date(thread.createdAt).toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <div className="mt-1 text-gray-800">{thread.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
