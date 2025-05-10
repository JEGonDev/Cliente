import axios from 'axios';

// Creamos una instancia base de Axios para toda la app.
//    - baseURL: punto de entrada de tu backend (configurable vía .env)
//    - timeout: tiempo máximo de espera (ms)
//    - headers: headers por defecto para todas las peticiones
export const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',  // Enviamos siempre JSON
    'Accept': 'application/json'         // Esperamos recibir JSON
  },
  withCredentials: true
});

// Interceptor de petición: se ejecuta ANTES de cada llamada.
// Las cookies se envían automáticamente con cada petición
API.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Interceptor de respuesta: logging centralizado de errores.
// Atrapa cualquier status ≠ 2xx y lo imprime en consola.
API.interceptors.response.use(
  response => response,  // Todo OK ─ paso directamente la respuesta
  error => {
    if (error.response) {
      // El servidor respondió con un código de error
      console.error(
        `[API Error] Status: ${error.response.status} -`,
        error.response.data
      );
    } else if (error.request) {
      // La petición salió pero no hubo respuesta
      console.error('[API Error] No hubo respuesta:', error.request);
    } else {
      // Error al configurar la petición
      console.error('[API Error] Configuración fallida:', error.message);
    }
    return Promise.reject(error);
  }
);