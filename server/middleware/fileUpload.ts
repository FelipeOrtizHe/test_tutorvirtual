import type { NextFunction, Request, Response } from "express";
import { fromNodeMiddleware } from "h3";
import type { NodeMiddleware } from "h3";

const normalizeUploadMiddleware: NodeMiddleware = (req, res, next) => {
  const request = req as unknown as Request;
  const response = res as unknown as Response;
  const nextFn = next as NextFunction;

  const requestUrl = request.url || "";
  const targetsMaterialRoute =
    requestUrl.includes("/materiales") || requestUrl.includes("/materials");
  const targetsAsignaturaMaterial =
    requestUrl.includes("/asignaturas") && targetsMaterialRoute;
  const targetsFilesUpload = requestUrl.includes("/api/files/upload");

  if (!targetsMaterialRoute && !targetsAsignaturaMaterial && !targetsFilesUpload) {
    return nextFn();
  }

  // Solo aplicar validaciones a peticiones POST relacionadas con cargas de material
  if (request.method !== "POST") {
    return nextFn();
  }

  const contentTypeHeader =
    (request.headers["content-type"] as string | undefined) ||
    (request.headers as Record<string, string | undefined>)["Content-Type"];

  if (!contentTypeHeader) {
    response.status(415).json({
      message: "Falta el encabezado Content-Type requerido para procesar el archivo.",
    });
    return;
  }

  // Normalizar la cabecera para evitar problemas con mayúsculas/minúsculas
  if (!request.headers["content-type"]) {
    request.headers["content-type"] = contentTypeHeader;
  }

  nextFn();
};

export default fromNodeMiddleware(normalizeUploadMiddleware);
