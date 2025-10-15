import React from "react";
import ReportesList from "./ReportesList";
import { useNavigate } from "react-router-dom";
import "../styles/DashboardAdmin.css";
import Swal from "sweetalert2";

function DashboardAdmin() {
  const navigate = useNavigate();

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
