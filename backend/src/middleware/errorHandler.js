export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor';

  // Centralized error response for consistency
  res.status(status).json({
    error: {
      message,
      path: req.originalUrl
    }
  });
}
