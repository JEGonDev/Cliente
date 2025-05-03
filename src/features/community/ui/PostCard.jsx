// src/components/PostCard.jsx
import React from "react";

export const PostCard = ({ post }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
      <h3 className="text-lg font-bold mb-2">{post.title}</h3>
      <p className="text-gray-700">{post.content}</p>
    </div>
  );
};
