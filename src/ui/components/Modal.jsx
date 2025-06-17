import { useEffect, useRef } from 'react';
import { Button } from './Button';

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footerActions,
  size = 'md'
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-xl',
    lg: 'max-w-3xl'
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm p-4 font-inter"
      onClick={handleOutsideClick}
    >
      <div
        ref={modalRef}
        className={`w-full ${sizeClasses[size]} bg-white rounded-2xl shadow-2xl transition-all duration-300 transform scale-100 overflow-hidden`}
      >
        {/* Header con degradado personalizado y Poppins */}
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-[#23582a] to-[#3a8741]">
          <h3 className="text-xl font-semibold text-white font-Poppins tracking-wide">
            {title}
          </h3>
          <Button
            onClick={onClose}
            className="text-white text-3xl font-extrabold rounded-full hover:bg-[#2f6b35] hover:text-white transition-colors duration-200 w-9 h-9 flex items-center justify-center"
          >
            ✕
          </Button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 text-sm sm:text-base font-inter text-gray-700 bg-white">
          {children}
        </div>

        {/* Footer */}
        {footerActions && (
          <div className="flex justify-end gap-2 px-6 py-4 border-t font-inter font-extrabold border-gray-200 bg-gray-50">
            {footerActions}
          </div>
        )}
      </div>
    </div>
  );
};
