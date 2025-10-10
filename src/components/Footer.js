// src/components/Footer.js

import React from 'react';
// Importa el archivo de estilos (crearemos uno general para el footer)
import '../styles/Footer.css'; 

const Footer = () => {
    // Usamos new Date().getFullYear() para obtener el año actual automáticamente
    const currentYear = new Date().getFullYear();
    const developerName = "Alumnos De I.E.S N°6039"; // ✨ ¡Reemplaza con tu nombre!

    return (
        <footer className="app-footer">
            <p>
                © {currentYear} Plataforma de Vigilancia de Plagas. Todos los derechos reservados.
            </p>
            <p>
                Desarrollado por: {developerName}
                <br/>
                Enrique Sanchez
                <br/>
                Gorriti Facundo
                <br/>
                Medina Franco
                <br/>
                Juarez Jesus
            </p>
        </footer>
    );
};

export default Footer;