import { useEffect, useRef } from 'react';
import { Button } from './Button';

export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footerActions,
  size = 'md' // 'sm', 'md', 'lg'
}) => {
  const modalRef = useRef(null);
  
  // Cierra el modal al presionar Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);
  
  // Cerrar al hacer clic fuera del modal
  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };
  
  if (!isOpen) return null;
  
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg'
  };
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={handleOutsideClick}
    >
      <div 
        ref={modalRef}
        className={`${sizeClasses[size]} w-full bg-white rounded-lg shadow-xl transform transition-all`}
      >
        <div className="flex justify-between items-center border-b border-gray-200 p-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </Button>
        </div>
        
        <div className="p-4">
          {children}
        </div>
        
        {footerActions && (
          <div className="flex justify-end gap-2 border-t border-gray-200 p-4">
            {footerActions}
          </div>
        )}
      </div>
    </div>
  );
};