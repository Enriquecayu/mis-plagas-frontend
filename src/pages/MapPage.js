import React, { useState, useEffect, useCallback, useRef } from "react";
// CAMBIO 1: Importamos el cliente configurado, NO el axios base
import axiosClient from "../config/axiosClient";
// Importaciones de React Router DOM
import { useNavigate, useLocation } from "react-router-dom";
// Importaciones de Leaflet
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
// Estilos locales (asegúrate de que exista este archivo)
import "../styles/MapPage.css";
import Footer from "../components/Footer";

// ----------------------------------------------------
// 1. UTILIDADES Y CONSTANTES DE LEAFLET
// ----------------------------------------------------

// Fix para los iconos de marcadores de Leaflet 
delete L.Icon.Default.prototype._getIconUrl;

// Función auxiliar para la leyenda (Devuelve el color HEX para estilos CSS)
const getPinColorForLegend = (estado) => {
    switch (estado) {
        case 'Pendiente': return '#E74C3C';
        case 'Asignado': return '#F1C40F';
        case 'En Proceso': return '#3498DB';
        case 'Solucionado': return '#2ECC71';
        default: return '#95A5A6';
    }
};

// FUNCIÓN CLAVE: Genera el ícono de color según el estado (Marcador simple)
const getPinIcon = (estado) => {
    let colorName = 'red';

    switch (estado) {
        case 'Pendiente':
            colorName = 'red';
            break;
        case 'Asignado':
            colorName = 'gold';
            break;
        case 'En Proceso':
            colorName = 'blue';
            break;
        case 'Solucionado':
            colorName = 'green';
            break;
        default:
            colorName = 'grey';
            break;
    }

    return new L.Icon({
        iconRetinaUrl:
            `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${colorName}.png`,
        iconUrl:
            `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${colorName}.png`,
        shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });
};

// ----------------------------------------------------
// 2. LÓGICA DE AGRUPACIÓN (CLUSTERING)
// ----------------------------------------------------

// Modificación: Genera un ícono simple para la agrupación, mostrando el conteo.
// Usaremos un icono DIV personalizado para mostrar el conteo.
const getClusterIcon = (count) => {
    // Si la librería Leaflet (L) está cargada, la usamos para generar iconos.
    if (typeof L !== 'undefined') {
        let color = '#ff7800'; // Color naranja fijo para agrupaciones
        let size = count > 9 ? '40px' : '36px';

        return L.divIcon({
            className: 'custom-cluster-icon', // Usaremos CSS para darle estilo
            html: `
                <div style="
                    background-color: ${color};
                    width: ${size};
                    height: ${size};
                    line-height: ${size};
                    text-align: center;
                    color: white;
                    border-radius: 50%;
                    font-weight: bold;
                    border: 3px solid white;
                    box-shadow: 0 0 8px rgba(0,0,0,0.4);
                    font-size: 14px;
                ">${count}</div>
            `,
            iconSize: [parseFloat(size), parseFloat(size)],
            iconAnchor: [parseFloat(size) / 2, parseFloat(size)],
        });
    }
    return null;
};


/**
 * Agrupa los reportes que tienen la misma latitud y longitud.
 */
const groupReports = (reports) => {
    const groups = {};

    reports.forEach(report => {
        const key = `${report.latitud},${report.longitud}`;

        if (!groups[key]) {
            groups[key] = {
                key: key,
                lat: parseFloat(report.latitud),
                lng: parseFloat(report.longitud),
                reports: [],
                count: 0,
            };
        }

        groups[key].reports.push(report);
        groups[key].count++;
    });

    return Object.values(groups);
};


