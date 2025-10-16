// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// 🚨 1. Importar los componentes necesarios de TanStack Query
import {
  QueryClient,
  QueryClientProvider,
  // Opcional: Si instalaste las DevTools (react-query-devtools)
  // ReactQueryDevtools 
} from '@tanstack/react-query';


// 🚨 2. Crear una instancia del Query Client (una sola vez)
const queryClient = new QueryClient();


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* 🚨 3. ENVOLVER: Envolvemos <App /> con el proveedor */}
    <QueryClientProvider client={queryClient}>
      <App />
      {/* Opcional: si instalaste las devtools */}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  </React.StrictMode>
);

reportWebVitals();