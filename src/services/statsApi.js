// src/services/statsApi.js

import axiosClient from "../config/axiosClient" // Importa tu cliente Axios

/**
 * Función auxiliar que procesa un array de reportes (obtenido del API)
 * y los transforma en los dos formatos de estadísticas que necesita el frontend.
 * * @param {Array<Object>} reports - Array de reportes, incluyendo el objeto 'Usuario' asociado.
 * @returns {Object} Contiene { reportesPorUsuario, reportesPorPlaga }
 */
const processAllReportsForStats = (reports) => {
    const userStats = {};
    const plagaStats = {};
    
    reports.forEach(reporte => {
        const userId = reporte.usuarioId;
        // 🚨 Campo de la plaga según tu modelo Reporte
        const plaga = reporte.nombrePlaga || 'Desconocida'; 

        // 1. Acumulación por Usuario
        if (userId) {
            if (!userStats[userId]) {
                userStats[userId] = {
                    userId: userId,
                    // 🚨 Campo del nombre según tu modelo Usuario
                    nombre: reporte.Usuario?.nombre || `Usuario ID ${userId}`, 
                    totalReportes: 0,
                    plagasReportadas: {}
                };
            }
            
            userStats[userId].totalReportes++;
            userStats[userId].plagasReportadas[plaga] = (userStats[userId].plagasReportadas[plaga] || 0) + 1;
        }

        // 2. Acumulación por Plaga (Contador global)
        plagaStats[plaga] = (plagaStats[plaga] || 0) + 1;
    });

    // Convierte los objetos de estadísticas en arrays para el consumo de React
    const usersArray = Object.values(userStats);
    const plagasArray = Object.entries(plagaStats).map(([plagaNombre, count]) => ({
        plagaNombre: plagaNombre,
        count: count
    }));

    return { reportesPorUsuario: usersArray, reportesPorPlaga: plagasArray };
};


// *******************************************************************
// FUNCIÓN PRINCIPAL DE FETCHING Y PROCESAMIENTO (Una sola llamada HTTP)
// *******************************************************************

/**
 * Realiza una única llamada a la API para obtener todos los reportes del administrador,
 * y luego procesa esos datos para generar las estadísticas de usuario y plaga.
 */
export const fetchAndProcessStatsData = async () => {
    try {
        // Llama al endpoint GET /api/reportes. Tu backend (reportes.js) se encarga 
        // de la autenticación Admin y de incluir el objeto Usuario asociado.
        const response = await axiosClient.get('/reportes');
        
        // Procesa los datos recibidos en el frontend
        return processAllReportsForStats(response.data);

    } catch (error) {
        console.error("Error al obtener y procesar datos de estadísticas:", error);
        // Lanza un error personalizado para que React Query lo maneje
        throw new Error(error.response?.data?.message || "Fallo en la conexión al servidor de reportes.");
    }
};

// *******************************************************************
// FUNCIONES DE ENLACE (Para ser usadas por useQuery en EstadisticasPage.js)
// *******************************************************************

/**
 * Obtiene solo el array de estadísticas de usuarios.
 */
export const fetchStatsReportesPorUsuario = async () => {
    const { reportesPorUsuario } = await fetchAndProcessStatsData();
    return reportesPorUsuario;
};

/**
 * Obtiene solo el array de estadísticas de plagas.
 */
export const fetchStatsPlagas = async () => {
    const { reportesPorPlaga } = await fetchAndProcessStatsData();
    return reportesPorPlaga;
};