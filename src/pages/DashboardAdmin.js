import React from "react";
import ReportesList from "./ReportesList";
import { useNavigate } from "react-router-dom";
import "../styles/DashboardAdmin.css";

function DashboardAdmin() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol"); // También es buena práctica eliminar el rol
    navigate("/login");
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Panel de Administración</h1>
        <button onClick={() => navigate("/mapa")} className="perfil-button">
          Mapa
        </button>
        <button onClick={handleLogout} className="logout-button">
          Cerrar sesión
        </button>
      </div>
      <ReportesList />
    </div>
  );
}

export default DashboardAdmin;
