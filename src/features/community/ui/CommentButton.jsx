import React from "react";
import { MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const CommentButton = ({ postId, commentsCount }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/comunity/posts/${postId}`)}
      className="flex items-center text-sm text-gray-600 hover:text-blue-600"
    >
      <MessageSquare className="w-4 h-4 mr-1" />
      {commentsCount || 0}
      <span className="ml-1">Comentarios</span>
    </button>
  );
};