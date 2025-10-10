import React from 'react';
import '../styles/ReporteModal.css';

const ReporteModal = ({ reporte, onClose }) => {
  if (!reporte) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2 className="modal-title">{reporte.nombrePlaga}</h2>
        <div className="modal-body">
          <p className="modal-text"><strong>Reportado por:</strong> {reporte.Usuario ? reporte.Usuario.nombre : 'Desconocido'}</p>
          <p className="modal-text"><strong>Latitud:</strong> {reporte.latitud || 'No especificada'}</p>
          <p className="modal-text"><strong>Longitud:</strong> {reporte.longitud || 'No especificada'}</p>
          <p className="modal-text"><strong>Descripción:</strong> {reporte.descripcion || 'Sin descripción'}</p>
          <p className="modal-text"><strong>Estado:</strong> {reporte.estado}</p>
          <p className="modal-text"><strong>Fecha:</strong> {new Date(reporte.createdAt).toLocaleString()}</p>
          {reporte.fotoURL && (
            <div className="modal-image-container">
              <img src={reporte.fotoURL} alt="Evidencia de plaga" className="modal-image" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReporteModal;
