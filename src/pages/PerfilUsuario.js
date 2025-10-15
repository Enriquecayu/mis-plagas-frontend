import React, { useState, useEffect } from 'react';
// CAMBIO 1: Importamos el cliente configurado, NO el axios base
import axiosClient from '../config/axiosClient';
import { useNavigate } from 'react-router-dom';
import '../styles/PerfilUsuario.css';
import Alerta from '../components/Alerta';
import Footer from '../components/Footer';
import Swal from 'sweetalert2';

const PerfilUsuario = () => {
    const [perfil, setPerfil] = useState(null);
    const [reportes, setReportes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alerta, setAlerta] = useState({ mensaje: '', tipo: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPerfilYReportes = async () => {
            try {
                // Opcional: Chequeo rápido de token antes de la llamada.
                if (!localStorage.getItem('token')) {
                    navigate('/login');
                    return;
                }

                // CAMBIO 2: Peticiones limpias con axiosClient y rutas relativas
                // ¡El token y la URL base se añaden automáticamente!
                const [perfilRes, reportesRes] = await Promise.all([
                    axiosClient.get('/auth/perfil'),
                    axiosClient.get('/reportes'),
                ]);

                setPerfil(perfilRes.data);
                setReportes(reportesRes.data);
            } catch (err) {
                // Manejo de error 401: limpiar y redirigir al login
                if (err.response && err.response.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('rol');
                    navigate('/login');
                } else {
                    setAlerta({
                        mensaje: 'Error al cargar el perfil o los reportes.',
                        tipo: 'error',
                    });
                    console.error(err);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchPerfilYReportes();
    }, [navigate]);

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

    if (loading) {
        return <div className="loading-message">Cargando perfil...</div>;
    }

    return (
        <div className="perfil-container">
            <div className="perfil-header">
                <h1 className="perfil-title">Mi Perfil</h1>
                <button onClick={() => navigate('/reportar-plaga')} className="go-to-report-button">
                    Reportar Plaga
                </button>
                <button onClick={() => navigate("/mapa")} className="perfil-button">
                        Mapa
                </button>
                <button onClick={handleLogout} className="logout-button">
                    Cerrar sesión
                </button>
            </div>
            <Alerta mensaje={alerta.mensaje} tipo={alerta.tipo} />
            {perfil && (
                <div className="perfil-info">
                    <p className="perfil-info-item"><strong>Nombre:</strong> {perfil.nombre}</p>
                    <p className="perfil-info-item"><strong>Email:</strong> {perfil.email}</p>
                    <p className="perfil-info-item"><strong>Rol:</strong> {perfil.rol}</p>
                    <p className="perfil-info-item"><strong>Reportes Realizados:</strong> {perfil.reportesRealizados}</p>
                </div>
            )}

            <h2 className="reportes-title">Mis Reportes</h2>
            {reportes.length > 0 ? (
                <div className="reportes-grid-container">
                    {reportes.map((reporte) => (
                        <div key={reporte.id} className="reporte-card-user">
                            <h3 className="reporte-card-title">{reporte.nombrePlaga}</h3>

                            <div className="reporte-data-group">

                                <div className="data-row status-row-user">
                                    <span className="reporte-label status-label-user">Estado:</span>
                                    <span className={`reporte-value status-badge-user status-${reporte.estado.toLowerCase().replace(/\s/g, '-')}`}>
                                        {reporte.estado}
                                    </span>
                                </div>

                                {reporte.asignadoA && (
                                    <div className="data-row">
                                        <span className="reporte-label asignado-label-user">Personal a Cargo:</span>
                                        <span className="reporte-value asignado-value-user">{reporte.asignadoA}</span>
                                    </div>
                                )}

                                <div className="data-row">
                                    <span className="reporte-label">Fecha:</span>
                                    <span className="reporte-value">{new Date(reporte.createdAt).toLocaleDateString()}</span>
                                </div>

                            </div>

                            <p className="reporte-descripcion-user">
                                <strong className='desc-title'>Descripción:</strong> {reporte.descripcion}
                            </p>

                            {reporte.fotoURL && (
                                <div className="reporte-image-container-user">
                                    <img src={reporte.fotoURL} alt="Evidencia" className="reporte-image-user" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-reportes-message">Aún no has enviado ningún reporte.</div>
            )}
            <Footer/>
        </div>
    );
};

export default PerfilUsuario;