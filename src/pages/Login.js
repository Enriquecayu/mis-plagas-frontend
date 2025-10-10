import React, { useState } from 'react';
// CAMBIO 1: Importamos el cliente configurado
import axiosClient from '../config/axiosClient';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import Alerta from '../components/Alerta';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alerta, setAlerta] = useState({ mensaje: '', tipo: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // CAMBIO 2: Usamos axiosClient y la ruta relativa. ¡baseURL se añade automáticamente!
      const response = await axiosClient.post('/auth/login', {
        email,
        password,
      });
      const { token, rol } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('rol', rol);
      setAlerta({ mensaje: 'Inicio de sesión exitoso. Redirigiendo...', tipo: 'exito' });
      setTimeout(() => {
        if (rol === 'administrador') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }, 2000);
    } catch (error) {
      // Nota: Aquí podrías manejar códigos de error específicos (ej. 400 Bad Request) 
      // si tu API de login devuelve mensajes de error más detallados.
      setAlerta({ mensaje: 'Error en el login. Email o contraseña incorrectos.', tipo: 'error' });
    }
  };

  return (
    <div className="login-container">
      <Alerta mensaje={alerta.mensaje} tipo={alerta.tipo} />
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Iniciar Sesión</h2>
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
        <button type="submit" className="submit-button">Iniciar Sesión</button>
        <p className="registro-link">
          ¿No tienes una cuenta? <a href="/registro">Regístrate aquí</a>
        </p>
      </form>
    </div>
  );
}

export default Login;