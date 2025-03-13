import React from 'react'

export const Storage = {
    get(key) {
        //obtiene el valor del token o clave
        const val = window.localStorage.getItem(key)
        //si no existe el valor retorna null
        if (!val) {
            return null
        }
        //retorna el valor en formato JSON
        return JSON.parse(val)       
    },
    set(key, val) {
        //almacena el token o clave
        window.localStorage.setItem(key, JSON.stringify(val));
},
remove(key) {
    //elimina el token o clave
    window.localStorage.removeItem(key);
},
clear() {
    //elimina todos los tokens o claves
    window.localStorage.clear();
}
}
export default Storage
  
