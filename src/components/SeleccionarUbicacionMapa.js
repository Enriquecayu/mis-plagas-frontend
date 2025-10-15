import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet'; 
import 'leaflet/dist/leaflet.css'; 

// 1. Coordenadas fijas para centrar el mapa en Aguaray, Salta
const AGUARAY_LAT = -22.2448; 
const AGUARAY_LNG = -63.7353;
const ZOOM_INICIAL = 14; // Zoom ajustado para una vista de ciudad

// Configuración del icono de marcador (debe mantenerse igual)
const customIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Componente auxiliar que maneja el evento de clic en el mapa
function ClickHandler({ onMapClick }) {
    useMapEvents({
        click: (e) => {
            onMapClick({ latitud: e.latlng.lat, longitud: e.latlng.lng });
        },
    });
    return null;
}

const SeleccionarUbicacionMapa = ({ onClose, onSelectLocation, ubicacionInicial }) => {
    
    // Si ya existe una ubicación previa (del GPS o una selección anterior), úsala.
    // Si no, usa las coordenadas de Aguaray como centro por defecto.
    const defaultCenter = ubicacionInicial.latitud ? 
        [ubicacionInicial.latitud, ubicacionInicial.longitud] : 
        [AGUARAY_LAT, AGUARAY_LNG];

    const [tempMarker, setTempMarker] = useState(ubicacionInicial.latitud ? ubicacionInicial : null);

    const handleConfirm = () => {
        if (tempMarker && tempMarker.latitud !== null) {
            onSelectLocation(tempMarker); 
            onClose(); 
        }
    };

    return (
        <div className="map-modal-overlay"> 
            <div className="map-modal-content">
                <h3>Haz clic en el mapa para señalar la ubicación precisa de la plaga</h3>
                
                <MapContainer 
                    // Uso de defaultCenter y ZOOM_INICIAL
                    center={defaultCenter} 
                    zoom={ZOOM_INICIAL} 
                    scrollWheelZoom={true}
                    style={{ height: '400px', width: '100%', borderRadius: '8px', marginBottom: '15px' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    <ClickHandler onMapClick={setTempMarker} />

                    {/* Muestra el marcador temporal */}
                    {tempMarker && tempMarker.latitud !== null && (
                        <Marker 
                            position={[tempMarker.latitud, tempMarker.longitud]} 
                            icon={customIcon} 
                        />
                    )}

                </MapContainer>

                <div className="map-modal-actions">
                    <button onClick={onClose} className="btn-cancel">
                        Cancelar
                    </button>
                    <button 
                        onClick={handleConfirm} 
                        disabled={!tempMarker || tempMarker.latitud === null}
                        className="btn-confirm"
                    >
                        Confirmar Ubicación
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SeleccionarUbicacionMapa;