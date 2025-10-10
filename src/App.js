import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Inicio from "./pages/inicio";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import ReporteForm from "./pages/ReporteForm";
import DashboardAdmin from "./pages/DashboardAdmin";
import MapPage from "./pages/MapPage";
import PerfilUsuario from "./pages/PerfilUsuario";
import InformacionPlagas from "./pages/InformacionPlagas";

// Este es un componente auxiliar para proteger rutas
const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("rol");

  if (!token) {
    // Si no hay token, redirige a la página de inicio
    return <Navigate to="/inicio" />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Si el rol no está permitido, redirige a la página principal
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas, accesibles para todos */}
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/mapa" element={<MapPage />} />
        <Route path="/informacion-plagas" element={<InformacionPlagas />} />

        {/* Ruta principal, protegida para usuarios */}
        <Route
          path="/"
          element={
            <PrivateRoute allowedRoles={["usuario", "administrador"]}>
              {localStorage.getItem("rol") === "administrador" ? (
                <DashboardAdmin />
              ) : (
                <ReporteForm />
              )}
            </PrivateRoute>
          }
        />

        {/* Nueva ruta protegida para el perfil de usuario */}
        <Route
          path="/perfil"
          element={
            <PrivateRoute allowedRoles={["usuario", "administrador"]}>
              <PerfilUsuario />
            </PrivateRoute>
          }
        />

        {/* Ruta protegida para la página de reportar */}
        <Route
          path="/reportar-plaga"
          element={
            <PrivateRoute allowedRoles={["usuario", "administrador"]}>
              <ReporteForm />
            </PrivateRoute>
          }
        />

        {/* Nueva ruta protegida para el panel de administrador */}
        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={["administrador"]}>
              <DashboardAdmin />
            </PrivateRoute>
          }
        />
        {/* Nueva ruta para el mapa, solo accesible para administradores */}
      </Routes>
    </Router>
  );
}

export default App;
