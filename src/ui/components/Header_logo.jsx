import React from "react";
import { Logo } from "./Logo";

export const Header_logo = ({ filePath, alt }) => {
  return (
 <a href="#" className="flex flex-col items-center justify-center gap-0">
      <Logo filePath={filePath} alt={alt} styleLogo="h-14 w-auto" />
      <span className="sr-only">Germogli</span>
      <span className="text-white font-chonburi text-xl">Germogli</span>
    </a>
  );
};
