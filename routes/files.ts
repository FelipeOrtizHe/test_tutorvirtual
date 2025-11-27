import { Router } from "express";
import formidable from "formidable";
import fs from "fs/promises";
import { createClient } from "@supabase/supabase-js";
import prisma from "../lib/prisma";

const router = Router();

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

router.post("/upload", async (req, res) => {
  const form = formidable({ multiples: false });

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({ message: "Error al procesar el formulario." });
    }

    const processUpload = async () => {
      const incomingFile = Array.isArray(files.file) ? files.file[0] : files.file;
      if (!incomingFile) {
        return res.status(400).json({ message: "No se recibió ningún archivo." });
      }

      const idAsignaturaValue = Array.isArray(fields.idAsignatura)
        ? fields.idAsignatura[0]
        : fields.idAsignatura;
      const idAsignatura = parseInt((idAsignaturaValue as string) ?? "", 10);

      if (!idAsignaturaValue || Number.isNaN(idAsignatura)) {
        return res.status(400).json({ message: "El ID de la asignatura no es válido." });
      }

      const asignatura = await prisma.asignatura.findUnique({ where: { id: idAsignatura } });
      if (!asignatura) {
        return res.status(404).json({ message: "La asignatura no existe." });
      }

      const fileData = await fs.readFile(incomingFile.filepath);
      const uploadResult = await supabase.storage.from("files").upload(incomingFile.originalFilename!, fileData, {
        contentType: incomingFile.mimetype || "application/octet-stream",
        upsert: true,
      });

      if (uploadResult.error || !uploadResult.data) {
        return res.status(500).json({ message: "Error al subir el archivo a Supabase." });
      }

      const { data: publicUrlData } = supabase.storage.from("files").getPublicUrl(uploadResult.data.path);

      await prisma.material.create({
        data: {
          nombre: incomingFile.originalFilename || "Archivo",
          tipo: incomingFile.mimetype || "application/octet-stream",
          url: publicUrlData.publicUrl,
          idAsignatura,
        },
      });

      return res.json({ success: true });
    };

    processUpload().catch((processingError) => {
      console.error("Error interno durante la carga:", processingError);
      res.status(500).json({ message: "Error interno del servidor." });
    });
  });
});

export default router;
