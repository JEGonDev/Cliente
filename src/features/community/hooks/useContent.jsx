// src/hooks/useContent.js
import { useContext } from 'react';
import { ContentContext } from '../context/ContentContext';

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent debe usarse dentro de un ContentProvider');
  }
  return context;
}
