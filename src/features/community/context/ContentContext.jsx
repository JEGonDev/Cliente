// src/context/ContentContext.jsx
import { createContext, useState } from 'react';

export const ContentContext = createContext();

export function ContentProvider({ children }) {
  const [activeContent, setActiveContent] = useState('content1');

  return (
    <ContentContext.Provider value={{ activeContent, setActiveContent }}>
      {children}
    </ContentContext.Provider>
  );
}
