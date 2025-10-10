import React from 'react';
import '../styles/Alerta.css'; // Importa el archivo de estilos para la alerta

const Alerta = ({ mensaje, tipo }) => {
  // La alerta solo se muestra si hay un mensaje
  if (!mensaje) return null;

  // El tipo define la clase CSS para el color (ej: 'exito', 'error')
  const claseAlerta = `alerta ${tipo}`;

  return (
    <div className={claseAlerta}>
      <p>{mensaje}</p>
    </div>
  );
};

export default Alerta;