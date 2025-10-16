// src/components/estadisticas/ReportesPorPlagaChart.js

import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const BAR_COLOR = "#10B981"; // Verde Emerald 600

const ReportesPorPlagaChart = ({ data }) => {
    
    if (!data || data.length === 0) {
        return <p className="text-center text-gray-600 py-8 bg-gray-50 rounded-lg">No hay datos de plagas para generar el gráfico.</p>;
    }
    
    const chartHeight = Math.max(350, data.length * 40);

    return (
        <ResponsiveContainer width="100%" height={chartHeight}> 
            <BarChart
                data={data}
                // Ajustamos el margen para evitar superposiciones
                margin={{ top: 10, right: 30, left: 20, bottom: 40 }}  
                
                layout="vertical"
            >
                <CartesianGrid strokeDasharray="5 5" stroke="#E5E7EB" />
                
                <YAxis 
                    dataKey="plagaNombre" 
                    type="category" 
                    style={{ fontSize: '0.8rem', fill: '#4B5563' }} 
                    tickLine={false}
                    axisLine={false}
                />
                
                <XAxis 
                    dataKey="count" 
                    type="number" 
                    tickLine={false} 
                    axisLine={{ stroke: '#9CA3AF' }} 
                    label={{ 
                        value: 'Cantidad de Reportes', 
                        position: 'bottom', 
                        offset: 35, 
                        fill: '#4B5563',
                        fontWeight: 'bold'
                    }}
                />
                
                <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}
                    labelStyle={{ fontWeight: 'bold', color: BAR_COLOR }}
                    formatter={(value) => [`${value} Reportes`, 'Total']}
                />
                
                <Legend 
                    wrapperStyle={{ paddingTop: '10px' }} 
                    verticalAlign="bottom"
                    align="center"
                    height={36}
                />
                
                <Bar 
                    dataKey="count" 
                    name="Reportes" 
                    fill={BAR_COLOR} 
                    radius={[5, 5, 0, 0]}
                    minPointSize={2} 
                />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default ReportesPorPlagaChart;