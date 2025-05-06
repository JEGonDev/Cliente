import React from "react";
import { MessageCircle, Heart, ThumbsUp } from "lucide-react";
import { SearchBar } from "../ui/SearchBar";

export const HomeComunity = () => {
  const posts = [
    {
      id: 1,
      author: "Camila JL",
      time: "Hoy, 4:36 PM",
      content:
        "¿El futuro de la agricultura o una moda pasajera? 🌱\n¿Creen que este método será el futuro de la agricultura? ¿Cuáles son los pros y contras de cultivar sin suelo?",
      likes: 999,
      hasImage: true,
      imageType: "header",
      imageUrl: "/api/placeholder/800/200",
    },
    {
      id: 2,
      author: "Camila JK",
      time: "Ayer, 9:48 AM",
      content:
        "Comparación de calidad entre cultivos hidropónicos y tradicionales 🍅",
      likes: 3,
      comments: 2,
      hasImage: true,
      imageType: "dual",
      imageUrl: "/api/placeholder/400/300",
    },
    {
      id: 3,
      author: "Samanta 12",
      time: "Ayer, 8:36 AM",
      content:
        "¿Es posible cultivar alimentos hidropónicos en un apartamento pequeño? 🌿\n(Estoy pensando en comenzar un proyecto hidropónico en casa) ¿Qué sistema me recomendarían?",
      likes: 120,
      hasImage: false,
    },
  ];

  return (
    <div>
      {/* Barra de búsqueda */}
      <SearchBar />
      {/* Contenido principal */}
      <div className="max-w-full mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {posts.map((post) => (
          <div key={post.id} className="border-b border-gray-200 p-4">
            {post.hasImage && post.imageType === "header" && (
              <div className="mb-3">
                <img
                  src={post.imageUrl}
                  alt="Cultivo hidropónico"
                  className="w-full h-40 object-cover rounded-lg"
                />
              </div>
            )}

            <div className="flex items-start mb-2">
              <div className="bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center mr-2">
                <MessageCircle size={16} />
              </div>
              <div>
                <div className="font-medium text-sm">{post.author}</div>
                <div className="text-gray-500 text-xs">{post.time}</div>
              </div>
            </div>

            <div className="ml-10">
              <p className="text-sm whitespace-pre-line mb-2">{post.content}</p>

              {post.hasImage && post.imageType === "dual" && (
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <img
                    src={post.imageUrl}
                    alt="Cultivo hidropónico"
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <img
                    src={post.imageUrl}
                    alt="Cultivo tradicional"
                    className="w-full h-24 object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="flex items-center text-sm mt-1">
                {post.likes && (
                  <div className="flex items-center mr-4">
                    <Heart
                      size={14}
                      className="text-red-500 mr-1"
                      fill="#EF4444"
                    />
                    <span className="text-xs text-gray-600">{post.likes}</span>
                  </div>
                )}

                {post.comments && (
                  <div className="flex items-center">
                    <ThumbsUp size={14} className="text-blue-500 mr-1" />
                    <span className="text-xs text-gray-600">
                      {post.comments}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