function MapPage() {
    const [reportes, setReportes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    // Coordenadas de Aguaray, Salta, Argentina (Centro por defecto)
    const defaultCenter = [-22.5694, -63.7556];
    const defaultZoom = 10;

    const [mapCenter, setMapCenter] = useState(null);
    const [mapZoom, setMapZoom] = useState(defaultZoom);

    const mapRef = useRef(null);


    // Lógica para obtener coordenadas de la URL y centrar el mapa
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const lat = params.get('lat');
        const lng = params.get('lng');

        if (lat && lng) {
            const newCenter = [parseFloat(lat), parseFloat(lng)];
            setMapCenter(newCenter);
            setMapZoom(15);

            if (mapRef.current) {
                mapRef.current.setView(newCenter, 15);
            }
        } else {
            setMapCenter(null);
            setMapZoom(defaultZoom);
        }
    }, [location.search]);


    // CAMBIO 2: Usamos axiosClient, ruta relativa y eliminamos la gestión manual del token
    const fetchReportes = useCallback(async () => {
        setLoading(true);
        try {
            // Chequeo rápido de token antes de la llamada (opcional)
            if (!localStorage.getItem("token")) {
                navigate("/login");
                return;
            }

            // Petición limpia. El token se adjunta automáticamente.
            const res = await axiosClient.get("/reportes");

            setReportes(res.data);

        } catch (err) {
            setError(
                "Error al cargar los reportes. Por favor, asegúrate de haber iniciado sesión."
            );
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchReportes();
    }, [fetchReportes]);

    if (loading) {
        return (
            <div className="loading-message">Cargando reportes en el mapa...</div>
        );
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    const validReports = reportes.filter((r) => r.latitud && r.longitud);

    const clusteredReports = groupReports(validReports);

    const initialCenter = mapCenter
        ? mapCenter
        : validReports.length > 0
            ? [validReports[0].latitud, validReports[0].longitud]
            : defaultCenter;


    return (
        <div className="map-page-container">
            {/* INCLUYE ESTILOS PARA LOS ÍCONOS DE CLUSTERING */}
            <style>
                {`
                /* Asegura que los íconos de cluster se vean correctamente */
                .custom-cluster-icon {
                    background: none !important;
                    border: none !important;
                }
                /* Estilo del popup para mejor lectura */
                .leaflet-popup-content-wrapper {
                    border-radius: 12px !important;
                }
                .map-popup-list {
                    max-height: 200px; /* Limita la altura de la lista */
                    overflow-y: auto;
                    padding-right: 10px;
                }
                .map-popup-item {
                    border-bottom: 1px dotted #ddd;
                    margin-bottom: 5px;
                    padding-bottom: 5px;
                }
                `}
            </style>

            <button className="back-button" onClick={() => navigate("/admin")}>
                Volver a la lista de reportes
            </button>
            <h2 className="map-title">Ubicación de los Reportes de Plagas ({validReports.length} Reportes)</h2>

            {/* Leyenda de Colores */}
            <div className="map-legend">
                <span className="legend-item"><span style={{ backgroundColor: getPinColorForLegend('Pendiente') }}></span>Pendiente</span>
                <span className="legend-item"><span style={{ backgroundColor: getPinColorForLegend('Asignado') }}></span>Asignado</span>
                <span className="legend-item"><span style={{ backgroundColor: getPinColorForLegend('En Proceso') }}></span>En Proceso</span>
                <span className="legend-item"><span style={{ backgroundColor: getPinColorForLegend('Solucionado') }}></span>Solucionado</span>
            </div>

            {/* Mensaje de centrado */}
            {mapCenter && (
                <div className="center-info-message">
                    Mapa centrado en un reporte específico.
                </div>
            )}

            {validReports.length === 0 ? (
                <p className="no-reportes-map">
                    No hay reportes válidos para mostrar en el mapa.
                </p>
            ) : (
                <div
                    style={{
                        width: "100%",
                        maxWidth: "100%",
                        height: "80vh",
                        border: "2px solid #ddd",
                        borderRadius: "12px",
                        overflow: "hidden",
                        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <MapContainer
                        // Usamos initialCenter y mapZoom para establecer el centro y zoom.
                        center={initialCenter}
                        zoom={mapZoom}
                        zoomControl={true}
                        scrollWheelZoom={true}
                        style={{ height: "100%", width: "100%" }}
                        whenCreated={(map) => {
                            mapRef.current = map; // Guardar la referencia del mapa

                            // Ajustar los límites solo si no hay un centro específico de la URL (solo en la carga inicial)
                            if (!mapCenter && validReports.length > 0) {
                                const latLngs = validReports.map((r) => [
                                    r.latitud,
                                    r.longitud,
                                ]);
                                const bounds = L.latLngBounds(latLngs);
                                // Usamos setTimeout para asegurar que el mapa se ha renderizado completamente
                                setTimeout(() => {
                                    map.fitBounds(bounds, { padding: [50, 50] });
                                }, 100);
                            } else if (mapCenter) {
                                // Si sí hay centro, solo ajustamos la vista (ya hecho en el useEffect)
                                map.setView(mapCenter, mapZoom);
                            } else {
                                // Centrar en la ubicación por defecto
                                map.setView(defaultCenter, defaultZoom);
                            }
                        }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        />

                        {/* -------------------------------------- */}
                        {/* RENDERIZADO DE MARCADORES AGRUPADOS   */}
                        {/* -------------------------------------- */}
                        {clusteredReports.map((group) => (
                            <Marker
                                key={group.key}
                                // Si es un grupo, usa el ícono de cluster; si es individual, usa el ícono de color por estado.
                                icon={group.count > 1 ? getClusterIcon(group.count) : getPinIcon(group.reports[0].estado)}
                                position={[group.lat, group.lng]}
                            >
                                <Popup>
                                    <div className="map-popup">
                                        <h4>{group.count} Reporte{group.count > 1 ? 's' : ''} aquí</h4>
                                        <div className="map-popup-list">
                                            {group.reports.map((reporte, index) => (
                                                <div key={index} className="map-popup-item">
                                                    <h3 style={{ color: getPinColorForLegend(reporte.estado) }}>{reporte.nombrePlaga}</h3>
                                                    <p className={`popup-status status-${reporte.estado.toLowerCase().replace(/\s/g, '-')}`}>
                                                        Estado: {reporte.estado}
                                                    </p>
                                                    <p>
                                                        Reportado por:{" "}
                                                        <strong>{reporte.Usuario ? reporte.Usuario.nombre : reporte.nombre || "TÚ"}</strong>
                                                    </p>
                                                    <p>Asignado a: {reporte.asignadoA || 'Nadie'}</p>
                                                    {reporte.fotoURL && (
                                                        <img
                                                            src={reporte.fotoURL}
                                                            alt="Foto del reporte"
                                                            style={{ maxWidth: "100px", height: "auto", marginTop: "10px", borderRadius: "4px" }}
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            )}
            <Footer/>
        </div>
    );
}


export default MapPage;
