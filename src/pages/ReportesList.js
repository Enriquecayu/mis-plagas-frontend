import React, { useState, useEffect, useCallback, useMemo } from 'react';
// CAMBIO 1: Importamos el cliente configurado
import axiosClient from '../config/axiosClient';
import { useNavigate } from 'react-router-dom';
import Alerta from '../components/Alerta';
import '../styles/ReportesList.css';
import ReporteModal from '../components/ReporteModal';

const ReportesList = () => {
  // Estados existentes
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [alerta, setAlerta] = useState({ mensaje: '', tipo: '' });
  const [selectedReporte, setSelectedReporte] = useState(null);
  const navigate = useNavigate();

  // Estado para manejar el input de asignación por reporte ID
  const [asignaciones, setAsignaciones] = useState({});

  // ESTADO: Para el filtro por estado
  const [filtroEstado, setFiltroEstado] = useState('Todos');

  const fetchReportes = useCallback(async () => {
    try {
      // ELIMINADO: Ya no se maneja el token manualmente en la petición
      if (!localStorage.getItem('token')) {
        navigate('/login');
        return;
      }

      // CAMBIO 2: Usamos axiosClient con ruta relativa y sin headers
      const res = await axiosClient.get('/reportes');

      setReportes(res.data);
      setLoading(false);

      // Inicializar el estado de asignaciones con los valores existentes
      const initialAsignaciones = res.data.reduce((acc, reporte) => {
        acc[reporte.id] = reporte.asignadoA || '';
        return acc;
      }, {});
      setAsignaciones(initialAsignaciones);

    } catch (err) {
      // Manejo de error para sesión expirada o no admin
      if (err.response && err.response.status === 401) {
        navigate('/login');
        return;
      }
      setError('Error al cargar los reportes. Por favor, asegúrate de haber iniciado sesión como administrador.');
      console.error(err);
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchReportes();
  }, [fetchReportes]);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este reporte?')) {
      try {
        // CAMBIO 3: Usamos axiosClient con ruta relativa y sin headers
        await axiosClient.delete(`/reportes/${id}`);

        setAlerta({ mensaje: 'Reporte eliminado con éxito.', tipo: 'exito' });
        fetchReportes();
      } catch (err) {
        setAlerta({ mensaje: 'Error al eliminar el reporte.', tipo: 'error' });
        console.error(err);
      }
    }
  };

  // FUNCIÓN DE ASIGNACIÓN/ESTADO UNIFICADA
  const handleUpdateReporte = async (id, updates = {}) => {
    const payload = {
      ...updates,
      // Aseguramos que solo se envíe si existe en el estado de asignaciones
      asignadoA: asignaciones[id] !== undefined ? asignaciones[id] : undefined
    };

    // Filtramos campos undefined si es necesario, aunque axiosClient lo maneja bien
    if (Object.keys(payload).length === 0) return;

    try {
      // CAMBIO 4: Usamos axiosClient con ruta relativa y sin headers
      await axiosClient.put(
        `/reportes/${id}`,
        payload
      );

      setAlerta({ mensaje: 'Reporte actualizado con éxito.', tipo: 'exito' });
      fetchReportes();

    } catch (err) {
      setAlerta({ mensaje: 'Error al actualizar el reporte.', tipo: 'error' });
      console.error(err);
    }
  };

  const handleAsignacionInputChange = (id, value) => {
    setAsignaciones(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleEstadoChange = (id, newEstado) => {
    handleUpdateReporte(id, { estado: newEstado });
  }

  const handleViewReporte = (reporte) => {
    setSelectedReporte(reporte);
  };

  const closeModal = () => {
    setSelectedReporte(null);
  };

  // Navega al mapa con las coordenadas
  const handleViewReporteOnMap = (lat, lng) => {
    navigate(`/mapa?lat=${lat}&lng=${lng}`);
  };

  // Lógica de filtrado
  const reportesFiltrados = useMemo(() => {
    if (filtroEstado === 'Todos') {
      return reportes;
    }
    return reportes.filter(reporte => reporte.estado === filtroEstado);
  }, [reportes, filtroEstado]);

  const getStatusClass = (estado) => {
    return `status-badge status-${estado.toLowerCase().replace(/\s/g, '-')}`;
  }

  // ----------------------------------------------------------------------
  // RENDERIZADO
  // ----------------------------------------------------------------------

  if (loading) {
    return <div className="loading-message">Cargando reportes para el administrador...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }


  return (
    <div className="reportes-page-container">
      {alerta.mensaje && <Alerta mensaje={alerta.mensaje} tipo={alerta.tipo} />}

      <div className="reportes-content">
        <h1 className="reportes-title">LISTA DE REPORTES</h1>

        {/* INICIO DE ELEMENTO DE FILTRO */}
        <div className="filter-container">
          <label htmlFor="estado-filter" className="filter-label">Filtrar por Estado:</label>
          <select
            id="estado-filter"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="filter-select"
          >
            <option value="Todos">Todos</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Asignado">Asignado</option>
            <option value="En Proceso">En Proceso</option>
            <option value="Solucionado">Solucionado</option>
          </select>
        </div>
        {/* FIN DE ELEMENTO DE FILTRO */}

        {loading ? (
          <div className="loading-message">Cargando reportes...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <>
            {reportesFiltrados.length > 0 ? (
              <div className="reportes-grid">
                {reportesFiltrados.map((reporte) => (
                  <div key={reporte.id} className="reporte-card">
                    <h3 className="card-title">{reporte.nombrePlaga}</h3>
                    <p className="card-text">
                      <strong className="reporter-label">Reportado por:</strong>
                      {reporte.Usuario ? reporte.Usuario.nombre : 'Usuario Desconocido'}
                    </p>
                    <p className="card-text"><strong className="date-label">Fecha:</strong> {new Date(reporte.createdAt).toLocaleDateString()}</p>
                    <p className="card-text">
                      <strong className="status-label">Personal Asignado:</strong>
                      <span className='asignado-info'>
                        {reporte.asignadoA || 'N/A'}
                      </span>
                    </p>
                    <p className="card-text">
                      <strong className="status-label">Estado Actual:</strong>
                      <span className={getStatusClass(reporte.estado)}>
                        {reporte.estado}
                      </span>
                    </p>

                    {/* Botones de visualización */}
                    <button className='view-button' onClick={() => handleViewReporte(reporte)}>
                      Ver Detalles
                    </button>

                    {/* NUEVO BOTÓN: Ver en Mapa */}
                    {(reporte.latitud && reporte.longitud) && (
                      <button
                        className='map-pin-button'
                        onClick={() => handleViewReporteOnMap(reporte.latitud, reporte.longitud)}
                      >
                        Ver En Mapa
                      </button>
                    )}


                    <div className="admin-actions">
                      <hr style={{ width: '100%', border: 'none', borderTop: '1px solid #eee', margin: '10px 0' }} />

                      {/* INPUT PARA ASIGNACIÓN DE PERSONAL */}
                      <input
                        type="text"
                        placeholder="Ej: Equipo Fumigación"
                        value={asignaciones[reporte.id] || ''}
                        onChange={(e) => handleAsignacionInputChange(reporte.id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="asignacion-input"
                      />

                      {/* BOTÓN PARA ASIGNAR */}
                      <button
                        className="asignar-button"
                        disabled={!asignaciones[reporte.id]}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateReporte(reporte.id, { estado: 'Asignado' });
                        }}
                      >Asignar</button>

                      {/* SELECT para cambiar estado */}
                      <select
                        value={reporte.estado}
                        onChange={(e) => handleEstadoChange(reporte.id, e.target.value)}
                        className="estado-select"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="Pendiente">Pendiente</option>
                        <option value="Asignado">Asignado</option>
                        <option value="En Proceso">En Proceso</option>
                        <option value="Solucionado">Solucionado</option>
                      </select>

                      <button className="delete-button" onClick={(e) => { e.stopPropagation(); handleDelete(reporte.id) }}>
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-reportes-message">No hay reportes de plagas para mostrar con el filtro actual.</div>
            )}
          </>
        )}
      </div>
      {selectedReporte && <ReporteModal reporte={selectedReporte} onClose={closeModal} />}
    </div>
  );
};

export default ReportesList;
