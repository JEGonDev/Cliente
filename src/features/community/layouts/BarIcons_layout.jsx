import React from "react";
import {
    Bell,
    MessageCircle,
    Users
  } from "lucide-react";

export const BarIcons_layout = () => {
  return (
    <div className="w-full md:w-16 bg-gray-200 border-b md:border-b-0 md:border-r border-gray-300 flex md:flex-col items-center justify-around md:justify-start p-2">
      <button className="p-2 text-gray-800">
        <Bell className="w-5 h-5" />
      </button>
      <button className="p-2 text-gray-800">
        <MessageCircle className="w-5 h-5" />
      </button>
      <button className="p-2 text-gray-800">
        <Users className="w-5 h-5" />
      </button>
    </div>
  );
};
