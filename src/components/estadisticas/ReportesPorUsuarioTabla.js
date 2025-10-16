// src/components/estadisticas/ReportesPorUsuarioTabla.js

import React, { useState } from 'react';

const ReportesPorUsuarioTabla = ({ data }) => {
    const [expandedRow, setExpandedRow] = useState(null);

    const toggleRow = (userId) => {
        setExpandedRow(expandedRow === userId ? null : userId);
    };

    if (!data || data.length === 0) {
        return <p className="p-6 text-center text-gray-600 bg-gray-50 border rounded-lg">No hay datos de reportes por usuario disponibles para el análisis.</p>;
    }

    return (
        // Borde exterior visible y sombra
        <div className="overflow-x-auto border border-gray-500 rounded-xl shadow-lg">
            {/* 🚨 Eliminamos 'divide-y' aquí para no duplicar líneas */}
            <table className="min-w-full">
                <thead className="bg-gray-200">
                    <tr>
                        {/* 🚨 Añadimos borde completo a los encabezados */}
                        <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider border border-gray-400">
                            Usuario ID
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider border border-gray-400">
                            Nombre del Usuario
                        </th>
                        <th className="px-6 py-3 text-center text-sm font-bold text-gray-800 uppercase tracking-wider border border-gray-400">
                            Total
                        </th>
                        <th className="px-6 py-3 text-center text-sm font-bold text-gray-800 uppercase tracking-wider border border-gray-400">
                            Acción
                        </th>
                    </tr>
                </thead>
                {/* 🚨 Eliminamos 'divide-y' del tbody */}
                <tbody className="bg-white">
                    {data.map((usuario) => (
                        <React.Fragment key={usuario.userId}>
                            {/* Fila Principal de Resumen */}
                            <tr 
                                className="hover:bg-green-50 transition duration-150 cursor-pointer" 
                                onClick={() => toggleRow(usuario.userId)}
                            >
                                {/* 🚨 Borde completo y explícito en cada TD */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600 border border-gray-300">
                                    {usuario.userId}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-base font-semibold text-gray-800 border border-gray-300">
                                    {usuario.nombre}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-xl font-extrabold text-green-600 border border-gray-300">
                                    {usuario.totalReportes}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center border border-gray-300">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); toggleRow(usuario.userId); }}
                                        className={`px-3 py-1 text-sm rounded-full transition duration-300 ${expandedRow === usuario.userId ? 'bg-indigo-500 text-white' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
                                    >
                                        {expandedRow === usuario.userId ? 'Ocultar Detalle' : 'Ver Detalle'} 
                                    </button>
                                </td>
                            </tr>

                            {/* Fila de Detalle Expandible */}
                            {expandedRow === usuario.userId && (
                                <tr className="bg-indigo-50">
                                    {/* 🚨 Usamos 'border-t' y 'border-b' para separar esta fila de las demás */}
                                    <td colSpan="4" className="p-6 border-t-2 border-b border-indigo-400">
                                        <h4 className="text-lg font-bold mb-3 text-indigo-800">
                                            Recuento de Plagas Reportadas:
                                        </h4>
                                        <div className="flex flex-wrap gap-3">
                                            {/* Mapea sobre el resumen de plagas del usuario */}
                                            {Object.entries(usuario.plagasReportadas).map(([plaga, count]) => (
                                                <span 
                                                    key={plaga} 
                                                    className={`inline-flex items-center px-4 py-1.5 text-sm font-semibold rounded-full shadow-sm 
                                                        ${count > 5 ? 'bg-red-200 text-red-800' : 'bg-indigo-100 text-indigo-800'}`}
                                                >
                                                    {plaga}: 
                                                    <strong className="ml-2 text-base">{count}</strong>
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReportesPorUsuarioTabla;