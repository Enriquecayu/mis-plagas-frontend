import React, { useState, useEffect } from "react";
// CAMBIO 1: Importamos el cliente configurado, NO el axios base
import axiosClient from "../config/axiosClient";
import { useNavigate } from "react-router-dom";
import "../styles/ReporteForm.css";
import Alerta from "../components/Alerta";
import Footer from "../components/Footer";
import SeleccionarUbicacionMapa from "../components/SeleccionarUbicacionMapa"; // <-- IMPORTADO
import Swal from "sweetalert2";

// Las 4 plagas fijas para los checkboxes. 
const PLAGAS_FIJAS = [
    { id: 1, nombre: "Micorbasurales" },
    { id: 2, nombre: "Terreno Baldios" },
    { id: 3, nombre: "Chatarra" },
    { id: 4, nombre: "Recipientes con Agua" },
    { id: 5, nombre: "Acumulacion de Agua"}
];


const ReporteForm = () => {
    // ESTADOS
    const [descripcion, setDescripcion] = useState("");
    const [foto, setFoto] = useState(null);
    const [ubicacion, setUbicacion] = useState({ latitud: null, longitud: null });
    // --> NUEVO ESTADO para controlar el modal del mapa
    const [isMapModalOpen, setIsMapModalOpen] = useState(false); 
    
    const [loading, setLoading] = useState(false);
    const [alerta, setAlerta] = useState({ mensaje: "", tipo: "" });
    const [plagasSeleccionadas, setPlagasSeleccionadas] = useState([]);

    const navigate = useNavigate();

    // ----------------------------------------------------------------------
    // LÓGICA PARA EL TEMPORIZADOR DE ALERTAS (5 SEGUNDOS)
    // ----------------------------------------------------------------------
    useEffect(() => {
        if (alerta.mensaje) {
            const temporizador = setTimeout(() => {
                setAlerta({ mensaje: "", tipo: "" });
            }, 5000);

            return () => {
                clearTimeout(temporizador);
            };
        }
    }, [alerta.mensaje]);

    // ----------------------------------------------------------------------
    // MANEJO DE CHECKBOXES Y LOGOUT
    // ----------------------------------------------------------------------
    const handlePlagaChange = (e) => {
        const plagaNombre = e.target.value;
        const isChecked = e.target.checked;

        if (isChecked) {
            setPlagasSeleccionadas((prev) => [...prev, plagaNombre]);
        } else {
            setPlagasSeleccionadas((prev) =>
                prev.filter((nombre) => nombre !== plagaNombre)
            );
        }
    };

    const handleLogout = async () => {
    // 1. Mostrar un modal de confirmación más llamativo
    const result = await Swal.fire({
        title: '¿Cerrar Sesión?',
        text: 'Tendrás que ingresar tus credenciales nuevamente para acceder.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#d33', // Rojo para la acción de "salir"
        cancelButtonColor: '#3085d6', // Azul para "cancelar"
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'Cancelar'
    });

    // 2. Verificar si el usuario confirmó
    if (result.isConfirmed) {
        // Ejecutar la acción de cerrar sesión
        localStorage.removeItem('token');
        localStorage.removeItem('rol');
        
        // 3. Mostrar alerta de éxito temporal (5 segundos)
        Swal.fire({
            icon: 'success',
            title: 'Sesión Cerrada 👋',
            text: 'Has cerrado tu sesión con éxito.',
            timer: 5000, // Se cierra después de 5 segundos (5000 ms)
            showConfirmButton: false 
        });

        // 4. Redirigir al usuario
        navigate('/login');
    }
};

    // ----------------------------------------------------------------------
    // NUEVA FUNCIÓN UNIFICADA: Maneja la ubicación obtenida por GPS o Mapa
    // ----------------------------------------------------------------------
    const actualizarUbicacion = ({ latitud, longitud }) => {
        setUbicacion({ latitud, longitud });
        setAlerta({ mensaje: "Ubicación obtenida con éxito.", tipo: "exito" });
    };

    // ----------------------------------------------------------------------
    // FUNCIÓN PARA OBTENER UBICACIÓN GPS
    // ----------------------------------------------------------------------
    const handleUbicacionGPS = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // Usa la función unificada para guardar la ubicación GPS
                    actualizarUbicacion({
                        latitud: position.coords.latitude,
                        longitud: position.coords.longitude,
                    });
                },
                () => {
                    setAlerta({
                        mensaje: "No se pudo obtener la ubicación GPS. Intenta seleccionar en el mapa.",
                        tipo: "error",
                    });
                }
            );
        } else {
            setAlerta({
                mensaje: "Tu navegador no soporta la geolocalización.",
                tipo: "error",
            });
        }
    };

    // ----------------------------------------------------------------------
    // ENVÍO DE FORMULARIO
    // ----------------------------------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (plagasSeleccionadas.length === 0) {
            setAlerta({ mensaje: "Debes seleccionar al menos una plaga.", tipo: "error" });
            return;
        }
        // --> VALIDACIÓN ACTUALIZADA: Verifica si se ha obtenido la ubicación (por GPS o Mapa)
        if (!ubicacion.latitud || !ubicacion.longitud) {
            setAlerta({ mensaje: "Debes obtener tu ubicación o seleccionarla en el mapa.", tipo: "error" });
            return;
        }


        setLoading(true);

        try {
            const plagasConcatenadas = plagasSeleccionadas.join(", ");

            // FormData es necesario para enviar archivos
            const formData = new FormData();

            formData.append("nombrePlaga", plagasConcatenadas);
            formData.append("descripcion", descripcion);

            if (foto) {
                formData.append("imagen", foto);
            }

            // Datos de ubicación (ahora pueden venir del mapa)
            formData.append("latitud", ubicacion.latitud);
            formData.append("longitud", ubicacion.longitud);

            await axiosClient.post('/reportes', formData);

            setAlerta({ mensaje: "Reporte enviado con éxito. Redirigiendo...", tipo: "exito" });

            // Redirigir al usuario después de 2 segundos.
            setTimeout(() => {
                navigate("/perfil");
            }, 2000);

            // Limpiar estados
            setDescripcion("");
            setFoto(null);
            setUbicacion({ latitud: null, longitud: null });
            setPlagasSeleccionadas([]);

        } catch (err) {
            console.error("Error completo en el envío:", err);
            if (err.response && err.response.status === 401) {
                // Si hay error 401, forzamos al usuario a iniciar sesión de nuevo
                navigate("/login");
            } else {
                setAlerta({
                    mensaje: `Error al enviar el reporte. Revisa la consola para más detalles.`,
                    tipo: "error",
                });
            }
        } finally {
            setLoading(false);
        }
    };

    // ----------------------------------------------------------------------
    // RENDERIZADO (JSX)
    // ----------------------------------------------------------------------
    return (
        <div className="reporte-form-container">
            <div className="reporte-form-header">
                <h1 className="reporte-form-title">Reporte de Plaga</h1>
                <div className="button-container">
                    <button onClick={() => navigate("/informacion-plagas")} className="info-button">
                        Informarme
                    </button>
                    <button onClick={() => navigate("/mapa")} className="perfil-button">
                        Mapa
                    </button>
                    <button onClick={() => navigate("/perfil")} className="perfil-button">
                        Mi Perfil
                    </button>
                    <button onClick={handleLogout} className="logout-button">
                        Cerrar sesión
                    </button>
                </div>
            </div>
            
            {/* --> LÓGICA DEL MODAL DE MAPA */}
            {isMapModalOpen && (
                <SeleccionarUbicacionMapa 
                    onClose={() => setIsMapModalOpen(false)} // Cierra el modal
                    onSelectLocation={actualizarUbicacion}  // Función que guarda las coordenadas seleccionadas
                    ubicacionInicial={ubicacion}             // Pasa la ubicación actual (si existe)
                />
            )}
            {/* ----------------------------- */}

            <Alerta mensaje={alerta.mensaje} tipo={alerta.tipo} />
            
            <form className="reporte-form" onSubmit={handleSubmit}>

                {/* ---------- BLOQUE DE CHECKBOXES FIJOS ---------- */}
                <fieldset className="plagas-fieldset">
                    <legend>Selecciona la(s) Plaga(s):</legend>
                    <div className="plagas-checkbox-group">
                        {PLAGAS_FIJAS.map(plaga => (
                            <label key={plaga.id} className="plaga-label">
                                <input
                                    type="checkbox"
                                    name="plagas"
                                    value={plaga.nombre}
                                    onChange={handlePlagaChange}
                                    checked={plagasSeleccionadas.includes(plaga.nombre)}
                                />
                                {plaga.nombre}
                            </label>
                        ))}

                    </div>
                </fieldset>

                <textarea
                    className="textA"
                    placeholder="Descripción del problema"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    required
                ></textarea>
                
                <input type="file" onChange={(e) => setFoto(e.target.files[0])} />
                
                <div className="ubicacion-container">
                    <button
                        type="button"
                        onClick={handleUbicacionGPS}
                        className="ubicacion-button"
                    >
                        Obtener mi ubicación (GPS)
                    </button>
                    
                    {/* --> NUEVO BOTÓN: Abre el modal del mapa */}
                    <button
                        type="button"
                        onClick={() => setIsMapModalOpen(true)}
                        className="ubicacion-button map-select-button"
                    >
                        Seleccionar Ubicación en Mapa 🗺️
                    </button>
                    {/* -------------------------------------- */}
                    
                    {ubicacion.latitud && ubicacion.longitud && (
                        <p className="ubicacion-info">
                            Ubicación obtenida: {ubicacion.latitud.toFixed(6)},{" "}
                            {ubicacion.longitud.toFixed(6)}
                        </p>
                    )}
                </div>
                
                <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? "Enviando..." : "Enviar Reporte"}
                </button>
            </form>
            <Footer/>
        </div>
    );
};

export default ReporteForm;