import React from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export const MobileMenuButton = ({ isOpen, onClick, className }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white ${className || ''}`}
    >
      <span className="sr-only">
        {isOpen ? 'Close menu' : 'Open main menu'}
      </span>
      {isOpen ? (
        <XMarkIcon aria-hidden="true" className="size-6" />
      ) : (
        <Bars3Icon aria-hidden="true" className="size-6" />
      )}
    </button>
  );
};