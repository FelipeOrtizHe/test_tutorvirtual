import { Router } from "express";
import { Prisma } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import prisma from "../lib/prisma";
import { authenticate } from "./utils";

const router = Router();

router.get("/", authenticate(["DOCENTE"]), async (req, res) => {
  const docenteId = (req as any).user?.userId as number;

  try {
    const asignaturas = await prisma.asignatura.findMany({
      where: { idDocente: docenteId },
      include: { estudiantes: true },
    });

    return res.json(
      asignaturas.map((asignatura) => ({
        ...asignatura,
        inscritos: asignatura.estudiantes.length,
        estudiantes: undefined,
      }))
    );
  } catch (error) {
    console.error("Error al obtener asignaturas", error);
    return res.status(500).json({ message: "Error al obtener las asignaturas" });
  }
});

router.get("/:id", authenticate(["DOCENTE", "ESTUDIANTE", "ADMIN"]), async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }

  try {
    const asignatura = await prisma.asignatura.findUnique({
      where: { id },
      include: { estudiantes: true },
    });

    if (!asignatura) {
      return res.status(404).json({ message: "Asignatura no encontrada" });
    }

    return res.json({
      ...asignatura,
      inscritos: asignatura.estudiantes.length,
      estudiantes: undefined,
    });
  } catch (error) {
    console.error("Error obteniendo asignatura", error);
    return res.status(500).json({ message: "Error obteniendo la asignatura" });
  }
});

router.post("/create", authenticate(["DOCENTE"]), async (req, res) => {
  const { nombre, carrera, jornada } = req.body ?? {};
  const docenteId = (req as any).user?.userId as number;

  if (!nombre || !carrera || !jornada) {
    return res.status(400).json({ message: "Faltan campos requeridos" });
  }

  try {
    const course = await prisma.asignatura.create({
      data: { nombre, carrera, jornada, idDocente: docenteId, activo: true },
    });
    return res.status(201).json(course);
  } catch (error) {
    console.error("Error creando asignatura", error);
    return res.status(500).json({ message: "Error al crear la asignatura" });
  }
});

router.post(
  ["/generate-link", "/:asignaturaId/generate-link"],
  authenticate(["DOCENTE"]),
  async (req, res) => {
    const asignaturaId = Number(req.params.asignaturaId || req.body.asignaturaId);
    const duracionHoras = Number(req.body?.duracionHoras ?? 1);

    if (!asignaturaId || Number.isNaN(asignaturaId)) {
      return res.status(400).json({ message: "ID de asignatura inválido" });
    }

    try {
      const enlaceRegistro = uuidv4();
      const fechaExpiracion = new Date();
      fechaExpiracion.setHours(fechaExpiracion.getHours() + duracionHoras);

      const asignatura = await prisma.asignatura.update({
        where: { id: asignaturaId },
        data: { enlaceRegistro, fechaExpiracion },
      });

      return res.json({
        enlaceRegistro: asignatura.enlaceRegistro,
        fechaExpiracion: asignatura.fechaExpiracion,
      });
    } catch (error) {
      console.error("Error generando enlace", error);
      return res.status(500).json({ message: "Error generando el enlace" });
    }
  }
);

router.delete("/:id", authenticate(["DOCENTE", "ADMIN"]), async (req, res) => {
  const id = Number(req.params.id);
  if (!id || Number.isNaN(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }

  try {
    await prisma.estudiante.deleteMany({ where: { asignaturaId: id } });
    await prisma.asignatura.delete({ where: { id } });
    return res.json({ message: "Asignatura y estudiantes eliminados" });
  } catch (error) {
    console.error("Error eliminando asignatura", error);
    return res.status(500).json({ message: "Error eliminando asignatura" });
  }
});

router.delete("/delete", authenticate(["DOCENTE", "ADMIN"]), async (req, res) => {
  const { id } = req.body ?? {};
  if (!id) {
    return res.status(400).json({ message: "ID es requerido" });
  }

  try {
    await prisma.estudiante.deleteMany({ where: { asignaturaId: id } });
    await prisma.asignatura.delete({ where: { id } });
    return res.json({ message: "Asignatura y estudiantes asociados eliminados exitosamente" });
  } catch (error) {
    console.error("Error eliminando asignatura", error);
    return res.status(500).json({ message: "Error eliminando la asignatura" });
  }
});

export default router;
