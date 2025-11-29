import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { DecodedToken } from "../server/utils/jwt";

const jwtSecret = process.env.JWT_SECRET || "fallback_secret";

export const authenticate = (
  roles?: (DecodedToken["role"] | "ANY")[]
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Acceso no autorizado" });
    }

    try {
      const decoded = jwt.verify(authHeader.replace("Bearer ", ""), jwtSecret) as DecodedToken;
      if (roles && !roles.includes("ANY") && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Permisos insuficientes" });
      }
      (req as Request & { user?: DecodedToken }).user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Token inválido" });
    }
  };
};

export const notImplemented = (description: string) => (_req: Request, res: Response) => {
  res.status(501).json({
    message: `${description} no está implementado aún en Express`,
    note: "Este endpoint refleja el handler existente en server/api.",
  });
};
