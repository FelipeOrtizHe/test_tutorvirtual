export function notFoundHandler(req, res, next) {
  next({ status: 404, message: `No se encontró la ruta: ${req.originalUrl}` });
}
