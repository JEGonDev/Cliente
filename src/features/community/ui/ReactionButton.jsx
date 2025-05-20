import React, { useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react"; // Cambiamos ThumbUp y ThumbsDown por ArrowUp y ArrowDown
import { communityService } from "../services/communityService";

export const ReactionButton = ({ postId, reactions }) => {
  const [reactionState, setReactionState] = useState({
    liked: false,
    disliked: false,
    count: reactions || 0,
  });

  const toggleReaction = (type) => {
    const updatedState = { ...reactionState };

    if (type === "like") {
      updatedState.liked = !reactionState.liked;
      updatedState.disliked = false;
      updatedState.count += reactionState.liked ? -1 : 1;
    } else if (type === "dislike") {
      updatedState.disliked = !reactionState.disliked;
      updatedState.liked = false;
      updatedState.count += reactionState.disliked ? -1 : 1;
    }

    setReactionState(updatedState);

    // Llamada a la API para registrar la reacción
    communityService.toggleReaction(postId, type).catch(console.error);
  };

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={() => toggleReaction("like")}
        className={`flex items-center text-sm ${
          reactionState.liked ? "text-green-600" : "text-gray-600"
        }`}
      >
        <ArrowUp className="w-4 h-4 mr-1" />
        {reactionState.count}
      </button>
      <button
        onClick={() => toggleReaction("dislike")}
        className={`flex items-center text-sm ${
          reactionState.disliked ? "text-red-600" : "text-gray-600"
        }`}
      >
        <ArrowDown className="w-4 h-4 mr-1" />
      </button>
    </div>
  );
};