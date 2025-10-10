import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Inicio.css';
function Inicio() {
  return (
    <div className="inicio-container">
      <div className="inicio-content">
        <h1 className="inicio-title">Bienvenido a la App de Reportes de Plagas</h1>
        <p className="inicio-subtitle">Por favor, regístrate o inicia sesión para continuar.</p>
        <div className="inicio-buttons">
          <Link to="/login" className="inicio-button">
            Iniciar Sesión
          </Link>
          <Link to="/registro" className="inicio-button-secondary">
            Registrarse
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Inicio;