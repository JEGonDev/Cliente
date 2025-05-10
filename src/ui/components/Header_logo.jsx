import React from "react";
import { Logo } from "./Logo";

export const Header_logo = ({ filePath, alt }) => {
  return (
    <a href="#" className="flex flex-col items-center -m-1.0 p-0.5">      
      <Logo filePath={filePath} alt={alt} styleLogo="h-12 w-auto" />
      <span className="sr-only">Germogli</span>
      <span className="text-white ml-2">Germogli</span>
    </a>
  );
};
