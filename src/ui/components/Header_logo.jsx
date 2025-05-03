import React from "react";
import { Logo } from "./Logo";

export const Header_logo = ({ filePath, alt }) => {
  return (
    <a href="#" className="-m-1.5 p-1.5">
      <span className="sr-only">Germogli</span>
      <Logo filePath={filePath} alt={alt} styleLogo="h-8 w-auto" />
    </a>
  );
};
