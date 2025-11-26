import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import { fromNodeMiddleware } from "h3";
import formidable from "formidable";
import fs from "fs/promises";
import type { NextFunction, Request, Response } from "express";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);
const prisma = new PrismaClient();

const uploadHandler = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Método no permitido." });
    return;
  }

  const form = formidable({ multiples: false });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error("Error al procesar formulario:", err);
      res.status(400).json({ message: "Error al procesar el formulario." });
      return;
    }

    const processUpload = async () => {
      const incomingFile = Array.isArray(files.file) ? files.file[0] : files.file;

      if (!incomingFile) {
        res.status(400).json({ message: "No se recibió ningún archivo." });
        return;
      }

      const idAsignaturaValue = Array.isArray(fields.idAsignatura)
        ? fields.idAsignatura[0]
        : fields.idAsignatura;
      const idAsignatura = parseInt((idAsignaturaValue as string) ?? "", 10);

      if (!idAsignaturaValue || Number.isNaN(idAsignatura)) {
        res.status(400).json({ message: "El ID de la asignatura no es válido." });
        return;
      }

      const asignatura = await prisma.asignatura.findUnique({
        where: { id: idAsignatura },
      });

      if (!asignatura) {
        res.status(404).json({ message: "La asignatura no existe." });
        return;
      }

      const fileData = await fs.readFile(incomingFile.filepath);
      const uploadResult = await supabase.storage
        .from("files")
        .upload(incomingFile.originalFilename!, fileData, {
          contentType: incomingFile.mimetype || "application/octet-stream",
          upsert: true,
        });

      if (uploadResult.error || !uploadResult.data) {
        console.error("Error al subir a Supabase:", uploadResult.error);
        res
          .status(500)
          .json({ message: "Error al subir el archivo a Supabase." });
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("files")
        .getPublicUrl(uploadResult.data.path);

      await prisma.material.create({
        data: {
          nombre: incomingFile.originalFilename || "Archivo",
          tipo: incomingFile.mimetype || "application/octet-stream",
          url: publicUrlData.publicUrl,
          idAsignatura,
        },
      });

      res.json({ success: true });
    };

    processUpload().catch((processingError) => {
      console.error("Error interno durante la carga:", processingError);
      res.status(500).json({ message: "Error interno del servidor." });
    });
  });
};

export default fromNodeMiddleware(uploadHandler);
