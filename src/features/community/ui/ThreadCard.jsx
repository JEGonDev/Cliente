import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export const ThreadCard = ({ thread }) => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-3 items-start border rounded-lg p-4 shadow bg-white">      
      <article
        key={thread.thread_id || thread.id}
        className="flex-1 bg-gray-100 border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
      >
        <div className="flex items-start gap-4">
          {/* <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-medium">
                {(thread.authorName || thread.userName || "U")
                  .charAt(0)
                  .toUpperCase()}
              </span>
            </div>
          </div> */}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {/* <h3 className="font-semibold text-gray-900 truncate">
                {thread.authorName || thread.userName || "Usuario"}
              </h3>
              <span className="text-gray-400">•</span> */}

              <h2 className="text-lg font-bold text-gray-900 truncate">
              {thread.title}
            </h2>
              <time className="text-sm text-gray-500">
                {new Date(
                  thread.creation_date ||
                    thread.creationDate ||
                    thread.createdAt
                ).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </time>
            </div>

            

            <p className="text-gray-700 line-clamp-3">{thread.content}</p>
          </div>
        </div>
        <div className="flex justify-end mt-4">
        <button
          onClick={() => navigate(`/comunity/thread/${thread.id}`)}
          className="text-secondary underline text-sm"
        >
          Ver detalles
        </button>
      </div>
      </article>     
    </div>
  );
};
