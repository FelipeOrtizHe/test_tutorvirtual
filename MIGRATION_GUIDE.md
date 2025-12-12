# Migración a arquitectura Node.js + Express + React

Este repositorio ahora incluye una implementación de referencia para ejecutar el proyecto con:

- **Backend:** Node.js + Express (API REST).
- **Frontend:** React con Vite y React Router.
- **Comunicación:** llamadas HTTP al backend mediante Axios desde servicios en el frontend.

## Estructura de carpetas

```
backend/
  src/
    config/          # Carga de variables de entorno
    controllers/     # Lógica de endpoints
    middleware/      # Manejo de errores y 404
    routes/          # Definición de rutas Express
    services/        # Ejemplo de capa de negocio/datos
  .env.example       # Variables de entorno recomendadas
  package.json       # Scripts npm para arrancar la API

frontend/
  src/
    components/      # UI reutilizable (StatusCard, listas)
    pages/           # Vistas conectadas al router
    services/        # Cliente Axios y helpers de datos
  .env.example       # Configura VITE_API_BASE_URL
  package.json       # Scripts npm para arrancar el frontend
```

## Puesta en marcha

1. **Backend**
   ```bash
   cd backend
   cp .env.example .env    # Ajusta el puerto si lo necesitas
   npm install
   npm run dev             # Arranca en http://localhost:4000
   ```

2. **Frontend**
   ```bash
   cd frontend
   cp .env.example .env    # Ajusta VITE_API_BASE_URL si el backend usa otro host/puerto
   npm install
   npm run dev             # Arranca en http://localhost:5173
   ```

El frontend consultará el backend en `/api/status` y `/api/learning-paths` para mostrar el estado del servicio y un catálogo de rutas de aprendizaje.
