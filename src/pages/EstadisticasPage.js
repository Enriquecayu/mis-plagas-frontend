// src/pages/EstadisticasPage.js

import React from 'react';
// Asumo que usas 'react-query' o '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
// Importamos los componentes de visualización
import ReportesPorUsuarioTabla from '../components/estadisticas/ReportesPorUsuarioTabla';
import ReportesPorPlagaChart from '../components/estadisticas/ReportesPorPlagaChart';

// Importamos la función central de la API
// 🚨 Asegúrate que la ruta sea correcta (ej: '../services/statsApi')
import { fetchAndProcessStatsData } from '../services/statsApi'; 

function EstadisticasPage() {
    const navigate = useNavigate();
    // 1. Llamada central: Obtiene y procesa AMBOS datasets en una sola petición
    //(Forma de objeto requerida por TanStack Query v5)
    const { 
        data: statsData, 
        isLoading, 
        error,
        refetch
    } = useQuery({
        // La clave de la consulta
        queryKey: ['allStatsData'], 
        
        // La función que realiza el fetching (tu función API)
        queryFn: fetchAndProcessStatsData, 
        
        // Opciones (siempre van dentro del objeto principal)
        staleTime: 60000, 
    });
    const estiloBoton = {
        backgroundImage: 'linear-gradient(45deg, #6c5ce7 0%, #4834d4 100%)', // Degradado púrpura a azul profundo
        color: 'white',
        fontWeight: 'bold',
        padding: '12px 28px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        // 2. Efecto de Sombra y Elevación
        boxShadow: '0 4px 15px rgba(72, 52, 212, 0.4)', // Sombra para darle profundidad

         // 3. Transición (para el efecto hover)
        transition: 'all 0.3s ease-in-out',
  
        // 4. Asegurar que el texto esté centrado
        textAlign: 'center',
        textDecoration: 'none', // Por si se usa en un enlace
        display: 'inline-block',
    };
    const estiloTexto = {
    // 1. Tipografía y Tamaño
  fontFamily: 'Montserrat, "Segoe UI", Arial, sans-serif', // Fuente más moderna si está disponible
  fontSize: '32px',         // Tamaño grande para un impacto inmediato
  fontWeight: '800',        // Extra negrita (Ultra Bold)
  textTransform: 'uppercase', // Opcional: poner el texto en mayúsculas para más fuerza

  // 2. Color y Contraste
  color: '#0D47A1',         // Azul marino profundo (un color profesional y llamativo)

  // 3. Efecto de Sombra y Profundidad
  // Sombra de texto para darle un efecto 3D sutil y que "salte" del fondo
  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)', 

  // 4. Espaciado
  lineHeight: '1.2',       // Líneas más juntas para encabezados
  letterSpacing: '1px',    // Espacio extra entre letras para un look más limpio y fuerte
  marginBottom: '15px',
};
    const handleGoBack = () => {
        // Redirige al path "/admin", que es donde tienes montado el DashboardAdmin
        navigate('/admin'); 
    };

    // ----------------------------------------------------
    // Lógica de Manejo de Estados
    // ----------------------------------------------------
    
    if (isLoading) {
        return (
            <div className="p-8 text-center bg-gray-50 min-h-screen flex flex-col justify-center items-center">
                <p className="text-xl font-semibold text-indigo-600">
                    Cargando estadísticas... 📊
                </p>
                <p className="text-gray-500 mt-2">
                    Procesando todos los reportes, por favor espera.
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center bg-red-50 border border-red-300 rounded-lg m-6">
                <p className="text-lg font-semibold text-red-700">
                    ❌ Error al cargar los datos.
                </p>
                <p className="text-sm text-red-600 mt-2">
                    Mensaje: {error.message}
                </p>
                <button 
                    onClick={() => refetch()} 
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Intentar Recargar
                </button>
            </div>
        );
    }
    
    // Desestructuramos los resultados una vez que se han cargado exitosamente
    const { reportesPorUsuario, reportesPorPlaga } = statsData;

    // ----------------------------------------------------
    // Renderizado de Contenido
    // ----------------------------------------------------

    return (
        <div className="estadisticas-page p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
                <h1 style={estiloTexto} className="text-4xl font-extrabold text-gray-800">
                    Panel de Estadísticas
                </h1>
                <button 
                    onClick={handleGoBack} 
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 transition"
                    style={estiloBoton}
                >
                    ⬅️ Volver
                </button>
                <button 
                    onClick={() => refetch()} 
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition"
                    style={estiloBoton}
                >
                    Actualizar Datos
                </button>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* SECCIÓN 1: GRÁFICO DE ACUMULACIÓN POR PLAGA */}
                <div className="bg-white p-6 shadow-xl rounded-lg border border-gray-200">
                    <h2 className="text-2xl font-semibold mb-4 text-indigo-700">
                        Acumulación de Reportes por Tipo de Plaga
                    </h2>
                    {/* Se pasa el array de plagas: [ { plagaNombre: 'Mosquitos', count: 120 }, ... ] */}
                    <ReportesPorPlagaChart data={reportesPorPlaga} />
                </div>

                {/* SECCIÓN 2: TABLA DE REPORTES POR USUARIO */}
                <div className="bg-white p-6 shadow-xl rounded-lg border border-gray-200">
                    <h2 className="text-2xl font-semibold mb-4 text-green-700">
                        Reportes Realizados por Usuario (Detalle de Plagas)
                    </h2>
                    {/* Se pasa el array de usuarios: [ { userId: 'u-001', nombre: 'Juan', ... }, ... ] */}
                    <ReportesPorUsuarioTabla data={reportesPorUsuario} />
                </div>
            </div>
        </div>
    );
}

export default EstadisticasPage;