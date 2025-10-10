import React, { useState } from 'react';
// CAMBIO 1: Importamos el cliente configurado
import axiosClient from '../config/axiosClient';
import { useNavigate } from 'react-router-dom';
import '../styles/Registro.css';
import Alerta from '../components/Alerta';

function Registro() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alerta, setAlerta] = useState({ mensaje: '', tipo: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // CAMBIO 2: Usamos axiosClient y la ruta relativa.
      await axiosClient.post('/auth/registro', {
        nombre,
        email,
        password,
      });
      setAlerta({ mensaje: 'Registro exitoso. Redirigiendo...', tipo: 'exito' });
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      // Aquí puedes usar error.response.data.msg si tu backend envía mensajes específicos
      setAlerta({ mensaje: 'Error al registrar. El email podría estar en uso.', tipo: 'error' });
    }
  };

  return (
    <div className="registro-container">
      <Alerta mensaje={alerta.mensaje} tipo={alerta.tipo} />
      <form className="registro-form" onSubmit={handleSubmit}>
        <h2 className="registro-title">Registro de Usuario</h2>
        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input
            type="text"
            id="nombre"
            className="form-input"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Tu nombre completo"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu_correo@ejemplo.com"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Tu contraseña"
            required
          />
        </div>
        <button type="submit" className="submit-button">Registrarse</button>
        <p className="login-link">
          ¿Ya tienes una cuenta? <a href="/login">Inicia sesión aquí</a>
        </p>
      </form>
    </div>
  );
}

export default Registro;