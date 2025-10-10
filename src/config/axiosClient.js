import axios from 'axios';

// Esta variable lee el valor definido en el archivo .env del frontend.
// En desarrollo: http://localhost:3000/api
// En producción: https://api.tudominio.com/api (definido en el hosting)
const API_URL = process.env.REACT_APP_API_URL; 

// 1. Crear una instancia de Axios con la URL Base
const axiosClient = axios.create({
    baseURL: API_URL
});

// 2. Configurar un Interceptor de Solicitud (Request Interceptor)
// Este código se ejecuta ANTES de que cualquier petición salga del navegador.
axiosClient.interceptors.request.use(
    (config) => {
        // Leemos el token que guardaste en el login
        const token = localStorage.getItem('token');
        // Si existe un token, lo adjuntamos al encabezado Authorization: Bearer <token>
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Manejo de errores de configuración o de red antes del envío
        return Promise.reject(error);
    }
);

export default axiosClient;