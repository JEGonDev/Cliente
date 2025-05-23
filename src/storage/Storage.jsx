export const Storage = {
  get(key) {
    const val = window.localStorage.getItem(key);
    // Opcional: solo log para debug controlado
    // console.log(`[Storage] get(${key}):`, val);

    if (!val || val === "undefined") {
      return null;
    }

    try {
      return JSON.parse(val);
    } catch (error) {
      console.error(
        `[Storage] Error al parsear JSON desde localStorage con clave "${key}":`,
        error
      );
      return null;
    }
  },
  set(key, val) {
    window.localStorage.setItem(key, JSON.stringify(val));
    // Opcional: solo log para debug controlado
    // console.log(`[Storage] set(${key}):`, val);
  },
  remove(key) {
    window.localStorage.removeItem(key);
  },
  clear() {
    window.localStorage.clear();
  },
};

// import React from 'react'

// export const Storage = {
//     get(key) {
//       // Obtiene el valor de localStorage
//       const val = window.localStorage.getItem(key);
//       console.log(val)
  
//       // Si el valor es null o "undefined" (como string), retorna null directamente
//       if (!val || val === "undefined") {
//         return null;
//       }
  
//       try {
//         return JSON.parse(val);
//       } catch (error) {
//         console.error(`Error al parsear JSON desde localStorage con clave "${key}":`, error);
//         return null; // Retorna null si el JSON es inválido
//       }
//     },
//     set(key, val) {
//       window.localStorage.setItem(key, JSON.stringify(val));
//       console.log(val)
//     },
//     remove(key) {
//       window.localStorage.removeItem(key);
//     },
//     clear() {
//       window.localStorage.clear();
//     },
//   };
  