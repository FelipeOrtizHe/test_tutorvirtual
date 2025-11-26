import { Request, Response } from "express";

export const notImplemented = (description: string) =>
  (_req: Request, res: Response) => {
    res.status(501).json({
      message: `${description} no está implementado aún en Express`,
      note: "Este endpoint refleja el handler existente en server/api.",
    });
  };
