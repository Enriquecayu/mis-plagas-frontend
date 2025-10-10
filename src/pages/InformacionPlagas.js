import React from 'react'; 
import { useNavigate } from 'react-router-dom';
import '../styles/InformacionPlagas.css';
const INFO_PLAGAS = [
    { 
        id: 1, 
        nombre: "Dengue", 
        transmision: "Mosquito Aedes aegypti y Aedes albopictus.",
        descripcion: "Enfermedad viral que causa fiebre alta, dolor de cabeza intenso, dolor detrás de los ojos, dolores musculares y articulares, y sarpullido. En casos graves, puede evolucionar a dengue hemorrágico, potencialmente fatal.", 
        prevencion: "Eliminar recipientes que acumulen agua (llantas, botellas, floreros) para evitar la cría de mosquitos. Usar ropa que cubra la mayor parte del cuerpo y repelente.",
        accionesAutoridad: ["Fumigación dirigida a áreas de brote.", "Vigilancia epidemiológica continua.", "Jornadas de descacharrización y educación comunitaria."] 
    },
    { 
        id: 2, 
        nombre: "Zica", 
        transmision: "Mosquito Aedes aegypti, también por vía sexual y de madre a feto.",
        descripcion: "Virus que presenta síntomas generalmente leves: fiebre, sarpullido, conjuntivitis y dolores musculares. La mayor preocupación es su vínculo con la microcefalia y otros defectos congénitos en bebés de madres infectadas durante el embarazo.", 
        prevencion: "Control de criaderos de mosquitos. Uso de condón para prevenir la transmisión sexual. Mujeres embarazadas deben extremar precauciones contra picaduras.",
        accionesAutoridad: ["Vigilancia específica en mujeres embarazadas.", "Control larvario y nebulización.", "Promoción de métodos de barrera (condón)."] 
    },
    { 
        id: 3, 
        nombre: "Leishmaniasis", 
        transmision: "Parásito transmitido por la picadura de flebótomos (moscas de la arena).",
        descripcion: "Enfermedad parasitaria que puede manifestarse de tres formas: cutánea (úlceras en la piel), mucosa (destrucción de las mucosas de nariz y boca) o visceral (afectación de órganos internos como bazo e hígado, siendo la forma más grave).", 
        prevencion: "Usar repelente y mosquiteros. Evitar actividades al aire libre al anochecer y amanecer (cuando el flebótomo está más activo). Controlar perros y roedores, que pueden ser reservorios.",
        accionesAutoridad: ["Diagnóstico y tratamiento oportuno.", "Control de vectores (rociado residual de insecticidas).", "Educación sanitaria en zonas endémicas."] 
    },
    { 
        id: 4, 
        nombre: "Chikungunya", 
        transmision: "Mosquito Aedes aegypti y Aedes albopictus.",
        descripcion: "Virus que provoca fiebre alta y dolor articular intenso y a menudo debilitante, principalmente en manos y pies. Aunque los síntomas agudos duran una semana, el dolor articular puede persistir por meses o años.", 
        prevencion: "Medidas similares al Dengue y Zica: eliminar criaderos de mosquitos y protegerse de las picaduras con ropa y repelente.",
        accionesAutoridad: ["Manejo clínico del dolor articular.", "Respuesta rápida de control vectorial ante nuevos casos.", "Campaña de información sobre los síntomas crónicos."] 
    },
];

// ----------------------------------------------------------------------
// COMPONENTE PRINCIPAL
// ----------------------------------------------------------------------
const InformacionPlagas = () => {
    const navigate = useNavigate();
    
    return ( 
        <div className="info-plagas-container">
            <header className="info-plagas-header">
                {/* Botón para regresar al formulario */}
                <button onClick={() => navigate(-1)} className="back-button">
                    ← Volver al Reporte
                </button>
                <h1>Conoce las Plagas que Puedes Reportar</h1>
            </header>

            <div className="plagas-list">
                {INFO_PLAGAS.map(plaga => (
                    // Tarjeta individual de información para cada plaga
                    <div key={plaga.id} className="plaga-card">
                        <h2>{plaga.nombre}</h2>
                        
                        <p><strong>Transmitido por:</strong> {plaga.transmision}</p>
                        
                        <div className="detalle-seccion">
                            <h3>Descripción y Riesgos</h3>
                            <p>{plaga.descripcion}</p>
                        </div>

                        <div className="detalle-seccion">
                            <h3>Prevención Personal</h3>
                            <p>{plaga.prevencion}</p>
                        </div>

                        <div className="detalle-seccion">
                            <h3>Acciones Gubernamentales</h3>
                            <ul>
                                {plaga.accionesAutoridad.map((accion, index) => (
                                    <li key={index}>{accion}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
            
            <footer className="info-plagas-footer">
                <p>Tu reporte es vital para ayudar a las autoridades a enfocar estas acciones. ¡Gracias por contribuir!</p>
            </footer>
        </div>
    );
};

export default InformacionPlagas;