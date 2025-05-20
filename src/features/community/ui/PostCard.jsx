import React from "react";
import { ReactionButton } from "./ReactionButton";
import { CommentButton } from "./CommentButton";

export const PostCard = ({ post }) => {
  const { post_id, user_id, content, multimedia_content, reactions, comments_count, user_name, post_date } = post;

  return (
    <div className="bg-white shadow-md rounded-md p-4">
      <div className="flex items-center mb-4">
        <img
          src={`https://i.pravatar.cc/40?u=${user_id}`}
          alt="User Avatar"
          className="w-10 h-10 rounded-full"
        />
        <div className="ml-3">
          <h3 className="text-sm font-semibold">{user_name}</h3>
          <p className="text-xs text-gray-500">{new Date(post_date).toLocaleString()}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-700">{content}</p>
        {multimedia_content && (
          <img
            src={multimedia_content}
            alt="Post Multimedia"
            className="w-full h-48 object-cover rounded-md mt-3"
          />
        )}
      </div>

      <div className="flex items-center justify-between">
        <ReactionButton postId={post_id} reactions={reactions} />
        <CommentButton postId={post_id} commentsCount={comments_count} />
      </div>
    </div>
  );
};