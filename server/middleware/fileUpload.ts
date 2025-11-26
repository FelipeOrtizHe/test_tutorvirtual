import type { NextFunction, Request, Response } from "express";
import { fromNodeMiddleware } from "h3";

const normalizeUploadMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestUrl = req.url || "";
  const targetsMaterialRoute =
    requestUrl.includes("/materiales") || requestUrl.includes("/materials");
  const targetsAsignaturaMaterial =
    requestUrl.includes("/asignaturas") && targetsMaterialRoute;
  const targetsFilesUpload = requestUrl.includes("/api/files/upload");

  if (!targetsMaterialRoute && !targetsAsignaturaMaterial && !targetsFilesUpload) {
    return next();
  }

  // Solo aplicar validaciones a peticiones POST relacionadas con cargas de material
  if (req.method !== "POST") {
    return next();
  }

  const contentTypeHeader =
    (req.headers["content-type"] as string | undefined) ||
    (req.headers as Record<string, string | undefined>)["Content-Type"];

  if (!contentTypeHeader) {
    res.status(415).json({
      message: "Falta el encabezado Content-Type requerido para procesar el archivo.",
    });
    return;
  }

  // Normalizar la cabecera para evitar problemas con mayúsculas/minúsculas
  if (!req.headers["content-type"]) {
    req.headers["content-type"] = contentTypeHeader;
  }

  next();
};

export default fromNodeMiddleware(normalizeUploadMiddleware);
