import React, { useState, useEffect } from "react";
// CAMBIO 1: Importamos el cliente configurado, NO el axios base
import axiosClient from "../config/axiosClient";
import { useNavigate } from "react-router-dom";
import "../styles/ReporteForm.css";
import Alerta from "../components/Alerta";
import Footer from "../components/Footer";

// Las 4 plagas fijas para los checkboxes. 
const PLAGAS_FIJAS = [
    { id: 1, nombre: "Dengue" },
    { id: 2, nombre: "Zica" },
    { id: 3, nombre: "Leishmaniasis" },
    { id: 4, nombre: "Chikungunya" },
];

// ELIMINADO: Ya no necesitamos definir la URL base aquí
// const API_BASE_URL = "http://localhost:3000/api";

const ReporteForm = () => {
    // ESTADOS
    const [descripcion, setDescripcion] = useState("");
    const [foto, setFoto] = useState(null);
    const [ubicacion, setUbicacion] = useState({ latitud: null, longitud: null });
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

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("rol");
        navigate("/login");
    };

    const handleUbicacion = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUbicacion({
                        latitud: position.coords.latitude,
                        longitud: position.coords.longitude,
                    });
                    setAlerta({
                        mensaje: "Ubicación obtenida con éxito.",
                        tipo: "exito",
                    });
                },
                () => {
                    setAlerta({
                        mensaje: "No se pudo obtener la ubicación.",
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
        if (!ubicacion.latitud || !ubicacion.longitud) {
            setAlerta({ mensaje: "Debes obtener tu ubicación antes de enviar.", tipo: "error" });
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

            formData.append("latitud", ubicacion.latitud);
            formData.append("longitud", ubicacion.longitud);

            // CAMBIO 3: Usamos axiosClient con ruta relativa. 
            // *Nota importante: `Content-Type: multipart/form-data` se maneja 
            // automáticamente por el navegador cuando se envía `FormData`.
            // El token es inyectado por el Interceptor.
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
                        onClick={handleUbicacion}
                        className="ubicacion-button"
                    >
                        Obtener mi ubicación
                    </button>
                    {ubicacion.latitud && ubicacion.longitud && (
                        <p className="ubicacion-info">
                            Ubicación obtenida: {ubicacion.latitud.toFixed(4)},{" "}
                            {ubicacion.longitud.toFixed(4)}
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